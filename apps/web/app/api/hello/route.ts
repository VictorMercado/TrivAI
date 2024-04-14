export function GET() {
  return new Response(JSON.stringify({ message: 'Hello, world!' }));
}