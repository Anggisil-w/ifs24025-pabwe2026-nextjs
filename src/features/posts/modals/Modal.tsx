"use client";
export default function Modal({ title, onClose, children }: Readonly<{ title: string; onClose: () => void; children: React.ReactNode }>) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <button type="button" tabIndex={-1} aria-label="Tutup" className="absolute inset-0 cursor-default bg-black/40" onClick={onClose} />
      <dialog open aria-modal="true" aria-label={title} className="card relative m-0 w-full max-w-lg space-y-4 p-6 text-inherit">
        <h2 className="text-lg font-extrabold">{title}</h2>
        {children}
      </dialog>
    </div>
  );
}