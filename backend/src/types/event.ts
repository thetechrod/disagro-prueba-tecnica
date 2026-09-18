export type CatalogItemType = "PRODUCT" | "SERVICE";

export type EventSlot = {
  id: number;
  time: string;
};

export type CatalogItem = {
  id: number;
  name: string;
  type: CatalogItemType;
  price: number;
};

export type ActiveEvent = {
  id: number;
  name: string;
  date: string;
  slots: EventSlot[];
  catalog: {
    products: CatalogItem[];
    services: CatalogItem[];
  };
};
