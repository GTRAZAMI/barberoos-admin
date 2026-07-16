import { AtSign, BriefcaseBusiness, Globe2, Hash, Music2, Play, Save, Users } from "lucide-react";
import type { FormEvent } from "react";
import { AdminInput, AdminTextarea, Panel } from "../components/ui";

const socialFields = [
  { label: "Instagram", placeholder: "https://instagram.com/barberoos", icon: <AtSign size={18} /> },
  { label: "Facebook", placeholder: "https://facebook.com/barberoos", icon: <Users size={18} /> },
  { label: "Twitter / X", placeholder: "https://x.com/barberoos", icon: <Globe2 size={18} /> },
  { label: "Threads", placeholder: "https://threads.net/@barberoos", icon: <Hash size={18} /> },
  { label: "LinkedIn", placeholder: "https://linkedin.com/company/barberoos", icon: <BriefcaseBusiness size={18} /> },
  { label: "TikTok", placeholder: "https://tiktok.com/@barberoos", icon: <Music2 size={18} /> },
  { label: "YouTube", placeholder: "https://youtube.com/@barberoos", icon: <Play size={18} /> },
];

export function WebsiteSettings({ saveChanges }: { saveChanges: (event?: FormEvent) => void }) {
  return (
    <form onSubmit={saveChanges} className="grid gap-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Homepage content">
          <div className="grid gap-4">
            <AdminInput label="Hero title" placeholder="BARBEROOS" />
            <AdminTextarea label="Hero text" placeholder="A sharp, modern barbershop experience..." />
            <AdminInput label="Delivery text" placeholder="Free livraison in Casablanca..." />
          </div>
        </Panel>
        <Panel title="Media and contact">
          <div className="grid gap-4">
            <AdminInput label="Hero image" placeholder="https://..." />
            <AdminInput label="Location" placeholder="Casablanca, Morocco" />
            <AdminInput label="Hours" placeholder="Monday to Saturday - 09:30 to 20:00" />
          </div>
        </Panel>
      </div>

      <Panel title="Social media profiles">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {socialFields.map((field) => (
            <label key={field.label} className="grid gap-2">
              <span className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#d6aa63]">
                {field.icon} {field.label}
              </span>
              <input
                name={field.label.toLowerCase().replaceAll(" ", "-").replaceAll("/", "")}
                type="url"
                className="rounded border border-white/10 bg-black/25 px-4 py-3 outline-none transition focus:border-[#d6aa63]"
                placeholder={field.placeholder}
              />
            </label>
          ))}
        </div>
      </Panel>

      <button className="inline-flex w-fit items-center justify-center gap-2 rounded bg-[#d6aa63] px-5 py-3 font-black text-[#11100e] transition hover:bg-[#f8f1e7]">
        <Save size={18} /> Save website
      </button>
    </form>
  );
}
