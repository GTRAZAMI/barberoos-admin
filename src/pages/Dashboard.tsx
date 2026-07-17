import { BarChart3, CalendarClock, Check, Clock, Flame, Pencil, Plus, Scissors, Shuffle, ShoppingBag, Star, Tag, Trash2 } from "lucide-react";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { bookings, productRows, serviceRows } from "../data/mock";
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
  const [autoServices, setAutoServices] = useState(false);
  const [homepageServiceIds, setHomepageServiceIds] = useState<number[]>([1, 4, 5, 6]);
  const [servicePickerOpen, setServicePickerOpen] = useState(false);
  const [autoProducts, setAutoProducts] = useState(false);
  const [homepageProductIds, setHomepageProductIds] = useState<number[]>([1, 2, 3]);
  const [productPickerOpen, setProductPickerOpen] = useState(false);
  const selectedProduct = useMemo(() => productRows.find((product) => product.id === selectedProductId) ?? productRows[0], [selectedProductId]);
  const formattedOfferPrice = useMemo(() => formatPrice(offerPricePreview), [offerPricePreview]);
  const savings = useMemo(() => getSavings(selectedProduct?.price ?? "$0", formattedOfferPrice), [selectedProduct, formattedOfferPrice]);
  const activeServices = useMemo(() => serviceRows.filter((service) => service.status === "Active"), []);
  const publishedProducts = useMemo(() => productRows.filter((product) => product.status === "Published"), []);
  const selectedHomepageServices = useMemo(() => {
    if (autoServices) return getMixedServices(activeServices);

    return homepageServiceIds
      .map((serviceId) => activeServices.find((service) => service.id === serviceId))
      .filter((service): service is (typeof activeServices)[number] => Boolean(service));
  }, [activeServices, autoServices, homepageServiceIds]);
  const selectedHomepageProducts = useMemo(() => {
    if (autoProducts) return getMixedProducts(publishedProducts);

    return homepageProductIds
      .map((productId) => publishedProducts.find((product) => product.id === productId))
      .filter((product): product is (typeof publishedProducts)[number] => Boolean(product));
  }, [autoProducts, homepageProductIds, publishedProducts]);

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

  function toggleHomepageService(serviceId: number) {
    if (autoServices) return;

    setHomepageServiceIds((current) => {
      if (current.includes(serviceId)) return current.filter((id) => id !== serviceId);
      if (current.length >= 4) {
        toast.warning("Only four services", { description: "Remove one selected service before adding another." });
        return current;
      }

      return [...current, serviceId];
    });
  }

  function toggleHomepageProduct(productId: number) {
    if (autoProducts) return;

    setHomepageProductIds((current) => {
      if (current.includes(productId)) return current.filter((id) => id !== productId);
      if (current.length >= 3) {
        toast.warning("Only three products", { description: "Remove one selected product before adding another." });
        return current;
      }

      return [...current, productId];
    });
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

      <Panel title="Live booking queue" action="View calendar">
        <DataTable rows={bookings} columns={["client", "service", "barber", "time", "status"]} />
      </Panel>

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

      <Panel title="Homepage services">
        <div className="grid gap-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm leading-6 text-[#cabbab]">Choose the four services shown in the homepage popular services block, or let the website mix four active services from all categories.</p>
              <p className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-[#d6aa63]">{autoServices ? "Automatic mixed mode" : `${homepageServiceIds.length}/4 selected`}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => setServicePickerOpen(true)} disabled={autoServices} className="inline-flex items-center gap-2 rounded bg-[#d6aa63] px-5 py-3 font-black text-[#11100e] transition hover:bg-[#f8f1e7] disabled:cursor-not-allowed disabled:opacity-45">
                <Scissors size={18} /> Choose services
              </button>
              <label className="flex cursor-pointer items-center gap-3 rounded border border-white/10 bg-black/25 px-4 py-3 transition hover:border-[#d6aa63]">
                <input type="checkbox" checked={autoServices} onChange={(event) => setAutoServices(event.target.checked)} className="sr-only" />
                <span className={`relative h-6 w-11 rounded-full transition ${autoServices ? "bg-[#d6aa63]" : "bg-white/15"}`}>
                  <span className={`absolute top-1 size-4 rounded-full bg-[#11100e] transition ${autoServices ? "left-6" : "left-1"}`} />
                </span>
                <span className="inline-flex items-center gap-2 font-black">
                  <Shuffle size={17} /> Show random 4
                </span>
              </label>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {selectedHomepageServices.map((service) => (
              <article key={service.id} className="rounded border border-[#d6aa63]/25 bg-[#d6aa63]/10 p-4">
                <div className="flex items-start justify-between gap-3">
                  <span className="grid size-10 place-items-center rounded bg-[#d6aa63] text-[#11100e]">
                    <Scissors size={18} />
                  </span>
                  <span className="rounded bg-emerald-400/15 px-2 py-1 text-xs font-bold text-emerald-200">Home</span>
                </div>
                <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-[#d6aa63]">{service.category}</p>
                <h3 className="mt-2 text-xl font-black">{service.name}</h3>
                <div className="mt-5 flex items-end justify-between border-t border-white/10 pt-4 text-sm text-[#d8cec0]">
                  <span>{service.duration}</span>
                  <strong className="text-2xl text-[#d6aa63]">{service.price}</strong>
                </div>
              </article>
            ))}
          </div>

        </div>
      </Panel>

      <Panel title="Homepage products">
        <div className="grid gap-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm leading-6 text-[#cabbab]">Choose the three products shown in the homepage store section, or let the website rotate three published products from different categories.</p>
              <p className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-[#d6aa63]">{autoProducts ? "Automatic product rotation" : `${homepageProductIds.length}/3 selected`}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => setProductPickerOpen(true)} disabled={autoProducts} className="inline-flex items-center gap-2 rounded bg-[#d6aa63] px-5 py-3 font-black text-[#11100e] transition hover:bg-[#f8f1e7] disabled:cursor-not-allowed disabled:opacity-45">
                <ShoppingBag size={18} /> Choose products
              </button>
              <label className="flex cursor-pointer items-center gap-3 rounded border border-white/10 bg-black/25 px-4 py-3 transition hover:border-[#d6aa63]">
                <input type="checkbox" checked={autoProducts} onChange={(event) => setAutoProducts(event.target.checked)} className="sr-only" />
                <span className={`relative h-6 w-11 rounded-full transition ${autoProducts ? "bg-[#d6aa63]" : "bg-white/15"}`}>
                  <span className={`absolute top-1 size-4 rounded-full bg-[#11100e] transition ${autoProducts ? "left-6" : "left-1"}`} />
                </span>
                <span className="inline-flex items-center gap-2 font-black">
                  <Shuffle size={17} /> Show random 3
                </span>
              </label>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {selectedHomepageProducts.map((product) => (
              <article key={product.id} className="overflow-hidden rounded border border-white/10 bg-black/20 transition duration-300 hover:border-[#d6aa63]">
                <div className="grid aspect-[4/3] place-items-center bg-[linear-gradient(135deg,#efe4d1,#c3944f)] text-[#11100e]">
                  <ShoppingBag size={44} strokeWidth={2.4} />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d6aa63]">{product.category}</p>
                      <h3 className="mt-2 text-xl font-black">{product.name}</h3>
                    </div>
                    <span className="rounded bg-emerald-400/15 px-2 py-1 text-xs font-bold text-emerald-200">Home</span>
                  </div>
                  <div className="mt-5 flex items-end justify-between border-t border-white/10 pt-4">
                    <span className="text-sm text-[#cabbab]">{product.stock} in stock</span>
                    <strong className="text-2xl text-[#f8f1e7]">{product.price}</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Panel>

      {servicePickerOpen && (
        <Modal title="Choose homepage services" onClose={() => setServicePickerOpen(false)} size="lg">
          <div className="grid gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded border border-white/10 bg-black/20 p-4">
              <div>
                <p className="font-black">{homepageServiceIds.length}/4 services selected</p>
                <p className="mt-1 text-sm text-[#cabbab]">Pick exactly the services that will appear in the homepage popular services section.</p>
              </div>
              <button type="button" onClick={() => setServicePickerOpen(false)} className="inline-flex items-center gap-2 rounded bg-[#d6aa63] px-5 py-3 font-black text-[#11100e] transition hover:bg-[#f8f1e7]">
                <Check size={18} /> Done
              </button>
            </div>

            <div className="grid max-h-[55vh] gap-3 overflow-y-auto pr-1 md:grid-cols-2">
              {activeServices.map((service) => {
                const selected = homepageServiceIds.includes(service.id);
                const disabled = !selected && homepageServiceIds.length >= 4;

                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => toggleHomepageService(service.id)}
                    disabled={disabled}
                    className={`flex min-h-24 items-center justify-between gap-3 rounded border p-4 text-left transition duration-300 ${selected ? "border-[#d6aa63] bg-[#d6aa63]/10" : "border-white/10 bg-black/20 hover:border-[#d6aa63]"} ${disabled ? "cursor-not-allowed opacity-45" : ""}`}
                  >
                    <span>
                      <span className="block text-xs font-black uppercase tracking-[0.16em] text-[#d6aa63]">{service.category}</span>
                      <span className="mt-2 block font-black">{service.name}</span>
                      <span className="mt-1 block text-sm text-[#cabbab]">{service.duration} - {service.price}</span>
                    </span>
                    <span className={`grid size-8 shrink-0 place-items-center rounded ${selected ? "bg-[#d6aa63] text-[#11100e]" : "bg-white/10 text-[#cabbab]"}`}>
                      {selected ? <Check size={16} /> : <Plus size={16} />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </Modal>
      )}

      {productPickerOpen && (
        <Modal title="Choose homepage products" onClose={() => setProductPickerOpen(false)} size="lg">
          <div className="grid gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded border border-white/10 bg-black/20 p-4">
              <div>
                <p className="font-black">{homepageProductIds.length}/3 products selected</p>
                <p className="mt-1 text-sm text-[#cabbab]">Pick the products that appear in the homepage store preview.</p>
              </div>
              <button type="button" onClick={() => setProductPickerOpen(false)} className="inline-flex items-center gap-2 rounded bg-[#d6aa63] px-5 py-3 font-black text-[#11100e] transition hover:bg-[#f8f1e7]">
                <Check size={18} /> Done
              </button>
            </div>

            <div className="grid max-h-[55vh] gap-3 overflow-y-auto pr-1 md:grid-cols-2">
              {publishedProducts.map((product) => {
                const selected = homepageProductIds.includes(product.id);
                const disabled = !selected && homepageProductIds.length >= 3;

                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => toggleHomepageProduct(product.id)}
                    disabled={disabled}
                    className={`flex min-h-24 items-center justify-between gap-3 rounded border p-4 text-left transition duration-300 ${selected ? "border-[#d6aa63] bg-[#d6aa63]/10" : "border-white/10 bg-black/20 hover:border-[#d6aa63]"} ${disabled ? "cursor-not-allowed opacity-45" : ""}`}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="grid size-12 shrink-0 place-items-center rounded bg-[#d6aa63]/15 text-[#d6aa63]">
                        <ShoppingBag size={20} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs font-black uppercase tracking-[0.16em] text-[#d6aa63]">{product.category}</span>
                        <span className="mt-2 block truncate font-black">{product.name}</span>
                        <span className="mt-1 block text-sm text-[#cabbab]">{product.stock} stock - {product.price}</span>
                      </span>
                    </span>
                    <span className={`grid size-8 shrink-0 place-items-center rounded ${selected ? "bg-[#d6aa63] text-[#11100e]" : "bg-white/10 text-[#cabbab]"}`}>
                      {selected ? <Check size={16} /> : <Plus size={16} />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </Modal>
      )}

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

function getMixedServices(services: typeof serviceRows) {
  const byCategory = services.reduce<Record<string, typeof serviceRows>>((groups, service) => {
    groups[service.category] = [...(groups[service.category] ?? []), service];
    return groups;
  }, {});

  const mixed = Object.values(byCategory).flatMap((categoryServices) => categoryServices.slice(0, 1));
  const remaining = services.filter((service) => !mixed.some((selected) => selected.id === service.id));

  return [...mixed, ...remaining].slice(0, 4);
}

function getMixedProducts(products: typeof productRows) {
  const byCategory = products.reduce<Record<string, typeof productRows>>((groups, product) => {
    groups[product.category] = [...(groups[product.category] ?? []), product];
    return groups;
  }, {});

  const mixed = Object.values(byCategory).flatMap((categoryProducts) => categoryProducts.slice(0, 1));
  const remaining = products.filter((product) => !mixed.some((selected) => selected.id === product.id));

  return [...mixed, ...remaining].slice(0, 3);
}
