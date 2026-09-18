import type {
  Confirmation,
  CreateConfirmationInput,
} from "../types/confirmation";

type ConfirmationResponse = {
  data: Confirmation;
};

const API_URL = import.meta.env.VITE_API_URL;

export async function createConfirmation(
  input: CreateConfirmationInput,
  token: string,
): Promise<Confirmation> {
  const response = await fetch(`${API_URL}/api/confirmations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ?? "No fue posible confirmar la asistencia.",
    );
  }

  return (result as ConfirmationResponse).data;
}
