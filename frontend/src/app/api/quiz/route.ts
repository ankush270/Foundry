import { NextResponse } from "next/server";
import { getRandomStartup } from "@/lib/utils";
import { generateHints } from "@/services/quiz.service";

export async function GET() {
  const startup = getRandomStartup();
  return NextResponse.json({
    hints: generateHints(startup),
    answer: startup.name,
    slug: startup.slug,
  });
}
