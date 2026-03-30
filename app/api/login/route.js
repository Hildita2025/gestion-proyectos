import { users } from "../users/data";

export async function POST(req) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return Response.json(
      { message: "Campos obligatorios" },
      { status: 400 }
    );
  }

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return Response.json(
      { message: "Credenciales incorrectas" },
      { status: 401 }
    );
  }

  return Response.json({
    message: "Login exitoso",
    user,
  });
}