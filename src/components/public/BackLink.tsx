"use client";
import { useRouter } from "next/navigation";

export default function BackLink() {
  const router = useRouter();
  
  return (
    <button 
      onClick={() => router.back()} 
      className="mb-8 flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-brand transition-colors hover:text-brand-hover"
    >
      <span className="text-lg leading-none">←</span>
      <span>Return</span>
    </button>
  );
}
