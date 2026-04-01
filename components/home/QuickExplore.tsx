import Link from "next/link";

export function QuickExplore() {
  const tags = ["Milano", "Sale Podcast", "Uffici Privati", "Flex Desk"];

  return (
    <div className="mt-8 flex flex-wrap justify-center gap-3">
      <span className="text-sm text-muted-foreground/80 py-1">Esplora:</span>
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/search?q=${tag}`}
          className="text-sm font-bold text-accent hover:text-accent/80 transition-colors border-b-2 border-secondary/50 pb-0.5"
        >
          {tag}
        </Link>
      ))}
    </div>
  );
}
