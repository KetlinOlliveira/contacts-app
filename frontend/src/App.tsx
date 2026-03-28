import { useState, useEffect, useCallback } from "react";
import { contactsService } from "./services/contacts";
import type { Contact, ContactFormData } from "./types/contact";

// ─── PALETTE ────────────────────────────────────────────────────────
// #f2eae0 warm cream, #b4d3d9 soft teal, #bda6ce lavender, #9b8ec7 violet

const EMPTY_FORM: ContactFormData = {
  name: "", email: "", phone: "", company: "", notes: "",
};

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

const AVATAR_COLORS = [
  "#bda6ce", "#b4d3d9", "#9b8ec7", "#c9b8d8", "#a8c8ce",
];
function avatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

// ─── ICONS ──────────────────────────────────────────────────────────
const IconPlus = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconEdit = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const IconTrash = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const IconX = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconMail = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const IconPhone = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.08 6.08l1.28-1.28a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const IconBriefcase = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    <line x1="12" y1="12" x2="12" y2="12"/>
  </svg>
);
const IconUsers = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

// ─── MODAL ───────────────────────────────────────────────────────────
function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center",
      animation: "fadeIn 0.18s ease",
    }}>
      <div onClick={onClose} style={{
        position: "absolute", inset: 0,
        background: "rgba(155,142,199,0.18)", backdropFilter: "blur(8px)",
      }}/>
      <div style={{
        position: "relative", zIndex: 1,
        background: "#f2eae0",
        borderRadius: "20px",
        padding: "36px",
        width: "min(520px, 92vw)",
        boxShadow: "0 32px 80px rgba(155,142,199,0.22), 0 2px 8px rgba(155,142,199,0.12)",
        animation: "slideUp 0.22s cubic-bezier(0.34,1.56,0.64,1)",
        border: "1px solid rgba(180,211,217,0.4)",
      }}>
        {children}
      </div>
    </div>
  );
}

// ─── CONTACT FORM ────────────────────────────────────────────────────
function ContactForm({
  initial, onSave, onCancel, loading,
}: {
  initial: ContactFormData;
  onSave: (data: ContactFormData) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [form, setForm] = useState<ContactFormData>(initial);

  const set = (key: keyof ContactFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const inputStyle: React.CSSProperties = {
    width: "100%", boxSizing: "border-box",
    background: "rgba(180,211,217,0.15)",
    border: "1.5px solid rgba(180,211,217,0.5)",
    borderRadius: "10px",
    padding: "10px 14px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "14px",
    color: "#4a4060",
    outline: "none",
    transition: "border-color 0.2s, background 0.2s",
  };

  return (
    <div>
      <h2 style={{
        fontFamily: "'DM Serif Display', serif",
        fontSize: "22px", fontWeight: 400,
        color: "#6a5a8e", marginBottom: "24px",
        letterSpacing: "-0.3px",
      }}>
        {initial.name ? "Edit contact" : "New contact"}
      </h2>

      <div style={{ display: "grid", gap: "12px" }}>
        {([
          ["name", "Full name *", "text"],
          ["email", "Email address *", "email"],
          ["phone", "Phone number *", "tel"],
          ["company", "Company", "text"],
        ] as [keyof ContactFormData, string, string][]).map(([key, label, type]) => (
          <div key={key}>
            <label style={{
              display: "block", fontSize: "11px", fontWeight: 500,
              color: "#9b8ec7", letterSpacing: "0.06em", textTransform: "uppercase",
              marginBottom: "5px", fontFamily: "'DM Sans', sans-serif",
            }}>{label}</label>
            <input
              type={type}
              value={form[key] ?? ""}
              onChange={set(key)}
              style={inputStyle}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#9b8ec7";
                e.currentTarget.style.background = "rgba(155,142,199,0.08)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(180,211,217,0.5)";
                e.currentTarget.style.background = "rgba(180,211,217,0.15)";
              }}
            />
          </div>
        ))}
        <div>
          <label style={{
            display: "block", fontSize: "11px", fontWeight: 500,
            color: "#9b8ec7", letterSpacing: "0.06em", textTransform: "uppercase",
            marginBottom: "5px", fontFamily: "'DM Sans', sans-serif",
          }}>Notes</label>
          <textarea
            rows={3}
            value={form.notes ?? ""}
            onChange={set("notes")}
            style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#9b8ec7";
              e.currentTarget.style.background = "rgba(155,142,199,0.08)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(180,211,217,0.5)";
              e.currentTarget.style.background = "rgba(180,211,217,0.15)";
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", marginTop: "24px", justifyContent: "flex-end" }}>
        <button onClick={onCancel} style={{
          padding: "10px 20px", borderRadius: "10px",
          border: "1.5px solid rgba(155,142,199,0.3)",
          background: "transparent", color: "#9b8ec7",
          fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 500,
          cursor: "pointer", transition: "all 0.15s",
        }}>
          Cancel
        </button>
        <button
          onClick={() => onSave(form)}
          disabled={loading || !form.name || !form.email || !form.phone}
          style={{
            padding: "10px 24px", borderRadius: "10px",
            border: "none",
            background: "linear-gradient(135deg, #9b8ec7, #bda6ce)",
            color: "#fff",
            fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 500,
            cursor: loading ? "wait" : "pointer",
            opacity: (!form.name || !form.email || !form.phone) ? 0.5 : 1,
            transition: "all 0.15s",
            boxShadow: "0 4px 16px rgba(155,142,199,0.3)",
          }}
        >
          {loading ? "Saving…" : "Save contact"}
        </button>
      </div>
    </div>
  );
}

// ─── CONTACT CARD ────────────────────────────────────────────────────
function ContactCard({
  contact, onEdit, onDelete,
}: {
  contact: Contact;
  onEdit: (c: Contact) => void;
  onDelete: (c: Contact) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const bg = avatarColor(contact.name);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#fff" : "rgba(242,234,224,0.7)",
        border: `1.5px solid ${hovered ? "rgba(155,142,199,0.3)" : "rgba(180,211,217,0.3)"}`,
        borderRadius: "16px",
        padding: "20px",
        display: "flex",
        alignItems: "flex-start",
        gap: "16px",
        transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
        transform: hovered ? "translateY(-2px)" : "none",
        boxShadow: hovered
          ? "0 12px 32px rgba(155,142,199,0.15)"
          : "0 2px 8px rgba(180,211,217,0.1)",
        cursor: "default",
        animation: "fadeInUp 0.3s ease both",
      }}
    >
      {/* Avatar */}
      <div style={{
        width: "46px", height: "46px", borderRadius: "14px",
        background: bg,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'DM Serif Display', serif",
        fontSize: "17px", color: "#fff", flexShrink: 0,
        letterSpacing: "0.02em",
      }}>
        {getInitials(contact.name)}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "16px", fontWeight: 400,
          color: "#4a4060", marginBottom: "4px",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {contact.name}
        </div>

        {contact.company && (
          <div style={{
            display: "flex", alignItems: "center", gap: "5px",
            fontSize: "11px", color: "#9b8ec7", marginBottom: "6px",
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            textTransform: "uppercase", letterSpacing: "0.05em",
          }}>
            <IconBriefcase />{contact.company}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12.5px", color: "#7a6e8e", fontFamily: "'DM Sans', sans-serif" }}>
            <IconMail />{contact.email}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12.5px", color: "#7a6e8e", fontFamily: "'DM Sans', sans-serif" }}>
            <IconPhone />{contact.phone}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{
        display: "flex", gap: "6px", flexShrink: 0,
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.15s",
      }}>
        <button
          onClick={() => onEdit(contact)}
          style={{
            width: "32px", height: "32px", borderRadius: "9px",
            border: "1.5px solid rgba(180,211,217,0.5)",
            background: "rgba(180,211,217,0.2)",
            color: "#7ab5bf",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#b4d3d9";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(180,211,217,0.2)";
            e.currentTarget.style.color = "#7ab5bf";
          }}
        >
          <IconEdit />
        </button>
        <button
          onClick={() => onDelete(contact)}
          style={{
            width: "32px", height: "32px", borderRadius: "9px",
            border: "1.5px solid rgba(189,166,206,0.4)",
            background: "rgba(189,166,206,0.15)",
            color: "#bda6ce",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#bda6ce";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(189,166,206,0.15)";
            e.currentTarget.style.color = "#bda6ce";
          }}
        >
          <IconTrash />
        </button>
      </div>
    </div>
  );
}

// ─── EMPTY STATE ──────────────────────────────────────────────────────
function EmptyState({ filtered }: { filtered: boolean }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "64px 24px", gap: "16px",
      animation: "fadeIn 0.4s ease",
    }}>
      <div style={{
        width: "80px", height: "80px", borderRadius: "24px",
        background: "rgba(180,211,217,0.2)",
        border: "1.5px dashed rgba(155,142,199,0.3)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#bda6ce",
      }}>
        <IconUsers />
      </div>
      <div style={{ textAlign: "center" }}>
        <p style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "18px", color: "#7a6e8e", marginBottom: "6px",
        }}>
          {filtered ? "No contacts found" : "No contacts yet"}
        </p>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "13px", color: "#b0a8c0",
        }}>
          {filtered ? "Try a different search term" : "Add your first contact to get started"}
        </p>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────
export default function App() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Contact | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await contactsService.getAll();
      setContacts(data);
      setError(null);
    } catch {
      setError("Could not connect to the API. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = contacts.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.company ?? "").toLowerCase().includes(q)
    );
  });

  const handleSave = async (form: ContactFormData) => {
    if (saving) return;
    setSaving(true);
    try {
      if (editTarget) {
        await contactsService.update(editTarget._id, form);
      } else {
        await contactsService.create(form);
      }
      await load();
      setModalOpen(false);
      setEditTarget(null);
    } catch (e: any) {
      alert(e?.response?.data?.message ?? "Error saving contact");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await contactsService.delete(deleteTarget._id);
      await load();
      setDeleteTarget(null);
    } catch {
      alert("Error deleting contact");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          background: #f2eae0;
          min-height: 100vh;
          font-family: 'DM Sans', sans-serif;
        }

        /* Subtle noise texture overlay */
        body::before {
          content: '';
          position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 0;
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.97); } to { opacity: 1; transform: none; } }

        input:focus, textarea:focus { outline: none; }
        button { outline: none; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(155,142,199,0.25); border-radius: 99px; }
      `}</style>

      {/* ── Layout ── */}
      <div style={{
        position: "relative", zIndex: 1,
        maxWidth: "860px", margin: "0 auto",
        padding: "48px 24px 80px",
      }}>

        {/* ── Header ── */}
        <div style={{
          display: "flex", alignItems: "flex-end",
          justifyContent: "space-between", marginBottom: "36px",
          flexWrap: "wrap", gap: "16px",
        }}>
          <div>
            <div style={{
              fontSize: "11px", fontWeight: 500, letterSpacing: "0.12em",
              textTransform: "uppercase", color: "#9b8ec7",
              fontFamily: "'DM Sans', sans-serif", marginBottom: "6px",
            }}>
              Address Book
            </div>
            <h1 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(32px, 5vw, 44px)",
              fontWeight: 400, color: "#4a4060",
              letterSpacing: "-0.5px", lineHeight: 1.1,
            }}>
              Your Contacts
            </h1>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px", color: "#9b94aa",
              marginTop: "6px",
            }}>
              {contacts.length} {contacts.length === 1 ? "person" : "people"} in your network
            </p>
          </div>

          <button
            onClick={() => { setEditTarget(null); setModalOpen(true); }}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "12px 22px", borderRadius: "12px",
              border: "none",
              background: "linear-gradient(135deg, #9b8ec7 0%, #bda6ce 100%)",
              color: "#fff",
              fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 500,
              cursor: "pointer", transition: "all 0.2s",
              boxShadow: "0 6px 20px rgba(155,142,199,0.35)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 10px 28px rgba(155,142,199,0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(155,142,199,0.35)";
            }}
          >
            <IconPlus /> Add contact
          </button>
        </div>

        {/* ── Decorative bar ── */}
        <div style={{
          height: "3px",
          background: "linear-gradient(90deg, #9b8ec7, #bda6ce 40%, #b4d3d9 70%, transparent)",
          borderRadius: "99px",
          marginBottom: "28px",
          opacity: 0.6,
        }}/>

        {/* ── Search ── */}
        <div style={{ position: "relative", marginBottom: "28px" }}>
          <div style={{
            position: "absolute", left: "14px", top: "50%",
            transform: "translateY(-50%)", color: "#bda6ce", pointerEvents: "none",
          }}>
            <IconSearch />
          </div>
          <input
            type="text"
            placeholder="Search by name, email or company…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px 12px 40px",
              background: "rgba(255,255,255,0.6)",
              border: "1.5px solid rgba(180,211,217,0.4)",
              borderRadius: "12px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px", color: "#4a4060",
              backdropFilter: "blur(8px)",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = "#9b8ec7"}
            onBlur={(e) => e.currentTarget.style.borderColor = "rgba(180,211,217,0.4)"}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                position: "absolute", right: "12px", top: "50%",
                transform: "translateY(-50%)",
                background: "none", border: "none",
                color: "#bda6ce", cursor: "pointer", display: "flex",
              }}
            >
              <IconX />
            </button>
          )}
        </div>

        {/* ── Error ── */}
        {error && (
          <div style={{
            padding: "14px 18px", borderRadius: "12px",
            background: "rgba(189,166,206,0.15)",
            border: "1.5px solid rgba(189,166,206,0.3)",
            color: "#8a6aaa", fontSize: "13px",
            fontFamily: "'DM Sans', sans-serif",
            marginBottom: "20px",
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* ── Contact Grid ── */}
        {loading ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "14px",
          }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{
                height: "106px", borderRadius: "16px",
                background: "rgba(180,211,217,0.15)",
                animation: `pulse 1.4s ${i * 0.15}s ease-in-out infinite alternate`,
              }}/>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState filtered={!!search} />
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "14px",
          }}>
            {filtered.map((c, i) => (
              <div key={c._id} style={{ animationDelay: `${i * 0.05}s` }}>
                <ContactCard
                  contact={c}
                  onEdit={(c) => { setEditTarget(c); setModalOpen(true); }}
                  onDelete={setDeleteTarget}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Add / Edit Modal ── */}
      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditTarget(null); }}>
        <button
          onClick={() => { setModalOpen(false); setEditTarget(null); }}
          style={{
            position: "absolute", top: "16px", right: "16px",
            width: "32px", height: "32px", borderRadius: "8px",
            border: "1.5px solid rgba(155,142,199,0.25)",
            background: "rgba(155,142,199,0.08)",
            color: "#9b8ec7",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <IconX />
        </button>
        <ContactForm
          initial={editTarget
            ? { name: editTarget.name, email: editTarget.email, phone: editTarget.phone, company: editTarget.company ?? "", notes: editTarget.notes ?? "" }
            : EMPTY_FORM
          }
          onSave={handleSave}
          onCancel={() => { setModalOpen(false); setEditTarget(null); }}
          loading={saving}
        />
      </Modal>

      {/* ── Delete Confirm ── */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <h2 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "20px", fontWeight: 400, color: "#6a5a8e",
          marginBottom: "10px",
        }}>
          Remove contact?
        </h2>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "14px", color: "#9b94aa", marginBottom: "24px",
          lineHeight: 1.6,
        }}>
          <strong style={{ color: "#4a4060" }}>{deleteTarget?.name}</strong> will be permanently removed from your contacts.
        </p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <button onClick={() => setDeleteTarget(null)} style={{
            padding: "10px 20px", borderRadius: "10px",
            border: "1.5px solid rgba(155,142,199,0.3)",
            background: "transparent", color: "#9b8ec7",
            fontFamily: "'DM Sans', sans-serif", fontSize: "14px", cursor: "pointer",
          }}>
            Cancel
          </button>
          <button onClick={handleDelete} style={{
            padding: "10px 22px", borderRadius: "10px",
            border: "none",
            background: "linear-gradient(135deg, #bda6ce, #9b8ec7)",
            color: "#fff",
            fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 500,
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(155,142,199,0.3)",
          }}>
            Remove
          </button>
        </div>
      </Modal>

      <style>{`
        @keyframes pulse {
          from { opacity: 0.5; }
          to { opacity: 0.9; }
        }
      `}</style>
    </>
  );
}
