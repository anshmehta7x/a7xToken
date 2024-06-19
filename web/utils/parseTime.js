export default function parseTime(time) {
  const date = new Date(time * 1000);
  return date.toLocaleString();
}
