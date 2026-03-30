// app/api/proyectos/route.js
import { readProjects, createProjectInDB } from "../data/db"; // <-- ruta corregida

// Obtener todos los proyectos
export async function GET() {
  const projects = await readProjects();
  return new Response(JSON.stringify(projects), { status: 200 });
}

// Crear un nuevo proyecto
export async function POST(req) {
  try {
    const data = await req.json();

    if (!data.nombre || !data.descripcion) {
      return new Response(
        JSON.stringify({ message: "Campos obligatorios: nombre y descripción" }),
        { status: 400 }
      );
    }

    const id = Date.now().toString(); // ID único
    const newProject = {
      id,
      ...data,
      tasks: data.tasks || [],
    };

    await createProjectInDB(newProject);

    return new Response(JSON.stringify(newProject), { status: 201 });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error al crear proyecto" }),
      { status: 500 }
    );
  }
}