"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { getProjects } from "../../services/projectService";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user]);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const data = await getProjects();
    setProjects(data);
  };

  if (!user) return null;


  const visibleProjects =
    user.role === "admin" ? projects : projects.filter(p => p.userEmail === user.email);

  const totalTasks = visibleProjects.reduce(
    (acc, p) => acc + (p.tasks?.length || 0),
    0
  );
  const completedTasks = visibleProjects.reduce(
    (acc, p) =>
      acc + (p.tasks?.filter(t => t.estado === "completado").length || 0),
    0
  );
  const progress =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Bienvenido {user.nombre} 👋</h1>
        <button
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Cerrar sesión
        </button>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-gray-500">Proyectos</h2>
          <p className="text-2xl font-bold">{visibleProjects.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-gray-500">Tareas</h2>
          <p className="text-2xl font-bold">{totalTasks}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-gray-500">Completadas</h2>
          <p className="text-2xl font-bold">{completedTasks}</p>
        </div>
      </div>

      {/* PROGRESO */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h2 className="mb-2 font-semibold">Progreso general</h2>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-green-500 h-4 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="mt-2 text-sm">{progress}% completado</p>
      </div>

      {/* LISTA DE PROYECTOS */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl mb-4 font-semibold">Proyectos</h2>

        {visibleProjects.length === 0 ? (
          <p>No tienes proyectos</p>
        ) : (
          visibleProjects.map((p) => (
            <div key={p.id} className="border p-3 mb-3 rounded-lg">
              <h3 className="font-bold">{p.nombre}</h3>
              <p className="text-sm text-gray-600">{p.descripcion}</p>
              <p className="text-xs mt-1">Tareas: {p.tasks?.length || 0}</p>

            
              <button
                onClick={() => router.push(`/proyectos/${p.id}/editar`)}
                className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Editar
              </button>

              {/*  */}
            </div>
          ))
        )}

        <button
          onClick={() => router.push("/proyectos")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Ir a Proyectos
        </button>
      </div>
    </div>
  );
}