import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createPost = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const postId = await ctx.db.insert("posts", {
      title: args.title,
      content: args.content,
      tags: args.tags,
      authorId: identity.subject,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      comments: [],
      likes: [],
    });
    console.log("Post created with ID:", postId);
    return postId;
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("posts").collect();
  },
});