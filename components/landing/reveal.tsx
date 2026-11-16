"use client";

import { useEffect, useRef } from "react";

import type { CSSProperties, ReactNode } from "react";

/**
 * Reveal — memunculkan anak-anaknya satu per satu saat masuk viewport
 * (IntersectionObserver, sekali per elemen). `reveal-child` di CSS awal
 * opacity 0; `is-visible` memicunya. Tanpa library animasi.
 *
 * Anak harus memakai kelas `reveal-child`; stagger diatur lewat
 * `--reveal-i` (index), jadi komponen ini tidak tahu isinya (SRP).
 * Reduced motion: CSS guard membuat semuanya langsung terlihat.
 */
export function Reveal({
  children,
  className,
  stagger = 80,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Browser tanpa IntersectionObserver: tampilkan langsung.
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className ?? ""}`}
      style={{ "--reveal-stagger": `${stagger}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
