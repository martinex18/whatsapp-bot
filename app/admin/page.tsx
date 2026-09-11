"use client"; // permite usar estados en este componente
import { useState, useEffect } from "react";

const inputClass =
  "w-full pl-2.5 py-2 bg-white rounded text-md text-gray-800 border";
const labelClass = "block text-md text-gray-900 font-medium mb-1.5";

const Panel = () => {
  const [form, setForm] = useState({
    systemPrompt: "",
    model: "",
    temperature: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [hasConfig, setHasConfig] = useState(false);

  useEffect(() => {
    const getConfig = async () => {
      const response = await fetch("/api/config");
      const data = await response.json();

      if (!data.consulta.length) {
        setHasConfig(false);
        return;
      }

      const config = data.consulta[0];

      setHasConfig(true);

      setForm({
        systemPrompt: config.system_prompt,
        model: config.model,
        temperature: config.temperature,
      });
    };

    getConfig();
  }, []);

  const validateForm = () => {
    if (!form.systemPrompt.trim() || !form.model.trim()) {
      setError("Todos los campos son obligatorios");
      return false;
    }

    if (form.temperature < 0 || form.temperature > 2) {
      setError("La temperatura debe estar entre 0 y 2");
      return false;
    }

    setError("");
    return true;
  };

  const handleConfig = async (e: React.FormEvent<HTMLFormElement>) => {
    const method = hasConfig ? "PUT" : "POST";

    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const response = await fetch("/api/config", {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          system_prompt: form.systemPrompt,
          model: form.model,
          temperature: Number(form.temperature),
        }),
      });

      if (!response.ok) throw new Error("Error al guardar configuración");

      setHasConfig(true);
      setSuccess("Configuración guardada");

      setError("");
    } catch {
      setError("Error al guardar");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <section className="w-full max-w-2xl bg-white rounded-xl shadow-sm p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Configuración del bot
          </h1>
          <p className="text-gray-500 mt-2">
            Configura el comportamiento de tu asistente.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleConfig}>
          <div>
            <label className={labelClass}>Prompt</label>
            <textarea
              className={`${inputClass} h-32 resize-none`}
              value={form.systemPrompt}
              onChange={(e) =>
                setForm({ ...form, systemPrompt: e.target.value })
              }
              placeholder="Escribe las instrucciones del asistente..."
            />
          </div>

          <div>
            <label className={labelClass}>Model</label>
            <input
              type="text"
              className={inputClass}
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
              placeholder="openrouter/free"
            />
          </div>

          <div>
            <label className={labelClass}>Temperature</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="2"
              className={inputClass}
              value={form.temperature}
              onChange={(e) =>
                setForm({ ...form, temperature: Number(e.target.value) })
              }
              placeholder="0.7"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2.5 rounded font-medium hover:bg-blue-600 cursor-pointer"
          >
            {" "}
            {loading ? "Guardando..." : "Guardar configuración"}
          </button>

          {success && (
            <p className="text-md text-green-400 px-3 py-2 rounded bg-green-500/20">
              {success}
            </p>
          )}

          {error && (
            <p className="text-sm text-red-400 px-3 py-2 rounded bg-red-500/20">
              {error}
            </p>
          )}
        </form>
      </section>
    </main>
  );
};

export default Panel;
