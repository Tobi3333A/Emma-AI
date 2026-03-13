import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getBlogPostBySlug } from "@/content/blogPosts";
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

export default function BlogPost() {
  const { slug } = useParams();
  const post = getBlogPostBySlug(slug || "");

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-3 max-w-md">
          <h1 className="font-display text-2xl font-bold text-foreground">Post not found</h1>
          <p className="text-muted-foreground">That article doesn’t exist (or hasn’t been published yet).</p>
          <Link to="/blog" className="text-primary font-semibold hover:underline">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />
      <MarketingNav />

      <header className="container pt-28 pb-2 max-w-3xl">
        <Link to="/blog" className="text-sm text-primary font-medium hover:underline">
          Back to Blog
        </Link>
      </header>

      <main className="container pb-24 max-w-3xl">
        <article className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3 gap-1">
            <time className="text-sm text-muted-foreground shrink-0" dateTime={post.date}>
              {formatDate(post.date)}
            </time>
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight">
              {post.title}
            </h1>
          </div>

          <div className="prose prose-invert prose-teal max-w-none mt-8 prose-p:leading-relaxed prose-headings:font-display prose-headings:font-bold">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.contentMd}</ReactMarkdown>
          </div>
        </article>

        <div className="mt-14 pt-6 border-t border-border">
          <p className="text-foreground font-medium text-sm">Want help improving AI visibility?</p>
          <p className="text-muted-foreground mt-0.5 text-sm">
            Run a monitoring query to see how models describe your products today.
          </p>
          <Link to="/signup" className="inline-block mt-3 text-sm font-semibold text-primary hover:underline">
            Get Started Free →
          </Link>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
