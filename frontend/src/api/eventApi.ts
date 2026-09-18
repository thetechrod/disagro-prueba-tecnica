import type { ActiveEvent } from "../types/event";

type ActiveEventResponse = {
  data: ActiveEvent;
};

const API_URL = import.meta.env.VITE_API_URL;

export async function getActiveEvent(token: string): Promise<ActiveEvent> {
  const response = await fetch(`${API_URL}/api/events/active`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`No se pudo cargar el evento. Status: ${response.status}`);
  }

  const result: ActiveEventResponse = await response.json();

  return result.data;
}
