import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Store a new user.
 *
 * Called from the client to ensure the user is stored in the database.
 */
export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    // Check if we've already stored this user.
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
    if (user !== null) {
      // If we've seen this user before, do nothing.
      return user._id;
    }

    // If it's a new user, create a new document.
    const name = identity.name!;
    return await ctx.db.insert("users", {
      displayName: name,
      email: identity.email!,
      username: identity.nickname!,
      bio: "",
      searchField: `${name} ${identity.nickname!}`,
      password: "", // It's best not to store passwords directly. Consider removing if not needed.
      tokenIdentifier: identity.tokenIdentifier,
    });
  },
});

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

export const getByEmails = query({
  args: { emails: v.array(v.string()) },
  handler: async (ctx, args) => {
    const users = await Promise.all(
      args.emails.map((email) =>
        ctx.db.query("users").withIndex("byEmail", (q) => q.eq("email", email)).unique()
      )
    );
    return users;
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

export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    return user;
  },
});

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    if (!args.query) {
      return [];
    }
    return await ctx.db
      .query("users")
      .withSearchIndex("by_username_or_displayname", (q) =>
        q.search("searchField", args.query)
      )
      .take(20); // Limit to 20 results
  },
});