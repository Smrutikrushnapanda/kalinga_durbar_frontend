"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchRegistrations } from "@/app/api/api";

type IconProps = { className?: string };

function SearchIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ChevronLeftIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function ChevronUpIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}

function ChevronDownIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export type Registration = {
  id: string;
  fullName: string;
  mobile: string;
  email: string;
  aadhar?: string;
  organization?: string;
  clubNumber?: string;
  areaNumber?: string;
  city: string;
  state: string;
  gender?: string;
  registrationType: string;
  accompanyingPersonsCount: number;
  airportPickup: boolean;
  arrivalDate?: string;
  arrivalTime?: string;
  flightDetails?: string;
  dietary?: string;
  preTours: string[];
  totalAmount: number;
  status: string;
  qrToken?: string;
  accompanyingPersons?: AccompanyingPerson[];
  createdOn: string;
  updatedOn: string;
};

type AccompanyingPerson = {
  id: string;
  fullName: string;
  aadhar: string;
  phone: string;
  gender?: string;
  relation: string;
};

type Column<T> = {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (
    row: T,
    meta: { pageIndex: number; serialNumber: number }
  ) => React.ReactNode;
};

type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchKeys?: (keyof T)[];
  pageSize?: number;
  title?: string;
  showExport?: boolean;
};

const DEFAULT_SEARCH_KEYS: (keyof Registration)[] = [
  "fullName",
  "email",
  "mobile",
  "city",
];

function DownloadIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7,10 12,15 17,10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export default function DataTable<T extends Registration>({
  data,
  columns,
  searchable = true,
  searchKeys,
  pageSize = 10,
  title = "Recent Registrations",
  showExport = false,
}: DataTableProps<T>) {
  const resolvedSearchKeys = useMemo(
    () => (searchKeys ?? (DEFAULT_SEARCH_KEYS as (keyof T)[])),
    [searchKeys]
  );
  const [tableData, setTableData] = useState<T[]>(data);
  const [filteredData, setFilteredData] = useState<T[]>(data);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<keyof T | null>("createdOn");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Demo data for testing when API is not available
  const demoData: T[] = [
    {
      id: "1",
      fullName: "Aarav Mishra",
      mobile: "+91 9876543210",
      email: "aarav.mishra@email.com",
      aadhar: "123456789012",
      organization: "41 Club Bhubaneswar",
      clubNumber: "KD/2026/001",
      areaNumber: "41",
      city: "Bhubaneswar",
      state: "Odisha",
      gender: "male",
      registrationType: "single",
      accompanyingPersonsCount: 0,
      airportPickup: true,
      arrivalDate: "2026-09-17",
      arrivalTime: "14:30",
      flightDetails: "AI 123 Delhi-Bhubaneswar",
      dietary: "Veg",
      preTours: ["jagannath"],
      totalAmount: 43000,
      status: "confirmed",
      qrToken: "KD-2026-ABCD1234",
      createdOn: "2026-04-06T10:30:00.000Z",
      updatedOn: "2026-04-06T10:30:00.000Z",
    },
    {
      id: "2",
      fullName: "Priya Patel",
      mobile: "+91 8765432109",
      email: "priya.patel@email.com",
      aadhar: "234567890123",
      organization: "41 Club Cuttack",
      clubNumber: "KD/2026/002",
      areaNumber: "42",
      city: "Cuttack",
      state: "Odisha",
      gender: "female",
      registrationType: "couple",
      accompanyingPersonsCount: 1,
      airportPickup: false,
      arrivalDate: "2026-09-18",
      arrivalTime: "09:00",
      flightDetails: "",
      dietary: "Jain",
      preTours: ["konark"],
      totalAmount: 51500,
      status: "pending",
      qrToken: "KD-2026-ABCD1235",
      createdOn: "2026-04-06T09:15:00.000Z",
      updatedOn: "2026-04-06T09:15:00.000Z",
    },
    {
      id: "3",
      fullName: "Rohit Das",
      mobile: "+91 7654321098",
      email: "rohit.das@email.com",
      aadhar: "345678901234",
      organization: "41 Club Rourkela",
      clubNumber: "KD/2026/003",
      areaNumber: "43",
      city: "Rourkela",
      state: "Odisha",
      gender: "male",
      registrationType: "single_twin",
      accompanyingPersonsCount: 0,
      airportPickup: true,
      arrivalDate: "2026-09-17",
      arrivalTime: "16:45",
      flightDetails: "AI 456 Mumbai-Bhubaneswar",
      dietary: "Non-Veg",
      preTours: ["jagannath", "konark"],
      totalAmount: 26500,
      status: "confirmed",
      qrToken: "KD-2026-ABCD1236",
      createdOn: "2026-04-06T08:00:00.000Z",
      updatedOn: "2026-04-06T08:00:00.000Z",
    },
    {
      id: "4",
      fullName: "Neha Gupta",
      mobile: "+91 6543210987",
      email: "neha.gupta@email.com",
      aadhar: "456789012345",
      organization: "41 Club Berhampur",
      clubNumber: "KD/2026/004",
      areaNumber: "44",
      city: "Berhampur",
      state: "Odisha",
      gender: "female",
      registrationType: "tangent_twin",
      accompanyingPersonsCount: 0,
      airportPickup: false,
      arrivalDate: "2026-09-19",
      arrivalTime: "11:30",
      flightDetails: "",
      dietary: "Veg",
      preTours: [],
      totalAmount: 25500,
      status: "confirmed",
      qrToken: "KD-2026-ABCD1237",
      createdOn: "2026-04-05T22:30:00.000Z",
      updatedOn: "2026-04-05T22:30:00.000Z",
    },
    {
      id: "5",
      fullName: "Sanjay Kumar",
      mobile: "+91 5432109876",
      email: "sanjay.kumar@email.com",
      aadhar: "567890123456",
      organization: "41 Club Sambalpur",
      clubNumber: "KD/2026/005",
      areaNumber: "45",
      city: "Sambalpur",
      state: "Odisha",
      gender: "male",
      registrationType: "single",
      accompanyingPersonsCount: 0,
      airportPickup: true,
      arrivalDate: "2026-09-18",
      arrivalTime: "13:00",
      flightDetails: "AI 789 Kolkata-Bhubaneswar",
      dietary: "Veg",
      preTours: ["chilika"],
      totalAmount: 43000,
      status: "pending",
      qrToken: "KD-2026-ABCD1238",
      createdOn: "2026-04-05T18:00:00.000Z",
      updatedOn: "2026-04-05T18:00:00.000Z",
    },
    {
      id: "6",
      fullName: "Anita Sharma",
      mobile: "+91 9876543211",
      email: "anita.sharma@email.com",
      aadhar: "678901234567",
      organization: "41 Club Puri",
      clubNumber: "KD/2026/006",
      areaNumber: "46",
      city: "Puri",
      state: "Odisha",
      gender: "female",
      registrationType: "couple",
      accompanyingPersonsCount: 1,
      airportPickup: true,
      arrivalDate: "2026-09-17",
      arrivalTime: "15:30",
      flightDetails: "AI 234 Chennai-Bhubaneswar",
      dietary: "Jain",
      preTours: ["jagannath"],
      totalAmount: 51500,
      status: "confirmed",
      qrToken: "KD-2026-ABCD1239",
      createdOn: "2026-04-05T14:00:00.000Z",
      updatedOn: "2026-04-05T14:00:00.000Z",
    },
    {
      id: "7",
      fullName: "Vikram Singh",
      mobile: "+91 8765432108",
      email: "vikram.singh@email.com",
      aadhar: "789012345678",
      organization: "41 Club Delhi",
      clubNumber: "KD/2026/007",
      areaNumber: "47",
      city: "New Delhi",
      state: "Delhi",
      gender: "male",
      registrationType: "single_twin",
      accompanyingPersonsCount: 0,
      airportPickup: false,
      arrivalDate: "2026-09-19",
      arrivalTime: "08:00",
      flightDetails: "AI 567 Delhi-Bhubaneswar",
      dietary: "Non-Veg",
      preTours: [],
      totalAmount: 26500,
      status: "cancelled",
      qrToken: "KD-2026-ABCD1240",
      createdOn: "2026-04-04T20:30:00.000Z",
      updatedOn: "2026-04-05T10:00:00.000Z",
    },
    {
      id: "8",
      fullName: "Meera Nair",
      mobile: "+91 7654321099",
      email: "meera.nair@email.com",
      aadhar: "890123456789",
      organization: "41 Club Kochi",
      clubNumber: "KD/2026/008",
      areaNumber: "48",
      city: "Kochi",
      state: "Kerala",
      gender: "female",
      registrationType: "tangent_twin",
      accompanyingPersonsCount: 0,
      airportPickup: true,
      arrivalDate: "2026-09-18",
      arrivalTime: "12:15",
      flightDetails: "AI 890 Kochi-Bhubaneswar",
      dietary: "Veg",
      preTours: ["konark", "chilika"],
      totalAmount: 25500,
      status: "confirmed",
      qrToken: "KD-2026-ABCD1241",
      createdOn: "2026-04-04T16:00:00.000Z",
      updatedOn: "2026-04-04T16:00:00.000Z",
    },
    {
      id: "9",
      fullName: "Rahul Verma",
      mobile: "+91 6543210988",
      email: "rahul.verma@email.com",
      aadhar: "901234567890",
      organization: "41 Club Kolkata",
      clubNumber: "KD/2026/009",
      areaNumber: "49",
      city: "Kolkata",
      state: "West Bengal",
      gender: "male",
      registrationType: "single",
      accompanyingPersonsCount: 0,
      airportPickup: true,
      arrivalDate: "2026-09-17",
      arrivalTime: "10:45",
      flightDetails: "AI 123 Kolkata-Bhubaneswar",
      dietary: "Non-Veg",
      preTours: ["jagannath"],
      totalAmount: 43000,
      status: "confirmed",
      qrToken: "KD-2026-ABCD1242",
      createdOn: "2026-04-04T12:00:00.000Z",
      updatedOn: "2026-04-04T12:00:00.000Z",
    },
    {
      id: "10",
      fullName: "Kavita Reddy",
      mobile: "+91 5432109877",
      email: "kavita.reddy@email.com",
      aadhar: "012345678901",
      organization: "41 Club Hyderabad",
      clubNumber: "KD/2026/010",
      areaNumber: "50",
      city: "Hyderabad",
      state: "Telangana",
      gender: "female",
      registrationType: "couple",
      accompanyingPersonsCount: 1,
      airportPickup: false,
      arrivalDate: "2026-09-19",
      arrivalTime: "14:00",
      flightDetails: "",
      dietary: "Veg",
      preTours: [],
      totalAmount: 51500,
      status: "pending",
      qrToken: "KD-2026-ABCD1243",
      createdOn: "2026-04-04T08:00:00.000Z",
      updatedOn: "2026-04-04T08:00:00.000Z",
    },
    {
      id: "11",
      fullName: "Deepak Choudhury",
      mobile: "+91 9876543212",
      email: "deepak.choudhury@email.com",
      aadhar: "112233445566",
      organization: "41 Club Mumbai",
      clubNumber: "KD/2026/011",
      areaNumber: "51",
      city: "Mumbai",
      state: "Maharashtra",
      gender: "male",
      registrationType: "single_twin",
      accompanyingPersonsCount: 0,
      airportPickup: true,
      arrivalDate: "2026-09-18",
      arrivalTime: "11:00",
      flightDetails: "AI 456 Mumbai-Bhubaneswar",
      dietary: "Non-Veg",
      preTours: ["konark"],
      totalAmount: 26500,
      status: "confirmed",
      qrToken: "KD-2026-ABCD1244",
      createdOn: "2026-04-03T22:00:00.000Z",
      updatedOn: "2026-04-03T22:00:00.000Z",
    },
    {
      id: "12",
      fullName: "Sunita Iyer",
      mobile: "+91 8765432107",
      email: "sunita.iyer@email.com",
      aadhar: "223344556677",
      organization: "41 Club Chennai",
      clubNumber: "KD/2026/012",
      areaNumber: "52",
      city: "Chennai",
      state: "Tamil Nadu",
      gender: "female",
      registrationType: "tangent_twin",
      accompanyingPersonsCount: 0,
      airportPickup: false,
      arrivalDate: "2026-09-19",
      arrivalTime: "16:30",
      flightDetails: "AI 789 Chennai-Bhubaneswar",
      dietary: "Jain",
      preTours: ["chilika"],
      totalAmount: 25500,
      status: "confirmed",
      qrToken: "KD-2026-ABCD1245",
      createdOn: "2026-04-03T18:00:00.000Z",
      updatedOn: "2026-04-03T18:00:00.000Z",
    },
  ] as T[];

  // Fetch data from API
  useEffect(() => {
    let isCancelled = false;
    
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetchRegistrations();
        if (isCancelled) return;
        // axios wraps response in { data: ... }, and NestJS may wrap again
        const registrationsArray = response.data?.data || response.data || [];
        const registrations = registrationsArray as T[];
        const sourceRows = registrations.length > 0 ? registrations : demoData;
        // Sort by createdOn descending (most recent first)
        const sorted = [...sourceRows].sort(
          (a, b) =>
            new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime()
        );
        setTableData(sorted);
      } catch (error) {
        console.warn("Failed to fetch registrations. Using demo data.");
        if (isCancelled) return;
        // Use demo data when API fails
        const sorted = [...demoData].sort(
          (a, b) =>
            new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime()
        );
        setTableData(sorted);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      isCancelled = true;
    };
  }, []);

  // Filter data based on search term
  useEffect(() => {
    let result = [...tableData];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((row) =>
        resolvedSearchKeys.some((key) => {
          const value = row[key];
          return value?.toString().toLowerCase().includes(term);
        })
      );
    }

    setFilteredData(result);
    setCurrentPage(1);
  }, [searchTerm, tableData, resolvedSearchKeys]);

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortKey) return 0;

    const aValue = a[sortKey as keyof T];
    const bValue = b[sortKey as keyof T];

    if (aValue === bValue) return 0;

    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    const comparison =
      typeof aValue === "string"
        ? aValue.localeCompare(bValue as string)
        : (aValue as number) - (bValue as number);

    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      pending: "bg-amber-50 text-amber-700",
      confirmed: "bg-emerald-50 text-emerald-700",
      cancelled: "bg-rose-50 text-rose-700",
    };

    return (
      <span
        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
          statusStyles[status] || "bg-slate-100 text-slate-700"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatRegistrationType = (type: string) => {
    const typeLabels: Record<string, string> = {
      single: "Single",
      single_twin: "Single (Twin)",
      couple: "Couple",
      tangent_twin: "Tangent (Twin)",
    };
    return typeLabels[type] || type;
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-4">
        <h2 className="text-base font-bold text-slate-800">{title}</h2>
        <div className="flex flex-wrap items-center gap-2">
          {showExport && (
            <button
              onClick={() => {
                const csvContent = [
                  columns.map((col) => col.label).join(","),
                  ...sortedData.map((row) =>
                    columns
                      .map((col) => {
                        const value = row[col.key as keyof T];
                        return value ? String(value).replace(/",/g, '""') : "";
                      })
                      .join(",")
                  ),
                ].join("\n");
                const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `${title.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.csv`;
                link.click();
                URL.revokeObjectURL(url);
              }}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <DownloadIcon className="h-4 w-4" />
              Export
            </button>
          )}
          {searchable && (
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, mobile, city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 w-64 rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
              />
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={String(column.key)}
                      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 ${
                        column.sortable ? "cursor-pointer select-none" : ""
                      }`}
                      onClick={() =>
                        column.sortable && handleSort(column.key as keyof T)
                      }
                    >
                      <div className="flex items-center gap-1">
                        {column.label}
                        {column.sortable && sortKey === column.key && (
                          <span className="text-orange-500">
                            {sortDirection === "asc" ? (
                              <ChevronUpIcon className="h-3 w-3" />
                            ) : (
                              <ChevronDownIcon className="h-3 w-3" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-4 py-8 text-center text-sm text-slate-500"
                    >
                      No registrations found
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((row, idx) => (
                    <tr
                      key={row.id || idx}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      {columns.map((column) => (
                        <td
                          key={String(column.key)}
                          className="whitespace-nowrap px-4 py-3 text-sm text-slate-600"
                        >
                          {column.render
                            ? column.render(row, {
                                pageIndex: idx,
                                serialNumber:
                                  (currentPage - 1) * pageSize + idx + 1,
                              })
                            : column.key === "status"
                            ? getStatusBadge(
                                row[column.key as keyof T] as string
                              )
                            : column.key === "createdOn"
                            ? formatDate(row.createdOn)
                            : column.key === "registrationType"
                            ? formatRegistrationType(
                                row.registrationType as string
                              )
                            : (row[column.key as keyof T] as React.ReactNode) ||
                              "-"}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 p-4">
              <p className="text-sm text-slate-500">
                Showing {(currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, sortedData.length)} of{" "}
                {sortedData.length} entries
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    const diff = Math.abs(page - currentPage);
                    return (
                      diff === 0 ||
                      diff === 1 ||
                      page === 1 ||
                      page === totalPages
                    );
                  })
                  .map((page, idx, arr) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`grid h-8 w-8 place-items-center rounded-lg text-sm font-medium transition ${
                        page === currentPage
                          ? "bg-orange-500 text-white"
                          : "border border-slate-300 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
