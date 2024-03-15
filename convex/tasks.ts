import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const listTask = query({
  args: {},
  handler: async (ctx) => {
    const tasks = await ctx.db.query('tasks').order('desc').take(100);

    return Promise.all(
      tasks.map(async (task) => ({
        ...task,
        imageUrl: (await ctx.storage.getUrl(task.imageStorageId)) as string,
      }))
    );
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const addTask = mutation({
  args: {
    location: v.object({
      latitude: v.number(),
      longitude: v.number(),
    }),
    address: v.string(),
    imageStorageId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('tasks', {
      location: args.location,
      address: args.address,
      imageStorageId: args.imageStorageId,
    });
  },
});

export const deleteTask = mutation({
  args: { id: v.id('tasks') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
