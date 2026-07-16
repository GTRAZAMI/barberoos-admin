import type { ReactNode } from "react";

export type Section = "Dashboard" | "Services" | "Barbers" | "Products" | "Bookings" | "Orders" | "Website";

export type NavSection = {
  name: Section;
  path: string;
  icon: ReactNode;
};

export type CategoryRow = {
  id: number;
  name: string;
  status: "Active" | "Hidden";
};

export type ProductRow = {
  id: number;
  name: string;
  category: string;
  stock: number;
  price: string;
  status: "Published" | "Draft";
};

export type ServiceCategoryRow = {
  id: number;
  name: string;
  status: "Active" | "Hidden";
};

export type ServiceRow = {
  id: number;
  name: string;
  category: string;
  duration: string;
  price: string;
  status: "Active" | "Draft";
  image?: string;
};
