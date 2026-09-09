import { db } from "@/lib/db";
import { askOpenRouter } from "@/lib/openrouter";

export async function POST(request: Request) {
  const body = await request.json();
  const fromMe = body.data.key.fromMe;
  if (fromMe) {
    return Response.json({});
  } else {
    const messageText = body.data.message.conversation;
    const remoteJid = body.data.key.remoteJid;
    const number = remoteJid.replace("@s.whatsapp.net", "");
    console.log("Numero: ", number);

    const query = db.prepare("select * from bot_config");
    const result = query.all();
    const botConfig = result[0];

    const config = {
      model: botConfig.model,
      systemPrompt: botConfig.system_prompt,
      temperature: botConfig.temperature,
      message: messageText,
    };

    const aiResponse = await askOpenRouter(config);
    console.log("Respuesta IA:", aiResponse);
    return Response.json({ aiResponse });
  }
}
