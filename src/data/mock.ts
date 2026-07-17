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
  { id: 4, name: "Classic Cut", category: "Haircuts", duration: "35 min", price: "$22", status: "Active" },
  { id: 5, name: "Scissor Cut", category: "Haircuts", duration: "50 min", price: "$32", status: "Active" },
  { id: 6, name: "Buzz Cut", category: "Haircuts", duration: "25 min", price: "$16", status: "Active" },
  { id: 7, name: "Royal Shave", category: "Beard", duration: "35 min", price: "$24", status: "Active" },
  { id: 8, name: "Father & Son", category: "Packages", duration: "70 min", price: "$44", status: "Active" },
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
  { id: 3, name: "Daily Shampoo", category: "Hair Care", stock: 32, price: "$14", status: "Published" },
  { id: 4, name: "Texture Powder", category: "Styling", stock: 15, price: "$17", status: "Published" },
  { id: 5, name: "Sea Salt Spray", category: "Styling", stock: 20, price: "$15", status: "Published" },
  { id: 6, name: "Beard Balm", category: "Beard Care", stock: 12, price: "$18", status: "Published" },
  { id: 7, name: "Aftershave Balm", category: "Skin Care", stock: 26, price: "$13", status: "Published" },
  { id: 8, name: "Comb Set", category: "Tools", stock: 40, price: "$11", status: "Published" },
  { id: 9, name: "Grooming Kit", category: "Bundles", stock: 9, price: "$39", status: "Draft" },
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
