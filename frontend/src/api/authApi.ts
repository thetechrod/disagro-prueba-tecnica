type LoginResponse = {
  data: {
    token: string;
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
};

export async function login(email: string, password: string) {
  const API_URL = import.meta.env.VITE_API_URL;

  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message ?? "No fue posible iniciar sesión.");
  }

  return (result as LoginResponse).data;
}
