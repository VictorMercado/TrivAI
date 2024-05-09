import { notFound } from "next/navigation";

export default function SlugPage({ params }: { params: { slug: string } }) {
  return <>{notFound()}</>;
}
