"use client";
export default function Modal({ title, onClose, children }: Readonly<{ title: string; onClose: () => void; children: React.ReactNode }>) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <button type="button" tabIndex={-1} aria-label="Tutup" className="absolute inset-0 cursor-default bg-black/40" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label={title} className="card relative w-full max-w-lg space-y-4 p-6">
        <h2 className="text-lg font-extrabold">{title}</h2>
        {children}
      </div>
    </div>
  );
}