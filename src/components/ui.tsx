import { Check, ChevronRight, Image as ImageIcon, Scissors, Sparkles, Trash2, X } from "lucide-react";
import type { ChangeEvent, ReactNode } from "react";
import { useState } from "react";
import { toast } from "sonner";

export function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#100f0d]/80 backdrop-blur-sm">
      <div className="grid place-items-center gap-4">
        <div className="relative size-20">
          <div className="absolute inset-0 rounded-full border-2 border-[#d6aa63]/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#d6aa63] animate-spin-slow" />
          <Scissors className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#d6aa63]" />
        </div>
        <p className="text-sm font-black uppercase tracking-[0.22em] text-[#d6aa63]">Preparing chair</p>
      </div>
    </div>
  );
}

export function StatCard({ icon, label, value, trend }: { icon: ReactNode; label: string; value: string; trend: string }) {
  return (
    <article className="rounded border border-white/10 bg-white/[.05] p-5 transition duration-500 hover:-translate-y-1 hover:border-[#d6aa63]">
      <div className="flex items-center justify-between text-[#d6aa63]">
        {icon}
        <Sparkles size={17} />
      </div>
      <p className="mt-5 text-sm text-[#cabbab]">{label}</p>
      <h3 className="mt-1 text-3xl font-black">{value}</h3>
      <p className="mt-3 text-sm text-emerald-200">{trend}</p>
    </article>
  );
}

export function Panel({ title, action, children }: { title: string; action?: string; children: ReactNode }) {
  return (
    <section className="rounded border border-white/10 bg-[#17130f] p-5 shadow-2xl shadow-black/25">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-black">{title}</h2>
        {action && (
          <button type="button" onClick={() => toast.success(action)} className="inline-flex items-center gap-2 rounded border border-white/15 px-3 py-2 text-sm font-bold text-[#d8cec0] transition hover:border-[#d6aa63] hover:text-[#d6aa63]">
            {action} <ChevronRight size={16} />
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

export function Modal({ title, children, onClose, size = "md" }: { title: string; children: ReactNode; onClose: () => void; size?: "md" | "lg" }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
      <section className={`w-full rounded border border-white/10 bg-[#17130f] p-5 shadow-2xl shadow-black/50 animate-soft-in ${size === "lg" ? "max-w-3xl" : "max-w-xl"}`}>
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-black">{title}</h2>
          <button type="button" onClick={onClose} className="grid size-10 place-items-center rounded border border-white/15 text-[#cabbab] transition hover:border-[#d6aa63] hover:text-[#d6aa63]" aria-label="Close modal">
            <X size={18} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

export function DataTable({ rows, columns }: { rows: Array<Record<string, string | number>>; columns: string[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[620px] border-separate border-spacing-y-2 text-left">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#d6aa63]">
                {column}
              </th>
            ))}
            <th className="px-3 py-2 text-right text-xs font-black uppercase tracking-[0.18em] text-[#d6aa63]">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="bg-white/[.05]">
              {columns.map((column) => (
                <td key={column} className="px-3 py-3 text-sm text-[#e8ded2]">
                  {row[column]}
                </td>
              ))}
              <td className="px-3 py-3">
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => toast.info("Edit mode", { description: "Backend connection comes next." })} className="grid size-8 place-items-center rounded bg-[#d6aa63] text-[#11100e]">
                    <Check size={15} />
                  </button>
                  <button type="button" onClick={() => toast.warning("Delete queued")} className="grid size-8 place-items-center rounded bg-red-500/15 text-red-200">
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ImageUploadCard({
  label = "Product image",
  name = "image",
  title = "Click to upload product image",
  hint = "The selected image will appear here before saving.",
  previewAlt = "Image preview",
  compact = false,
}: {
  label?: string;
  name?: string;
  title?: string;
  hint?: string;
  previewAlt?: string;
  compact?: boolean;
}) {
  const [preview, setPreview] = useState("");
  const [fileName, setFileName] = useState("");

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setPreview(URL.createObjectURL(file));
  }

  return (
    <label className="grid gap-2">
      <span className="text-xs font-black uppercase tracking-[0.18em] text-[#d6aa63]">{label}</span>
      <input name={name} type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
      <div className={`group grid cursor-pointer place-items-center overflow-hidden rounded border border-dashed border-[#d6aa63]/45 bg-black/25 transition duration-300 hover:border-[#d6aa63] hover:bg-[#d6aa63]/10 ${compact ? "aspect-square min-h-0 w-full" : "min-h-56"}`}>
        {preview ? (
          <img src={preview} alt={previewAlt} className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${compact ? "max-h-none" : "max-h-72"}`} />
        ) : (
          <div className={`grid place-items-center gap-3 p-6 text-center ${compact ? "p-4" : ""}`}>
            <span className={`${compact ? "size-12" : "size-14"} grid place-items-center rounded bg-[#d6aa63] text-[#11100e]`}>
              <ImageIcon size={compact ? 22 : 26} />
            </span>
            <span className="font-black leading-tight">{title}</span>
            <small className="max-w-xs text-[#cabbab]">{hint}</small>
          </div>
        )}
      </div>
      {fileName && <small className="block max-w-full truncate text-[#cabbab]">{fileName}</small>}
    </label>
  );
}

export function AdminInput({
  label,
  placeholder,
  name,
  defaultValue,
  type = "text",
}: {
  label: string;
  placeholder: string;
  name?: string;
  defaultValue?: string;
  type?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black uppercase tracking-[0.18em] text-[#d6aa63]">{label}</span>
      <input name={name} defaultValue={defaultValue} type={type} className="rounded border border-white/10 bg-black/25 px-4 py-3 outline-none transition focus:border-[#d6aa63]" placeholder={placeholder} />
    </label>
  );
}

export function AdminTextarea({ label, placeholder, name, defaultValue }: { label: string; placeholder: string; name?: string; defaultValue?: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black uppercase tracking-[0.18em] text-[#d6aa63]">{label}</span>
      <textarea name={name} defaultValue={defaultValue} rows={4} className="resize-y rounded border border-white/10 bg-black/25 px-4 py-3 outline-none transition focus:border-[#d6aa63]" placeholder={placeholder} />
    </label>
  );
}
