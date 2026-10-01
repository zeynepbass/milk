import { useState } from "react";
import { EmptyState, LoadMore, QueryState } from "@/shared/components/molecules";
import { flattenPages } from "@/shared/query/infinite";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useApplications, useReviewApplication } from "../../hooks/useOrganic";
import { ApplicationReviewCard } from "../ApplicationReviewCard";

const FILTERS = [
  { value: "pending", label: "Bekleyenler" },
  { value: "approved", label: "Onaylananlar" },
  { value: "rejected", label: "Reddedilenler" },
];

function ApplicationList({ status }) {
  const query = useApplications(status);
  const review = useReviewApplication(status);
  const applications = flattenPages(query.data);

  return (
    <QueryState
      query={query}
      isEmpty={applications.length === 0}
      empty={<EmptyState title="Başvuru yok" description="Bu durumda bekleyen bir başvuru bulunmuyor." />}
    >
      <div className="grid gap-4 md:grid-cols-2">
        {applications.map((application) => (
          <ApplicationReviewCard
            key={application._id}
            application={application}
            reviewing={review.isPending && review.variables?.applicationId === application._id}
            onReview={(input) => review.mutate(input)}
          />
        ))}
      </div>
      <LoadMore query={query} />
    </QueryState>
  );
}

export function AdminApplications() {
  const [status, setStatus] = useState("pending");
  const { data: me, isPending } = useCurrentUser();

  if (isPending) return null;

  if (me?.role !== "admin") {
    return <EmptyState title="Erişim yok" description="Bu sayfayı yalnızca yöneticiler görüntüleyebilir." />;
  }

  return (
    <section aria-labelledby="admin-title" className="p-4 space-y-4">
      <h1 id="admin-title" className="text-xl font-semibold text-gray-800 dark:text-gray-100">
        Organik sertifika başvuruları
      </h1>

      <div role="group" aria-label="Durum filtresi" className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            aria-pressed={status === filter.value}
            onClick={() => setStatus(filter.value)}
            className={`rounded-full px-4 py-2 text-sm ${
              status === filter.value
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <ApplicationList key={status} status={status} />
    </section>
  );
}
