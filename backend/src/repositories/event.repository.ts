import type { RowDataPacket } from "mysql2";
import { pool } from "../config/database";
import type { CatalogItem, CatalogItemType, EventSlot } from "../types/event";

type EventRow = RowDataPacket & {
  id: number;
  name: string;
  date: string;
};

type EventSlotRow = RowDataPacket & EventSlot;

type CatalogItemRow = RowDataPacket & {
  id: number;
  name: string;
  type: CatalogItemType;
  price: number;
};

export async function findActiveEvent() {
  const [rows] = await pool.query<EventRow[]>(`
    SELECT
      id,
      name,
      DATE_FORMAT(event_date, '%Y-%m-%d') AS date
    FROM events
    WHERE is_active = TRUE
    ORDER BY event_date ASC
    LIMIT 1
  `);

  return rows[0] ?? null;
}

export async function findActiveEventSlots(
  eventId: number,
): Promise<EventSlot[]> {
  const [rows] = await pool.query<EventSlotRow[]>(
    `
      SELECT
        id,
        TIME_FORMAT(start_time, '%H:%i') AS time
      FROM event_slots
      WHERE event_id = ?
        AND is_active = TRUE
      ORDER BY start_time ASC
    `,
    [eventId],
  );

  return rows;
}

export async function findActiveCatalogItems(): Promise<CatalogItem[]> {
  const [rows] = await pool.query<CatalogItemRow[]>(`
    SELECT
      id,
      name,
      type,
      price
    FROM catalog_items
    WHERE is_active = TRUE
    ORDER BY type, name
  `);

  return rows;
}
