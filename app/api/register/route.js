import { users } from "../users/data";

export async function POST(req) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return Response.json(
      { message: "Campos obligatorios" },
      { status: 400 }
    );
  }

  const userExists = users.find((u) => u.email === email);

  if (userExists) {
    return Response.json(
      { message: "Usuario ya existe" },
      { status: 400 }
    );
  }

  const newUser = {
    email,
    password,
    nombre: email.split("@")[0],
    role: email.includes("admin") ? "gerente" : "usuario", // 🔥 FIX
  };

  users.push(newUser);

  return Response.json({
    message: "Usuario creado",
    user: newUser,
  });
}