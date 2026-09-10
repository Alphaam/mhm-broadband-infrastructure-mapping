"use client";

import { ChevronDown } from "lucide-react";
import { useRef, useState } from "react";
import { MapCanvas, type MapCanvasHandle } from "./map-canvas";
import { LayerControlPanel } from "./layer-control-panel";
import { Legend } from "./legend";
import { CountySearch, type CountySearchHandle } from "./county-search";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { defaultActiveLayerIds, layersForSection } from "./layers.config";
import type { MapSection } from "@/lib/types";

export function MapSectionView({ section }: { section: MapSection }) {
  // Computed here (inside the client component) rather than passed as a
  // prop from the server page: tooltip.title/format are functions, and
  // functions can't cross the server->client boundary as props.
  const layers = layersForSection(section.id);
  const mapRef = useRef<MapCanvasHandle>(null);
  const countySearchRef = useRef<CountySearchHandle>(null);
  const [activeLayerIds, setActiveLayerIds] = useState(() =>
    defaultActiveLayerIds(section.id),
  );
  // Collapsed by default on mobile, where the panel would otherwise push the
  // map below the fold; irrelevant on desktop, which always shows it (the
  // aside below ignores this state at the md breakpoint and up).
  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <div className="shrink-0 border-b border-border px-4 py-3 sm:px-6 sm:py-4">
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {section.title}
        </h1>
        <p className="mt-0.5 max-w-3xl text-xs text-muted-foreground sm:text-sm">
          {section.dek}
        </p>
      </div>

      <button
        type="button"
        onClick={() => setPanelOpen((open) => !open)}
        aria-expanded={panelOpen}
        className="flex shrink-0 items-center justify-between gap-2 border-b border-border bg-sidebar px-4 py-2.5 text-sm font-medium text-foreground md:hidden"
      >
        Layers &amp; Legend
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${panelOpen ? "rotate-180" : ""}`}
        />
      </button>

      <div className="relative flex min-h-0 flex-1 flex-col md:flex-row">
        <aside
          className={`${panelOpen ? "flex" : "hidden"} max-h-[60vh] shrink-0 flex-col overflow-y-auto border-b border-border bg-sidebar md:flex md:h-full md:max-h-none md:w-[36rem] md:overflow-visible md:border-b-0 md:border-r`}
        >
          <div className="flex shrink-0 items-center justify-between gap-2 border-b border-sidebar-border px-4 py-3">
            <CountySearch
              ref={countySearchRef}
              onSelect={(county) => {
                mapRef.current?.flyToBounds(county.bbox);
                mapRef.current?.highlightCounty(county.name);
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              title="Return to the full service-area view and clear the county selection"
              onClick={() => {
                mapRef.current?.resetView();
                mapRef.current?.highlightCounty(null);
                countySearchRef.current?.clear();
              }}
            >
              Reset
            </Button>
          </div>

          <div className="flex min-h-0 flex-1 flex-col md:flex-row">
            <div className="flex min-h-0 flex-[3] flex-col border-b border-sidebar-border px-4 py-3 md:border-r md:border-b-0">
              <h3 className="mb-2 shrink-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Layers
              </h3>
              <ScrollArea className="min-h-0 flex-1">
                <div className="pr-4 pb-6">
                  <LayerControlPanel
                    layers={layers}
                    activeLayerIds={activeLayerIds}
                    onChange={setActiveLayerIds}
                  />
                </div>
              </ScrollArea>
            </div>

            <div className="flex min-h-0 flex-[2] flex-col px-4 py-3">
              <h3 className="mb-2 shrink-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Legend
              </h3>
              <ScrollArea className="min-h-0 flex-1">
                <div className="pr-4 pb-6">
                  <Legend layers={layers} activeLayerIds={activeLayerIds} />
                </div>
              </ScrollArea>
            </div>
          </div>
        </aside>

        <div className="relative min-h-0 flex-1">
          <MapCanvas ref={mapRef} layers={layers} activeLayerIds={activeLayerIds} />
        </div>
      </div>
    </div>
  );
}
