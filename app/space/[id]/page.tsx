// app/space/[id]/page.tsx
import { notFound } from "next/navigation";
import { SpaceService } from "@/services/space-service";
import SpaceDetailClient from "@/components/space/SpaceDetailClient";

export default async function SpacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // In Next.js 15, params is a Promise
  const resolvedParams = await params;
  const { id } = resolvedParams;

  // Fetch real data from the database
  const space = await SpaceService.getSpaceById(id);

  if (!space) {
    notFound(); // Triggers the Next.js 404 page if space doesn't exist
  }

  // space.host is included because of the Prisma 'include' we added in Step 1
  return <SpaceDetailClient space={space} host={space.host} />;
}
