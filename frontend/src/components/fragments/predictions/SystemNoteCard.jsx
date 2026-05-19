import { DEFAULT_SYSTEM_NOTE } from "./predictionDisplay";

function normalizeNoteItems(note) {
  if (Array.isArray(note)) {
    return note
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        if (item && typeof item === "object") {
          return (
            item.note ||
            item.description ||
            item.message ||
            item.text ||
            Object.values(item).filter(Boolean).join(" ")
          );
        }

        return "";
      })
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (typeof note === "string") {
    return note.trim() ? [note.trim()] : [];
  }

  if (note && typeof note === "object") {
    const text =
      note.note ||
      note.description ||
      note.message ||
      note.text ||
      Object.values(note).filter(Boolean).join(" ");

    return text ? [String(text).trim()] : [];
  }

  return [];
}

export default function SystemNoteCard({ note }) {
  const noteItems = normalizeNoteItems(note);
  const visibleNoteItems = noteItems.length ? noteItems : [DEFAULT_SYSTEM_NOTE];
  const hasDefaultNote = visibleNoteItems.some(
    (item) =>
      typeof item === "string" &&
      item.toLowerCase().includes("informasi awal")
  );

  return (
    <section className="rounded-lg border border-amber-200 bg-amber-50 p-4">
      <h3 className="text-sm font-semibold text-amber-900">Catatan Sistem</h3>
      {visibleNoteItems.length > 1 ? (
        <ul className="mt-2 space-y-2 text-sm leading-6 text-amber-900/85">
          {visibleNoteItems.map((item, index) => (
            <li key={`${item}-${index}`} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-700" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm leading-6 text-amber-900/85">
          {visibleNoteItems[0]}
        </p>
      )}
      {!hasDefaultNote ? (
        <p className="mt-2 text-sm leading-6 text-amber-900/85">
          {DEFAULT_SYSTEM_NOTE}
        </p>
      ) : null}
    </section>
  );
}
