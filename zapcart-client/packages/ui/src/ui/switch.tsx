import { cn } from "@repo/lib/utils";
import React from "react";

interface ToggleItemProps {
  id?: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export const Switch = ({
  id,
  label,
  checked,
  onCheckedChange,
  className,
}: ToggleItemProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 bg-gray-50 rounded-lg",
        className
      )}
    >
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-700 cursor-pointer select-none"
      >
        {label}
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ",
          checked ? "bg-primary" : "bg-gray-300"
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
};
