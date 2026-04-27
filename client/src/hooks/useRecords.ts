import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { toast } from "sonner";
import { createRecord, deleteRecord, getRecords } from "../api/records";
import type { RecordFormState } from "../types";
import { queryKeys } from "./queryKeys";

type UseRecordsOptions = {
  selectedPetId: number | null;
};

export function useRecords({ selectedPetId }: UseRecordsOptions) {
  const queryClient = useQueryClient();

  const recordsQuery = useQuery({ queryKey: queryKeys.records, queryFn: () => getRecords() });
  const records = recordsQuery.data ?? [];
  const selectedRecords = useMemo(
    () => records.filter((record) => !selectedPetId || record.petId === selectedPetId),
    [records, selectedPetId]
  );

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

  async function handleCreateRecord(form: RecordFormState) {
    if (!selectedPetId) return;

    await createRecordMutation.mutateAsync({ petId: selectedPetId, form });
  }

  async function handleDeleteRecord(id: number) {
    await deleteRecordMutation.mutateAsync(id);
  }

  return {
    records,
    selectedRecords,
    handleCreateRecord,
    handleDeleteRecord
  };
}
