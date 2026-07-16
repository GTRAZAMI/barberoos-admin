import { Camera, Save, Star } from "lucide-react";
import { barbers } from "../data/mock";
import { AdminInput, ImageUploadCard, Panel } from "../components/ui";

export function Barbers() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        {barbers.map((barber) => (
          <article key={barber.name} className="overflow-hidden rounded border border-white/10 bg-[#17130f] transition duration-500 hover:-translate-y-1 hover:border-[#d6aa63] hover:shadow-2xl hover:shadow-black/25">
            <div className="relative h-40 bg-[linear-gradient(135deg,#2b2116,#d6aa63)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(248,241,231,.28),transparent_28%),radial-gradient(circle_at_78%_30%,rgba(17,16,14,.25),transparent_34%)]" />
              <span className="absolute right-4 top-4 rounded bg-emerald-400/15 px-3 py-1 text-sm font-bold text-emerald-100">{barber.status}</span>
              <div className="absolute -bottom-8 left-5 grid size-20 place-items-center rounded-full border-4 border-[#17130f] bg-[#d6aa63] text-2xl font-black text-[#11100e] shadow-xl">
                {barber.name[0]}
              </div>
            </div>
            <div className="px-5 pb-5 pt-11">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <h3 className="text-2xl font-black">{barber.name}</h3>
                  <p className="text-[#cabbab]">{barber.role}</p>
                </div>
                <p className="flex items-center gap-2 rounded bg-[#d6aa63]/10 px-3 py-2 text-[#d6aa63]">
                  <Star size={16} fill="currentColor" /> {barber.rating}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <Panel title="Barber profile editor">
        <div className="grid items-start gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
          <div className="w-full max-w-[300px] rounded border border-white/10 bg-black/20 p-4">
            <ImageUploadCard
              label="Barber photo"
              name="barberPhoto"
              title="Upload photo"
              hint="Preview appears here."
              previewAlt="Barber preview"
              compact
            />
            <div className="mt-4 flex items-center gap-3 rounded bg-[#d6aa63]/10 p-3 text-sm text-[#d8cec0]">
              <Camera className="shrink-0 text-[#d6aa63]" size={18} />
              Use a clear portrait so clients recognize the barber fast.
            </div>
          </div>

          <div className="grid min-w-0 content-start gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <AdminInput label="Name" placeholder="Barber name" />
              <AdminInput label="Speciality" placeholder="Fade specialist" />
              <AdminInput label="Rating" placeholder="4.9" />
              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-[#d6aa63]">Status</span>
                <select className="rounded border border-white/10 bg-black/25 px-4 py-3 outline-none transition focus:border-[#d6aa63]" defaultValue="Available">
                  <option value="Available">Available</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </label>
            </div>
            <button className="mt-2 inline-flex w-fit items-center justify-center gap-2 rounded bg-[#d6aa63] px-5 py-3 font-black text-[#11100e] transition hover:bg-[#f8f1e7]">
              <Save size={18} /> Save barber
            </button>
          </div>
        </div>
      </Panel>
    </div>
  );
}
