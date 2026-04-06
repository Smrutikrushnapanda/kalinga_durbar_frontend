import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef3f9_100%)] text-slate-900">
      {children}
    </div>
  );
}
