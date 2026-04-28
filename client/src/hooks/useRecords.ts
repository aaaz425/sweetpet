import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createRecord, deleteRecord, getRecords } from "../api/records";
import type { RecordFormState } from "../types";
import { queryKeys } from "./queryKeys";

export function useRecords() {
  const queryClient = useQueryClient();

  const recordsQuery = useQuery({ queryKey: queryKeys.records, queryFn: () => getRecords() });
  const records = recordsQuery.data ?? [];

  const createRecordMutation = useMutation({
    mutationFn: ({ petId, form }: { petId: number; form: RecordFormState }) =>
      createRecord(petId, {
        recordDate: form.recordDate,
        weight: form.weight ? Number(form.weight) : null,
        condition: form.condition,
        memo: form.memo,
        tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        photo: form.photo
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.records });
      toast.success("일상기록이 추가되었습니다.");
    },
    onError: () => {
      toast.error("일상기록 추가 중 문제가 발생했습니다.");
    }
  });

  const deleteRecordMutation = useMutation({
    mutationFn: deleteRecord,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.records });
      toast.success("일상기록이 삭제되었습니다.");
    },
    onError: () => {
      toast.error("일상기록 삭제 중 문제가 발생했습니다.");
    }
  });

  async function handleCreateRecord(petId: number, form: RecordFormState) {
    await createRecordMutation.mutateAsync({ petId, form });
  }

  async function handleDeleteRecord(id: number) {
    await deleteRecordMutation.mutateAsync(id);
  }

  return {
    records,
    handleCreateRecord,
    handleDeleteRecord
  };
}
