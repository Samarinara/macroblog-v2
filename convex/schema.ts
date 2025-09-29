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

  posts: defineTable({
    authorId: v.string(),
    content: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    title: v.string(),
  }),

  Comment: defineTable({
    authorId: v.string(),
    content: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    comments: v.array(v.id("Comment")),
    postId: v.string(),
  }),

});