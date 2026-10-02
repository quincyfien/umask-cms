import Link from "next/link";
import { getOrganization } from "@/lib/organization";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/programs", label: "Programs" },
  { href: "/projects", label: "Projects" },
  { href: "/events", label: "Events" },
  { href: "/news", label: "News" },
  { href: "/downloads", label: "Downloads" },
  { href: "/contact", label: "Contact" },
];

export default async function Header() {
  const org = await getOrganization();
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold text-brand">
          {org.name}
        </Link>
        <nav className="hidden flex-wrap gap-x-4 gap-y-1 text-sm md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-gray-600 hover:text-brand">
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
