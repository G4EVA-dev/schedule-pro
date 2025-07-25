import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function getOrCreateUser(email: string, name: string) {
  try {
    // Check if user exists
    const existingUser = await convex.query(api.auth.getCurrentUser, { email });
    
    if (existingUser) {
      return existingUser;
    }
    
    // Create new user if they don't exist
    const userId = await convex.mutation(api.auth.createUser, {
      email,
      name,
      role: 'owner' // Default role
    });
    
    return { _id: userId, email, name, role: 'owner' };
  } catch (error) {
    console.error('Error in getOrCreateUser:', error);
    throw error;
  }
}

export async function getCurrentUser(email: string) {
  try {
    return await convex.query(api.auth.getCurrentUser, { email });
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}
