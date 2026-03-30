const API_URL = "/api/proyectos";


export async function getProjects() {
  const res = await fetch(API_URL);
  if (!res.ok) {
    throw new Error("Error al obtener proyectos");
  }
  return res.json();
}


export async function createProject(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  let responseData = null;
  try {
    responseData = await res.json();
  } catch (err) {}

  if (!res.ok) {
    throw new Error(responseData?.error || `Error al crear proyecto (status ${res.status})`);
  }

  return responseData;
}

export async function updateProject(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  let responseData = null;
  try {
    responseData = await res.json();
  } catch (err) {}

  if (!res.ok) {
    throw new Error(responseData?.error || `Error al actualizar proyecto (status ${res.status})`);
  }

  return responseData;
}


export async function deleteProject(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

  let responseData = null;
  try {
    responseData = await res.json();
  } catch (err) {}

  if (!res.ok) {
    throw new Error(responseData?.error || `Error al eliminar proyecto (status ${res.status})`);
  }

  return responseData;
}