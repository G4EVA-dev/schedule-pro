"use node"; 

import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import * as bcrypt from "bcryptjs"; 

export const hashPassword = internalAction({
  args: {
    password: v.string(),
  },
  handler: async (_, args): Promise<string> => {
    // Hash with bcrypt
    return await bcrypt.hash(args.password, 12); // 12 rounds of salting
  },
});

export const verifyPassword = internalAction({
  args: {
    password: v.string(),
    hash: v.string(),
  },
  handler: async (_, args): Promise<boolean> => {
    return await bcrypt.compare(args.password, args.hash);
  },
});