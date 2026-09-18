import { useEffect, useState } from "react";
import { CustomerForm } from "./components/CustomerForm";
import { getActiveEvent } from "./api/eventApi";
import { EventHeader } from "./components/EventHeader";
import type { ActiveEvent } from "./types/event";
import { CatalogSelector } from "./components/CatalogSelector";
import { DiscountSummary } from "./components/DiscountSummary";
import { getProductDiscount, getServiceDiscount } from "./utils/discounts";
import { createConfirmation } from "./api/confirmationApi";
import { ConfirmationSummary } from "./components/ConfirmationSummary";
import type { Confirmation } from "./types/confirmation";
import { Login } from "./components/Login";

export default function App() {
  const [authToken, setAuthToken] = useState<string | null>(() =>
    sessionStorage.getItem("authToken"),
  );

  const [event, setEvent] = useState<ActiveEvent | null>(null);

  const [isLoading, setIsLoading] = useState(Boolean(authToken));

  const [error, setError] = useState<string | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);

  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);

  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!authToken) {
      return;
    }

    const token = authToken;

    async function loadEvent() {
      try {
        const activeEvent = await getActiveEvent(token);

        setEvent(activeEvent);
      } catch (error) {
        console.error(error);

        setError("No fue posible cargar la información del evento.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadEvent();
  }, [authToken]);

  function handleLogin(token: string) {
    setIsLoading(true);
    setError(null);
    setAuthToken(token);
  }

  function handleLogout() {
    sessionStorage.removeItem("authToken");

    setAuthToken(null);
    setEvent(null);
    setConfirmation(null);
    setError(null);
    setIsLoading(false);

    setFirstName("");
    setLastName("");
    setEmail("");
    setSelectedSlotId(null);
    setSelectedItemIds([]);
    setSubmitError(null);
  }

  if (!authToken) {
    return <Login onLogin={handleLogin} />;
  }

  if (isLoading) {
    return <p>Cargando evento...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!event) {
    return <p>No hay un evento disponible.</p>;
  }

  const selectedProducts = event.catalog.products.filter((product) =>
    selectedItemIds.includes(product.id),
  );

  const selectedServices = event.catalog.services.filter((service) =>
    selectedItemIds.includes(service.id),
  );

  const productDiscount = getProductDiscount(selectedProducts);

  const serviceDiscount = getServiceDiscount(selectedServices);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const canConfirm =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    isEmailValid &&
    selectedSlotId !== null &&
    selectedItemIds.length > 0;

  async function handleConfirm() {
    if (!authToken || !selectedSlotId || !canConfirm) {
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const result = await createConfirmation(
        {
          firstName,
          lastName,
          email,
          eventSlotId: selectedSlotId,
          catalogItemIds: selectedItemIds,
        },
        authToken,
      );

      setConfirmation(result);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "No fue posible confirmar la asistencia.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleNewConfirmation() {
    setFirstName("");
    setLastName("");
    setEmail("");
    setSelectedSlotId(null);
    setSelectedItemIds([]);
    setSubmitError(null);
    setConfirmation(null);
  }

  if (confirmation) {
    return (
      <div className="app-layout">
        <EventHeader
          name={confirmation.event.name}
          date={confirmation.event.date}
          onLogout={handleLogout}
        />

        <main className="page">
          <ConfirmationSummary
            confirmation={confirmation}
            onNewConfirmation={handleNewConfirmation}
          />
        </main>

        <footer className="app-footer">Atención al cliente: 2223-2425</footer>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <EventHeader
        name={event.name}
        date={event.date}
        onLogout={handleLogout}
      />

      <main className="page">
        <div className="app-columns">
          <CustomerForm
            firstName={firstName}
            lastName={lastName}
            email={email}
            selectedSlotId={selectedSlotId}
            slots={event.slots}
            onFirstNameChange={setFirstName}
            onLastNameChange={setLastName}
            onEmailChange={setEmail}
            onSlotChange={setSelectedSlotId}
          />

          <div className="catalog-column">
            <CatalogSelector
              products={event.catalog.products}
              services={event.catalog.services}
              selectedItemIds={selectedItemIds}
              onSelectionChange={setSelectedItemIds}
            />

            <DiscountSummary
              productDiscount={productDiscount}
              serviceDiscount={serviceDiscount}
            />

            <button
              className="confirm-button"
              type="button"
              disabled={!canConfirm || isSubmitting}
              onClick={handleConfirm}
            >
              {isSubmitting ? "Confirmando..." : "Confirmar asistencia"}
            </button>

            {submitError && <p className="submit-error">{submitError}</p>}
          </div>
        </div>
      </main>

      <footer className="app-footer">Atención al cliente: 2223-2425</footer>
    </div>
  );
}
