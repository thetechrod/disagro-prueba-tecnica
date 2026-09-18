type EventHeaderProps = {
  name: string;
  date: string;
  onLogout: () => void;
};

function formatEventDate(date: string) {
  return new Intl.DateTimeFormat("es-GT", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export function EventHeader({ name, date, onLogout }: EventHeaderProps) {
  return (
    <header className="event-header">
      <div className="event-header-content">
        <div className="event-header-main">
          <p className="event-header-company">DISAGRO</p>

          <div className="event-header-title-row">
            <h1>{name}</h1>
            <span className="event-header-separator" aria-hidden="true">
              —
            </span>
            <p className="event-header-date">{formatEventDate(date)}</p>
          </div>
        </div>

        <div className="event-header-actions">
          <img
            className="event-header-logo"
            src="https://www.disagro.com.gt/wp-content/uploads/2022/02/logotipo-disagro-verde-300x135.png"
            alt="DISAGRO"
          />

          <button className="logout-button" type="button" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
}
