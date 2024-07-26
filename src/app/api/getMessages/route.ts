import { NextRequest, NextResponse } from "next/server";
import { getMessages } from "../../../server/queries";
import { message } from "@/server/db/schema";
type Message = typeof message.$inferInsert;

export async function GET(req: NextRequest) {
  try {
    const messages: Message[] = await getMessages();
    return NextResponse.json(messages);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 },
    );
  }
}
