"use client"

import React, { createContext, useContext } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";

const BusinessDataContext = createContext({ staff: [], services: [], clients: [] });

export const BusinessDataProvider = ({ children }: { children: React.ReactNode }) => {
  const { businessId } = useAuth();
  const staff = useQuery(api.staff.getStaff, businessId ? { businessId } : "skip");
  const services = useQuery(api.services.getServices, businessId ? { businessId } : "skip");
  const clients = useQuery(api.clients.getClients, businessId ? { businessId } : "skip");

  return (
    <BusinessDataContext.Provider value={{ staff: staff || [], services: services || [], clients: clients || [] }}>
      {children}
    </BusinessDataContext.Provider>
  );
};

export const useBusinessData = () => useContext(BusinessDataContext);
