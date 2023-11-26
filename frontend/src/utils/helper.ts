export function transformRgba({
  r,
  g,
  b,
  a,
}: {
  r: number;
  g: number;
  b: number;
  a: number;
}) {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
