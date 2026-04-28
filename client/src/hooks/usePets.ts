import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createPet, deletePet, getPets } from "../api/pets";
import type { PetFormState } from "../types";
import { queryKeys } from "./queryKeys";

export function usePets() {
  const queryClient = useQueryClient();

  const petsQuery = useQuery({ queryKey: queryKeys.pets, queryFn: getPets });
  const pets = petsQuery.data ?? [];

  const createPetMutation = useMutation({
    mutationFn: createPet,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.pets });
      toast.success("마이펫이 등록되었습니다.");
    },
    onError: () => {
      toast.error("마이펫 등록 중 문제가 발생했습니다.");
    }
  });

  const deletePetMutation = useMutation({
    mutationFn: deletePet,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.pets }),
        queryClient.invalidateQueries({ queryKey: queryKeys.records }),
        queryClient.invalidateQueries({ queryKey: queryKeys.orders })
      ]);
      toast.success("마이펫이 삭제되었습니다.");
    },
    onError: () => {
      toast.error("마이펫 삭제 중 문제가 발생했습니다.");
    }
  });

  async function handleCreatePet(form: PetFormState) {
    await createPetMutation.mutateAsync(form);
  }

  async function handleDeletePet(id: number) {
    await deletePetMutation.mutateAsync(id);
  }

  return {
    pets,
    handleCreatePet,
    handleDeletePet
  };
}
