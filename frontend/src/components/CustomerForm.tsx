import type { EventSlot } from "../types/event";

type CustomerFormProps = {
  firstName: string;
  lastName: string;
  email: string;
  selectedSlotId: number | null;
  slots: EventSlot[];
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onSlotChange: (value: number | null) => void;
};

export function CustomerForm({
  firstName,
  lastName,
  email,
  selectedSlotId,
  slots,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onSlotChange,
}: CustomerFormProps) {
  return (
    <section className="step-section">
      <div className="step-heading">
        <span className="step-number">1</span>
        <h2>Ingrese su información</h2>
      </div>

      <div className="customer-form">
        <label>
          Nombre:
          <input
            type="text"
            placeholder="Introduzca su nombre"
            value={firstName}
            onChange={(event) => onFirstNameChange(event.target.value)}
            required
          />
        </label>

        <label>
          Apellidos:
          <input
            type="text"
            placeholder="Introduzca sus apellidos"
            value={lastName}
            onChange={(event) => onLastNameChange(event.target.value)}
            required
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            placeholder="Introduzca su email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            required
          />
        </label>

        <label>
          Horario de asistencia:
          <select
            value={selectedSlotId ?? ""}
            onChange={(event) =>
              onSlotChange(
                event.target.value ? Number(event.target.value) : null,
              )
            }
            required
          >
            <option value="">Seleccione un horario</option>

            {slots.map((slot) => (
              <option key={slot.id} value={slot.id}>
                {slot.time}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
