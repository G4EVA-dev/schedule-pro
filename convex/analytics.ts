import { query } from "./_generated/server";
import { v } from "convex/values";

// Get business analytics overview
export const getBusinessAnalytics = query({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

    // Get all appointments for this business
    const appointments = await ctx.db
      .query("appointments")
      .withIndex("by_business", (q) => q.eq("businessId", args.businessId))
      .collect();

    // Filter appointments by time periods
    const recentAppointments = appointments.filter(
      (apt) => apt.startTime >= thirtyDaysAgo.getTime()
    );
    const sixMonthAppointments = appointments.filter(
      (apt) => apt.startTime >= sixMonthsAgo.getTime()
    );

    // Get services for pricing
    const services = await ctx.db
      .query("services")
      .withIndex("by_business", (q) => q.eq("businessId", args.businessId))
      .collect();

    const serviceMap = new Map(services.map(s => [s._id, s]));

    // Calculate total revenue (last 30 days)
    const totalRevenue = recentAppointments.reduce((sum, apt) => {
      if (apt.status === "completed" || apt.status === "confirmed") {
        const service = serviceMap.get(apt.serviceId);
        return sum + (service?.price || 0);
      }
      return sum;
    }, 0);

    // Calculate previous period for comparison
    const previousPeriodStart = new Date(thirtyDaysAgo.getTime() - 30 * 24 * 60 * 60 * 1000);
    const previousPeriodAppointments = appointments.filter(
      (apt) => apt.startTime >= previousPeriodStart.getTime() && apt.startTime < thirtyDaysAgo.getTime()
    );
    const previousRevenue = previousPeriodAppointments.reduce((sum, apt) => {
      if (apt.status === "completed" || apt.status === "confirmed") {
        const service = serviceMap.get(apt.serviceId);
        return sum + (service?.price || 0);
      }
      return sum;
    }, 0);

    // Calculate revenue change percentage
    const revenueChange = previousRevenue > 0 
      ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 
      : totalRevenue > 0 ? 100 : 0;

    // Calculate appointment metrics
    const totalAppointments = recentAppointments.length;
    const previousAppointments = previousPeriodAppointments.length;
    const appointmentChange = previousAppointments > 0 
      ? ((totalAppointments - previousAppointments) / previousAppointments) * 100 
      : totalAppointments > 0 ? 100 : 0;

    // Calculate average session duration
    const completedAppointments = recentAppointments.filter(apt => apt.status === "completed");
    const avgDuration = completedAppointments.length > 0 
      ? completedAppointments.reduce((sum, apt) => {
          return sum + (apt.endTime - apt.startTime);
        }, 0) / completedAppointments.length / (1000 * 60) // Convert to minutes
      : 0;

    // Calculate client retention (clients with multiple appointments)
    const clientAppointmentCounts = new Map();
    recentAppointments.forEach(apt => {
      const count = clientAppointmentCounts.get(apt.clientId) || 0;
      clientAppointmentCounts.set(apt.clientId, count + 1);
    });
    const returningClients = Array.from(clientAppointmentCounts.values()).filter(count => count > 1).length;
    const totalClients = clientAppointmentCounts.size;
    const clientRetention = totalClients > 0 ? (returningClients / totalClients) * 100 : 0;

    return {
      totalRevenue,
      revenueChange,
      totalAppointments,
      appointmentChange,
      avgDuration: Math.round(avgDuration),
      clientRetention: Math.round(clientRetention * 10) / 10, // Round to 1 decimal
    };
  },
});

// Get monthly revenue data for charts
export const getMonthlyRevenue = query({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const appointments = await ctx.db
      .query("appointments")
      .withIndex("by_business", (q) => q.eq("businessId", args.businessId))
      .filter((q) => q.gte(q.field("startTime"), sixMonthsAgo.getTime()))
      .collect();

    const services = await ctx.db
      .query("services")
      .withIndex("by_business", (q) => q.eq("businessId", args.businessId))
      .collect();

    const serviceMap = new Map(services.map(s => [s._id, s]));

    // Group by month
    const monthlyData = new Map();
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toISOString().slice(0, 7); // YYYY-MM
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      monthlyData.set(monthKey, {
        month: monthName,
        revenue: 0,
        appointments: 0,
      });
    }

    // Aggregate data
    appointments.forEach(apt => {
      if (apt.status === "completed" || apt.status === "confirmed") {
        const date = new Date(apt.startTime);
        const monthKey = date.toISOString().slice(0, 7);
        const data = monthlyData.get(monthKey);
        
        if (data) {
          const service = serviceMap.get(apt.serviceId);
          data.revenue += service?.price || 0;
          data.appointments += 1;
        }
      }
    });

    const result = Array.from(monthlyData.values());
    const maxRevenue = Math.max(...result.map(d => d.revenue));
    
    return result.map(data => ({
      ...data,
      percentage: maxRevenue > 0 ? Math.round((data.revenue / maxRevenue) * 100) : 0,
    }));
  },
});

// Get appointment types distribution
export const getAppointmentTypes = query({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const appointments = await ctx.db
      .query("appointments")
      .withIndex("by_business", (q) => q.eq("businessId", args.businessId))
      .filter((q) => q.gte(q.field("startTime"), thirtyDaysAgo.getTime()))
      .collect();

    const services = await ctx.db
      .query("services")
      .withIndex("by_business", (q) => q.eq("businessId", args.businessId))
      .collect();

    const serviceMap = new Map(services.map(s => [s._id, s]));

    // Count appointments by service
    const serviceCounts = new Map();
    let totalAppointments = 0;

    appointments.forEach(apt => {
      const service = serviceMap.get(apt.serviceId);
      const serviceName = service?.name || "Unknown Service";
      const count = serviceCounts.get(serviceName) || 0;
      serviceCounts.set(serviceName, count + 1);
      totalAppointments++;
    });

    // Convert to percentage and add colors
    const colors = [
      "bg-blue-500",
      "bg-green-500", 
      "bg-orange-500",
      "bg-purple-500",
      "bg-red-500",
      "bg-yellow-500",
      "bg-pink-500",
      "bg-indigo-500"
    ];

    const result = Array.from(serviceCounts.entries())
      .map(([name, count], index) => ({
        name,
        value: totalAppointments > 0 ? Math.round((count / totalAppointments) * 100) : 0,
        color: colors[index % colors.length],
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Top 8 services

    return result;
  },
});

// Get recent appointments for the dashboard
export const getRecentAppointments = query({
  args: { businessId: v.id("businesses"), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    
    const appointments = await ctx.db
      .query("appointments")
      .withIndex("by_business", (q) => q.eq("businessId", args.businessId))
      .order("desc")
      .take(limit);

    // Get related data
    const services = await ctx.db
      .query("services")
      .withIndex("by_business", (q) => q.eq("businessId", args.businessId))
      .collect();
    
    const clients = await ctx.db.query("clients").collect();
    const staff = await ctx.db.query("staff").collect();

    const serviceMap = new Map(services.map(s => [s._id, s]));
    const clientMap = new Map(clients.map(c => [c._id, c]));
    const staffMap = new Map(staff.map(s => [s._id, s]));

    return appointments.map(apt => {
      const service = serviceMap.get(apt.serviceId);
      const client = clientMap.get(apt.clientId);
      const staffMember = staffMap.get(apt.staffId);

      return {
        _id: apt._id,
        startTime: apt.startTime,
        endTime: apt.endTime,
        status: apt.status,
        serviceName: service?.name || "Unknown Service",
        clientName: client?.name || client?.email || "Unknown Client",
        staffName: staffMember?.name || "Unknown Staff",
        price: service?.price || 0,
      };
    });
  },
});
