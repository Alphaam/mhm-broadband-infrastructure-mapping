"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import type { FeatureCollection } from "geojson";
import { Check, ChevronsUpDown, MapPin } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { resolveDataUrl } from "@/lib/data";
import { countiesFromFeatureCollection, regionsFromFeatureCollection } from "@/lib/geo";
import {
  COUNTY_NAME_PROPERTY,
  REGION_NAME_PROPERTY,
  SERVICE_AREA_COUNTIES_PATH,
  SERVICE_AREA_REGIONS_PATH,
} from "@/lib/mapbox";
import type { County, Region } from "@/lib/types";

export type PlaceSelection =
  | { type: "county"; county: County }
  | { type: "region"; region: Region };

export type PlaceSearchHandle = {
  clear: () => void;
};

type PlaceSearchProps = {
  onSelect: (selection: PlaceSelection) => void;
};

type Status = "loading" | "ready" | "empty" | "error";

export const PlaceSearch = forwardRef<PlaceSearchHandle, PlaceSearchProps>(
  function PlaceSearch({ onSelect }, ref) {
    const [open, setOpen] = useState(false);
    const [counties, setCounties] = useState<County[]>([]);
    const [regions, setRegions] = useState<Region[]>([]);
    const [selected, setSelected] = useState<string | null>(null);
    // County load failing is fatal (there's nothing useful to show); region
    // load failing just means the "Regions" group renders empty — the two
    // boundary files ship independently, so one missing shouldn't block
    // the other's search/zoom.
    const [status, setStatus] = useState<Status>("loading");

    useImperativeHandle(ref, () => ({
      clear: () => setSelected(null),
    }));

    useEffect(() => {
      let cancelled = false;

      fetch(resolveDataUrl(SERVICE_AREA_COUNTIES_PATH))
        .then((res) => {
          if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
          return res.json() as Promise<FeatureCollection>;
        })
        .then((geojson) => {
          if (cancelled) return;
          const parsed = countiesFromFeatureCollection(geojson, COUNTY_NAME_PROPERTY);
          setCounties(parsed);
          setStatus(parsed.length > 0 ? "ready" : "empty");
        })
        .catch(() => {
          if (!cancelled) setStatus("error");
        });

      fetch(resolveDataUrl(SERVICE_AREA_REGIONS_PATH))
        .then((res) => {
          if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
          return res.json() as Promise<FeatureCollection>;
        })
        .then((geojson) => {
          if (cancelled) return;
          setRegions(regionsFromFeatureCollection(geojson, REGION_NAME_PROPERTY));
        })
        .catch(() => {
          // Swallowed: region boundaries are a bonus, not required.
        });

      return () => {
        cancelled = true;
      };
    }, []);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          role="combobox"
          aria-expanded={open}
          title="Search for a county or region to zoom the map to it and outline its boundary"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "min-w-0 flex-1 justify-between font-normal",
          )}
        >
          <span className="flex min-w-0 items-center gap-2 truncate">
            <MapPin className="size-4 shrink-0 text-muted-foreground" />
            <span className="truncate">{selected ?? "Zoom to county or region…"}</span>
          </span>
          <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
        </PopoverTrigger>
        <PopoverContent align="start" className="w-(--anchor-width) min-w-64 p-0">
          <Command>
            <CommandInput autoFocus placeholder="Search counties or regions…" />
            <CommandList>
              {status === "loading" && (
                <CommandEmpty>Loading boundaries…</CommandEmpty>
              )}
              {status === "error" && (
                <CommandEmpty>Couldn&apos;t load boundaries.</CommandEmpty>
              )}
              {status === "empty" && (
                <CommandEmpty>
                  No counties found. Add {SERVICE_AREA_COUNTIES_PATH} — see
                  docs/data-dictionary.md.
                </CommandEmpty>
              )}
              {status === "ready" && (
                <>
                  {regions.length > 0 && (
                  <CommandGroup heading="Regions">
                    {regions.map((region) => (
                      <CommandItem
                        key={`region-${region.name}`}
                        value={`Region ${region.name}`}
                        onSelect={() => {
                          setSelected(`Region ${region.name}`);
                          setOpen(false);
                          onSelect({ type: "region", region });
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 size-4",
                            selected === `Region ${region.name}`
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        Region {region.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  )}
                  <CommandGroup heading="Counties">
                    {counties.map((county) => (
                      <CommandItem
                        key={`county-${county.name}`}
                        value={county.name}
                        onSelect={() => {
                          setSelected(county.name);
                          setOpen(false);
                          onSelect({ type: "county", county });
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 size-4",
                            selected === county.name ? "opacity-100" : "opacity-0",
                          )}
                        />
                        {county.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);
