import { query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
    .query("users")
    .withIndex("byEmail", (q) => q.eq("email", args.email))
    .collect();
  },
});

export const getUserByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
    .query("users")
    .withIndex("byUsername", (q) => q.eq("username", args.username))
    .collect();
  },
});