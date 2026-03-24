# 6 Security Prompts to Harden Your Vibecoded Projects

**Topic/Category:** Tech / Application Security / Vibe Coding
**Primary Goal of the Post:** To provide 6 copy-paste prompts that developers can feed to their AI code editor to audit and fix the most common security vulnerabilities in vibecoded applications.

---

## Executive Summary

This carousel targets the growing community of "vibe coders" — people building apps with AI assistance — and addresses a critical blind spot: security. The creator, a 24-year-old tech founder, shares six specific prompts that can be pasted into an AI code editor (like Cursor or Claude) to act as a senior security engineer reviewing your project. Each prompt targets a different attack surface: authentication, authorization, deployment, abuse prevention, secret management, and input validation. The thesis is that running all six before launch eliminates the majority of real-world vulnerabilities.

## Key Insights & Main Ideas

- **Vibecoded projects are more hackable than most builders realize** — AI-generated code often skips security best practices unless explicitly prompted.
- **Six targeted prompts cover the most critical security domains:** authentication, data access control, deployment hardening, abuse/bot prevention, secrets management, and input sanitization.
- **Each prompt is designed to be copy-pasted directly into an AI code editor**, making the security audit process accessible to non-security-experts.
- **Advanced teams go further** with automated vulnerability scanning, penetration testing, and dependency monitoring — but the six prompts handle the baseline.

## Detailed Breakdown / Step-by-Step

**Slide 1 — Cover:** "How to improve the security of your vibecoded projects" — introduces the creator as a 24-year-old tech founder.

**Slide 2 — Secure Authentication:** Focuses on how your app verifies who a user is. The prompt reviews the authentication system to ensure passwords are hashed, sessions expire, email verification is enabled, reset tokens expire, login attempts are rate limited, and secrets are never exposed to the frontend. This prevents account takeovers.

**Slide 3 — Prevent Users from Accessing Other Users' Data:** Addresses authorization and insecure direct object reference (IDOR) vulnerabilities. The prompt reviews all API endpoints and database queries to enforce ownership checks before any read, modify, or delete operation.

**Slide 4 — Secure Deployment & Monitoring:** Covers infrastructure-level security. The prompt configures HTTPS enforcement, secure secret storage, restricted database access, and logging for auth attempts, API errors, and unusual traffic patterns.

**Slide 5 — Prevent Abuse & Bot Attacks:** Focuses on rate limiting for login attempts, API endpoints, account creation, and AI generation requests. Prevents bots from brute-forcing passwords, scraping data, or running up costs.

**Slide 6 — Protect Secrets and API Keys:** The prompt scans the entire project for hardcoded secrets and credentials, ensuring API keys, database service keys, and tokens are never in frontend code or committed to the repo. Everything moves to environment variables, server-side only.

**Slide 7 — Validate and Sanitize User Input:** Identifies every user input entry point (forms, APIs, uploads, query parameters) and adds strict validation to prevent SQL injection, command injection, script injection, and unsafe file uploads.

**Slide 8 — Conclusion:** Reinforces that running all 6 prompts before launching eliminates the majority of real-world vulnerabilities. Bonus tips for advanced teams: (1) automated vulnerability scanning, (2) penetration testing, (3) dependency monitoring. CTA to follow @genzbestie.

## Notable Visual Context

Each slide uses a consistent dark-themed design with handwritten-style white text for headings, a quoted prompt block in a lighter card, and hand-drawn annotations with cute doodle icons (lock, magnifying glass, robot, syringe, key). The casual, approachable aesthetic lowers the intimidation factor of security topics. The background photos appear to be candlelit event/dinner settings, giving the carousel a personal, lifestyle-meets-tech feel. The cover and closing slides feature selfies of the creator, reinforcing personal brand.

## Verbatim Templates & Scripts

**Prompt 1 — Secure Authentication:**
> Act as a senior security engineer. Review the authentication system of this project and make it secure. Ensure passwords are securely hashed, sessions expire, email verification is enabled, password reset tokens expire, login attempts are rate limited, and authentication secrets are never exposed to the frontend. Refactor any insecure authentication logic.

**Prompt 2 — Prevent Unauthorized Data Access (IDOR):**
> Review all API endpoints and database queries. Ensure every request verifies the logged-in user owns the data being accessed. Prevent insecure direct object reference (IDOR) vulnerabilities by enforcing ownership checks before reading, modifying, or deleting any resource.

**Prompt 3 — Secure Deployment & Monitoring:**
> Configure the application for secure deployment. Enforce HTTPS, ensure secrets are stored securely, restrict direct database access from the public internet, and add logging for authentication attempts, API errors, and unusual traffic patterns so suspicious behavior can be detected.

**Prompt 4 — Prevent Abuse & Bot Attacks:**
> Add abuse protection to the application. Implement rate limiting for login attempts, API endpoints, account creation, and AI generation requests. Prevent bots or automated scripts from repeatedly calling endpoints or scraping data.

**Prompt 5 — Protect Secrets and API Keys:**
> Scan the entire project for secrets and credentials. Ensure API keys, database service keys, and tokens are never exposed in frontend code or committed to the repository. Move all secrets to secure environment variables and ensure they are only used on the server.

**Prompt 6 — Validate and Sanitize User Input:**
> Identify every place where user input enters the system including forms, APIs, uploads, and query parameters. Add strict validation and sanitization to prevent SQL injection, command injection, script injection, and unsafe file uploads. Reject invalid data and enforce strict input types.

## Call to Action / Conclusion

The creator encourages viewers to run all 6 prompts before launching their vibecoded app to eliminate the majority of real-world vulnerabilities. For those wanting to go further, advanced teams also add: (1) automated vulnerability scanning, (2) penetration testing, and (3) dependency monitoring. The caption invites users to comment "security" to receive a document with all prompts for easy copy-paste. Follow @genzbestie for more content.
