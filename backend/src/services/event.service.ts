import {
  findActiveCatalogItems,
  findActiveEvent,
  findActiveEventSlots,
} from "../repositories/event.repository";

import type { ActiveEvent } from "../types/event";

export async function getActiveEvent(): Promise<ActiveEvent | null> {
  const event = await findActiveEvent();

  if (!event) {
    return null;
  }

  const [slots, catalogItems] = await Promise.all([
    findActiveEventSlots(event.id),
    findActiveCatalogItems(),
  ]);

  const products = catalogItems.filter((item) => item.type === "PRODUCT");

  const services = catalogItems.filter((item) => item.type === "SERVICE");

  return {
    id: event.id,
    name: event.name,
    date: event.date,
    slots,
    catalog: {
      products,
      services,
    },
  };
}
