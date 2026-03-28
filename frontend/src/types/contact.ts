export interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ContactFormData = Omit<Contact, "_id" | "createdAt" | "updatedAt">;
