import type { CatalogItem } from "../types/event";

export function getProductDiscount(products: CatalogItem[]): number {
  if (products.length >= 5) {
    return 5;
  }

  if (products.length >= 3) {
    return 3;
  }

  return 0;
}

export function getServiceDiscount(services: CatalogItem[]): number {
  const total = getSubtotal(services);

  if (services.length >= 2 && total > 1500) {
    return 5;
  }

  if (services.length >= 2) {
    return 3;
  }

  return 0;
}

export function getSubtotal(items: CatalogItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
