// app/data/db.js

// Simulación de "base de datos" en memoria
let projects = [
  { id: "1", nombre: "Proyecto 1", descripcion: "Demo", userEmail: "user@example.com", tasks: [] },
];

// Leer todos los proyectos
export function readProjects() {
  return projects;
}

// Obtener un proyecto por ID
export function getProjectById(id) {
  return projects.find(p => p.id === id) || null;
}

// Crear un nuevo proyecto
export function createProjectInDB(project) {
  const newProject = {
    ...project,
    id: Date.now().toString(),
    tasks: [],
  };
  projects.push(newProject);
  return newProject;
}

// Actualizar proyecto
export function updateProjectInDB(id, updatedProject) {
  const index = projects.findIndex(p => p.id === id);
  if (index === -1) return null;
  projects[index] = { ...projects[index], ...updatedProject };
  return projects[index];
}

// Eliminar proyecto
export function deleteProjectInDB(id) {
  const projectExists = projects.some(p => p.id === id); // Verificar si existe
  if (!projectExists) {
    return false; // No se encontró
  }

  projects = projects.filter(p => p.id !== id); // Eliminar
  return true; // Eliminación exitosa
}