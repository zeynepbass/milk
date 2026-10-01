import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/shared/api/apiClient";
import { queryKeys } from "@/shared/query/queryKeys";
import { filterInfiniteItems, pageParamsFromCursor } from "@/shared/query/infinite";
import { organicService } from "../services/organic.service";

export function useMyApplication() {
  return useQuery({ queryKey: queryKeys.organic.mine(), queryFn: () => organicService.getMine() });
}

export function useSubmitApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file) => organicService.submit(file),
    onSuccess: (result) => {
      queryClient.setQueryData(queryKeys.organic.mine(), result.application);
      toast.success(result.message);
    },
    onError: (error) => toast.error(getErrorMessage(error, "Başvuru gönderilemedi")),
  });
}

export function useApplications(status) {
  return useInfiniteQuery({
    queryKey: queryKeys.organic.list(status),
    queryFn: ({ pageParam }) => organicService.list({ status, cursor: pageParam }),
    ...pageParamsFromCursor,
  });
}

export function useReviewApplication(status) {
  const queryClient = useQueryClient();
  const listKey = queryKeys.organic.list(status);

  return useMutation({
    mutationFn: ({ applicationId, decision, note }) =>
      organicService.review(applicationId, { decision, note }),
    onSuccess: (result, { applicationId }) => {
      queryClient.setQueryData(listKey, (data) =>
        filterInfiniteItems(data, (application) => application._id !== applicationId)
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.organic.all });
      toast.success(result.application.status === "approved" ? "Başvuru onaylandı" : "Başvuru reddedildi");
    },
    onError: (error) => toast.error(getErrorMessage(error, "Başvuru güncellenemedi")),
  });
}

export function useOpenDocument() {
  return useMutation({
    mutationFn: (applicationId) => organicService.openDocument(applicationId),
    onError: (error) => toast.error(getErrorMessage(error, "Belge açılamadı")),
  });
}
