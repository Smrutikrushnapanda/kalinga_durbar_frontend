import axios from "axios";

// Use Next.js same-origin API proxy to avoid browser CORS/network issues.
const baseURL = "/api";

export const api = axios.create({
  baseURL,
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
  gender?: string;
  relation: string;
};

export type RegistrationPayload = {
  fullName: string;
  mobile: string;
  email: string;
  aadhar: string;
  organization?: string;
  clubNumber: string;
  areaNumber: string;
  city: string;
  state: string;
  gender?: string;
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

export const fetchRegistrations = () => api.get("/registrations");

export const fetchRegistrationById = (id: string) =>
  api.get(`/registrations/${id}`);
