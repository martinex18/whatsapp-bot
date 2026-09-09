interface User {
  name: string;
  age: number;
}

export async function POST(request: Request) {
  const body: User = await request.json();
  if (body.name === "" || typeof body.age !== "number") {
    return Response.json({
      error: "Datos invalidos",
    });
  } else if (body.age >= 18) {
    return Response.json({
      response: `Hola ${body.name}, eres mayor de edad.`,
    });
  } else {
    return Response.json({
      response: `Hola ${body.name}, eres menor de edad.`,
    });
  }
}
