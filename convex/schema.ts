import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    bio: v.string(),
    displayName: v.string(),
    email: v.string(),
    password: v.string(),
    tokenIdentifier: v.string(),
    username: v.string(),
  })
    .index("byEmail", ["email"])
    .index("byUsername", ["username"])
    .index("by_token", ["tokenIdentifier"]),

  posts: defineTable({
    userId: v.id("users"), // Reverted to required after migration
    storageId: v.id("_storage"),
    excerpt: v.optional(v.string()),
    createdAt: v.number(),
    tags: v.array(v.string()),
    title: v.string(),
  })
    .index("by_userId", ["userId"])
    ,

  bios: defineTable({
    userId: v.string(),
    content: v.string()
  }).index("byUserId", ["userId"]),

  Comment: defineTable({
    userId: v.id("users"),
    content: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    // For nested comments
    comments: v.optional(v.array(v.id("Comment"))),
    postId: v.id("posts"),
  }).index("byPostId", ["postId"]),

  Like: defineTable({
    userId: v.id("users"),
    postId: v.id("posts"),
  }).index("by_user_post", ["userId", "postId"]),

});