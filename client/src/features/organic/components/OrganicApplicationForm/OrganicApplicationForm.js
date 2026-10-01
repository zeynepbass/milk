import { useState } from "react";
import { ArrowRightIcon, DocumentIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button, Heading, Loading } from "@/shared/components/atoms";
import { validateDocument } from "../../services/organic.service";
import { useMyApplication, useSubmitApplication } from "../../hooks/useOrganic";
import { ApplicationStatus } from "../ApplicationStatus";

const CARD = "p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border dark:border-gray-700 space-y-6";

export function OrganicApplicationForm({ canApply }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const application = useMyApplication();
  const submit = useSubmitApplication();
  const latest = application.data;
  const canSubmit = canApply && latest?.status !== "pending" && latest?.status !== "approved";

  const handleFile = (event) => {
    const selected = event.target.files?.[0] ?? null;
    event.target.value = "";
    setError(validateDocument(selected));
    setFile(selected);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const problem = validateDocument(file);
    if (problem) return setError(problem);

    return submit.mutate(file, { onSuccess: () => setFile(null) });
  };

  return (
    <section className={CARD} aria-label="Organik sertifika">
      <Heading
        title="Organik Sertifika"
        desc="Doğrulanmış satıcı rozeti için organik ürün sertifikanı PDF olarak yükle. Belgen yalnızca yöneticiler tarafından görülür."
      />

      {application.isPending && <Loading label="Başvuru durumu yükleniyor..." />}
      {latest && <ApplicationStatus application={latest} />}
      {!canApply && (
        <p className="text-sm text-gray-600 dark:text-gray-300">Başvuru yalnızca satıcı hesapları içindir.</p>
      )}

      {canSubmit && (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer hover:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFile}
              className="sr-only"
              aria-describedby={error ? "organic-document-error" : undefined}
            />
            <DocumentIcon className="w-10 h-10 text-gray-500 mb-2" aria-hidden="true" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              PDF belgeni seçmek için tıkla (en fazla 10 MB)
            </span>
          </label>

          {error && (
            <p id="organic-document-error" role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          {file && (
            <div className="flex items-center justify-between border rounded-lg px-4 py-2 bg-gray-50 dark:bg-gray-900">
              <span className="text-sm text-gray-700 dark:text-gray-200 truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => setFile(null)}
                aria-label="Seçilen belgeyi kaldır"
                className="p-1 text-gray-500 hover:text-red-500"
              >
                <XMarkIcon className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              disabled={!file || Boolean(error)}
              loading={submit.isPending}
              loadingText="Gönderiliyor..."
              icon={ArrowRightIcon}
              text="Başvur"
            />
          </div>
        </form>
      )}
    </section>
  );
}
