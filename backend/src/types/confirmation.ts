import type { CatalogItem, CatalogItemType } from "./event";

export type CreateConfirmationInput = {
  firstName: string;
  lastName: string;
  email: string;
  eventSlotId: number;
  catalogItemIds: number[];
};

export type ConfirmationItemSnapshot = {
  catalogItemId: number;
  itemName: string;
  itemType: CatalogItemType;
  priceAtConfirmation: number;
};

export type ConfirmationToSave = {
  eventId: number;
  eventSlotId: number;

  firstName: string;
  lastName: string;
  email: string;

  productDiscountPercent: number;
  serviceDiscountPercent: number;

  totalBeforeDiscount: number;
  totalDiscount: number;
  totalAfterDiscount: number;

  items: ConfirmationItemSnapshot[];
};

export type ConfirmationResponse = {
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

  products: {
    items: CatalogItem[];
    subtotal: number;
    discountPercent: number;
    discountAmount: number;
    total: number;
  };

  services: {
    items: CatalogItem[];
    subtotal: number;
    discountPercent: number;
    discountAmount: number;
    total: number;
  };

  totalBeforeDiscount: number;
  totalDiscount: number;
  total: number;
};
