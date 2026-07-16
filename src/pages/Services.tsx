import { Pencil, Plus, Save, Scissors, Trash2 } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { AdminInput, AdminTextarea, ImageUploadCard, Modal, Panel } from "../components/ui";
import { serviceCategories, serviceRows } from "../data/mock";
import type { ServiceCategoryRow, ServiceRow } from "../types";

export function Services() {
  const [activeTab, setActiveTab] = useState<"services" | "categories">("services");
  const [categories, setCategories] = useState(serviceCategories);
  const [items, setItems] = useState(serviceRows);
  const [serviceModal, setServiceModal] = useState<ServiceRow | "new" | null>(null);
  const [categoryModal, setCategoryModal] = useState<ServiceCategoryRow | "new" | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: "service"; item: ServiceRow } | { type: "category"; item: ServiceCategoryRow } | null>(null);

  function submitService(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("serviceName") || "").trim();
    const category = String(form.get("category") || "").trim();
    const duration = String(form.get("duration") || "").trim();
    const price = String(form.get("price") || "").trim();
    const status = String(form.get("status") || "Active") as ServiceRow["status"];

    if (!name || !category || !duration || !price) {
      toast.error("Service name, category, duration, and price are required");
      return;
    }

    if (serviceModal && serviceModal !== "new") {
      setItems((current) => current.map((item) => (item.id === serviceModal.id ? { ...item, name, category, duration, price, status } : item)));
      toast.success("Service updated", { description: `${name} is ready for the website.` });
    } else {
      setItems((current) => [{ id: Date.now(), name, category, duration, price, status }, ...current]);
      toast.success("Service added", { description: `${name} was added to ${category}.` });
    }

    setServiceModal(null);
  }

  function submitCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("categoryName") || "").trim();
    const status = String(form.get("status") || "Active") as ServiceCategoryRow["status"];

    if (!name) {
      toast.error("Category name is required");
      return;
    }

    if (categoryModal && categoryModal !== "new") {
      const previousName = categoryModal.name;
      setCategories((current) => current.map((category) => (category.id === categoryModal.id ? { ...category, name, status } : category)));
      setItems((current) => current.map((item) => (item.category === previousName ? { ...item, category: name } : item)));
      toast.success("Category updated", { description: `${name} is ready.` });
    } else {
      if (categories.some((category) => category.name.toLowerCase() === name.toLowerCase())) {
        toast.warning("Category already exists");
        return;
      }

      setCategories((current) => [...current, { id: Date.now(), name, status }]);
      toast.success("Category created", { description: "You can add services to it now." });
    }

    setCategoryModal(null);
  }

  function confirmDeleteService(id: number) {
    setItems((current) => current.filter((item) => item.id !== id));
    setDeleteTarget(null);
    toast.success("Service deleted");
  }

  function confirmDeleteCategory(category: ServiceCategoryRow) {
    const serviceCount = items.filter((item) => item.category === category.name).length;
    if (serviceCount > 0) {
      toast.error("Move services first", { description: `${category.name} has ${serviceCount} service${serviceCount === 1 ? "" : "s"}.` });
      return;
    }

    setCategories((current) => current.filter((item) => item.id !== category.id));
    setDeleteTarget(null);
    toast.success("Category deleted");
  }

  return (
    <div className="grid gap-6">
      <section className="rounded border border-white/10 bg-[#17130f] p-5 shadow-2xl shadow-black/25">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#d6aa63]">Service manager</p>
            <h2 className="mt-2 text-3xl font-black">Organize the barbershop menu.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#cabbab]">Create categories first, then attach every service to one category.</p>
          </div>
          <div className="flex rounded border border-white/10 bg-black/20 p-1">
            {[
              { id: "services", label: "Services" },
              { id: "categories", label: "Categories" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as "services" | "categories")}
                className={`rounded px-4 py-2 text-sm font-black transition ${activeTab === tab.id ? "bg-[#d6aa63] text-[#11100e]" : "text-[#cabbab] hover:text-[#f8f1e7]"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {activeTab === "services" ? (
        <Panel title="Services list">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[#cabbab]">Manage service name, category, duration, price, and publish state from one table.</p>
            <button type="button" onClick={() => setServiceModal("new")} className="inline-flex items-center gap-2 rounded bg-[#d6aa63] px-5 py-3 font-black text-[#11100e] transition hover:bg-[#f8f1e7]">
              <Plus size={18} /> Add service
            </button>
          </div>
          <ServiceTable
            items={items}
            onEdit={(item) => setServiceModal(item)}
            onDelete={(item) => setDeleteTarget({ type: "service", item })}
          />
        </Panel>
      ) : (
        <Panel title="Service categories">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[#cabbab]">Categories help clients scan the service list faster on the website.</p>
            <button type="button" onClick={() => setCategoryModal("new")} className="inline-flex items-center gap-2 rounded bg-[#d6aa63] px-5 py-3 font-black text-[#11100e] transition hover:bg-[#f8f1e7]">
              <Plus size={18} /> Add category
            </button>
          </div>
          <CategoryTable
            categories={categories}
            items={items}
            onEdit={(item) => setCategoryModal(item)}
            onDelete={(item) => setDeleteTarget({ type: "category", item })}
          />
        </Panel>
      )}

      {serviceModal && (
        <Modal title={serviceModal === "new" ? "Add service" : "Edit service"} onClose={() => setServiceModal(null)}>
          <form onSubmit={submitService} className="grid gap-4">
            <AdminInput name="serviceName" label="Service name" placeholder="Royal shave" defaultValue={serviceModal === "new" ? "" : serviceModal.name} />
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-[#d6aa63]">Category</span>
              <select name="category" defaultValue={serviceModal === "new" ? categories[0]?.name : serviceModal.category} required className="rounded border border-white/10 bg-black/25 px-4 py-3 outline-none transition focus:border-[#d6aa63]">
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminInput name="duration" label="Duration" placeholder="35 min" defaultValue={serviceModal === "new" ? "" : serviceModal.duration} />
              <AdminInput name="price" label="Price" placeholder="$24" defaultValue={serviceModal === "new" ? "" : serviceModal.price} />
            </div>
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-[#d6aa63]">Status</span>
              <select name="status" defaultValue={serviceModal === "new" ? "Active" : serviceModal.status} className="rounded border border-white/10 bg-black/25 px-4 py-3 outline-none transition focus:border-[#d6aa63]">
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
              </select>
            </label>
            <ImageUploadCard
              label="Service image"
              name="serviceImage"
              title="Upload service image"
              hint="Optional. Leave it empty if this service does not need a photo."
              previewAlt="Service preview"
            />
            <AdminTextarea label="Description" placeholder="What makes this service special?" />
            <button className="inline-flex items-center justify-center gap-2 rounded bg-[#d6aa63] px-5 py-3 font-black text-[#11100e] transition hover:bg-[#f8f1e7]">
              <Save size={18} /> Save service
            </button>
          </form>
        </Modal>
      )}

      {categoryModal && (
        <Modal title={categoryModal === "new" ? "Add category" : "Edit category"} onClose={() => setCategoryModal(null)}>
          <form onSubmit={submitCategory} className="grid gap-4">
            <AdminInput name="categoryName" label="Category name" placeholder="Haircuts" defaultValue={categoryModal === "new" ? "" : categoryModal.name} />
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-[#d6aa63]">Status</span>
              <select name="status" defaultValue={categoryModal === "new" ? "Active" : categoryModal.status} className="rounded border border-white/10 bg-black/25 px-4 py-3 outline-none transition focus:border-[#d6aa63]">
                <option value="Active">Active</option>
                <option value="Hidden">Hidden</option>
              </select>
            </label>
            <button className="inline-flex items-center justify-center gap-2 rounded bg-[#d6aa63] px-5 py-3 font-black text-[#11100e] transition hover:bg-[#f8f1e7]">
              <Save size={18} /> Save category
            </button>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <Modal title={`Delete ${deleteTarget.type}`} onClose={() => setDeleteTarget(null)}>
          <div className="grid gap-4">
            <p className="text-[#cabbab]">
              Are you sure you want to delete <strong className="text-[#f8f1e7]">{deleteTarget.item.name}</strong>?
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => (deleteTarget.type === "service" ? confirmDeleteService(deleteTarget.item.id) : confirmDeleteCategory(deleteTarget.item))}
                className="inline-flex items-center gap-2 rounded bg-red-500 px-5 py-3 font-black text-white"
              >
                <Trash2 size={18} /> Delete
              </button>
              <button type="button" onClick={() => setDeleteTarget(null)} className="rounded border border-white/15 px-5 py-3 font-bold text-[#d8cec0] transition hover:border-[#d6aa63] hover:text-[#d6aa63]">
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ServiceTable({ items, onEdit, onDelete }: { items: ServiceRow[]; onEdit: (item: ServiceRow) => void; onDelete: (item: ServiceRow) => void }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px] border-separate border-spacing-y-2 text-left">
        <thead>
          <tr>
            {["Service", "Category", "Duration", "Price", "Status", "Actions"].map((column) => (
              <th key={column} className="px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#d6aa63]">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="bg-white/[.05]">
              <td className="px-3 py-4">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded bg-[#d6aa63]/15 text-[#d6aa63]">
                    <Scissors size={18} />
                  </span>
                  <span>
                    <span className="block font-black">{item.name}</span>
                    <small className="text-[#cabbab]">{item.image ? "Image attached" : "No image"}</small>
                  </span>
                </div>
              </td>
              <td className="px-3 py-4 text-sm text-[#e8ded2]">{item.category}</td>
              <td className="px-3 py-4 text-sm text-[#e8ded2]">{item.duration}</td>
              <td className="px-3 py-4 font-black">{item.price}</td>
              <td className="px-3 py-4">
                <StatusBadge status={item.status} />
              </td>
              <td className="px-3 py-4">
                <RowActions onEdit={() => onEdit(item)} onDelete={() => onDelete(item)} label={item.name} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CategoryTable({
  categories,
  items,
  onEdit,
  onDelete,
}: {
  categories: ServiceCategoryRow[];
  items: ServiceRow[];
  onEdit: (item: ServiceCategoryRow) => void;
  onDelete: (item: ServiceCategoryRow) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-separate border-spacing-y-2 text-left">
        <thead>
          <tr>
            {["Category", "Services", "Status", "Actions"].map((column) => (
              <th key={column} className="px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#d6aa63]">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id} className="bg-white/[.05]">
              <td className="px-3 py-4 font-black">{category.name}</td>
              <td className="px-3 py-4 text-sm text-[#e8ded2]">{items.filter((item) => item.category === category.name).length}</td>
              <td className="px-3 py-4">
                <StatusBadge status={category.status} />
              </td>
              <td className="px-3 py-4">
                <RowActions onEdit={() => onEdit(category)} onDelete={() => onDelete(category)} label={category.name} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const active = status === "Active";

  return (
    <span className={`rounded px-2 py-1 text-xs font-bold ${active ? "bg-emerald-400/15 text-emerald-200" : "bg-white/10 text-[#cabbab]"}`}>
      {status}
    </span>
  );
}

function RowActions({ onEdit, onDelete, label }: { onEdit: () => void; onDelete: () => void; label: string }) {
  return (
    <div className="flex gap-2">
      <button type="button" onClick={onEdit} className="grid size-9 place-items-center rounded bg-[#d6aa63] text-[#11100e]" aria-label={`Edit ${label}`}>
        <Pencil size={16} />
      </button>
      <button type="button" onClick={onDelete} className="grid size-9 place-items-center rounded bg-red-500/15 text-red-200" aria-label={`Delete ${label}`}>
        <Trash2 size={16} />
      </button>
    </div>
  );
}
