import type { ResultSetHeader, RowDataPacket } from "mysql2";

import { pool } from "../config/database";

import type { CatalogItem, CatalogItemType } from "../types/event";

import type { ConfirmationToSave } from "../types/confirmation";

type EventSlotRow = RowDataPacket & {
  id: number;
  eventId: number;
  eventName: string;
  eventDate: string;
  time: string;
};

type CatalogItemRow = RowDataPacket & {
  id: number;
  name: string;
  type: CatalogItemType;
  price: number;
};

export async function findEventSlotById(eventSlotId: number) {
  const [rows] = await pool.query<EventSlotRow[]>(
    `
      SELECT
        es.id,
        es.event_id AS eventId,
        e.name AS eventName,
        DATE_FORMAT(e.event_date, '%Y-%m-%d') AS eventDate,
        TIME_FORMAT(es.start_time, '%H:%i') AS time
      FROM event_slots es
      INNER JOIN events e
        ON e.id = es.event_id
      WHERE es.id = ?
        AND es.is_active = TRUE
        AND e.is_active = TRUE
      LIMIT 1
    `,
    [eventSlotId],
  );

  return rows[0] ?? null;
}

export async function findConfirmationByEmail(eventId: number, email: string) {
  const [rows] = await pool.query<RowDataPacket[]>(
    `
      SELECT id
      FROM confirmations
      WHERE event_id = ?
        AND email = ?
      LIMIT 1
    `,
    [eventId, email],
  );

  return rows[0] ?? null;
}

export async function findCatalogItemsByIds(
  ids: number[],
): Promise<CatalogItem[]> {
  const placeholders = ids.map(() => "?").join(", ");

  const [rows] = await pool.query<CatalogItemRow[]>(
    `
      SELECT
        id,
        name,
        type,
        price
      FROM catalog_items
      WHERE id IN (${placeholders})
        AND is_active = TRUE
    `,
    ids,
  );

  return rows;
}

export async function saveConfirmation(
  confirmation: ConfirmationToSave,
): Promise<number> {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [confirmationResult] = await connection.execute<ResultSetHeader>(
      `
          INSERT INTO confirmations (
            event_id,
            event_slot_id,
            first_name,
            last_name,
            email,
            product_discount_percent,
            service_discount_percent,
            total_before_discount,
            total_discount,
            total_after_discount
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
      [
        confirmation.eventId,
        confirmation.eventSlotId,
        confirmation.firstName,
        confirmation.lastName,
        confirmation.email,
        confirmation.productDiscountPercent,
        confirmation.serviceDiscountPercent,
        confirmation.totalBeforeDiscount,
        confirmation.totalDiscount,
        confirmation.totalAfterDiscount,
      ],
    );

    const confirmationId = confirmationResult.insertId;

    for (const item of confirmation.items) {
      await connection.execute(
        `
          INSERT INTO confirmation_items (
            confirmation_id,
            catalog_item_id,
            item_name,
            item_type,
            price_at_confirmation
          )
          VALUES (?, ?, ?, ?, ?)
        `,
        [
          confirmationId,
          item.catalogItemId,
          item.itemName,
          item.itemType,
          item.priceAtConfirmation,
        ],
      );
    }

    await connection.commit();

    return confirmationId;
  } catch (error) {
    await connection.rollback();

    throw error;
  } finally {
    connection.release();
  }
}
