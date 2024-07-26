"use server";

import { message } from "@/server/db/schema";
import { writeMessage } from "@/server/queries";


type NewMessage = typeof message.$inferInsert;
export async function sendMsgHandler(msg:NewMessage) {
  await writeMessage(msg);

}
