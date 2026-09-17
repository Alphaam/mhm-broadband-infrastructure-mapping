export const metadata = {
  title: "Methodology & Data Sources: MHM Broadband Infrastructure Mapping",
};

function Source({ children }: { children: React.ReactNode }) {
  return <p className="mt-2 text-xs text-muted-foreground">{children}</p>;
}

export default function MethodologyPage() {
  return (
    <main className="h-full flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Methodology &amp; Data Sources
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
          How this dashboard is built
        </h1>
        <p className="mt-4 text-sm text-muted-foreground sm:text-base">
          HR&amp;A gathered broadband and demographic data on existing
          conditions, public funding and geographic data on current
          investments, and built a blended index to identify where gaps are
          likely to remain across Methodist Healthcare Ministries&apos;
          74-county South Texas service area. This page documents the
          sources and definitions behind each map.
        </p>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-foreground">
            Existing Conditions
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Availability, speed, technology, and consumer-choice metrics are
            all reported at the individual broadband-serviceable location
            (aggregated to the census block for mapping), based on the FCC
            Broadband Data Collection (BDC), the most current public dataset
            on internet availability in the United States.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              Highest Quality Technology Available
            </span>{" "}
            is ordered by reliability, preferencing wireline technologies
            (fiber, cable, and copper) ahead of fixed wireless and satellite.
            A location with both fiber and satellite available shows as
            fiber.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Demographic layers (median household income, fixed broadband
            subscription, communities of color) come from the American
            Community Survey (ACS) 5-Year Estimates. Food insecurity comes
            from Feeding America&apos;s Map the Meal Gap, 2024 (the most
            recent year available).
          </p>
          <Source>
            Sources: FCC Broadband Data Collection (December 2025 snapshot)
            · U.S. Census Bureau ACS 5-Year Estimates · Feeding America, Map
            the Meal Gap (2024)
          </Source>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-foreground">
            Current Investments
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Federal and state broadband funding awards active across the
            service area, drawn from FCC and Texas Broadband Development
            Office (BDO) award data. This covers 8 federal programs (BEAD,
            the Tribal Broadband Connectivity Program, the Enhanced
            Alternative Connect America Cost Model, Connect America Fund
            Phase II, the Rural Digital Opportunity Fund, USDA Rural
            Utilities Service&apos;s ReConnect and Telephone Loan programs,
            and the U.S. Treasury Capital Projects Fund&apos;s BOOT II) and
            3 Texas state programs (Texas Department of Agriculture
            Priority Hospitals and Network Improvements grants, and the
            Texas State Library and Archives Commission&apos;s library
            infrastructure grants).
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Per-project funding, provider, technology, and speed tier shown
            in the map tooltips are cross-referenced against HR&amp;A&apos;s
            internal funding tracker, since several programs&apos; own
            spatial data doesn&apos;t carry funding amounts at all (BEAD, most
            notably).
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            As with all public funding programs, federal broadband funding is often subject to review and revision. This map reflects the most up to date information available on federal investment in broadband infrastructure in September 2026, inclusive of the announcement by the National Telecommunications and Information Administration&rsquo;s (NTIA) location &ldquo;true-up&rdquo; program on September 3rd, 2026. Over time, programs or projects may default, and those programs or projects may be removed from the map. The map will be updated as new information becomes available.
          </p>
          <Source>
            Sources: FCC Broadband Funding Map · Texas Broadband Development
            Office (BDO) award data · HR&amp;A funding tracker
          </Source>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-foreground">
            Anticipated Gaps
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            To identify where gaps are likely to remain after currently
            committed investment concludes, HR&amp;A scores every census
            block in the service area on three measures, then combines them
            into a single priority ranking. The scoring script runs this logic at the block level, then rolls the
            results up to the tract and county maps.
          </p>
          <ol className="mt-3 flex flex-col gap-3 text-sm text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">
                1. Current Service Score.
              </span>{" "}
              A 0 to 100 score based on each block&apos;s best available
              terrestrial download and upload speeds today. Satellite
              isn&apos;t counted, since most state and federal broadband
              offices don&apos;t treat it as an equivalent substitute for
              wireline or fixed wireless buildout. NTIA&apos;s three tiers
              set the score bands: <em>unserved</em> (below 25/3 Mbps) scores
              0 to 40, <em>underserved</em> (25/3 up to 100/20 Mbps) scores
              40 to 100, and <em>served</em> (at least 100/20 Mbps) scores a
              flat 100. Within each band, the score rises smoothly rather
              than jumping straight to the next value, so two blocks in the
              same tier can still score differently depending on how close
              each one is to the next tier up.
            </li>
            <li>
              <span className="font-medium text-foreground">
                2. Post-Investment Service Score.
              </span>{" "}
              The same 0 to 100 scoring, applied to whichever is better for
              that block: its current speed, or the speed committed by
              funded federal and state programs (the 11 programs listed
              under <em>Current Investments</em> above) once built. It
              assumes every committed program is completed and delivers its
              full promised speed.
            </li>
            <li>
              <span className="font-medium text-foreground">
                3. Socioeconomic Need Score.
              </span>{" "}
              Each block takes on its census tract&apos;s median household
              income, converted to a 0 to 100 percentile rank and inverted
              so the lowest-income tracts score highest. This accounts for
              adoption barriers, like cost and device access, that persist
              even once infrastructure is in place.
            </li>
          </ol>
          <p className="mt-4 text-sm text-muted-foreground">
            The Post-Investment Service Score converts directly into a{" "}
            <span className="font-medium text-foreground">Priority Score</span>:
            100 minus the Post-Investment Score, multiplied by a{" "}
            <em>need multiplier</em> that runs from 0.5x in the
            highest-income tracts up to 1.5x in the lowest-income ones. The
            same size infrastructure gap can count for up to three times as
            much in a low-income tract as in a high-income one.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Blocks are then sorted into five tiers: <em>Resolved / Low</em>,{" "}
            <em>Watch</em>, <em>Medium</em>, <em>High</em>, and{" "}
            <em>Critical</em>, targeting roughly an 80/10/6/3/1% split. The
            split is measured in{" "}
            <span className="font-medium text-foreground">
              serviceable locations
            </span>{" "}
            (individual homes and businesses), not blocks, and tiers are
            assigned by each location&apos;s position in the ranked
            distribution of Priority Scores rather than by fixed score
            cutoffs.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            The county map uses the same method, but ranks counties against
            each other rather than rolling up their blocks&apos; tiers. Each
            county&apos;s tier reflects its location-weighted average
            Priority Score relative to the other 73 counties, not the share
            of its own locations that are individually Critical. That
            breakdown is available separately, county by county.
          </p>
          <Source>
            Source: HR&amp;A analysis blending FCC, ACS, Feeding America, and
            Texas BDO data
          </Source>
        </section>

        <section className="mt-10 border-t border-border pt-8">
          <h2 className="text-lg font-semibold text-foreground">
            A note on gaps in the data
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Areas shown in light grey on any map mean the underlying dataset
            has no value there for that specific metric, typically no
            residential population (for FCC location-level data) or a
            program or grant that didn&apos;t reach that county. It
            doesn&apos;t mean the value is zero.
          </p>
        </section>
      </div>
    </main>
  );
}
