import { ensureDatabaseReady, isDatabaseConfigured } from '@/lib/prisma';
import { RoleEntryPage } from '@/components/RoleEntryPage';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let totalProducts = 0;
  let inStockCount = 0;
  let totalImages = 0;

  if (isDatabaseConfigured()) {
    try {
      const prisma = await ensureDatabaseReady();
      const [productsTotal, productsInStock, imagesTotal] = await Promise.all([
        prisma.product.count({ where: { active: true } }),
        prisma.product.count({ where: { active: true, availability: 'in stock' } }),
        prisma.productImage.count(),
      ]);
      totalProducts = productsTotal;
      inStockCount = productsInStock;
      totalImages = imagesTotal;
    } catch {
      // Mantiene contadores en 0 si la base de datos no responde
    }
  }

  return (
    <RoleEntryPage
      totalProducts={totalProducts}
      inStockCount={inStockCount}
      totalImages={totalImages}
    />
  );
}
