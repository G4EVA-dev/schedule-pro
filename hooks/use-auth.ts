"use client";

import { signOut as nextAuthSignOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { User } from "@/types";

function mapConvexUser(convexUser: any): User | null {
  if (!convexUser) return null;
  
  return {
    id: convexUser._id,
    name: convexUser.name,
    email: convexUser.email,
    image: convexUser.avatarUrl,
    role: convexUser.role,
    businessId: convexUser.businessId,
    createdAt: convexUser.createdAt,
    updatedAt: convexUser.updatedAt || convexUser._creationTime,
  };
}

export function useAuth() {
  const { data: session, status } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const convexUser = useQuery(
    api.auth.getCurrentUser, 
    session?.user?.email ? { email: session.user.email } : 'skip'
  );

  useEffect(() => {
    if (status !== 'loading') {
      setIsAuthenticated(!!session?.user);
      setIsLoading(false);
    }
  }, [session, status]);

  const signOut = async () => {
    await nextAuthSignOut({ callbackUrl: '/auth/login' });
  };

  const user = mapConvexUser(convexUser);

  return {
    user,
    session,
    isAuthenticated,
    isLoading,
    role: user?.role || null,
    businessId: user?.businessId || null,
    signOut,
  };
}
