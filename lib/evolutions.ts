interface EvolutionRequest {
  instance: string;
  number: string;
  text: string;
}

export async function sendEvolutionMessage(messageConfig: EvolutionRequest) {
  // se envia el mensaje a la instancia de Evolution
  try {
    const response = await fetch(
      `${process.env.EVOLUTION_API_URL}/message/sendText/${messageConfig.instance}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.EVOLUTION_API_KEY!,
        },
        body: JSON.stringify({
          number: messageConfig.number,
          text: messageConfig.text,
        }),
      },
    );

    if (!response.ok)
      throw new Error(`Evolution API error: ${response.status}`);

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error con Evolution API:", error);
    throw new Error("No se pudo enviar el mensaje con Evolution API");
  }
}
