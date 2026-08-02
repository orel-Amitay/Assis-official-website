import Link from "next/link";
import type { ReactNode } from "react";

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|_[^_]+_|\[([^\]]+)\]\(([^)]+)\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const token = m[0];
    if (token.startsWith("**")) {
      nodes.push(<strong key={key++}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("_")) {
      nodes.push(<em key={key++}>{token.slice(1, -1)}</em>);
    } else if (m[2] && m[3]) {
      const href = m[3];
      const label = m[2];
      if (href.startsWith("http") || href.startsWith("mailto:")) {
        nodes.push(
          <a
            key={key++}
            href={href}
            className="text-link underline underline-offset-2"
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noreferrer" : undefined}
          >
            {label}
          </a>,
        );
      } else {
        nodes.push(
          <Link key={key++} href={href} className="text-link underline underline-offset-2">
            {label}
          </Link>,
        );
      }
    }
    last = m.index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export default function RichText({ body }: { body: string }) {
  const blocks = body.split(/\n\n+/).filter(Boolean);

  return (
    <div className="space-y-5 text-[15px] leading-relaxed text-foreground/90">
      {blocks.map((block, i) => {
        const lines = block.split("\n").filter((l) => l.trim().length > 0);
        if (lines.every((l) => l.trim().startsWith("- "))) {
          return (
            <ul key={i} className="list-disc space-y-2 pl-5">
              {lines.map((l, j) => (
                <li key={j}>{renderInline(l.trim().slice(2))}</li>
              ))}
            </ul>
          );
        }

        const first = lines[0]?.trim() ?? "";
        if (first.startsWith("### ")) {
          return (
            <div key={i} className="space-y-2">
              <h3 className="font-display text-lg font-medium tracking-wide">
                {first.slice(4)}
              </h3>
              {lines.slice(1).map((l, j) => (
                <p key={j}>{renderInline(l)}</p>
              ))}
            </div>
          );
        }
        if (first.startsWith("## ")) {
          return (
            <div key={i} className="space-y-2 pt-2">
              <h2 className="font-display text-xl font-medium tracking-[0.12em]">
                {first.slice(3)}
              </h2>
              {lines.slice(1).map((l, j) => (
                <p key={j}>{renderInline(l)}</p>
              ))}
            </div>
          );
        }
        if (first.startsWith("# ")) {
          return (
            <div key={i} className="space-y-2">
              <h1 className="font-display text-2xl font-medium tracking-[0.14em]">
                {first.slice(2)}
              </h1>
              {lines.slice(1).map((l, j) => (
                <p key={j}>{renderInline(l)}</p>
              ))}
            </div>
          );
        }

        return (
          <div key={i} className="space-y-2">
            {lines.map((l, j) => (
              <p key={j}>{renderInline(l)}</p>
            ))}
          </div>
        );
      })}
    </div>
  );
}
