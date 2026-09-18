import {
  findCatalogItemsByIds,
  findConfirmationByEmail,
  findEventSlotById,
  saveConfirmation,
} from "../repositories/confirmation.repository";

import type {
  CreateConfirmationInput,
  ConfirmationResponse,
} from "../types/confirmation";

import {
  getProductDiscount,
  getServiceDiscount,
  getSubtotal,
  roundMoney,
} from "../utils/discounts";

import { AppError } from "../utils/appError";

export async function createConfirmation(
  input: CreateConfirmationInput,
): Promise<ConfirmationResponse> {
  const firstName = input.firstName?.trim();
  const lastName = input.lastName?.trim();
  const email = input.email?.trim().toLowerCase();

  if (!firstName || !lastName || !email) {
    throw new AppError(400, "Nombre, apellidos y email son obligatorios.");
  }

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!isEmailValid) {
    throw new AppError(400, "El email ingresado no es válido.");
  }

  if (!Number.isInteger(input.eventSlotId) || input.eventSlotId <= 0) {
    throw new AppError(400, "El horario seleccionado no es válido.");
  }

  if (
    !Array.isArray(input.catalogItemIds) ||
    input.catalogItemIds.length === 0
  ) {
    throw new AppError(
      400,
      "Debe seleccionar al menos un producto o servicio.",
    );
  }

  const catalogItemIds = [...new Set(input.catalogItemIds)];

  const slot = await findEventSlotById(input.eventSlotId);

  if (!slot) {
    throw new AppError(400, "El horario seleccionado no está disponible.");
  }

  const existingConfirmation = await findConfirmationByEmail(
    slot.eventId,
    email,
  );

  if (existingConfirmation) {
    throw new AppError(
      409,
      "Este correo ya confirmó asistencia para el evento.",
    );
  }

  const catalogItems = await findCatalogItemsByIds(catalogItemIds);

  if (catalogItems.length !== catalogItemIds.length) {
    throw new AppError(400, "Uno o más productos o servicios no son válidos.");
  }

  const products = catalogItems.filter((item) => item.type === "PRODUCT");

  const services = catalogItems.filter((item) => item.type === "SERVICE");

  const productSubtotal = roundMoney(getSubtotal(products));

  const serviceSubtotal = roundMoney(getSubtotal(services));

  const productDiscountPercent = getProductDiscount(products);

  const serviceDiscountPercent = getServiceDiscount(services);

  const productDiscountAmount = roundMoney(
    productSubtotal * (productDiscountPercent / 100),
  );

  const serviceDiscountAmount = roundMoney(
    serviceSubtotal * (serviceDiscountPercent / 100),
  );

  const productTotal = roundMoney(productSubtotal - productDiscountAmount);

  const serviceTotal = roundMoney(serviceSubtotal - serviceDiscountAmount);

  const totalBeforeDiscount = roundMoney(productSubtotal + serviceSubtotal);

  const totalDiscount = roundMoney(
    productDiscountAmount + serviceDiscountAmount,
  );

  const totalAfterDiscount = roundMoney(totalBeforeDiscount - totalDiscount);

  const confirmationId = await saveConfirmation({
    eventId: slot.eventId,
    eventSlotId: slot.id,

    firstName,
    lastName,
    email,

    productDiscountPercent,
    serviceDiscountPercent,

    totalBeforeDiscount,
    totalDiscount,
    totalAfterDiscount,

    items: catalogItems.map((item) => ({
      catalogItemId: item.id,
      itemName: item.name,
      itemType: item.type,
      priceAtConfirmation: item.price,
    })),
  });

  return {
    confirmationId,

    customer: {
      firstName,
      lastName,
      email,
    },

    event: {
      name: slot.eventName,
      date: slot.eventDate,
      time: slot.time,
    },

    products: {
      items: products,
      subtotal: productSubtotal,
      discountPercent: productDiscountPercent,
      discountAmount: productDiscountAmount,
      total: productTotal,
    },

    services: {
      items: services,
      subtotal: serviceSubtotal,
      discountPercent: serviceDiscountPercent,
      discountAmount: serviceDiscountAmount,
      total: serviceTotal,
    },

    totalBeforeDiscount,
    totalDiscount,
    total: totalAfterDiscount,
  };
}
