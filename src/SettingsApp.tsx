import { useEffect, useState } from "react";
import { get_status_message } from "./lib/string"

type AvailableType = "yes" | "no";

function get_token(): string {
  return new URL(window.location.href).searchParams.get("token")!;
}

export default function App() {
  const [email, setEmail] = useState<string>("");
  const [available, setAvailable] = useState<AvailableType>("no");
  const [error, setError] = useState<string | null>(null);
  const [log, setLog] = useState<string | null>(null);

  useEffect(() => {
    async function load_settings() {
      try {
        const response = await fetch(
          `/settings/data?token=${get_token()}`
        );

        const data:
          | {
            success: false;
            message: string;
          }
          | {
            success: true;
            email: string;
            available: AvailableType;
          } = await response.json();

        if (!data.success) {
          setError(data.message);
        } else {
          setEmail(data.email);
          setAvailable(data.available);
        }
      } catch (error) {
        console.error(error);
        setError("Failed to load settings. Please try again.");
      }
    }

    load_settings();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const response = await fetch(`/settings/save?token=${get_token()}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        available,
      }),
    });

    const data: {
      success: boolean,
      message: string
    } = await response.json();

    if (!data.success) {
      setLog(null);
      setError(data.message);
      return;
    }

    setLog(data.message);
    setError(null);
  }

  return <div>
    <h3>--- Settings ---</h3>
    <a href="/">Back</a>
    <hr />
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email: </label>
      <input id="email" name="email" type="email" value={email} autoComplete="email" placeholder="john.doe@example.com" onChange={(e) => setEmail(e.target.value)} required/>
      <br /> <br />
      <label htmlFor="available">¿Aceptar clientes? </label>

      <select id="available" name="available" value={available} onChange={(e) => e.target.value == "yes" ? setAvailable("yes") : setAvailable("no")} required>
        <option value="yes">Sí</option>
        <option value="no">No</option>
      </select>
      <p>Mensaje: {get_status_message(available == "yes")}</p>
      {log && <p style={{ color: "green" }}>{log}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit">Guardar</button>
    </form>
  </div>
}
