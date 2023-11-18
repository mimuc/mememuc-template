export async function getAllTemplates(): Promise<
  { id: string; name: string }[]
> {
  const response = await fetch("http://localhost:3001/template/all");
  return await response.json();
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
): Promise<{ id: string; name: string }[]> {
  const response = await fetch(`http://localhost:3001/users/all/${user}`);
  return await response.json().then((data) => data.templates);
}

export async function postUserTemplate(
  user: string,
  file: File,
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`http://localhost:3001/users/upload/${user}`, {
    method: "POST",
    body: formData,
  });
  return await response.json();
}
