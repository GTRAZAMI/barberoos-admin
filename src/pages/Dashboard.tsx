import { BarChart3, CalendarClock, Clock, Flame, Pencil, Plus, ShoppingBag, Star, Tag, Trash2 } from "lucide-react";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { bookings, productRows } from "../data/mock";
import { AdminInput, DataTable, Modal, Panel, StatCard } from "../components/ui";

type FlashOffer = {
  id: number;
  productId: number;
  productName: string;
  oldPrice: string;
  offerPrice: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
};

export function Dashboard() {
  const [offers, setOffers] = useState<FlashOffer[]>([
    {
      id: 1,
      productId: 1,
      productName: "Matte Clay",
      oldPrice: "$19",
      offerPrice: "$15",
      startDate: "2026-07-09",
      startTime: "10:00",
      endDate: "2026-07-09",
      endTime: "20:00",
    },
  ]);
  const [selectedProductId, setSelectedProductId] = useState(productRows[0]?.id ?? 0);
  const [offerPricePreview, setOfferPricePreview] = useState("15");
  const [offerModal, setOfferModal] = useState<FlashOffer | "new" | null>(null);
  const [deleteOffer, setDeleteOffer] = useState<FlashOffer | null>(null);
  const selectedProduct = useMemo(() => productRows.find((product) => product.id === selectedProductId) ?? productRows[0], [selectedProductId]);
  const formattedOfferPrice = useMemo(() => formatPrice(offerPricePreview), [offerPricePreview]);
  const savings = useMemo(() => getSavings(selectedProduct?.price ?? "$0", formattedOfferPrice), [selectedProduct, formattedOfferPrice]);

  function openOfferModal(offer: FlashOffer | "new") {
    if (offer === "new") {
      const firstProduct = productRows[0];
      setSelectedProductId(firstProduct?.id ?? 0);
      setOfferPricePreview(firstProduct ? getNumericPrice(firstProduct.price).toString() : "0");
      setOfferModal("new");
      return;
    }

    setSelectedProductId(offer.productId);
    setOfferPricePreview(getNumericPrice(offer.offerPrice).toString());
    setOfferModal(offer);
  }

  function saveFlashOffer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const productId = Number(form.get("productId"));
    const product = productRows.find((item) => item.id === productId);
    const offerPrice = formatPrice(String(form.get("offerPrice") || ""));
    const startDate = String(form.get("startDate") || "");
    const startTime = String(form.get("startTime") || "");
    const endDate = String(form.get("endDate") || "");
    const endTime = String(form.get("endTime") || "");

    if (!product || !offerPrice || !startDate || !startTime || !endDate || !endTime) {
      toast.error("Complete the offer details");
      return;
    }

    if (offerModal && offerModal !== "new") {
      setOffers((current) =>
        current.map((offer) =>
          offer.id === offerModal.id
            ? {
                ...offer,
                productId,
                productName: product.name,
                oldPrice: product.price,
                offerPrice,
                startDate,
                startTime,
                endDate,
                endTime,
              }
            : offer,
        ),
      );
      toast.success("Flash offer updated", { description: `${product.name} final price is ${offerPrice}.` });
    } else {
      setOffers((current) => [
        {
          id: Date.now(),
          productId,
          productName: product.name,
          oldPrice: product.price,
          offerPrice,
          startDate,
          startTime,
          endDate,
          endTime,
        },
        ...current,
      ]);
      toast.success("Flash offer created", { description: `${product.name} final price is ${offerPrice}.` });
    }

    event.currentTarget.reset();
    setSelectedProductId(productRows[0]?.id ?? 0);
    setOfferPricePreview("15");
    setOfferModal(null);
  }

  function confirmDeleteOffer() {
    if (!deleteOffer) return;
    setOffers((current) => current.filter((offer) => offer.id !== deleteOffer.id));
    toast.success("Flash offer deleted");
    setDeleteOffer(null);
  }

  const offerFormDefaults =
    offerModal && offerModal !== "new"
      ? offerModal
      : {
          id: Date.now(),
          productId: selectedProductId,
          productName: selectedProduct?.name ?? "",
          oldPrice: selectedProduct?.price ?? "$0",
          offerPrice: formattedOfferPrice,
          startDate: "",
          startTime: "",
          endDate: "",
          endTime: "",
        };

  return (
    <div className="grid gap-6">
      <section className="relative overflow-hidden rounded border border-white/10 bg-[linear-gradient(115deg,rgba(214,170,99,.24),rgba(255,255,255,.05)),url('https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center p-6 shadow-2xl md:p-8">
        <div className="absolute inset-0 bg-[#100f0d]/55" />
        <div className="relative max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#d6aa63]">Control room</p>
          <h2 className="mt-3 text-4xl font-black leading-tight md:text-6xl">Make every chair, product, and order feel managed.</h2>
          <p className="mt-4 max-w-xl leading-7 text-[#e2d8cc]">A calm barber-first panel for services, team, stock, bookings, checkout orders, delivery messages, gallery, and homepage content.</p>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={<CalendarClock />} label="Today bookings" value="18" trend="+4 from yesterday" />
        <StatCard icon={<ShoppingBag />} label="Shop orders" value="12" trend="$486 expected" />
        <StatCard icon={<Star />} label="Top barber" value="Arbi" trend="5.0 rating" />
        <StatCard icon={<BarChart3 />} label="Revenue" value="$1,240" trend="+16% this week" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Panel title="Live booking queue" action="View calendar">
          <DataTable rows={bookings} columns={["client", "service", "barber", "time", "status"]} />
        </Panel>
        <Panel title="Quick actions">
          <div className="grid gap-3">
            {["Add service", "Upload gallery image", "Create product", "Edit delivery text"].map((item) => (
              <button key={item} type="button" onClick={() => toast.info(item, { description: "This action will connect to backend later." })} className="flex items-center justify-between rounded border border-white/10 bg-white/[.05] px-4 py-3 font-bold transition hover:border-[#d6aa63] hover:text-[#d6aa63]">
                {item} <Plus size={18} />
              </button>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Flash product offers">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[#cabbab]">Create timed prices for products and publish them as daily flash offers.</p>
          <button type="button" onClick={() => openOfferModal("new")} className="inline-flex items-center gap-2 rounded bg-[#d6aa63] px-5 py-3 font-black text-[#11100e] transition hover:bg-[#f8f1e7]">
            <Plus size={18} /> Add offer
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {offers.map((offer) => (
              <article key={offer.id} className="rounded border border-white/10 bg-black/20 p-4 transition duration-300 hover:border-[#d6aa63]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="mb-3 inline-flex items-center gap-2 rounded bg-red-500/15 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-red-100">
                      <Flame size={14} /> Flash price
                    </span>
                    <p className="font-black">{offer.productName}</p>
                    <p className="mt-1 text-sm text-[#cabbab]">
                      <span className="line-through">{offer.oldPrice}</span> <strong className="text-[#d6aa63]">{offer.offerPrice}</strong>
                      {getSavings(offer.oldPrice, offer.offerPrice) && <span className="ml-2 text-emerald-200">Save {getSavings(offer.oldPrice, offer.offerPrice)}</span>}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => openOfferModal(offer)} className="grid size-9 place-items-center rounded bg-[#d6aa63] text-[#11100e]" aria-label={`Edit ${offer.productName} offer`}>
                      <Pencil size={16} />
                    </button>
                    <button type="button" onClick={() => setDeleteOffer(offer)} className="grid size-9 place-items-center rounded bg-red-500/15 text-red-200" aria-label={`Delete ${offer.productName} offer`}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="mt-4 grid gap-2 text-sm text-[#d8cec0]">
                  <p className="flex items-center gap-2">
                    <Clock size={16} className="text-[#d6aa63]" /> Start: {offer.startDate} at {offer.startTime}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock size={16} className="text-[#d6aa63]" /> End: {offer.endDate} at {offer.endTime}
                  </p>
                </div>
              </article>
            ))}
          </div>
      </Panel>

      {offerModal && (
        <Modal title={offerModal === "new" ? "Add flash offer" : "Edit flash offer"} onClose={() => setOfferModal(null)} size="lg">
          <form onSubmit={saveFlashOffer} className="grid gap-5">
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-[#d6aa63]">Choose product</span>
                <select
                  name="productId"
                  value={selectedProductId}
                  onChange={(event) => {
                    const productId = Number(event.target.value);
                    const product = productRows.find((item) => item.id === productId);
                    setSelectedProductId(productId);
                    setOfferPricePreview(getNumericPrice(product?.price ?? "$0").toString());
                  }}
                  className="rounded border border-white/10 bg-black/25 px-4 py-3 outline-none transition focus:border-[#d6aa63]"
                >
                  {productRows.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {product.price}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-[#d6aa63]">Final price</span>
                <input
                  name="offerPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={offerPricePreview}
                  onChange={(event) => setOfferPricePreview(event.target.value)}
                  className="rounded border border-white/10 bg-black/25 px-4 py-3 outline-none transition focus:border-[#d6aa63]"
                  placeholder="15"
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <AdminInput name="startDate" label="Start date" placeholder="" type="date" defaultValue={offerFormDefaults.startDate} />
              <AdminInput name="startTime" label="Start time" placeholder="" type="time" defaultValue={offerFormDefaults.startTime} />
              <AdminInput name="endDate" label="End date" placeholder="" type="date" defaultValue={offerFormDefaults.endDate} />
              <AdminInput name="endTime" label="End time" placeholder="" type="time" defaultValue={offerFormDefaults.endTime} />
            </div>

            <div className="grid gap-4 rounded border border-[#d6aa63]/25 bg-[#d6aa63]/10 p-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid size-11 place-items-center rounded bg-[#d6aa63] text-[#11100e]">
                  <Tag size={20} />
                </span>
                <div className="min-w-0">
                  <p className="font-black">{selectedProduct?.name ?? "Select a product"}</p>
                  <p className="text-sm text-[#cabbab]">
                    Final price: <span className="line-through">{selectedProduct?.price}</span>{" "}
                    <strong className="text-[#d6aa63]">{formattedOfferPrice}</strong>
                    {savings && <span className="ml-0 block text-emerald-200 sm:ml-2 sm:inline">Save {savings}</span>}
                  </p>
                </div>
              </div>
              <button className="inline-flex w-full items-center justify-center gap-2 rounded bg-[#d6aa63] px-5 py-3 font-black text-[#11100e] transition hover:bg-[#f8f1e7] md:w-auto">
                <Flame size={18} /> Save offer
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleteOffer && (
        <Modal title="Delete flash offer" onClose={() => setDeleteOffer(null)}>
          <div className="grid gap-4">
            <p className="text-[#cabbab]">
              Are you sure you want to delete the flash offer for <strong className="text-[#f8f1e7]">{deleteOffer.productName}</strong>?
            </p>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={confirmDeleteOffer} className="inline-flex items-center gap-2 rounded bg-red-500 px-5 py-3 font-black text-white">
                <Trash2 size={18} /> Delete
              </button>
              <button type="button" onClick={() => setDeleteOffer(null)} className="rounded border border-white/15 px-5 py-3 font-bold text-[#d8cec0] transition hover:border-[#d6aa63] hover:text-[#d6aa63]">
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function getNumericPrice(price: string) {
  const numericPrice = Number(price.replace(/[^0-9.]/g, ""));
  return Number.isFinite(numericPrice) ? numericPrice : 0;
}

function formatPrice(price: string) {
  const numericPrice = getNumericPrice(price);
  if (!numericPrice && price.trim() === "") return "";
  return `$${numericPrice.toFixed(2)}`;
}

function getSavings(oldPrice: string, offerPrice: string) {
  const savings = getNumericPrice(oldPrice) - getNumericPrice(offerPrice);
  return savings > 0 ? `$${savings.toFixed(2)}` : "";
}
