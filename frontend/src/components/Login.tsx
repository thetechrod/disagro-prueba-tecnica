import { useState } from "react";

import { login } from "../api/authApi";

type LoginProps = {
  onLogin: (token: string) => void;
};

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError(null);

      const result = await login(email, password);

      sessionStorage.setItem("authToken", result.token);

      onLogin(result.token);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No fue posible iniciar sesión.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <img
          className="login-logo"
          src="https://www.disagro.com.gt/wp-content/uploads/2022/02/logotipo-disagro-verde-300x135.png"
          alt="DISAGRO"
        />
        <h1>DISAGRO</h1>

        <h2>Ingreso al evento</h2>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        {error && <p className="submit-error">{error}</p>}

        <button
          className="confirm-button"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
