export type BlogPost = {
  slug: string;
  title: string;
  date: string; // ISO yyyy-mm-dd
  excerpt: string;
  contentMd: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "what-is-aeo",
    title: "What Is Answer Engine Optimization (AEO) and Why It Matters in 2026",
    date: "2026-02-16",
    excerpt:
      "AI assistants are replacing search engines for millions of queries. If your brand isn’t being cited in those answers, you’re already losing customers.",
    contentMd: `AEO (Answer Engine Optimization) is the practice of making your brand **retrievable and citable** inside AI-generated answers.

Unlike classic SEO, you’re not just competing for rank — you’re competing to be *included* in the answer.

## What answer engines actually do

Most systems follow a loop:

1. Interpret the prompt
2. Retrieve sources (web pages, docs, platforms, databases)
3. Synthesize a response
4. Cite or reference the sources that look trustworthy

## What AEO optimizes

- **Entity trust**: Are you corroborated across multiple sources?
- **Machine readability**: Can bots parse your content without JS/CSS?
- **Chunk quality**: Can your content be lifted and quoted?
- **Coverage**: Do you answer long-tail, 25-word prompts?

## The practical playbook

- Publish comparison pages and structured tables
- Expand help center / docs
- Add schema markup (and keep it accurate)
- Seed transparent, high-signal mentions off-site
`,
  },
  {
    slug: "aeo-playbook",
    title: "The AEO Playbook: How to Get Cited by AI Answer Engines in 2026",
    date: "2026-02-16",
    excerpt:
      "To get cited by AI answer engines, you can’t just optimize your website; you have to optimize your entire digital entity. Here’s the execution plan.",
    contentMd: `To get cited by answer engines, optimize **retrieval**, not just rankings. Models prefer corroborated facts, clean structure, and pages that answer a prompt in one pass.

## Step 1: Off-site corroboration (the “mention economy”)

AI models do not trust claims that only appear on your site. Build third‑party validation:

- Technical YouTube walkthroughs
- Transparent Reddit/Quora participation
- Templates and benchmarks others can reference

## Step 2: Semantic chunking

Make your content “liftable”:

- One paragraph = one claim
- Use lists and tables
- Clear H2/H3 headings

## Step 3: Help center expansion

AI prompts are longer than search queries. Treat docs as a growth channel and publish pages for:

- Feature edge cases
- Integrations
- “How do I…” questions from users

## Step 4: Machine readability

Bots often read raw HTML. Keep it clean: descriptive slugs, headings, and a BLUF summary near the top.
`,
  },
  {
    slug: "aeo-vs-seo",
    title: "AEO vs. SEO: What Is the Difference? (2026 Guide)",
    date: "2026-02-16",
    excerpt:
      "SEO ranks your website in a list of links. AEO gets your business cited inside the answer itself—where the click may never happen.",
    contentMd: `SEO optimizes for **ranked results**. AEO optimizes for **included answers**.

## SEO

- Goal: rank higher in search results
- Success metric: clicks, sessions, conversions

## AEO

- Goal: become the cited source inside AI responses
- Success metric: mentions, citations, share of voice across models

## What changes in practice

- More structure (tables, comparisons, BLUF summaries)
- More corroboration (mentions across the web)
- More long-tail coverage (docs/help center)
`,
  },
  {
    slug: "llms-txt-debate",
    title: "The llms.txt Debate: Does Your Website Need One in 2026?",
    date: "2026-02-16",
    excerpt:
      "llms.txt isn’t a ranking factor. It’s a documentation artifact. Here’s when it’s worth shipping and when it’s just bloat.",
    contentMd: `\`llms.txt\` is best thought of as a developer-friendly index of your most important machine-readable knowledge.

## You probably need it if…

- You have API docs
- You ship SDKs or complex integrations
- You want a single “canonical” place for your product facts

## You probably don’t if…

- You’re a local business with minimal structured content
- Your site has no docs/help center

## Better first steps

- Add schema markup
- Publish comparison pages with tables
- Expand help center coverage
`,
  },
  {
    slug: "semantic-chunking",
    title: "Semantic Chunking: The Fastest Way to Become ‘Quotable’ by AI",
    date: "2026-02-20",
    excerpt:
      "If your content can’t be extracted cleanly, it won’t be cited. Semantic chunking turns pages into high-signal blocks models can retrieve and reuse.",
    contentMd: `Semantic chunking means structuring content into **self-contained units** that answer one question or make one claim.

## Why it works

Retrieval systems rank chunks, not vibes. If a chunk contains a complete idea (with context), it gets pulled into the final answer more reliably.

## Rules of thumb

- One section = one intent
- One paragraph = one claim
- Prefer lists and tables over long prose
- Use explicit headings that match user questions

## Example headings that perform well

- “What is X?”
- “When should I use X?”
- “Common mistakes”
- “Step-by-step setup”
`,
  },
  {
    slug: "meet-the-creators",
    title: "How We Built EmmaAI: Data Science, Computer Science, Business Management & Accounting",
    date: "2026-02-23",
    excerpt:
      "We merged data science, computer science, business management, and accounting to build a product that’s technical, measurable, and grounded in real business outcomes.",
    contentMd: `EmmaAI was built by a cross-major team: **Samarah Smith**, **Jaya Meeks**, **La'Joir Coppock**, **Oluwatobiloba Adejumo**, and **Thea Nicholson**. We combined four disciplines to ship something that’s technical, measurable, and business-ready.

## Why four majors?

- **Data science** — pipelines, metrics, and how we measure “visibility” and “accuracy” across AI models.
- **Computer science** — the app, APIs, and the monitoring engine that queries multiple models and stores results.
- **Business management** — who this is for, how it fits into marketing and product strategy, and how teams actually use the data.
- **Accounting** — clarity on what’s being measured, how it’s reported, and how it ties to outcomes that matter to the business.

## What we shipped

A single place to see how ChatGPT, Grok, Claude, and Gemini describe your products — with brand mention tracking, sentiment, accuracy checks, and competitor mentions. No guesswork; just one dashboard and one playbook.

## The takeaway

You don’t need one skill set to build an AEO product. You need retrieval logic, clear metrics, and a clear picture of what the business needs. We merged our disciplines to do exactly that.
`,
  },
];

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
