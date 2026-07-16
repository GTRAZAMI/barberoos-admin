import type { CategoryRow, ProductRow, ServiceCategoryRow, ServiceRow } from "../types";

export const serviceCategories: ServiceCategoryRow[] = [
  { id: 1, name: "Haircuts", status: "Active" },
  { id: 2, name: "Beard", status: "Active" },
  { id: 3, name: "Packages", status: "Active" },
];

export const serviceRows: ServiceRow[] = [
  { id: 1, name: "Signature Fade", category: "Haircuts", duration: "45 min", price: "$28", status: "Active" },
  { id: 2, name: "Beard Ritual", category: "Beard", duration: "30 min", price: "$18", status: "Active" },
  { id: 3, name: "Groom & Facial", category: "Packages", duration: "85 min", price: "$58", status: "Draft" },
];

export const barbers = [
  { name: "Yassine", role: "Fade specialist", rating: "4.9", status: "Available" },
  { name: "Amine", role: "Beard architect", rating: "4.8", status: "Busy" },
  { name: "Arbi", role: "Classic cuts", rating: "5.0", status: "Available" },
];

export const productCategories: CategoryRow[] = [
  { id: 1, name: "Styling", status: "Active" },
  { id: 2, name: "Beard Care", status: "Active" },
  { id: 3, name: "Hair Care", status: "Active" },
];

export const productRows: ProductRow[] = [
  { id: 1, name: "Matte Clay", category: "Styling", stock: 24, price: "$19", status: "Published" },
  { id: 2, name: "Beard Oil", category: "Beard Care", stock: 18, price: "$16", status: "Published" },
  { id: 3, name: "Daily Shampoo", category: "Hair Care", stock: 32, price: "$14", status: "Draft" },
];

export const bookings = [
  { client: "Adam Rahimi", service: "Signature Fade", barber: "Yassine", time: "10:15", status: "Confirmed" },
  { client: "Sara Benali", service: "Beard Ritual", barber: "Amine", time: "12:30", status: "Waiting" },
  { client: "Nabil Idrissi", service: "Classic Cut", barber: "Arbi", time: "17:00", status: "Confirmed" },
];

export const orders = [
  { id: "#BR-1024", client: "Mohamed", total: "$49", delivery: "Casablanca", status: "Ready" },
  { id: "#BR-1025", client: "Youssef", total: "$35", delivery: "Maarif", status: "New" },
  { id: "#BR-1026", client: "Karim", total: "$72", delivery: "Ain Diab", status: "Delivered" },
];
