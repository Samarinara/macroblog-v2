import { mutation, query, action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
// Create a new post
export const createPost = mutation({
  args: {
    title: v.string(),
    storageId: v.id("_storage"),
    tags: v.array(v.string()),
    excerpt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();
    if (!user) {
      throw new Error("User not found.");
    }
    await ctx.db.insert("posts", {
      title: args.title,
      storageId: args.storageId,
      tags: args.tags,
      excerpt: args.excerpt,
      userId: user._id,
      createdAt: Date.now(),
    });
  },
});

// Get a single post by its ID (without content)
export const getById = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.postId);
  },
});

// New action to get a post and its content from file storage
export const getPostWithContent = action({
  args: { postId: v.id("posts") },
  handler: async (
    ctx,
    args,
  ): Promise<(Doc<"posts"> & { content: string }) | null> => {
    // First, run the query to get the post document
    const post: Doc<"posts"> | null = await ctx.runQuery(api.posts.getById, { postId: args.postId });
    if (!post) {
      return null;
    }
    // Then, get the file content from storage. This is only allowed in actions.
    const content: Blob | null = await ctx.storage.get(post.storageId);
    if (content === null) {
      return { ...post, content: "File content not found." };
    }
    const textContent = await content.text();
    return { ...post, content: textContent };
  },
});

// Get all posts for a specific user (without content)
export const getUsersPosts = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});