import { Infer, v } from "convex/values";
import { MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

export const attachmentSchema = v.array(
  v.object({
    format: v.string(),
    fileId: v.string(),
    url: v.string(),
    blur: v.string(),
    name: v.string(),
  }),
);

export type AttachmentSchema = Infer<typeof attachmentSchema>;
/**
 * helper send attachment
 */

export async function createAttachment({
  ctx,
  values,
  messageId,
}: {
  ctx: MutationCtx;
  values: AttachmentSchema;
  messageId: Id<"message">;
}) {
  for (const value of values) {
    await ctx.db.insert("attachment", {
      ...value,
      messageId,
    });
  }
}
