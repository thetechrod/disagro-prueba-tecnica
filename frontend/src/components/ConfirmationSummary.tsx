import type { Confirmation } from "../types/confirmation";

type ConfirmationSummaryProps = {
  confirmation: Confirmation;
  onNewConfirmation: () => void;
};

export function ConfirmationSummary({
  confirmation,
  onNewConfirmation,
}: ConfirmationSummaryProps) {
  return (
    <section className="confirmation-summary">
      <h2>Asistencia confirmada</h2>

      <p>
        <strong>
          {confirmation.customer.firstName} {confirmation.customer.lastName}
        </strong>
      </p>

      <p>{confirmation.customer.email}</p>

      <div className="confirmation-event">
        <p>
          <strong>Evento:</strong> {confirmation.event.name}
        </p>

        <p>
          <strong>Fecha:</strong> {confirmation.event.date}
        </p>

        <p>
          <strong>Horario:</strong> {confirmation.event.time}
        </p>
      </div>

      {confirmation.products.items.length > 0 && (
        <div>
          <h3>Productos</h3>

          {confirmation.products.items.map((item) => (
            <p key={item.id}>
              {item.name} - Q{item.price.toFixed(2)}
            </p>
          ))}

          <p>Descuento: {confirmation.products.discountPercent}%</p>
        </div>
      )}

      {confirmation.services.items.length > 0 && (
        <div>
          <h3>Servicios</h3>

          {confirmation.services.items.map((item) => (
            <p key={item.id}>
              {item.name} - Q{item.price.toFixed(2)}
            </p>
          ))}

          <p>Descuento: {confirmation.services.discountPercent}%</p>
        </div>
      )}

      <div className="confirmation-total">
        <p>Subtotal: Q{confirmation.totalBeforeDiscount.toFixed(2)}</p>

        <p>Descuento: Q{confirmation.totalDiscount.toFixed(2)}</p>

        <strong>Total: Q{confirmation.total.toFixed(2)}</strong>
      </div>
      <button
        className="confirm-button"
        type="button"
        onClick={onNewConfirmation}
      >
        Registrar nueva asistencia
      </button>
    </section>
  );
}
