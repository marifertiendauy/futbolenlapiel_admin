'use client';

import React, { useEffect } from 'react';
import { Trash2, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  open: boolean;
  count: number;
  productTitle?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDeleteModal({
  open,
  count,
  productTitle,
  onCancel,
  onConfirm,
}: ConfirmDeleteModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  const isMultiple = count > 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-title"
    >
      <div className="w-full max-w-md bg-white border border-neutral-200 rounded-xl p-6 shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 border border-red-100">
              <Trash2 size={18} />
            </div>
            <div>
              <h2
                id="confirm-delete-title"
                className="font-display text-base font-semibold text-neutral-900"
              >
                {isMultiple
                  ? `Eliminar ${count} productos`
                  : 'Eliminar producto'}
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Esta baja quitará el registro del catálogo actual.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
            aria-label="Cerrar diálogo"
          >
            <X size={16} />
          </button>
        </div>

        <p className="mt-4 text-sm text-neutral-600 leading-relaxed">
          {isMultiple ? (
            <>
              Vas a dar de baja <strong className="font-semibold text-neutral-900 tabular-nums">{count}</strong>{' '}
              artículos seleccionados. Podrás deshacer la acción inmediatamente desde la notificación inferior.
            </>
          ) : (
            <>
              ¿Confirmás la baja de{' '}
              <strong className="font-semibold text-neutral-900">
                {productTitle?.trim() || 'este producto sin título'}
              </strong>
              ? Podrás deshacer esta baja inmediatamente después si fue un error.
            </>
          )}
        </p>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-1"
          >
            {isMultiple ? `Eliminar (${count})` : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}
