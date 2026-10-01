import { CheckBadgeIcon, ClockIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useOpenDocument } from "../../hooks/useOrganic";

const STATUS_VIEW = {
  pending: {
    icon: ClockIcon,
    title: "Başvurun inceleniyor",
    description: "Belgen yönetici tarafından incelendiğinde bildirim alacaksın.",
    className: "border-yellow-300 bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200",
  },
  approved: {
    icon: CheckBadgeIcon,
    title: "Doğrulanmış satıcısın",
    description: "Organik sertifikan onaylandı; gönderilerinde doğrulanmış satıcı rozeti görünür.",
    className: "border-green-300 bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-200",
  },
  rejected: {
    icon: XCircleIcon,
    title: "Başvurun reddedildi",
    description: "Gerekçeyi inceleyip yeni bir belgeyle tekrar başvurabilirsin.",
    className: "border-red-300 bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-200",
  },
};

const formatDate = (value) => (value ? new Date(value).toLocaleDateString("tr-TR") : "");

export function ApplicationStatus({ application }) {
  const openDocument = useOpenDocument();
  const view = STATUS_VIEW[application.status];
  const Icon = view.icon;

  return (
    <div role="status" className={`flex gap-3 rounded-xl border p-4 ${view.className}`}>
      <Icon className="w-6 h-6 shrink-0" aria-hidden="true" />
      <div className="space-y-1 text-sm">
        <p className="font-semibold">{view.title}</p>
        <p>{view.description}</p>
        {application.note && (
          <p>
            <span className="font-medium">Yönetici notu:</span> {application.note}
          </p>
        )}
        <p className="text-xs opacity-80">
          Başvuru tarihi {formatDate(application.createdAt)}
          {application.reviewedAt && ` · İnceleme ${formatDate(application.reviewedAt)}`}
        </p>
        <button
          type="button"
          className="text-xs font-medium underline"
          disabled={openDocument.isPending}
          onClick={() => openDocument.mutate(application._id)}
        >
          Yüklediğin belgeyi görüntüle
        </button>
      </div>
    </div>
  );
}
