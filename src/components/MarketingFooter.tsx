const creators = [
  "Samarah Smith",
  "Jaya Meeks",
  "La'Joir Coppock",
  "Oluwatobiloba Adejumo",
  "Thea Nicholson",
];

export default function MarketingFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="container py-10 space-y-6">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-6 h-6 rounded bg-gradient-teal flex items-center justify-center text-background text-xs font-bold font-mono">
              E
            </div>
            <span className="font-display font-semibold text-foreground">EmmaAI</span>
          </div>
          <span className="text-muted-foreground">
            — Built to help modern teams monitor how AI models describe their products, catch inaccuracies, and improve visibility where customers are actually searching.
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© 2026 EmmaAI. All rights reserved.</p>
          <p className="text-muted-foreground/80">Made with interdisciplinary teamwork.</p>
        </div>

        <p className="text-center text-sm text-muted-foreground pt-2 border-t border-border/60">
          {creators.join(" · ")}
        </p>
      </div>
    </footer>
  );
}
