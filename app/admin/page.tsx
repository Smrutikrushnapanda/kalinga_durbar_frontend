"use client";

import { useState } from "react";
import DataTable, { Registration } from "../(admin)/components/DataTable";

type IconProps = { className?: string };

function HomeIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V20h13V9.5" />
    </svg>
  );
}

function UsersIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
      <path d="M14 18.5c.4-1.9 1.8-3.3 4-3.5 1.6-.2 2.5.4 2.5 1.8" />
    </svg>
  );
}

function PaymentIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M3 10h18" />
      <path d="M7 15h4" />
    </svg>
  );
}

function TicketIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4Z" />
      <path d="M12 7.5v9" strokeDasharray="2.5 2.5" />
    </svg>
  );
}

function ReportIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M5 4h10l4 4v12H5z" />
      <path d="M15 4v4h4" />
      <path d="M8 14h8M8 10h5M8 18h8" />
    </svg>
  );
}

function SettingsIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a2 2 0 1 1-4 0v-.2a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a2 2 0 1 1 0-4h.2a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1 1 0 0 0 1.1.2h.1a1 1 0 0 0 .6-.9V4a2 2 0 1 1 4 0v.2a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1 1 0 0 0-.2 1.1v.1a1 1 0 0 0 .9.6H20a2 2 0 1 1 0 4h-.2a1 1 0 0 0-.9.6Z" />
    </svg>
  );
}

const stats = [
  { label: "Total Guests", value: "1,245", delta: "+12.5%" },
  { label: "Checked In", value: "932", delta: "+8.1%" },
  { label: "Pending Payments", value: "184", delta: "-3.2%" },
  { label: "Revenue", value: "₹8,42,500", delta: "+17.4%" },
];

const paymentMethods = [
  { title: "UPI", subtitle: "Google Pay, PhonePe, Paytm, BHIM", fee: "0.5% gateway fee", status: "Fastest" },
  { title: "Card", subtitle: "Credit / Debit / Corporate Cards", fee: "2% gateway fee", status: "Secure" },
  { title: "Net Banking", subtitle: "All major Indian banks", fee: "1.2% gateway fee", status: "Trusted" },
  { title: "Wallets", subtitle: "Paytm, Amazon Pay, Mobikwik", fee: "1.8% gateway fee", status: "Popular" },
];

const menuItems = [
  { label: "Dashboard", Icon: HomeIcon },
  { label: "Guest Management", Icon: UsersIcon },
  { label: "Payments", Icon: PaymentIcon },
  { label: "Passes", Icon: TicketIcon },
  { label: "Reports", Icon: ReportIcon },
  { label: "Settings", Icon: SettingsIcon },
];

export default function AdminPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0]);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

  const handleSwitchMethod = () => {
    const currentIndex = paymentMethods.findIndex((method) => method.title === selectedPayment.title);
    const nextIndex = (currentIndex + 1) % paymentMethods.length;
    setSelectedPayment(paymentMethods[nextIndex]);
  };

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <p className="mt-8 text-center text-5xl font-black tracking-tight text-slate-200/60 sm:text-7xl">Kalinga Durbar</p>
      </div>

      <div className="relative mx-auto flex min-h-screen w-full items-stretch overflow-hidden border border-slate-200/80 bg-white/95 shadow-[0_28px_65px_rgba(15,23,42,0.09)]">
        <div
          onClick={() => setIsSidebarOpen(false)}
          className={`fixed inset-0 z-30 bg-slate-900/35 transition lg:hidden ${isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        />

        <aside
          className={`fixed left-0 top-0 z-40 h-full border-r border-slate-200 bg-slate-50/95 p-4 transition-transform duration-300 lg:fixed lg:top-0 lg:left-0 lg:z-auto lg:h-screen lg:overflow-y-auto lg:rounded-l-3xl lg:p-5 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          } ${isSidebarOpen ? "w-[260px]" : "lg:w-[86px]"}`}
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-orange-500 text-base font-bold text-white">KD</div>
            <div className={`${isSidebarOpen ? "block" : "hidden"}`}>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Admin Panel</p>
              <p className="text-base font-bold">Kalinga Durbar</p>
            </div>
          </div>

          <nav className="space-y-2 text-sm">
            {menuItems.map(({ label, Icon }, idx) => (
              <button
                key={label}
                className={`flex w-full items-center rounded-xl px-3 py-2.5 text-left transition ${
                  idx === 0 ? "bg-orange-500 text-white shadow-md" : "text-slate-600 hover:bg-white hover:text-slate-900"
                }`}
                title={label}
              >
                <span className={`${isSidebarOpen ? "mr-3" : "mx-auto"}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className={`${isSidebarOpen ? "block" : "hidden"}`}>{label}</span>
              </button>
            ))}
          </nav>

          {isSidebarOpen ? (
            <div className="mt-8 rounded-2xl border border-orange-100 bg-orange-50 p-4">
              <p className="text-sm font-semibold text-slate-800">Quick Collect</p>
              <p className="mt-1 text-xs text-slate-600">Generate payment link and share instantly with guests.</p>
              <button className="mt-3 w-full rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white">Create Payment Link</button>
            </div>
          ) : null}
        </aside>

        <main
          className={`min-w-0 flex-1 p-4 transition-[margin] duration-300 sm:p-6 lg:p-7 ${
            isSidebarOpen ? "lg:ml-[260px]" : "lg:ml-[86px]"
          }`}
        >
          <header className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen((prev) => !prev)}
                className="grid h-10 w-10 place-items-center rounded-lg border border-slate-300 bg-white text-slate-700"
                aria-label="Toggle sidebar"
              >
                ☰
              </button>
              <div>
                <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">Good morning, Admin</h1>
                <p className="text-sm text-slate-500">Welcome back. Here is today&apos;s event dashboard.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700">Export Report</button>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsAdminMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-900 text-xs font-bold text-white">AD</span>
                  <span className="hidden text-left leading-tight sm:block">
                    <span className="block text-xs font-semibold text-slate-900">Admin User</span>
                    <span className="block text-[11px] text-slate-500">Super Admin</span>
                  </span>
                  <span className="text-slate-500">{isAdminMenuOpen ? "▴" : "▾"}</span>
                </button>

                {isAdminMenuOpen ? (
                  <div className="absolute right-0 z-50 mt-2 w-44 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                    <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">My Profile</button>
                    <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">Account Settings</button>
                    <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50">Logout</button>
                  </div>
                ) : null}
              </div>
            </div>
          </header>

          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => (
              <article key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{item.value}</p>
                <p className={`mt-2 text-xs font-semibold ${item.delta.startsWith("+") ? "text-emerald-600" : "text-rose-500"}`}>{item.delta} vs last week</p>
              </article>
            ))}
          </section>

          <section className="mt-5 grid gap-4 xl:grid-cols-[1.1fr_1fr]">
            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-800">Payment Gateway</h2>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Live</span>
              </div>
              <p className="text-sm text-slate-500">Let guests pay directly from dashboard links using UPI, Card, Net Banking, and Wallets.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Payment methods">
                {paymentMethods.map((method) => (
                  <button
                    key={method.title}
                    type="button"
                    role="radio"
                    aria-checked={selectedPayment.title === method.title}
                    onClick={() => setSelectedPayment(method)}
                    className={`rounded-xl border p-3 text-left transition ${
                      selectedPayment.title === method.title
                        ? "border-orange-400 bg-orange-50 ring-2 ring-orange-200"
                        : "border-slate-200 bg-slate-50 hover:border-orange-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-slate-900">{method.title}</p>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-slate-600">{method.status}</span>
                        <span
                          className={`grid h-4 w-4 place-items-center rounded-full border ${
                            selectedPayment.title === method.title ? "border-orange-500" : "border-slate-300"
                          }`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${
                              selectedPayment.title === method.title ? "bg-orange-500" : "bg-transparent"
                            }`}
                          />
                        </span>
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{method.subtitle}</p>
                    <p className="mt-2 text-xs font-medium text-orange-600">{method.fee}</p>
                  </button>
                ))}
              </div>
              <div className="mt-4 rounded-xl border border-orange-100 bg-orange-50 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-800">Collect Payment Now - {selectedPayment.title}</p>
                  <span className="text-xs text-slate-500">Txn ID: KD-24061</span>
                </div>
                <p className="mt-1 text-xs text-slate-600">Selected: {selectedPayment.subtitle}</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <button className="rounded-lg bg-orange-500 px-3 py-2 text-sm font-semibold text-white">Pay via {selectedPayment.title}</button>
                  <button
                    type="button"
                    onClick={handleSwitchMethod}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
                  >
                    Switch Method
                  </button>
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <h2 className="text-base font-bold text-slate-800">Recent Guests</h2>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[430px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                      <th className="px-3 py-3">Guest</th>
                      <th className="px-3 py-3">Amount</th>
                      <th className="px-3 py-3">Status</th>
                      <th className="px-3 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[["Aarav Mishra", "₹4,000", "Paid"],["Isha Patel", "₹1,500", "Pending"],["Rohit Das", "₹2,900", "Paid"],["Neha Gupta", "₹900", "Failed"]].map((row) => (
                      <tr key={row[0]} className="border-b border-slate-100 hover:bg-slate-50/70">
                        <td className="px-3 py-3 font-medium text-slate-800">{row[0]}</td>
                        <td className="px-3 py-3 text-slate-700">{row[1]}</td>
                        <td className="px-3 py-3">
                          <span className={`rounded-full px-2 py-1 text-xs font-semibold ${row[2] === "Paid" ? "bg-emerald-50 text-emerald-700" : row[2] === "Pending" ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"}`}>{row[2]}</span>
                        </td>
                        <td className="px-3 py-3">
                          <button className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-white">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
                <p className="text-xs text-slate-500">Showing 1 to 4 of 4 entries</p>
                <div className="flex items-center gap-1">
                  <button className="grid h-7 w-7 place-items-center rounded border border-slate-300 text-slate-400" disabled>
                    ‹
                  </button>
                  <button className="grid h-7 w-7 place-items-center rounded bg-orange-500 text-xs font-medium text-white">
                    1
                  </button>
                  <button className="grid h-7 w-7 place-items-center rounded border border-slate-300 text-slate-400" disabled>
                    ›
                  </button>
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 col-span-2">
              <DataTable<Registration>
                data={[]}
                columns={[
                  {
                    key: "slNo",
                    label: "SL #",
                    render: (_row, meta) => meta.serialNumber,
                  },
                  { key: "fullName", label: "Guest Name", sortable: true },
                  { key: "email", label: "Email", sortable: true },
                  { key: "mobile", label: "Mobile", sortable: true },
                  {
                    key: "registrationType",
                    label: "Type",
                    sortable: true,
                  },
                  { key: "city", label: "City", sortable: true },
                  { key: "status", label: "Status", sortable: true },
                  { key: "createdOn", label: "Registered", sortable: true },
                ]}
                title="All Registrations"
                pageSize={10}
                showExport={true}
              />
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}
