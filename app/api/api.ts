import axios from "axios";

// Fallback to local Nest server if env is missing
const fallbackURL = "http://localhost:8000";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || fallbackURL,
  timeout: 10000,
  withCredentials: false,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized - Redirect to login");
    }
    return Promise.reject(error);
  }
);

// ── Types ──────────────────────────────────────────────────────────────────

export type AccompanyingPersonPayload = {
  fullName: string;
  aadhar: string;
  phone: string;
  gender: string;
};

export type RegistrationPayload = {
  fullName: string;
  mobile: string;
  email: string;
  organization: string;
  city: string;
  state: string;
  gender: string;
  registrationType: string;
  accompanyingPersonsCount: number;
  accompanyingPersons?: AccompanyingPersonPayload[];
  airportPickup: boolean;
  arrivalDate?: string;
  arrivalTime?: string;
  flightDetails?: string;
  dietary?: string;
  preTours?: string[];
  totalAmount?: number;
};

// ── API helpers ────────────────────────────────────────────────────────────

export const submitRegistration = (payload: RegistrationPayload) =>
  api.post("/registrations", payload);
