import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import {
  PRODUCT_INCLUDE_IMAGES,
  ensureDatabaseReady,
  isDatabaseConfigured,
  serializeProduct,
} from '@/lib/prisma';
import { normalizeProductForDb, productInputSchema } from '@/lib/product-validation';

export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{ uid: string }>;
};

export async function GET(_req: NextRequest, context: RouteContext) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      {
        error: 'DATABASE_URL no está configurada en las variables de entorno.',
        code: 'DB_NOT_CONFIGURED',
      },
      { status: 503 }
    );
  }

  try {
    const { uid } = await context.params;
    const prisma = await ensureDatabaseReady();
    const row = await prisma.product.findUnique({
      where: { uid },
      include: PRODUCT_INCLUDE_IMAGES,
    });

    if (!row) {
      return NextResponse.json(
        { error: 'Producto no encontrado.', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product: serializeProduct(row) });
  } catch (error) {
    console.error('[GET /api/products/[uid]] Error:', error);
    return NextResponse.json(
      { error: 'No se pudo obtener el producto.', code: 'DB_QUERY_FAILED' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      {
        error: 'DATABASE_URL no está configurada en las variables de entorno.',
        code: 'DB_NOT_CONFIGURED',
      },
      { status: 503 }
    );
  }

  try {
    const { uid } = await context.params;
    const body = await req.json();
    const parsed = productInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: parsed.error.issues[0]?.message || 'Datos de actualización inválidos.',
          code: 'VALIDATION_ERROR',
        },
        { status: 400 }
      );
    }

    const prisma = await ensureDatabaseReady();
    const { productData } = normalizeProductForDb(parsed.data);

    const updated = await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { uid },
        data: productData,
      });

      const nextCoverUrl = productData.image_link.trim();
      if (nextCoverUrl && !nextCoverUrl.startsWith('/api/images/')) {
        const existingCover = await tx.productImage.findUnique({
          where: {
            productId_url: {
              productId: uid,
              url: nextCoverUrl,
            },
          },
          select: { id: true },
        });

        if (!existingCover) {
          await tx.productImage.updateMany({
            where: { productId: uid },
            data: { isCover: false },
          });
          await tx.productImage.create({
            data: {
              productId: uid,
              url: nextCoverUrl,
              fileName: nextCoverUrl.split(/[?#]/)[0]?.split('/').pop() || '',
              position: 0,
              isCover: true,
            },
          });
        }
      }

      return tx.product.findUniqueOrThrow({
        where: { uid },
        include: PRODUCT_INCLUDE_IMAGES,
      });
    });

    return NextResponse.json({ product: serializeProduct(updated) });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'El producto que intentás editar no existe.', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }
      if (error.code === 'P2002') {
        return NextResponse.json(
          {
            error: 'Ya existe otro producto con ese mismo SKU o slug.',
            code: 'DUPLICATE_SKU',
          },
          { status: 409 }
        );
      }
    }

    console.error('[PATCH /api/products/[uid]] Error:', error);
    return NextResponse.json(
      { error: 'No se pudieron guardar los cambios.', code: 'DB_WRITE_FAILED' },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      {
        error: 'DATABASE_URL no está configurada en las variables de entorno.',
        code: 'DB_NOT_CONFIGURED',
      },
      { status: 503 }
    );
  }

  try {
    const { uid } = await context.params;
    const prisma = await ensureDatabaseReady();
    await prisma.product.delete({ where: { uid } });

    return NextResponse.json({ deleted: true, uid });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return NextResponse.json(
        { error: 'El producto ya no existe.', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    console.error('[DELETE /api/products/[uid]] Error:', error);
    return NextResponse.json(
      { error: 'No se pudo eliminar el producto.', code: 'DB_WRITE_FAILED' },
      { status: 500 }
    );
  }
}
