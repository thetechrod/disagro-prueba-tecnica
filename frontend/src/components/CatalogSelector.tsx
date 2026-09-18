import { useState } from "react";

import type { CatalogItem } from "../types/event";

type CatalogSelectorProps = {
  products: CatalogItem[];
  services: CatalogItem[];
  selectedItemIds: number[];
  onSelectionChange: (ids: number[]) => void;
};

export function CatalogSelector({
  products,
  services,
  selectedItemIds,
  onSelectionChange,
}: CatalogSelectorProps) {
  const [search, setSearch] = useState("");

  const filterItems = (items: CatalogItem[]) => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return items;
    }

    return items.filter((item) =>
      item.name.toLowerCase().includes(normalizedSearch),
    );
  };

  const filteredProducts = filterItems(products);

  const filteredServices = filterItems(services);

  function toggleItem(itemId: number) {
    const isSelected = selectedItemIds.includes(itemId);

    if (isSelected) {
      onSelectionChange(selectedItemIds.filter((id) => id !== itemId));

      return;
    }

    onSelectionChange([...selectedItemIds, itemId]);
  }

  function renderItems(items: CatalogItem[]) {
    return items.map((item) => (
      <label key={item.id} className="catalog-item">
        <input
          type="checkbox"
          checked={selectedItemIds.includes(item.id)}
          onChange={() => toggleItem(item.id)}
        />

        <span>{item.name}</span>

        <strong>Q{item.price.toFixed(2)}</strong>
      </label>
    ));
  }

  return (
    <section className="step-section">
      <div className="step-heading">
        <span className="step-number">2</span>
        <h2>Seleccione productos y servicios de su interés</h2>
      </div>

      <div className="catalog-selector">
        <div className="catalog-header">
          <div className="catalog-search">
            <input
              type="search"
              placeholder="Buscar productos o servicios"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <svg
              className="catalog-search-icon"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M16.5 16.5 21 21" />
            </svg>
          </div>
        </div>

        <div className="catalog-content">
          <div className="catalog-group">
            <h3>Productos</h3>

            {filteredProducts.length > 0 ? (
              renderItems(filteredProducts)
            ) : (
              <p>No se encontraron productos.</p>
            )}
          </div>

          <div className="catalog-group">
            <h3>Servicios</h3>

            {filteredServices.length > 0 ? (
              renderItems(filteredServices)
            ) : (
              <p>No se encontraron servicios.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
