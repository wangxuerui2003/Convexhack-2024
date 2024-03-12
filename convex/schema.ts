import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  tasks: defineTable({
    location: v.object({
      latitude: v.number(),
      longitude: v.number(),
    }),
    address: v.string(),
  }),
});
