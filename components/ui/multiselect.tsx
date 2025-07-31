import * as React from "react";
import { Checkbox } from "./checkbox";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({ options, value, onChange, placeholder }) => {
  const toggle = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  return (
    <div className="border rounded-md p-2 bg-background">
      {options.length === 0 ? (
        <div className="text-xs text-muted-foreground">No options</div>
      ) : (
        <ul className="space-y-1">
          {options.map((opt) => (
            <li key={opt.value} className="flex items-center gap-2">
              <Checkbox checked={value.includes(opt.value)} onCheckedChange={() => toggle(opt.value)} />
              <span className="text-sm">{opt.label}</span>
            </li>
          ))}
        </ul>
      )}
      {placeholder && value.length === 0 && (
        <div className="text-xs text-muted-foreground mt-1">{placeholder}</div>
      )}
    </div>
  );
};
