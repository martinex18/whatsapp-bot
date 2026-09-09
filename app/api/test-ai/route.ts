import { askOpenRouter } from "@/lib/openrouter";
import { db } from "@/lib/db";

export async function GET() {
  const query = db.prepare("select * from bot_config");
  const result = query.all();
  const botConfig = result[0];
  const config = {
    model: botConfig.model,
    systemPrompt: botConfig.system_prompt,
    temperature: botConfig.temperature,
    message: "Hola, ¿cómo estás?",
  };
  const aiResponse = await askOpenRouter(config);
  return Response.json(aiResponse);
}
