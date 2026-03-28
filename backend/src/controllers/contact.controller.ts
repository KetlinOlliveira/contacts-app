import { Request, Response } from "express";
import { Contact } from "../models/contact.model";

// GET /api/contacts
export const getContacts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching contacts", error });
  }
};

// GET /api/contacts/:id
export const getContactById = async (req: Request, res: Response): Promise<void> => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      res.status(404).json({ message: "Contact not found" });
      return;
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: "Error fetching contact", error });
  }
};

// POST /api/contacts
export const createContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const contact = new Contact(req.body);
    const saved = await contact.save();
    res.status(201).json(saved);
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }
    res.status(400).json({ message: "Error creating contact", error: error.message });
  }
};

// PUT /api/contacts/:id
export const updateContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!contact) {
      res.status(404).json({ message: "Contact not found" });
      return;
    }
    res.json(contact);
  } catch (error: any) {
    res.status(400).json({ message: "Error updating contact", error: error.message });
  }
};

// DELETE /api/contacts/:id
export const deleteContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      res.status(404).json({ message: "Contact not found" });
      return;
    }
    res.json({ message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting contact", error });
  }
};
