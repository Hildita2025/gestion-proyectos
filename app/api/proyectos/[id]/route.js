// app/api/proyectos/[id]/route.js
import { NextResponse } from "next/server";
import { getProjectById, updateProjectInDB, deleteProjectInDB } from "../../data/db"; // <-- ruta corregida

// Obtener proyecto por ID
export async function GET(req, { params }) {
  const id = params.id.toString();
  const project = await getProjectById(id);
  if (!project) {
    return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
  }
  return NextResponse.json(project);
}

// Actualizar proyecto
export async function PUT(req, { params }) {
  const id = params.id.toString();
  const data = await req.json();
  const updated = await updateProjectInDB(id, data);
  if (!updated) {
    return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
  }
  return NextResponse.json({ message: "Proyecto actualizado", proyecto: updated });
}

// Eliminar proyecto
export async function DELETE(req, { params }) {
  const id = params.id.toString();
  const project = await getProjectById(id);
  if (!project) {
    return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
  }

  await deleteProjectInDB(id);
  return NextResponse.json({ message: "Proyecto eliminado correctamente" });
}