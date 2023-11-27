export async function getAllTemplates(): Promise<
  { id: string; name: string }[]
> {
  const response = await fetch("http://localhost:3001/template/all");
  return await response.json().then((data) => data.templates);
}

export async function getRandomTemplate(): Promise<{
  id: string;
  name: string;
}> {
  const response = await fetch("http://localhost:3001/template/random");
  return await response.json();
}

export async function getUserTemplates(
  user: string,
  origin?: "upload" | "camera",
): Promise<{ id: string; name: string }[]> {
  const response = await fetch(
    `http://localhost:3001/users/all/${user}?origin=${origin}`,
  );
  return await response.json().then((data) => data.templates);
}

export async function uploadUserTemplate(
  user: string,
  file: File,
  origin: "upload" | "camera",
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const url = `http://localhost:3001/users/upload/${user}?origin=${origin}`;
  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });
  return await response.json();
}

export async function deleteUserTemplate(
  user: string,
  id: string,
): Promise<void> {
  await fetch(`http://localhost:3001/users/delete/${user}/${id}`, {
    method: "DELETE",
  });
}