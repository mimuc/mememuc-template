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
