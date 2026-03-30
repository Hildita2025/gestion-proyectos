"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">
        Sistema de Gestión de Proyectos
      </h1>
      <p className="mb-6">Administra proyectos fácilmente</p>

      <div className="flex gap-4">
        <Link
          href="/login"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Login
        </Link>

        <Link
          href="/register"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Registro
        </Link>
      </div>
    </div>
  );
}