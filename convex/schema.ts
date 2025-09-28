import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Other tables here...

  users: defineTable({
    bio: v.string(),
    displayName: v.string(),
    email: v.string(),
    password: v.string(),
    username: v.string(),
  }),
});