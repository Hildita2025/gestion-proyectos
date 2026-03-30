"use client";

import { useEffect, useState } from "react";
import {
  getProjects,
  deleteProject,
  createProject,
  updateProject,
} from "../../services/projectService";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function ProyectosPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ nombre: "", descripcion: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user]);

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.descripcion) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const dataToSend = { ...form, userEmail: user.email, tasks: [] };

    try {
      if (editingId) {
        await updateProject(editingId, dataToSend);
        setEditingId(null);
      } else {
        await createProject(dataToSend);
      }
      setForm({ nombre: "", descripcion: "" });
      loadProjects();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleEdit = (project) => {
    setForm({ nombre: project.nombre, descripcion: project.descripcion });
    setEditingId(project.id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteProject(id);
      loadProjects();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const filteredProjects = projects.filter(
    (p) => user?.role === "gerente" || p.userEmail === user?.email
  );

  if (!user) return null;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-indigo-700">📊 Dashboard de Proyectos</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-6 bg-white p-6 rounded-xl shadow-lg border border-indigo-100"
      >
        <h2 className="text-2xl font-semibold mb-4 text-indigo-600">
          {editingId ? "Editar Proyecto" : "Crear Nuevo Proyecto"}
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            name="nombre"
            placeholder="Nombre del proyecto"
            value={form.nombre}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            name="descripcion"
            placeholder="Descripción del proyecto"
            value={form.descripcion}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <button className="mt-4 bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700 transition">
          {editingId ? "Actualizar Proyecto" : "Crear Proyecto"}
        </button>
      </form>

      {/* Lista de proyectos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((p) => {
          const completed = p.tasks?.filter((t) => t.estado === "completado").length || 0;
          const total = p.tasks?.length || 0;
          const percent = total ? Math.round((completed / total) * 100) : 0;

          return (
            <div key={p.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-5 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{p.nombre}</h2>
                <p className="text-gray-600 mt-1">{p.descripcion}</p>

                {/* Progreso */}
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700">
                    Progreso: {percent}% ({completed}/{total})
                  </p>
                  <div className="w-full bg-gray-200 h-3 rounded-full mt-1">
                    <div
                      className="bg-green-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Tareas */}
                <div className="mt-4">
                  <strong className="text-gray-700">Tareas:</strong>
                  {(p.tasks || [])
                    .filter((t) => user.role === "gerente" || t.asignadoA === user.email)
                    .map((t) => (
                      <div key={t.id} className="flex justify-between items-center mt-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                        <div>
                          <p className="text-gray-800 font-medium">{t.nombre}</p>
                          <p className="text-sm text-gray-500">
                            Estado: {t.estado} | 👤 {t.asignadoA}
                          </p>
                        </div>
                        {(user.role === "gerente" || t.asignadoA === user.email) && (
                          <button
                            onClick={async () => {
                              const updatedTasks = p.tasks.map((task) =>
                                task.id === t.id
                                  ? { ...task, estado: task.estado === "pendiente" ? "completado" : "pendiente" }
                                  : task
                              );
                              try {
                                await updateProject(p.id, { ...p, tasks: updatedTasks });
                                loadProjects();
                              } catch (err) {
                                console.error(err);
                                alert(err.message);
                              }
                            }}
                            className="text-blue-500 font-semibold hover:underline"
                          >
                            Cambiar Estado
                          </button>
                        )}
                      </div>
                    ))}
                </div>
              </div>

              {/* Botones del proyecto */}
              <div className="mt-5 flex flex-wrap gap-2">
                {(user.role === "gerente" || p.userEmail === user.email) && (
                  <button
                    onClick={() => handleEdit(p)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg shadow"
                  >
                    Editar
                  </button>
                )}
                {user.role === "gerente" && (
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow"
                  >
                    Eliminar
                  </button>
                )}

                
                {user.role === "gerente" && (
                  <button
                    onClick={async () => {
                      const nombre = prompt("Nombre de la tarea");
                      const asignadoA = prompt("Correo del usuario");
                      if (!nombre || !asignadoA) return;
                      if (!asignadoA.includes("@")) { alert("Correo inválido"); return; }

                      const newTasks = [...(p.tasks || []), { id: Date.now(), nombre, estado: "pendiente", asignadoA }];
                      try { await updateProject(p.id, { ...p, tasks: newTasks }); loadProjects(); } 
                      catch (err) { console.error(err); alert(err.message); }
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow"
                  >
                    + Asignar Tarea
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}