// components/ui/combobox.tsx
"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateComponentId } from "@/lib/utils/misc";

// UI Imports
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type ComboboxOption = {
  value: string;
  label: string;
};

export interface ComboboxProps {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  notFoundMessage?: string;
  disabled?: boolean;
  onInputChange?: (search: string) => void;
  // --- NEW PROP ---
  renderNotFound?: React.ReactNode;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  notFoundMessage = "No results found.",
  disabled = false,
  onInputChange,
  // --- DESTRUCTURE NEW PROP ---
  renderNotFound,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  
  // --- YOUR SUGGESTION IMPLEMENTED ---
  // Create a stable, unique ID for this instance of the Combobox.
  const componentId = React.useMemo(() => generateComponentId(), []);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            onValueChange={onInputChange}
          />
          <CommandList>
            {/* --- NEW LOGIC FOR NOT FOUND --- */}
            <CommandEmpty>
              {renderNotFound ? renderNotFound : notFoundMessage}
            </CommandEmpty>
            <CommandGroup>
              {options.map((option, index) => (
                // --- YOUR KEY STRATEGY IMPLEMENTED ---
                <CommandItem
                  key={`${option.value}-${componentId}-${index}`}
                  value={option.value}
                  onSelect={(currentValue) => {
                    const matchingOption = options.find(opt => opt.value.toLowerCase() === currentValue.toLowerCase());
                    if (matchingOption) {
                      onChange(matchingOption.value);
                    }
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
