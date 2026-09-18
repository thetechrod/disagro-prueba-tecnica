import type { CatalogItem } from "./event";

export type CreateConfirmationInput = {
  firstName: string;
  lastName: string;
  email: string;
  eventSlotId: number;
  catalogItemIds: number[];
};

type ConfirmationCategory = {
  items: CatalogItem[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  total: number;
};

export type Confirmation = {
  confirmationId: number;

  customer: {
    firstName: string;
    lastName: string;
    email: string;
  };

  event: {
    name: string;
    date: string;
    time: string;
  };

  products: ConfirmationCategory;
  services: ConfirmationCategory;

  totalBeforeDiscount: number;
  totalDiscount: number;
  total: number;
};
