import { NextRequest } from "next/server";
import { searchLessons } from "@/lib/content";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  if (!query.trim()) {
    return Response.json({ results: [] });
  }

  const results = searchLessons(query).map((r) => ({
    trackId: r.track.id,
    trackTitle: r.track.title,
    moduleId: r.module.id,
    lessonId: r.lesson.id,
    lessonTitle: r.lesson.title,
    excerpt: r.excerpt,
  }));

  return Response.json({ results });
}
