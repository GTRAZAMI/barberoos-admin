import { Package, Pencil, Plus, Save, Trash2 } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { AdminInput, AdminTextarea, ImageUploadCard, Modal, Panel } from "../components/ui";
import { productCategories, productRows } from "../data/mock";
import type { CategoryRow, ProductRow } from "../types";

export function Products() {
  const [categories, setCategories] = useState(productCategories);
  const [items, setItems] = useState(productRows);
  const [activeTab, setActiveTab] = useState<"products" | "categories">("products");
  const [activeCategory, setActiveCategory] = useState("All");
  const [productModal, setProductModal] = useState<ProductRow | "new" | null>(null);
  const [categoryModal, setCategoryModal] = useState<CategoryRow | "new" | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: "product"; item: ProductRow } | { type: "category"; item: CategoryRow } | null>(null);
  const visibleProducts = activeCategory === "All" ? items : items.filter((item) => item.category === activeCategory);

  function submitCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const categoryName = String(form.get("categoryName") || "").trim();

    if (!categoryName) {
      toast.error("Category name is required");
      return;
    }

    if (categoryModal && categoryModal !== "new") {
      const oldCategory = categoryModal;
      setCategories((current) => current.map((category) => (category.id === categoryModal.id ? { ...category, name: categoryName } : category)));
      setItems((current) => current.map((item) => (item.category === oldCategory.name ? { ...item, category: categoryName } : item)));
      setActiveCategory(categoryName);
      toast.success("Category updated", { description: `${categoryName} is ready for products.` });
    } else {
      if (categories.some((category) => category.name.toLowerCase() === categoryName.toLowerCase())) {
        toast.warning("Category already exists");
        return;
      }

      setCategories((current) => [...current, { id: Date.now(), name: categoryName, status: "Active" }]);
      toast.success("Category created", { description: "You can add products to it now." });
    }

    setCategoryModal(null);
  }

  function confirmDeleteCategory(category: CategoryRow) {
    const productCount = items.filter((item) => item.category === category.name).length;
    if (productCount > 0) {
      toast.error("Move products first", { description: `${category.name} has ${productCount} product${productCount === 1 ? "" : "s"}.` });
      return;
    }

    setCategories((current) => current.filter((item) => item.id !== category.id));
    setActiveCategory("All");
    setDeleteTarget(null);
    toast.success("Category deleted");
  }

  function submitProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (categories.length === 0) {
      toast.error("Create a category first", { description: "Products need a category before they can be published." });
      return;
    }

    const form = new FormData(event.currentTarget);
    const name = String(form.get("productName") || "").trim();
    const category = String(form.get("category") || "").trim();
    const price = String(form.get("price") || "").trim();
    const stock = Number(form.get("stock") || 0);

    if (!name || !price || !category) {
      toast.error("Product name, price, and category are required");
      return;
    }

    if (productModal && productModal !== "new") {
      setItems((current) =>
        current.map((item) =>
          item.id === productModal.id
            ? {
                ...item,
                name,
                category,
                stock: Number.isFinite(stock) ? stock : 0,
                price,
              }
            : item,
        ),
      );
      toast.success("Product updated", { description: `${name} is ready.` });
    } else {
      setItems((current) => [
        {
          id: Date.now(),
          name,
          category,
          stock: Number.isFinite(stock) ? stock : 0,
          price,
          status: "Draft",
        },
        ...current,
      ]);
      toast.success("Product added", { description: `${name} was added to ${category}.` });
    }

    setProductModal(null);
  }

  function confirmDeleteProduct(id: number) {
    setItems((current) => current.filter((item) => item.id !== id));
    setDeleteTarget(null);
    toast.success("Product deleted");
  }

  return (
    <div className="grid gap-6">
      <section className="rounded border border-white/10 bg-[#17130f] p-5 shadow-2xl shadow-black/25">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#d6aa63]">Product manager</p>
            <h2 className="mt-2 text-3xl font-black">Simple shop control.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#cabbab]">Products stay visual like the store. Categories stay clean in a table.</p>
          </div>
          <div className="flex rounded border border-white/10 bg-black/20 p-1">
            {[
              { id: "products", label: "Products" },
              { id: "categories", label: "Categories" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as "products" | "categories")}
                className={`rounded px-4 py-2 text-sm font-black transition ${activeTab === tab.id ? "bg-[#d6aa63] text-[#11100e]" : "text-[#cabbab] hover:text-[#f8f1e7]"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {activeTab === "products" ? (
        <section className="grid gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {["All", ...categories.map((category) => category.name)].map((category) => (
                <button key={category} type="button" onClick={() => setActiveCategory(category)} className={`rounded border px-4 py-2 text-sm font-black transition ${activeCategory === category ? "border-[#d6aa63] bg-[#d6aa63]/15 text-[#d6aa63]" : "border-white/10 bg-white/[.04] text-[#d8cec0] hover:border-[#d6aa63]"}`}>
                  {category}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setProductModal("new")} className="inline-flex items-center gap-2 rounded bg-[#d6aa63] px-5 py-3 font-black text-[#11100e] transition hover:bg-[#f8f1e7]">
              <Plus size={18} /> Add product
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleProducts.map((product) => (
              <article key={product.id} className="overflow-hidden rounded border border-white/10 bg-[#17130f] shadow-2xl shadow-black/25 transition duration-500 hover:-translate-y-1 hover:border-[#d6aa63]">
                <div className="grid aspect-[4/3] place-items-center bg-[linear-gradient(135deg,#efe4d1,#c3944f)] text-[#11100e]">
                  <Package size={54} />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d6aa63]">{product.category}</p>
                      <h3 className="mt-2 text-2xl font-black">{product.name}</h3>
                      <p className="mt-2 text-sm text-[#cabbab]">{product.stock} in stock</p>
                    </div>
                    <span className={`rounded px-2 py-1 text-xs font-bold ${product.status === "Published" ? "bg-emerald-400/15 text-emerald-200" : "bg-white/10 text-[#cabbab]"}`}>{product.status}</span>
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-2xl font-black">{product.price}</span>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setProductModal(product)} className="grid size-10 place-items-center rounded bg-[#d6aa63] text-[#11100e]" aria-label={`Edit ${product.name}`}>
                        <Pencil size={17} />
                      </button>
                      <button type="button" onClick={() => setDeleteTarget({ type: "product", item: product })} className="grid size-10 place-items-center rounded bg-red-500/15 text-red-200" aria-label={`Delete ${product.name}`}>
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <Panel title="Categories list">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[#cabbab]">Create categories before adding products. Delete is protected when products exist.</p>
            <button type="button" onClick={() => setCategoryModal("new")} className="inline-flex items-center gap-2 rounded bg-[#d6aa63] px-5 py-3 font-black text-[#11100e] transition hover:bg-[#f8f1e7]">
              <Plus size={18} /> Add category
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-separate border-spacing-y-2 text-left">
              <thead>
                <tr>
                  {["Name", "Products", "Status", "Actions"].map((column) => (
                    <th key={column} className="px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#d6aa63]">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => {
                  const count = items.filter((item) => item.category === category.name).length;
                  return (
                    <tr key={category.id} className="bg-white/[.05]">
                      <td className="px-3 py-4 font-black">{category.name}</td>
                      <td className="px-3 py-4 text-sm text-[#e8ded2]">{count}</td>
                      <td className="px-3 py-4">
                        <span className="rounded bg-emerald-400/15 px-2 py-1 text-xs font-bold text-emerald-200">{category.status}</span>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex gap-2">
                          <button type="button" onClick={() => setCategoryModal(category)} className="grid size-9 place-items-center rounded bg-[#d6aa63] text-[#11100e]" aria-label={`Edit ${category.name}`}>
                            <Pencil size={16} />
                          </button>
                          <button type="button" onClick={() => setDeleteTarget({ type: "category", item: category })} className="grid size-9 place-items-center rounded bg-red-500/15 text-red-200" aria-label={`Delete ${category.name}`}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {productModal && (
        <Modal title={productModal === "new" ? "Add product" : "Edit product"} onClose={() => setProductModal(null)}>
          <form onSubmit={submitProduct} className="grid gap-4">
            <AdminInput name="productName" label="Product name" placeholder="Matte clay" defaultValue={productModal === "new" ? "" : productModal.name} />
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-[#d6aa63]">Category</span>
              <select name="category" defaultValue={productModal === "new" ? categories[0]?.name : productModal.category} required className="rounded border border-white/10 bg-black/25 px-4 py-3 outline-none transition focus:border-[#d6aa63]">
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminInput name="price" label="Price" placeholder="$19" defaultValue={productModal === "new" ? "" : productModal.price} />
              <AdminInput name="stock" label="Stock" placeholder="24" type="number" defaultValue={productModal === "new" ? "" : String(productModal.stock)} />
            </div>
            <ImageUploadCard />
            <AdminTextarea label="Description" placeholder="Short shop description" />
            <button className="inline-flex items-center justify-center gap-2 rounded bg-[#d6aa63] px-5 py-3 font-black text-[#11100e] transition hover:bg-[#f8f1e7]">
              <Save size={18} /> Save product
            </button>
          </form>
        </Modal>
      )}

      {categoryModal && (
        <Modal title={categoryModal === "new" ? "Add category" : "Edit category"} onClose={() => setCategoryModal(null)}>
          <form onSubmit={submitCategory} className="grid gap-4">
            <AdminInput name="categoryName" label="Category name" placeholder="Styling" defaultValue={categoryModal === "new" ? "" : categoryModal.name} />
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
                onClick={() => (deleteTarget.type === "product" ? confirmDeleteProduct(deleteTarget.item.id) : confirmDeleteCategory(deleteTarget.item))}
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
