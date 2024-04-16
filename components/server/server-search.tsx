"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Search } from "lucide-react";

interface ServerSearchProps {
  data: {
    label: string;
    type: "channel" | "member";
    data:
      | {
          icon: React.ReactNode;
          name: string;
          id: string;
        }[]
      | undefined;
  }[];
}

function ServerSearch({ data }: ServerSearchProps) {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const { serverId } = useParams();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((s) => !s);
      }
    };

    document.addEventListener("keydown", down);

    return () => {
      document.removeEventListener("keydown", down);
    };
  }, []);

  const onClick = (id: string, type: "channel" | "member") => {
    if (!serverId || !id || !type) {
      return;
    }

    setOpen(false);

    if (type === "member") {
      router.push(`/servers/${serverId}/conversations/${id}`);
      return router.refresh();
    }

    if (type === "channel") {
      router.push(`/servers/${serverId}/channels/${id}`);
      return router.refresh();
    }
  };

  return (
    <>
      <button
        className="group p-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition justify-between"
        onClick={() => setOpen(true)}
      >
        <div className="flex items-center gap-x-2">
          <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
          <p className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
            Search
          </p>
        </div>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search all channels and members" />
        <CommandList>
          <CommandEmpty>No results found</CommandEmpty>
          {data.map(({ label, type, data }) => {
            if (!data || data.length === 0) {
              return null;
            }

            return (
              <CommandGroup key={label} heading={label}>
                {data.map(({ id, icon, name }) => {
                  return (
                    <CommandItem
                      key={id}
                      onSelect={() => onClick(id, type)}
                      className="gap-x-2"
                    >
                      {icon}
                      <span>{name}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
}

export default ServerSearch;
