const inputClass = "w-full pl-2.5 py-2 bg-white rounded text-md text-gray-800 border";
const labelClass = "block text-md text-gray-900 font-medium mb-1.5";

const Panel = () => {
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

        <form className="space-y-6">
          <div>
            <label className={labelClass}>System Prompt</label>
            <textarea
              className={`${inputClass} h-32 resize-none`}
              placeholder="Escribe las instrucciones del asistente..."
            />
          </div>

          <div>
            <label className={labelClass}>Model</label>
            <input
              type="text"
              className={inputClass}
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
              className={`${inputClass} w-full`}
              placeholder="0.7"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2.5 rounded font-medium hover:bg-blue-600 cursor-pointer"
          >
            Guardar configuración
          </button>
        </form>
      </section>
    </main>
  );
}

export default Panel;