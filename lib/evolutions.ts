interface EvolutionRequest {
  instance: string;
  number: string;
  text: string;
}

export async function sendEvolutionMessage(messageConfig: EvolutionRequest) {
  // se envia el mensaje a la instancia de Evolution
  const response = await fetch(
    `http://localhost:8080/message/sendText/${messageConfig.instance}`,
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

  const data = await response.json();
  return data;
}
