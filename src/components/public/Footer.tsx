import Link from "next/link";
import { getOrganization } from "@/lib/organization";

export default async function Footer() {
  const org = await getOrganization();
  return (
    <footer className="mt-16 border-t border-gray-200 bg-charcoal text-gray-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm md:grid-cols-3">
        <div>
          <p className="font-semibold text-white">{org.name}</p>
          <p className="mt-2 text-gray-400">{org.description}</p>
        </div>
        <div>
          <p className="font-semibold text-white">Contact</p>
          {org.address && <p className="mt-2 text-gray-400">{org.address}</p>}
          {org.email && <p className="text-gray-400">{org.email}</p>}
          {org.phone && <p className="text-gray-400">{org.phone}</p>}
        </div>
        <div>
          <p className="font-semibold text-white">Legal</p>
          <p className="mt-2">
            <Link href="/privacy" className="text-gray-400 hover:text-white">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
