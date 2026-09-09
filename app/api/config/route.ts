import { db } from "@/lib/db";

interface Config {
  system_prompt: string;
  model: string;
  temperature: number;
}

export async function GET() {
  const query = db.prepare("select * from bot_config");
  const result = query.all();
  return Response.json({
    consulta: result,
  });
}

export async function POST(request: Request) {
  const body: Config = await request.json();
  const insertStatement = db.prepare(
    "insert into bot_config (system_prompt,model,temperature)values(?,?,?)",
  );
  const result = insertStatement.run(
    body.system_prompt,
    body.model,
    body.temperature,
  );

  return Response.json({
    insertStatement: result,
  });
}

export async function PUT(request: Request) {
  const body: Config = await request.json();
  const updateStatement = db.prepare(
    "update bot_config set system_prompt = ?, model = ?, temperature = ? where id = ?",
  );
  const result = updateStatement.run(
    body.system_prompt,
    body.model,
    body.temperature,
    1,
  );

  return Response.json({
    updateStatement: result,
  });
}
