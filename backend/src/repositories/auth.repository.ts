import type { RowDataPacket } from "mysql2";

import { pool } from "../config/database";

type UserRow = RowDataPacket & {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
};

export async function findUserByEmail(email: string) {
  const [rows] = await pool.query<UserRow[]>(
    `
      SELECT
        id,
        name,
        email,
        password_hash AS passwordHash
      FROM users
      WHERE email = ?
        AND is_active = TRUE
      LIMIT 1
    `,
    [email],
  );

  return rows[0] ?? null;
}
