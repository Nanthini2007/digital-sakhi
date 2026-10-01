import { NextRequest } from "next/server";
import { POST as processSakhiPost } from "@/app/api/sakhi/route";

export async function POST(req: NextRequest) {
  return processSakhiPost(req);
}
