import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { MultiSelect } from "@/components/ui/multiselect";
import { Checkbox } from "../ui/checkbox";

interface StaffServiceCardProps {
  staff: any;
  services: any[];
  onUpdate: (serviceIds: string[]) => Promise<void>;
}

export const StaffServiceCard: React.FC<StaffServiceCardProps> = ({ staff, services, onUpdate }) => {
  const [selected, setSelected] = useState<string[]>(staff.services || []);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await onUpdate(selected);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (e) {
      setError("Failed to update assignments.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={staff.avatar || "/placeholder.svg?height=40&width=40"} />
          <AvatarFallback>{staff.name?.slice(0,2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-base">{staff.name}</CardTitle>
          <div className="text-xs text-muted-foreground">{staff.email}</div>
        </div>
      </CardHeader>
      <CardContent>
        <Label className="block mb-2">Services</Label>
        <MultiSelect
          options={services.map((s) => ({ value: s._id, label: s.name }))}
          value={selected}
          onChange={setSelected}
          placeholder="Assign services..."
        />
        <div className="flex items-center gap-2 mt-4">
          <Button size="sm" onClick={handleSave} disabled={saving || success}>
            {saving ? "Saving..." : success ? "Saved!" : "Save"}
          </Button>
          {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffServiceCard;
