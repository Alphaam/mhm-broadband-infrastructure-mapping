# Knowledge Transfer & Maintenance Agreement

**To:** Methodist Healthcare Ministries of South Texas, Inc. (MHM)
**From:** HR&A Advisors (the Team)
**Re:** Knowledge Transfer and Ongoing Maintenance for the Broadband Infrastructure Mapping Tool and the Regional Ecosystem Network Tool
**Date:** March 2026
**Status:** Draft for MHM review

---

## 1. Purpose

This memo documents the transition of two digital tools the Team built for MHM from active development into a stable, maintained state, and proposes an ongoing maintenance agreement to keep both tools accurate, secure, and available after handoff.

It has two objectives:

1. **Knowledge transfer** — to give MHM a clear, plain-language account of how each tool is built, where its data comes from, where it is hosted, and what it takes to keep it running, so that MHM is never dependent on any single individual to understand or operate the tools.
2. **Maintenance agreement** — to define a reasonable, predictable scope of ongoing support under a fixed annual retainer, and to set expectations for how maintenance work is requested, prioritized, and communicated.

This memo covers both tools together. Where a practice differs between the two, it is called out explicitly.

---

## 2. Tools in Scope

### 2.1 Broadband Infrastructure Mapping Tool

A public-facing web dashboard that visualizes broadband access, adoption, and related community conditions across MHM's service area through a set of interactive maps.

- **What it does.** Presents several map views (for example, infrastructure and service availability, adoption and affordability, and related community-need indicators) that a user can pan, zoom, and toggle between. Layers are configuration-driven, so the set of maps and the layers within them are defined in structured configuration rather than hard-coded one by one.
- **Where the data comes from.** The underlying data is derived from authoritative public sources — including the FCC (broadband availability), the U.S. Census Bureau American Community Survey (demographic and adoption indicators), Feeding America (community-need indicators), and the Texas Broadband Development Office. Source datasets are processed from their original formats (including shapefiles) into web-ready geographic formats (GeoJSON and vector tiles) before publication.
- **How the data is served.** Processed map data is published to cloud object storage (an Amazon S3 bucket) and read by the application at runtime through a configured base URL. The application itself does not regenerate this data on the fly; the data is prepared during a refresh process and then served as static, versioned files.
- **How it's built and hosted.** The tool is a Next.js application deployed on Vercel, using Mapbox for map rendering.

### 2.2 Regional Ecosystem Network Tool

A web tool that documents the network of organizations working across MHM's regions and the relationships between them.

- **What it does.** Provides region-level pages, a network graph that visualizes organizations and their documented relationships, organization search, and supporting Data and Methodology pages. The tool distinguishes between **documented connections** (relationships that have been verified and recorded) and **additional ecosystem partners** (organizations present in the ecosystem without a documented relationship).
- **Where the data comes from — and the open decision.** Today, the organization and relationship data is **manually curated** and maintained directly within the tool's data files; it is **not yet wired to an external source of record.** MHM is currently deciding between two future intake approaches: (a) an **Airtable form** that lets contributors submit organizations and relationships, or (b) an **Airtable database** that serves as the ongoing source of record the tool reads from. **This decision is still pending and is subject to change.** The work to implement whichever option MHM selects — and to migrate the current manually curated data into it — is addressed in the maintenance scope in Section 5.
- **How it's built and hosted.** Like the broadband tool, it is a Next.js application deployed on Vercel.

---

## 3. Knowledge Transfer

The goal of knowledge transfer is durability: MHM should be able to understand, operate, and direct changes to both tools regardless of staff turnover on either side.

### 3.1 What is being handed over

For each tool, the handoff package includes:

- **Source code**, in the project's version-controlled repository, including in-repo documentation (README and data dictionary) that describes structure and setup.
- **Data pipeline documentation** — for the broadband tool, the sources used, the processing steps that convert them to web-ready formats, and the publishing location; for the ecosystem tool, the structure of the manually curated data and how records are added or edited today.
- **Hosting and configuration details** — the deployment setup on Vercel, the object storage location for broadband data, environment configuration (including the data base URL and Mapbox access token), and any domain configuration.
- **An account and asset inventory** (see Section 4).

### 3.2 Transition activities

- A **walkthrough session** (or sessions) covering both tools: architecture, data refresh, deployment, and common operational tasks.
- A **recorded or written operating guide** so the walkthrough is not a single point of knowledge.
- A defined **support window** immediately following handoff, during which the Team remains readily available for questions as MHM staff take on day-to-day familiarity. Ongoing support beyond this window is governed by the maintenance agreement.

---

## 4. Accounts, Assets, and Ownership

Clear ownership of the underlying accounts and assets is essential to both continuity and maintenance. The relevant assets are:

- The **code repository** (GitHub)
- The **hosting project** (Vercel)
- The **object storage bucket** holding processed broadband data (Amazon S3)
- The **Mapbox account / access token** used for map rendering
- The future **Airtable base** (once the form-vs-database decision is made), for the ecosystem tool
- Any **custom domains**

> **Open item.** Final ownership and account structure has **not yet been decided.** Options range from MHM owning all accounts with the Team retaining maintenance access, to the Team continuing to host under the retainer with MHM holding viewer access. This will be confirmed during the transition period and documented in the final version of this memo. Whichever structure is chosen, the guiding principle is that **MHM retains ultimate ownership of and access to its data and code**, and is never locked out of its own tools.

---

## 5. Maintenance Scope (Annual Retainer)

The Team proposes a **combined annual maintenance retainer of $15,000 per year covering both tools.** The retainer is intended to keep the tools healthy, current, and available — not to fund new feature development, which is handled separately as described in Section 6.

The retainer is a **defined pool of recurring effort** focused on the activities that most affect whether these tools stay useful and trustworthy. It is deliberately scoped to the pivotal work rather than to exhaustive coverage.

### 5.1 What the retainer covers

**a. Platform and hosting upkeep.** Keeping the Vercel deployments, object storage, Mapbox integration, and domain configuration operational, including responding to platform changes or service disruptions that affect availability.

**b. Security and dependency maintenance.** Applying framework and dependency updates (for example, Next.js and supporting packages) and security patches on a routine basis, so the tools do not drift into an unsupported or vulnerable state. This is the single most important recurring effort for the long-term health of both tools.

**c. Data refresh — Broadband tool.** Supporting a periodic (typically annual) refresh of the broadband datasets as new source data is released (for example, updated FCC availability or ACS estimates), including re-running the processing pipeline and re-publishing the web-ready data. The retainer assumes the sources and their formats remain broadly consistent year to year; a source that fundamentally changes its structure is treated as a change request (Section 6).

**d. Data updates and source integration — Ecosystem tool.** Two related efforts:
- **Ongoing content updates** to the manually curated organization and relationship data, in reasonable increments, as MHM provides new or corrected information.
- **Implementing the selected Airtable approach.** Once MHM decides between the **Airtable form** and the **Airtable database**, the retainer covers standing up that intake path, migrating the current manually curated data into it, and connecting the tool to read from it. Because this decision is still pending and **subject to change**, the specific effort is confirmed once MHM selects a direction; a large divergence from a straightforward Airtable integration would be scoped as a change request.

**e. Corrective maintenance (bug fixes).** Diagnosing and fixing defects that affect the correct functioning of either tool — broken layers, rendering errors, search problems, broken links, and similar issues.

**f. Availability monitoring and incident response.** Basic monitoring so that outages are noticed, and response to incidents that take a tool down or materially degrade it, per the response targets in Section 7.

**g. Minor enhancements.** Small, low-effort adjustments (copy edits, styling tweaks, small configuration changes) that fit within the retainer's recurring capacity.

### 5.2 What the retainer does not cover

- New tools, new map sections, or substantial new features
- Redesigns or significant changes to how a tool looks or works
- Integrating new data sources beyond those described above
- Fundamental re-architecture driven by a major upstream data-source change
- Effort caused by third parties (for example, a source publisher discontinuing a dataset), beyond diagnosis and recommendation

Out-of-scope work is welcome; it is handled through the change-request process in Section 6.

---

## 6. Change Requests (Out-of-Scope Work)

When MHM wants work that falls outside the retainer, the Team will:

1. Confirm the request and clarify the objective.
2. Provide a brief **scope and estimate** (effort and cost) before starting.
3. Proceed only on MHM's written approval.

This keeps the retainer predictable and ensures MHM always sees cost before committing to larger work. Change requests can be billed separately or, where small, drawn against remaining retainer capacity by mutual agreement.

---

## 7. Communicating About Maintenance Work

Maintenance is only as good as the communication around it. The Team proposes the following, consistent with industry standard for retained digital-tool support.

### 7.1 Single intake channel

All maintenance requests, questions, and reported issues go through **one agreed intake channel** (for example, a shared email alias or a lightweight ticket tracker). This creates a single, reviewable record of what was asked, when, and how it was resolved — and avoids requests getting lost in individual inboxes.

### 7.2 Severity levels and response targets

Each request is triaged into a severity level with an associated response target. Targets are for **initial response and triage**, not guaranteed resolution, since resolution time depends on the nature of the issue.

| Severity | Description | Target initial response |
| --- | --- | --- |
| **1 — Critical** | A tool is down or unusable for the public | Within 1 business day |
| **2 — High** | A major feature is broken or data is materially wrong | Within 2 business days |
| **3 — Standard** | Minor bug, small update, or content change | Within 5 business days |
| **4 — Low / informational** | Questions, small tweaks, non-urgent requests | Within 10 business days |

### 7.3 Regular cadence

- **Quarterly check-in.** A short standing review of tool health, work completed, retainer capacity used, and anything upcoming (for example, a scheduled data refresh).
- **Annual planning review.** Once a year, the Team and MHM review the past year, confirm the coming year's data refreshes, and discuss any anticipated change requests. This is also the natural point to revisit the retainer scope and amount.
- **Change notifications.** MHM is notified before any change that affects what the public sees, and after any significant maintenance action (such as a major dependency upgrade or a data refresh going live).

### 7.4 Transparency

Each quarter the Team provides a brief written summary of maintenance activity — what was requested, what was done, and remaining capacity — so MHM always has a clear picture of the value delivered under the retainer.

---

## 8. Summary of Proposed Terms

| Item | Proposed terms |
| --- | --- |
| **Tools covered** | Broadband Infrastructure Mapping Tool and Regional Ecosystem Network Tool |
| **Annual retainer** | $15,000 per year, combined across both tools |
| **Term** | 12 months, renewable, reviewed annually |
| **Covered work** | Platform upkeep, security/dependency updates, broadband data refresh, ecosystem data updates and Airtable integration, bug fixes, monitoring/incident response, minor enhancements |
| **Not covered** | New tools/features, redesigns, new data sources, major re-architecture (handled via change requests) |
| **Intake** | Single agreed channel with severity-based response targets |
| **Cadence** | Quarterly check-ins, annual planning review |
| **Open items** | (1) Final account/asset ownership structure; (2) MHM's choice between the Airtable form and Airtable database for the ecosystem tool — both to be confirmed and folded into the final agreement |

---

## 9. Next Steps

1. MHM reviews this memo and provides feedback.
2. MHM and the Team confirm the two open items in Section 8 — account ownership and the Airtable direction.
3. The Team finalizes this memo as the governing knowledge-transfer and maintenance agreement, and schedules the transition walkthrough.

*This memo is a draft for discussion. The maintenance scope, the Airtable approach, and the account-ownership structure are subject to change and will be confirmed with MHM before the agreement is finalized.*
