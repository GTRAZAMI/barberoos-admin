import {
  Bell,
  CalendarClock,
  ChevronRight,
  CreditCard,
  LayoutDashboard,
  Menu,
  Save,
  Scissors,
  Settings,
  ShoppingBag,
  Users,
  X,
} from "lucide-react";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { Navigate, NavLink, Route, Routes, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { PageLoader } from "./components/ui";
import { Barbers } from "./pages/Barbers";
import { Bookings } from "./pages/Bookings";
import { Dashboard } from "./pages/Dashboard";
import { Orders } from "./pages/Orders";
import { Products } from "./pages/Products";
import { Services } from "./pages/Services";
import { WebsiteSettings } from "./pages/WebsiteSettings";
import type { NavSection } from "./types";

const sections: NavSection[] = [
  { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
  { name: "Services", path: "/services", icon: <Scissors size={18} /> },
  { name: "Barbers", path: "/barbers", icon: <Users size={18} /> },
  { name: "Products", path: "/products", icon: <ShoppingBag size={18} /> },
  { name: "Bookings", path: "/bookings", icon: <CalendarClock size={18} /> },
  { name: "Orders", path: "/orders", icon: <CreditCard size={18} /> },
  { name: "Website", path: "/website", icon: <Settings size={18} /> },
];

export default function App() {
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const activeSection = sections.find((section) => location.pathname === section.path)?.name ?? "Dashboard";
  const currentDate = useMemo(
    () =>
      new Intl.DateTimeFormat("en", {
        weekday: "long",
        month: "short",
        day: "numeric",
      }).format(new Date()),
    [],
  );

  function closeSidebarWithLoader() {
    setLoading(true);
    setSidebarOpen(false);
    window.setTimeout(() => {
      setLoading(false);
    }, 320);
  }

  function saveChanges(event?: FormEvent) {
    event?.preventDefault();
    toast.success("Saved", { description: "The admin changes are ready to sync with the backend." });
  }

  return (
    <div className="min-h-screen bg-[#100f0d] text-[#f8f1e7]">
      {loading && <PageLoader />}

      <aside className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-white/10 bg-[#17130f]/95 p-5 backdrop-blur-xl transition-transform duration-500 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <a href="#" className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded bg-[#d6aa63] text-[#11100e] shadow-[0_18px_50px_rgba(214,170,99,.3)]">
            <Scissors size={22} />
          </span>
          <span>
            <strong className="block text-xl tracking-[0.18em]">BARBEROOS</strong>
            <small className="text-[#cabbab]">Admin Panel</small>
          </span>
        </a>

        <nav className="mt-9 grid gap-2">
          {sections.map((section) => (
            <NavLink
              key={section.name}
              to={section.path}
              onClick={closeSidebarWithLoader}
              className={({ isActive }) =>
                `flex items-center justify-between rounded px-4 py-3 text-left font-bold transition duration-300 ${isActive ? "bg-[#d6aa63] text-[#11100e]" : "text-[#d8cec0] hover:bg-white/10 hover:text-[#f8f1e7]"}`
              }
            >
              <span className="flex items-center gap-3">
                {section.icon} {section.name}
              </span>
              <ChevronRight size={17} />
            </NavLink>
          ))}
        </nav>

        <div className="mt-9 rounded border border-[#d6aa63]/25 bg-[#d6aa63]/10 p-4">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#d6aa63]">Today focus</p>
          <p className="mt-3 text-sm leading-6 text-[#d8cec0]">Keep bookings tidy, publish the best services, and make the shop feel sharp.</p>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#100f0d]/80 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4 px-5 py-4 lg:px-8">
            <div className="flex items-center gap-3">
              <button type="button" className="grid size-10 place-items-center rounded border border-white/15 lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
                <Menu size={20} />
              </button>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#d6aa63]">{currentDate}</p>
                <h1 className="text-2xl font-black">{activeSection}</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button type="button" className="hidden items-center gap-2 rounded border border-white/15 px-4 py-2 font-bold text-[#d8cec0] transition hover:border-[#d6aa63] hover:text-[#d6aa63] sm:flex">
                <Bell size={17} /> 4
              </button>
              <button type="button" onClick={() => saveChanges()} className="inline-flex items-center gap-2 rounded bg-[#f8f1e7] px-4 py-2 font-black text-[#11100e] transition duration-300 hover:bg-[#d6aa63]">
                <Save size={17} /> Save
              </button>
            </div>
          </div>
        </header>

        {sidebarOpen && (
          <button type="button" className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <X className="absolute right-5 top-5" />
          </button>
        )}

        <main className="px-5 py-6 lg:px-8">
          <div className="animate-soft-in">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/services" element={<Services />} />
              <Route path="/barbers" element={<Barbers />} />
              <Route path="/products" element={<Products />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/website" element={<WebsiteSettings saveChanges={saveChanges} />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}
