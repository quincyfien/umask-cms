"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function Shell({
  header,
  footer,
  children,
}: {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <div className="flex min-h-screen flex-col bg-ink text-paper selection:bg-brand selection:text-white antialiased">
      {!isAdmin && header}
      <main className="flex-1">{children}</main>
      {!isAdmin && footer}
    </div>
  );
}
