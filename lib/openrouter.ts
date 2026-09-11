// Puente entre backend y OpenRouter
// Recibir configuracion, hacer peticion y devolver respuesta

interface OpenRouterRequest {
  model: string;
  systemPrompt: string;
  temperature: number;
  message: string;
}

export async function askOpenRouter(config: OpenRouterRequest) {
  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: config.model,
          messages: [
            {
              role: "system", // define el comportamiento de la IA.
              content: config.systemPrompt,
            },
            {
              role: "user",
              content: config.message,
            },
          ],
          temperature: config.temperature,
        }),
      },
    );

    if (!response.ok) throw new Error(`OpenRouter error: ${response.status}`);

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error al obtener respuesta de OpenRouter: ", error);
    throw new Error("No se pudo obtener una respuesta de OpenRouter");
  }
}
