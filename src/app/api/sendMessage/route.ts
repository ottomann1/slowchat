import { NextRequest, NextResponse } from "next/server";
import { writeMessage } from "../../../server/queries";
import { message } from "@/server/db/schema";

type Message = typeof message.$inferInsert;

export async function POST(req: NextRequest) {
  try {
    const newmsg: Omit<Message, "id"> = await req.json();
    const sentMessage: Message[] = await writeMessage(newmsg);
    return NextResponse.json(sentMessage, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
