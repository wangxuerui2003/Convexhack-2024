import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
  args: {},
  handler: async (ctx) => {
    // Grab the most recent messages.
    const tasks = await ctx.db.query('tasks').order('desc').take(100);
    // Reverse the list so that it's in a chronological order.
    return tasks.reverse();
  },
});

export const send = mutation({
  args: {
    location: v.object({
      latitude: v.number(),
      longitude: v.number(),
    }),
    address: v.string(),
  },
  handler: async (ctx, { location, address }) => {
    // Send a new message.
    await ctx.db.insert('tasks', { location, address });
  },
});
