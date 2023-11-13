import { useState } from "react";
import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type SortParams = {
  value: string;
  label: string;
  icon: LucideIcon;
};

type SortFilterProps = {
  sortParams: SortParams[];
  handleSortParams: (value: SortParams) => void;
  selectedSortParams: SortParams | null;
};

export function SortFilter({
  sortParams,
  handleSortParams,
  selectedSortParams,
}: SortFilterProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center space-x-4">
      <p className="text-sm text-muted-foreground">Sort By</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-[150px] justify-start"
          >
            {selectedSortParams ? (
              <>
                <selectedSortParams.icon className="mr-2 h-4 w-4 shrink-0" />
                {selectedSortParams.label}
              </>
            ) : (
              <>+ Set Parameter </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="right" align="start">
          <Command>
            <CommandInput placeholder="Change sorting parameter..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {sortParams.map((status) => (
                  <CommandItem
                    key={status.value}
                    value={status.value}
                    onSelect={() => {
                      handleSortParams(status);
                      setOpen(false);
                    }}
                  >
                    <status.icon
                      className={cn(
                        "mr-2 h-4 w-4",
                        status.value === selectedSortParams?.value
                          ? "opacity-100"
                          : "opacity-40"
                      )}
                    />
                    <span>{status.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
