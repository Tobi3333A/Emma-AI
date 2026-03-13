import { blogPosts } from "@/content/blogPosts";
import { Link } from "react-router-dom";
import MarketingFooter from "@/components/MarketingFooter";
import MarketingNav from "@/components/MarketingNav";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function BlogIndex() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />
      <MarketingNav />

      <header className="container pt-28 pb-10 max-w-3xl">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">
          The Blog
        </h1>
        <p className="text-muted-foreground mt-2">
          Insights on AEO, AI search, and structured data.
        </p>
      </header>

      <main className="container pb-24 max-w-5xl">
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group flex flex-col rounded-xl border border-border bg-card/50 p-6 hover:border-primary/30 transition-colors"
            >
              <time className="text-sm text-muted-foreground shrink-0" dateTime={post.date}>
                {formatDate(post.date)}
              </time>
              <h2 className="font-display text-lg md:text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-snug mt-2">
                {post.title}
              </h2>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed line-clamp-3 flex-1">
                {post.excerpt}
              </p>
              <span className="inline-block mt-4 text-sm font-medium text-primary group-hover:underline">
                Read More →
              </span>
            </Link>
          ))}
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
