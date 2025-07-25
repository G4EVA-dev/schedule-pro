export interface User {
  id: string;
  name: string | null;
  email: string;
  image?: string | null;
  role: 'owner' | 'staff';
  businessId?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Business {
  id: string;
  name: string;
  ownerId: string;
  timezone: string;
  businessHours: {
    [key: string]: {
      open: boolean;
      startTime: string;
      endTime: string;
    };
  };
  settings: {
    timeSlotInterval: number;
    bufferTime: number;
    advanceNotice: number;
  };
  createdAt: number;
  updatedAt: number;
}

export interface Service {
  id: string;
  businessId: string;
  name: string;
  description?: string;
  duration: number; // in minutes
  price: number;
  staffIds: string[];
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Staff {
  id: string;
  businessId: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  services: string[];
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Client {
  id: string;
  businessId: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Appointment {
  id: string;
  businessId: string;
  clientId: string;
  serviceId: string;
  staffId: string;
  startTime: number;
  endTime: number;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'appointment' | 'system' | 'payment' | 'other';
  isRead: boolean;
  relatedId?: string;
  createdAt: number;
  readAt?: number;
}
