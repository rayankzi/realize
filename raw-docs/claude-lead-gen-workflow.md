# Finding Clients with Claude: Lead Generation Workflow

**Topic/Category:** AI-Powered Business / Lead Generation
**Primary Goal of the Post:** To teach a multi-step automated workflow for finding and qualifying high-value leads using Claude AI, custom skills, and third-party integrations.

---

## Executive Summary

This carousel outlines a sophisticated lead generation system that leverages Claude's extensibility through connectors (Apify, Apollo.io) and custom skills. The process moves from initial broad scraping of target companies to deep qualification based on customer pain points and ICP (Ideal Customer Profile) alignment, finally concluding with lead enrichment and verification.

## Key Insights & Main Ideas

- **AI-Driven Scraping:** Use Claude with an Apify connector to perform targeted searches for companies based on specific filters (e.g., role, location, employee count, ARR).
- **Automated Research & Pain Point Identification:** Utilize specialized Claude skills (like `viral-news-finder`) to identify what customers are complaining about regarding potential leads, providing a "hook" for outreach.
- **Deep ICP Qualification:** Employ an `icp-qualifier` skill to filter leads against precise criteria (demographics, new hires, etc.).
- **Integrated Enrichment:** Seamlessly find contact information (LinkedIn, Email) using an Apollo.io connector within the Claude interface.
- **Double Verification:** Use external tools like Icypeas to ensure lead data quality and deliverability.

## Detailed Breakdown / Step-by-Step

**Slide 1:** Introduction to the workflow: "How I use Claude to find clients for me."
**Slide 2:** Enabling the **Apify connector** in Claude to scrape company data.
**Slide 3:** Executing the initial search with a specific prompt: "use apify connector and find people looking for GTM specialists in united states give me 50 companies must be over 50 employees and over $10M in ARR".
**Slide 4:** Reviewing the output: a clean table of 50 qualified companies with key financial and organizational data.
**Slide 5:** Using the **`viral-news-finder`** skill to research recent news and customer complaints for the target companies.
**Slide 6:** Using the **`icp-qualifier`** skill to filter the list based on specific ICP markers like age, gender, and new hires.
**Slide 7:** Using the **Apollo.io connector** directly in Claude to find contact details for the leads.
**Slide 8:** Exporting and uploading the list to **Icypeas** for double enrichment and email verification.
**Slide 9:** Call to action: Creator asks if followers want a detailed video tutorial.

## Notable Visual Context

The visuals show Suprava Sabat's Claude interface, demonstrating the "Sonnet 4.6" model (likely a customized or future-dated UI for the sake of the post) with a "Connectors" and "Skills" sidebar. The presence of arrows and highlighting on specific UI elements (like the Apify/Apollo toggles) makes the technical steps easy to follow.

## Verbatim Templates & Scripts

### Initial Lead Scraping Prompt
> use apify connector and find people looking for GTM specialists in united states give me 50 companies must be over 50 employees and over $10M in ARR

### Custom Skills Mentioned
- `viral-news-finder`
- `icp-qualifier`

## Call to Action / Conclusion

The post ends by prompting the audience to comment if they want a full video breakdown of this workflow. The primary value proposition is turning Claude into a "super employee" that handles the entire sales pipeline from research to verified contact list.
