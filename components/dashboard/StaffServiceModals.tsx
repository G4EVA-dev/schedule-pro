import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function CreateStaffModal({ open, onClose, onSubmit }: { open: boolean; onClose: () => void; onSubmit: (data: any) => void }) {
  const [form, setForm] = useState({ name: "", email: "" });
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Staff Member</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="staff-name" className="text-sm font-medium">Name</label>
            <Input 
              id="staff-name"
              placeholder="Enter staff member's name" 
              value={form.name} 
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="staff-email" className="text-sm font-medium">Email</label>
            <Input 
              id="staff-email"
              type="email"
              placeholder="Enter email address" 
              value={form.email} 
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))} 
            />
          </div>
          <Button 
            onClick={() => onSubmit(form)} 
            className="w-full" 
            disabled={!form.name.trim() || !form.email.trim()}
          >
            Add Staff Member
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function CreateServiceModal({ open, onClose, onSubmit }: { open: boolean; onClose: () => void; onSubmit: (data: any) => void }) {
  const [form, setForm] = useState({ name: "", description: "", duration: 30, price: 0, color: "" });
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Service</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Input placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <Input placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <label className="space-y-2" htmlFor="duration">Duration (minutes)</label>
          <Input placeholder="Duration (minutes)" type="number" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: Number(e.target.value) }))} />
          <label className="space-y-2" htmlFor="price">Price ($)</label>
          <Input placeholder="Price ($) " type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} />
          <Input placeholder="Color eg. red" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} />
          <Button onClick={() => onSubmit(form)} className="w-full mt-2">Add Service</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
