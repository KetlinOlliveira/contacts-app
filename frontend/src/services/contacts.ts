import axios from "axios";
import type { Contact, ContactFormData } from "../types/contact";

const api = axios.create({ baseURL: "/api" });

export const contactsService = {
  getAll: () => api.get<Contact[]>("/contacts").then((r) => r.data),
  getById: (id: string) => api.get<Contact>(`/contacts/${id}`).then((r) => r.data),
  create: (data: ContactFormData) => api.post<Contact>("/contacts", data).then((r) => r.data),
  update: (id: string, data: Partial<ContactFormData>) =>
    api.put<Contact>(`/contacts/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/contacts/${id}`).then((r) => r.data),
};
