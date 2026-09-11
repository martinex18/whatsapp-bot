import { db } from "@/lib/db";
import { askOpenRouter } from "@/lib/openrouter";
import { sendEvolutionMessage } from "@/lib/evolutions";

interface BotConfig {
  id: number;
  system_prompt: string;
  model: string;
  temperature: number;
  created_at: string;
  updated_at: string;
}

export async function POST(request: Request) {
  const body = await request.json();
  const fromMe = body.data.key.fromMe;
  if (fromMe) {
    return Response.json({});
  } else {
    const messageText = body.data.message.conversation;
    const remoteJid = body.data.key.remoteJid;
    const number = remoteJid.replace("@s.whatsapp.net", "");

    const query = db.prepare("select * from bot_config");
    const result = query.all() as BotConfig[];
    const botConfig = result[0];

    if (!botConfig) {
      return Response.json(
        { error: "No existe configuración del bot" },
        { status: 500 },
      );
    }

    const config = {
      model: botConfig.model,
      systemPrompt: botConfig.system_prompt,
      temperature: botConfig.temperature,
      message: messageText,
    };

    const aiResponse = await askOpenRouter(config);
    const messageConfig = {
      instance: "whatsapp-bot",
      number: number,
      text: aiResponse,
    };
    const evolutionResponse = await sendEvolutionMessage(messageConfig);

    console.log("Webhook recibido: ", messageText);
    console.log("Respuesta IA: ", aiResponse);
    console.log("Respuesta Evolution: ", evolutionResponse);
    return Response.json({ evolutionResponse });
  }
}
