import "@/lib/db";

export async function GET() {
  return Response.json({
    status: "ok",
    message: "API funcionando",
  });
}
