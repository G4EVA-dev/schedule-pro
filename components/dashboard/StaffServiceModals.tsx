import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function CreateStaffModal({ open, onClose, onSubmit }: { open: boolean; onClose: () => void; onSubmit: (data: any) => void }) {
  const [form, setForm] = useState({ name: "", email: "", avatar: "" });
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Staff Member</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Input placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <Input placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          <Input placeholder="Avatar URL (optional)" value={form.avatar} onChange={e => setForm(f => ({ ...f, avatar: e.target.value }))} />
          <Button onClick={() => onSubmit(form)} className="w-full mt-2">Add Staff</Button>
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
