"use client";

export default function LetterFlow({
  text,
  gradient = false,
  className = "",
  startDelay = 0,
  step = 28,
}: {
  text: string;
  gradient?: boolean;
  className?: string;
  startDelay?: number;
  step?: number;
}) {
  return (
    <span className={"lf-line " + className} aria-label={text}>
      {text.split("").map((ch, i) =>
        ch === " " ? (
          <span key={i} className="lf-letter-space" aria-hidden="true" />
        ) : (
          <span
            key={i}
            aria-hidden="true"
            className={"lf-letter" + (gradient ? " gradient-text" : "")}
            style={{ animationDelay: (startDelay + i * step) + "ms" }}
          >
            {ch}
          </span>
        )
      )}
    </span>
  );
}
