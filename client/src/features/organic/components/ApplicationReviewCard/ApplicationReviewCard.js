import { useId, useState } from "react";
import { Avatar, Button, Textarea } from "@/shared/components/atoms";
import { useOpenDocument } from "../../hooks/useOrganic";

const STATUS_LABELS = { pending: "Bekliyor", approved: "Onaylandı", rejected: "Reddedildi" };

export function ApplicationReviewCard({ application, onReview, reviewing }) {
  const [note, setNote] = useState("");
  const [noteError, setNoteError] = useState(null);
  const openDocument = useOpenDocument();
  const headingId = useId();
  const applicant = application.user ?? {};
  const isPending = application.status === "pending";

  const reject = () => {
    if (!note.trim()) return setNoteError("Reddetme gerekçesi zorunludur");
    setNoteError(null);
    return onReview({ applicationId: application._id, decision: "rejected", note: note.trim() });
  };

  return (
    <article
      aria-labelledby={headingId}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5 space-y-4"
    >
      <header className="flex items-center gap-3">
        <Avatar user={applicant} />
        <div className="flex-1 min-w-0">
          <h3 id={headingId} className="font-semibold text-gray-800 dark:text-gray-100">
            {applicant.name} {applicant.surname}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {applicant.email}
            {applicant.province && ` · ${applicant.province}`}
          </p>
        </div>
        <span className="text-xs rounded-full bg-gray-100 dark:bg-gray-700 px-3 py-1 text-gray-700 dark:text-gray-200">
          {STATUS_LABELS[application.status]}
        </span>
      </header>

      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
        <span>{new Date(application.createdAt).toLocaleString("tr-TR")}</span>
        <button
          type="button"
          className="font-medium text-blue-700 dark:text-yellow-400 underline"
          disabled={openDocument.isPending}
          onClick={() => openDocument.mutate(application._id)}
        >
          Belgeyi aç ({application.originalName || "PDF"})
        </button>
      </div>

      {application.note && (
        <p className="text-sm text-gray-600 dark:text-gray-300">Not: {application.note}</p>
      )}

      {isPending && (
        <div className="space-y-3">
          <Textarea
            label="Not (reddederken zorunlu)"
            rows={2}
            value={note}
            error={noteError}
            onChange={(event) => setNote(event.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" disabled={reviewing} onClick={reject}>
              Reddet
            </Button>
            <Button
              type="button"
              variant="primary"
              loading={reviewing}
              onClick={() =>
                onReview({
                  applicationId: application._id,
                  decision: "approved",
                  note: note.trim() || undefined,
                })
              }
            >
              Onayla
            </Button>
          </div>
        </div>
      )}
    </article>
  );
}
