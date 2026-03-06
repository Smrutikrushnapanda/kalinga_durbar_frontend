"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { submitRegistration, type RegistrationPayload } from "@/app/api/api";

// ─── Types ────────────────────────────────────────────────────────────────────

type EventConfig = {
  eventName: string;
  tagline: string;
  subtitle: string;
  dates: string;
  venue: string;
  whatsappNumber: string;
  callNumber: string;
  registrationTypes: RegistrationType[];
  preTours: PreTour[];
  dietaryOptions: string[];
  formFields: FormFieldConfig;
  paymentEnabled: boolean;
  qrScanItems: ScanItem[];
};

type RegistrationType = {
  id: string;
  label: string;
  price: number;
  description?: string;
};

type PreTour = {
  id: string;
  name: string;
  price?: number;
};

type FormFieldConfig = {
  showAirportPickup: boolean;
  showFlightDetails: boolean;
  showDietary: boolean;
  showAccompanyingPersons: boolean;
  maxAccompanyingPersons: number;
};

type ScanItem = {
  id: string;
  label: string;
  allowMultiple: boolean;
  cooldownMinutes?: number;
};

type AccompanyingPerson = {
  fullName: string;
  aadhar: string;
  phone: string;
  relation: string;
};

type RegistrationForm = {
  // Basic
  fullName: string;
  mobile: string;
  email: string;
  aadhar: string;
  clubNumber: string;
  areaNumber: string;
  city: string;
  state: string;
  // Event specific
  registrationType: string;
  accompanyingPersonsCount: number;
  accompanyingPersons: AccompanyingPerson[];
  airportPickup: boolean;
  arrivalDate: string;
  arrivalTime: string;
  flightDetails: string;
  dietary: string;
  preTours: string[];
};

// ─── Default Event Config (fully dynamic — admin controls this via API) ───────

const DEFAULT_EVENT_CONFIG: EventConfig = {
  eventName: "NAGM 2026 – Kalinga Durbar",
  tagline: "YOU DESIRE – WE DELIVER",
  subtitle: "YOUR CURATED HOLIDAY AWAITS",
  dates: "18th – 20th September",
  venue: "Bhubaneswar",
  whatsappNumber: "+91 8260612032",
  callNumber: "+91 9437022309",
  registrationTypes: [
    { id: "single", label: "Single", price: 43000 },
    { id: "single_twin", label: "Single (Twin Sharing)", price: 26500 },
    { id: "couple", label: "Couple", price: 51500 },
    { id: "tangent_twin", label: "Tangent (Twin Sharing)", price: 25500 },
  ],
  preTours: [
    { id: "jagannath", name: "Lord Jagannath Temple Puri", price: 1500 },
    { id: "konark", name: "Sun Temple Konark", price: 1800 },
    { id: "chilika", name: "Chilika Lake", price: 2000 },
    { id: "bhitarkanika", name: "Bhitarkanika Wildlife Sanctuary", price: 2200 },
  ],
  dietaryOptions: ["Veg", "Non-Veg", "Jain", "Other"],
  formFields: {
    showAirportPickup: true,
    showFlightDetails: true,
    showDietary: true,
    showAccompanyingPersons: true,
    maxAccompanyingPersons: 5,
  },
  paymentEnabled: true,
  qrScanItems: [
    { id: "entry", label: "Entry", allowMultiple: false },
    { id: "lunch", label: "Lunch", allowMultiple: false },
    { id: "dinner", label: "Dinner", allowMultiple: false },
    { id: "liquor", label: "Liquor", allowMultiple: true, cooldownMinutes: 15 },
    { id: "kit", label: "Welcome Kit", allowMultiple: false },
  ],
};

const emptyPerson = (): AccompanyingPerson => ({
  fullName: "",
  aadhar: "",
  phone: "",
  relation: "",
});

const emptyForm = (): RegistrationForm => ({
  fullName: "",
  mobile: "",
  email: "",
  aadhar: "",
  clubNumber: "",
  areaNumber: "",
  city: "",
  state: "",
  registrationType: "",
  accompanyingPersonsCount: 0,
  accompanyingPersons: [],
  airportPickup: false,
  arrivalDate: "",
  arrivalTime: "",
  flightDetails: "",
  dietary: "",
  preTours: [],
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

function calcTotal(config: EventConfig, form: RegistrationForm): number {
  const reg = config.registrationTypes.find((r) => r.id === form.registrationType);
  const regPrice = reg?.price ?? 0;
  const tourPrice = form.preTours.reduce((sum, tid) => {
    const t = config.preTours.find((p) => p.id === tid);
    return sum + (t?.price ?? 0);
  }, 0);
  return regPrice + tourPrice;
}

// ─── Components ───────────────────────────────────────────────────────────────

function StepIndicator({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                i < current
                  ? "bg-amber-500 border-amber-500 text-white"
                  : i === current
                  ? "bg-white border-amber-500 text-amber-600 shadow-lg shadow-amber-200"
                  : "bg-stone-100 border-stone-300 text-stone-400"
              }`}
            >
              {i < current ? "✓" : i + 1}
            </div>
            <span className={`text-xs mt-1 font-medium ${i === current ? "text-amber-600" : "text-stone-400"}`}>{s}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-12 h-0.5 mb-5 mx-1 transition-all duration-300 ${i < current ? "bg-amber-400" : "bg-stone-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function Input({
  label,
  id,
  required,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; id: string; required?: boolean }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-stone-700 mb-1">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <input
        id={id}
        required={required}
        className="w-full rounded-xl border-2 border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition-all duration-200 focus:border-amber-400 focus:bg-white focus:shadow-md focus:shadow-amber-100 placeholder:text-stone-400"
        {...rest}
      />
    </div>
  );
}

function Select({
  label,
  id,
  options,
  required,
  value,
  onChange,
}: {
  label: string;
  id: string;
  options: { value: string; label: string }[];
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-stone-700 mb-1">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <select
        id={id}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border-2 border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition-all duration-200 focus:border-amber-400 focus:bg-white focus:shadow-md focus:shadow-amber-100 appearance-none cursor-pointer"
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function SectionTitle({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) {
  return (
    <div className="flex items-start gap-3 mb-6">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xl flex-shrink-0 shadow-lg shadow-amber-200">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-stone-900 text-lg leading-tight">{title}</h3>
        {subtitle && <p className="text-stone-500 text-sm">{subtitle}</p>}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function RegistrationPage() {
  const [config] = useState<EventConfig>(DEFAULT_EVENT_CONFIG);
  const [form, setForm] = useState<RegistrationForm>(emptyForm());
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notification, setNotification] = useState<{ type: "error" | "success"; message: string } | null>(null);

  const STEPS = ["Basic Info", "Event Details", "Pre Tours", "Review & Pay"];

  // Sync accompanying persons array length
  useEffect(() => {
    const count = form.accompanyingPersonsCount;
    setForm((prev) => {
      const current = prev.accompanyingPersons;
      if (current.length === count) return prev;
      if (current.length < count) {
        return { ...prev, accompanyingPersons: [...current, ...Array.from({ length: count - current.length }, emptyPerson)] };
      }
      return { ...prev, accompanyingPersons: current.slice(0, count) };
    });
  }, [form.accompanyingPersonsCount]);

  // Auto-set accompanying persons to 1 when a registration type is selected
  useEffect(() => {
    if (form.registrationType && form.accompanyingPersonsCount === 0) {
      set("accompanyingPersonsCount", 1);
    }
  }, [form.registrationType]);

  const set = <K extends keyof RegistrationForm>(key: K, val: RegistrationForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  };

  const toggleTour = (id: string) => {
    setForm((prev) => ({
      ...prev,
      preTours: prev.preTours.includes(id) ? prev.preTours.filter((t) => t !== id) : [...prev.preTours, id],
    }));
  };

  const updatePerson = (i: number, field: keyof AccompanyingPerson, val: string) => {
    setForm((prev) => {
      const persons = [...prev.accompanyingPersons];
      persons[i] = { ...persons[i], [field]: val };
      return { ...prev, accompanyingPersons: persons };
    });
    setErrors((prev) => {
      const n = { ...prev };
      delete n[`accompanyingPersons.${i}.${field}`];
      return n;
    });
  };

  const validate = (s: number): boolean => {
    const e: Record<string, string> = {};
    const aadharRegex = /^[0-9]{12}$/;
    const phoneRegex = /^[0-9]{10}$/;
    if (s === 0) {
      if (!form.fullName.trim()) e.fullName = "Required";
      if (!form.mobile.trim()) e.mobile = "Required";
      else if (!phoneRegex.test(form.mobile)) e.mobile = "Enter 10 digits";
      if (!form.email.trim()) e.email = "Required";
      if (!form.aadhar.trim()) e.aadhar = "Required";
      else if (!aadharRegex.test(form.aadhar)) e.aadhar = "Enter 12 digits";
      if (!form.clubNumber.trim()) e.clubNumber = "Required";
      if (!form.areaNumber.trim()) e.areaNumber = "Required";
      if (!form.city.trim()) e.city = "Required";
      if (!form.state.trim()) e.state = "Required";
    }
    if (s === 1) {
      if (!form.registrationType) e.registrationType = "Required";
      if (!form.dietary && config.formFields.showDietary) e.dietary = "Required";
      if (form.accompanyingPersonsCount > 0) {
        form.accompanyingPersons.forEach((person, i) => {
          const personAadhar = person.aadhar.trim();
          const personPhone = person.phone.trim();

          if (!personAadhar) e[`accompanyingPersons.${i}.aadhar`] = "Required";
          else if (!aadharRegex.test(personAadhar)) e[`accompanyingPersons.${i}.aadhar`] = "Enter 12 digits";

          if (!personPhone) e[`accompanyingPersons.${i}.phone`] = "Required";
          else if (!phoneRegex.test(personPhone)) e[`accompanyingPersons.${i}.phone`] = "Enter 10 digits";
        });
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validate(step)) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    if (!validate(step)) return;
    setSubmitting(true);
    setNotification(null);
    try {
      const accompanyingPersonsPayload =
        form.accompanyingPersonsCount > 0
          ? form.accompanyingPersons.map((person) => ({
              ...person,
              gender: "other",
            }))
          : [];

      const payload: RegistrationPayload = {
        ...form,
        // Backward-compatible fields for old deployed API validation.
        organization: `Club ${form.clubNumber}`,
        gender: "other",
        accompanyingPersons: accompanyingPersonsPayload,
        arrivalDate: form.arrivalDate || undefined,
        arrivalTime: form.arrivalTime || undefined,
        flightDetails: form.flightDetails || undefined,
        dietary: form.dietary || undefined,
        preTours: form.preTours ?? [],
        totalAmount: calcTotal(config, form),
      };

      await submitRegistration(payload);
      setSubmitted(true);
    } catch (e: unknown) {
      console.error(e);
      const axiosError = e as { response?: { status?: number; data?: { message?: string } } };
      const status = axiosError?.response?.status;
      const serverMessage = axiosError?.response?.data?.message ?? "";

      if (status === 409 || (typeof serverMessage === "string" && serverMessage.toLowerCase().includes("already exists"))) {
        // Duplicate email — navigate back to step 0 and highlight the field
        setErrors({ email: "This email is already registered. Please use a different email." });
        setStep(0);
        setNotification({ type: "error", message: "This email is already registered. Please go back and use a different email." });
      } else if (status === 400) {
        const msg = typeof serverMessage === "string" && serverMessage
          ? serverMessage
          : "Some fields are invalid. Please review your details.";
        setNotification({ type: "error", message: msg });
      } else {
        setNotification({ type: "error", message: "Submission failed. Please try again." });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const total = calcTotal(config, form);
  const selectedRegType = config.registrationTypes.find((r) => r.id === form.registrationType);

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-5xl mx-auto shadow-2xl shadow-amber-300 animate-bounce">
            🎉
          </div>
          <h1 className="text-3xl font-black text-stone-900">Registration Successful!</h1>
          <p className="text-stone-600 leading-relaxed">
            Welcome to <strong>{config.eventName}</strong>! Your registration has been received. Check your email for your credentials and QR
            code.
          </p>
          <div className="rounded-2xl bg-white border border-amber-100 shadow-xl p-6 space-y-2 text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-500">Booking Summary</p>
            <p className="font-semibold text-stone-900">{form.fullName}</p>
            <p className="text-stone-500 text-sm">{form.email}</p>
            <p className="text-stone-500 text-sm">{selectedRegType?.label}</p>
            <div className="pt-2 border-t border-stone-100">
              <p className="text-2xl font-black text-amber-600">{formatINR(total)}</p>
            </div>
          </div>
          <p className="text-sm text-stone-500">
            Questions? WhatsApp us at{" "}
            <a href={`https://wa.me/${config.whatsappNumber.replace(/\s/g, "")}`} className="text-amber-600 font-semibold underline">
              {config.whatsappNumber}
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f4]" style={{ fontFamily: "'Georgia', serif" }}>
      {/* Hero Banner */}
      <div className="bg-stone-900 text-white text-center py-3 px-4">
        <p className="text-xs sm:text-sm font-bold tracking-[0.3em] text-amber-300 uppercase">{config.tagline}</p>
      </div>

      <div
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1a3a2a 0%, #0f2419 40%, #1a3a2a 100%)",
        }}
      >
        {/* Decorative wave pattern */}
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,20 1440,30 L1440,60 L0,60 Z" fill="#faf8f4" />
        </svg>

        <div className="relative z-10 flex flex-col items-center gap-4 px-4 py-6 sm:py-8 lg:py-10">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 w-full max-w-4xl">
            <Image
              src="/images/LOGO-Kalingadarbar.png"
              alt="Kalinga Durbar Logo"
              width={170}
              height={80}
              priority
              className="h-auto w-auto max-w-[80px] sm:max-w-[90px]"
              sizes="(max-width: 640px) 150px, 180px"
            />
            <Image
              src="/images/associatelogo.png"
              alt="Associate Logo"
              width={150}
              height={75}
              className="h-auto w-auto max-w-[160px] sm:max-w-[180px] opacity-95"
              sizes="(max-width: 640px) 130px, 160px"
            />
          </div>

          <div className="text-center space-y-2">
            <p className="text-amber-400 text-xs tracking-[0.25em] font-bold uppercase">{config.subtitle}</p>
            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              {config.eventName}
            </h1>
            <p className="text-stone-400 text-sm">
              {config.dates} · {config.venue}
            </p>
          </div>
        </div>
      </div>

      {/* Main form card */}
      <div className="max-w-2xl mx-auto px-4 pb-20 -mt-4">
        <div className="bg-white rounded-3xl shadow-2xl shadow-amber-100/60 border border-amber-100/50 overflow-hidden">
          {/* Card header */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 sm:px-8 py-5 text-center">
            <p className="text-white/80 text-[11px] sm:text-xs font-bold tracking-widest uppercase">Official Registration</p>
            <h2 className="text-white text-lg sm:text-xl font-black mt-0.5">Complete Your Booking</h2>
          </div>

          <div className="px-6 sm:px-8 pt-8 pb-6">
            {notification && (
              <div
                className={`mb-4 rounded-xl px-4 py-3 text-sm font-semibold ${
                  notification.type === "error"
                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                    : "bg-green-50 text-green-700 border border-green-200"
                }`}
              >
                {notification.message}
              </div>
            )}

            <StepIndicator steps={STEPS} current={step} />

            {/* ── STEP 0: Basic Info ── */}
            {step === 0 && (
              <div className="space-y-5">
                <SectionTitle icon="👤" title="Basic Information" subtitle="Please fill in your personal details" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Input
                      label="Full Name"
                      id="fullName"
                      required
                      placeholder="As per ID proof"
                      value={form.fullName}
                      onChange={(e) => set("fullName", e.target.value)}
                    />
                    {errors.fullName && <p className="text-rose-500 text-xs mt-1">{errors.fullName}</p>}
                  </div>
                  <div>
                    <Input
                      label="Mobile Number"
                      id="mobile"
                      required
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={form.mobile}
                      onChange={(e) => set("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))}
                      pattern="[0-9]{10}"
                      maxLength={10}
                    />
                    {errors.mobile && <p className="text-rose-500 text-xs mt-1">{errors.mobile}</p>}
                  </div>
                  <div>
                    <Input
                      label="Email ID"
                      id="email"
                      required
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                    />
                    {errors.email && <p className="text-rose-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <Input
                      label="Aadhaar Number"
                      id="aadhar"
                      required
                      inputMode="numeric"
                      pattern="[0-9]{12}"
                      maxLength={12}
                      placeholder="12-digit Aadhaar"
                      value={form.aadhar}
                      onChange={(e) => set("aadhar", e.target.value.replace(/\D/g, "").slice(0, 12))}
                    />
                    {errors.aadhar && <p className="text-rose-500 text-xs mt-1">{errors.aadhar}</p>}
                  </div>
                  <div>
                    <Input
                      label="Club Number"
                      id="clubNumber"
                      required
                      inputMode="numeric"
                      pattern="[0-9]+"
                      placeholder="Enter club number"
                      value={form.clubNumber}
                      onChange={(e) => set("clubNumber", e.target.value.replace(/\D/g, ""))}
                    />
                    {errors.clubNumber && <p className="text-rose-500 text-xs mt-1">{errors.clubNumber}</p>}
                  </div>
                  <div>
                    <Input
                      label="Area Number"
                      id="areaNumber"
                      required
                      inputMode="numeric"
                      pattern="[0-9]+"
                      placeholder="Enter area number"
                      value={form.areaNumber}
                      onChange={(e) => set("areaNumber", e.target.value.replace(/\D/g, ""))}
                    />
                    {errors.areaNumber && <p className="text-rose-500 text-xs mt-1">{errors.areaNumber}</p>}
                  </div>
                  <div>
                    <Input
                      label="City"
                      id="city"
                      required
                      placeholder="Bhubaneswar"
                      value={form.city}
                      onChange={(e) => set("city", e.target.value)}
                    />
                    {errors.city && <p className="text-rose-500 text-xs mt-1">{errors.city}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <Input
                      label="State"
                      id="state"
                      required
                      placeholder="Odisha"
                      value={form.state}
                      onChange={(e) => set("state", e.target.value)}
                    />
                    {errors.state && <p className="text-rose-500 text-xs mt-1">{errors.state}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 1: Event Details ── */}
            {step === 1 && (
              <div className="space-y-6">
                <SectionTitle icon="🎪" title="Event Details" subtitle="Choose your registration type and preferences" />

                {/* Registration Type */}
                <div>
                  <p className="text-sm font-semibold text-stone-700 mb-3">
                    Registration Type <span className="text-rose-500">*</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {config.registrationTypes.map((rt) => (
                      <button
                        key={rt.id}
                        type="button"
                        onClick={() => set("registrationType", rt.id)}
                        className={`text-left rounded-2xl border-2 p-4 transition-all duration-200 ${
                          form.registrationType === rt.id
                            ? "border-amber-500 bg-amber-50 shadow-md shadow-amber-100"
                            : "border-stone-200 bg-stone-50 hover:border-amber-300"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <p className={`font-bold text-sm ${form.registrationType === rt.id ? "text-amber-700" : "text-stone-800"}`}>
                            {rt.label}
                          </p>
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                              form.registrationType === rt.id ? "border-amber-500 bg-amber-500" : "border-stone-300"
                            }`}
                          >
                            {form.registrationType === rt.id && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                        </div>
                        <p className="text-amber-600 font-black text-lg mt-1">{formatINR(rt.price)}</p>
                        {rt.description && <p className="text-stone-500 text-xs mt-1">{rt.description}</p>}
                      </button>
                    ))}
                  </div>
                  {errors.registrationType && <p className="text-rose-500 text-xs mt-1">{errors.registrationType}</p>}
                </div>

                {/* Accompanying Persons */}
                {config.formFields.showAccompanyingPersons && (
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1">
                      Number of Accompanying Persons
                    </label>
                    <select
                      value={form.accompanyingPersonsCount}
                      onChange={(e) => set("accompanyingPersonsCount", parseInt(e.target.value))}
                      className="w-full rounded-xl border-2 border-amber-300 bg-white px-4 py-3 text-sm font-semibold text-stone-900 outline-none focus:border-amber-500 focus:bg-white shadow-sm transition-all"
                    >
                      {Array.from({ length: config.formFields.maxAccompanyingPersons + 1 }, (_, i) => (
                        <option key={i} value={i}>{i === 0 ? "None" : i}</option>
                      ))}
                    </select>

                    {form.accompanyingPersons.length > 0 && (
                      <div className="mt-4 space-y-4">
                        {form.accompanyingPersons.map((p, i) => (
                          <div key={i} className="rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/40 p-4">
                            <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-3">Person {i + 1}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <Input
                                label="Full Name"
                                id={`p${i}_name`}
                                placeholder="As per Aadhaar"
                                value={p.fullName}
                                onChange={(e) => updatePerson(i, "fullName", e.target.value)}
                              />
                              <div>
                                <Input
                                  label="Aadhaar Number"
                                  id={`p${i}_aadhar`}
                                  inputMode="numeric"
                                  pattern="[0-9]{12}"
                                  maxLength={12}
                                  placeholder="12-digit Aadhaar"
                                  value={p.aadhar}
                                  onChange={(e) => updatePerson(i, "aadhar", e.target.value.replace(/\D/g, "").slice(0, 12))}
                                />
                                {errors[`accompanyingPersons.${i}.aadhar`] && (
                                  <p className="text-rose-500 text-xs mt-1">{errors[`accompanyingPersons.${i}.aadhar`]}</p>
                                )}
                              </div>
                              <div>
                                <Input
                                  label="Phone"
                                  id={`p${i}_phone`}
                                  type="tel"
                                  inputMode="numeric"
                                  pattern="[0-9]{10}"
                                  maxLength={10}
                                  placeholder="10-digit phone number"
                                  value={p.phone}
                                  onChange={(e) => updatePerson(i, "phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                                />
                                {errors[`accompanyingPersons.${i}.phone`] && (
                                  <p className="text-rose-500 text-xs mt-1">{errors[`accompanyingPersons.${i}.phone`]}</p>
                                )}
                              </div>
                              <Select
                                label="Relation"
                                id={`p${i}_relation`}
                                value={p.relation}
                                onChange={(v) => updatePerson(i, "relation", v)}
                                options={[
                                  { value: "spouse", label: "Spouse" },
                                  { value: "child", label: "Child" },
                                  { value: "parent", label: "Parent" },
                                  { value: "friend", label: "Friend" },
                                  { value: "colleague", label: "Colleague" },
                                  { value: "other", label: "Other" },
                                ]}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Airport Pickup */}
                {config.formFields.showAirportPickup && (
                  <div>
                    <p className="text-sm font-semibold text-stone-700 mb-3">Airport Pickup Required?</p>
                    <div className="flex gap-3">
                      {["Yes", "No"].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => set("airportPickup", opt === "Yes")}
                          className={`flex-1 py-3 rounded-xl font-semibold text-sm border-2 transition-all ${
                            form.airportPickup === (opt === "Yes")
                              ? "bg-amber-500 border-amber-500 text-white shadow-md"
                              : "bg-stone-50 border-stone-200 text-stone-600 hover:border-amber-300"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    {form.airportPickup && (
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-2xl bg-blue-50/50 border border-blue-100 p-4">
                        <Input
                          label="Arrival Date"
                          id="arrivalDate"
                          type="date"
                          value={form.arrivalDate}
                          onChange={(e) => set("arrivalDate", e.target.value)}
                        />
                        <Input
                          label="Arrival Time"
                          id="arrivalTime"
                          type="time"
                          value={form.arrivalTime}
                          onChange={(e) => set("arrivalTime", e.target.value)}
                        />
                        {config.formFields.showFlightDetails && (
                          <div className="sm:col-span-2">
                            <Input
                              label="Flight Details"
                              id="flightDetails"
                              placeholder="Flight number, airline…"
                              value={form.flightDetails}
                              onChange={(e) => set("flightDetails", e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Dietary */}
                {config.formFields.showDietary && (
                  <div>
                    <p className="text-sm font-semibold text-stone-700 mb-3">
                      Dietary Preference <span className="text-rose-500">*</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {config.dietaryOptions.map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => set("dietary", d)}
                          className={`px-5 py-2.5 rounded-full text-sm font-semibold border-2 transition-all ${
                            form.dietary === d
                              ? "bg-green-500 border-green-500 text-white shadow-md"
                              : "bg-stone-50 border-stone-200 text-stone-600 hover:border-green-300"
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                    {errors.dietary && <p className="text-rose-500 text-xs mt-1">{errors.dietary}</p>}
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 2: Pre Tours ── */}
            {step === 2 && (
              <div className="space-y-5">
                <SectionTitle
                  icon="🗺️"
                  title="Pre-Tour Selection"
                  subtitle="Add curated pre-tours to enhance your experience (additional cost)"
                />

                <div className="space-y-3">
                  {config.preTours.map((tour) => {
                    const selected = form.preTours.includes(tour.id);
                    return (
                      <button
                        key={tour.id}
                        type="button"
                        onClick={() => toggleTour(tour.id)}
                        className={`w-full text-left rounded-2xl border-2 p-4 transition-all duration-200 flex items-center gap-4 ${
                          selected ? "border-amber-500 bg-amber-50 shadow-md shadow-amber-100" : "border-stone-200 bg-stone-50 hover:border-amber-200"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            selected ? "bg-amber-500 border-amber-500" : "border-stone-300"
                          }`}
                        >
                          {selected && <span className="text-white text-xs font-bold">✓</span>}
                        </div>
                        <div className="flex-1">
                          <p className={`font-semibold text-sm ${selected ? "text-amber-800" : "text-stone-800"}`}>{tour.name}</p>
                          {tour.price ? (
                            <p className="text-amber-600 font-bold text-sm">{formatINR(tour.price)}</p>
                          ) : (
                            <p className="text-stone-400 text-xs">Price on request</p>
                          )}
                        </div>
                        {selected && (
                          <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">Added</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {form.preTours.length === 0 && (
                  <p className="text-center text-stone-400 text-sm py-4">
                    No pre-tours selected. You can skip this step.
                  </p>
                )}
              </div>
            )}

            {/* ── STEP 3: Review & Pay ── */}
            {step === 3 && (
              <div className="space-y-5">
                <SectionTitle icon="✅" title="Review & Pay" subtitle="Confirm your details before proceeding" />

                {/* Summary Card */}
                <div className="rounded-2xl bg-stone-50 border border-stone-200 divide-y divide-stone-200 overflow-hidden">
                  <div className="px-5 py-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Registrant</p>
                    <p className="font-bold text-stone-900">{form.fullName}</p>
                    <p className="text-stone-500 text-sm">{form.email} · {form.mobile}</p>
                    <p className="text-stone-500 text-sm">
                      Club #{form.clubNumber} · Area #{form.areaNumber} · {form.city}, {form.state}
                    </p>
                  </div>

                  <div className="px-5 py-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Registration</p>
                    <div className="flex justify-between">
                      <p className="text-stone-800 font-semibold">{selectedRegType?.label ?? "—"}</p>
                      <p className="text-stone-800 font-bold">{selectedRegType ? formatINR(selectedRegType.price) : "—"}</p>
                    </div>
                    {form.accompanyingPersonsCount > 0 && (
                      <p className="text-stone-500 text-xs mt-1">{form.accompanyingPersonsCount} accompanying person(s)</p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form.dietary && (
                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">{form.dietary}</span>
                      )}
                      {form.airportPickup && (
                        <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">Airport Pickup</span>
                      )}
                    </div>
                  </div>

                  {form.preTours.length > 0 && (
                    <div className="px-5 py-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Pre-Tours</p>
                      {form.preTours.map((tid) => {
                        const t = config.preTours.find((p) => p.id === tid)!;
                        return (
                          <div key={tid} className="flex justify-between text-sm">
                            <p className="text-stone-700">{t.name}</p>
                            <p className="text-stone-700 font-semibold">{t.price ? formatINR(t.price) : "TBD"}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="px-5 py-4 bg-gradient-to-r from-amber-50 to-orange-50">
                    <div className="flex justify-between items-center">
                      <p className="font-black text-stone-900 text-lg">Total Amount</p>
                      <p className="font-black text-amber-600 text-2xl">{formatINR(total)}</p>
                    </div>
                    <p className="text-stone-400 text-xs mt-1">* Pre-tour prices without explicit amounts are TBD</p>
                  </div>
                </div>

                {config.paymentEnabled && (
                  <div className="rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50 p-4 text-center">
                    <p className="text-amber-700 font-semibold text-sm">💳 Payment will be processed after submission</p>
                    <p className="text-amber-600 text-xs mt-1">You will be redirected to the payment gateway</p>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-8">
              {step > 0 && (
                <button
                  type="button"
                  onClick={back}
                  className="flex-1 rounded-xl border-2 border-stone-200 bg-white py-3.5 text-sm font-bold text-stone-700 hover:border-stone-300 transition-all"
                >
                  ← Back
                </button>
              )}
              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={next}
                  className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-200 hover:from-amber-600 hover:to-orange-600 transition-all"
                >
                  Continue →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-200 hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting…" : config.paymentEnabled ? "Proceed to Payment →" : "Submit Registration"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer contacts */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`https://wa.me/${config.whatsappNumber.replace(/[\s+]/g, "")}`}
            className="flex items-center justify-center gap-2 rounded-2xl bg-green-500 px-6 py-3.5 text-white font-bold text-sm shadow-lg shadow-green-200 hover:bg-green-600 transition-all"
          >
            <span className="text-xl">💬</span> {config.whatsappNumber}
          </a>
          <a
            href={`tel:${config.callNumber}`}
            className="flex items-center justify-center gap-2 rounded-2xl bg-stone-900 px-6 py-3.5 text-white font-bold text-sm shadow-lg hover:bg-stone-800 transition-all"
          >
            <span className="text-xl">📞</span> {config.callNumber}
          </a>
        </div>

        <p className="text-center text-stone-400 text-xs mt-6">
          © {new Date().getFullYear()} {config.eventName}. All rights reserved.
        </p>
      </div>
    </div>
  );
}
