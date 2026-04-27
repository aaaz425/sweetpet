import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { createPet, getPets } from "../api/pets";
import type { PetFormState } from "../types";
import { queryKeys } from "./queryKeys";

export function usePets() {
  const queryClient = useQueryClient();
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);

  const petsQuery = useQuery({ queryKey: queryKeys.pets, queryFn: getPets });
  const pets = petsQuery.data ?? [];
  const selectedPet = useMemo(() => pets.find((pet) => pet.id === selectedPetId), [pets, selectedPetId]);

  useEffect(() => {
    setSelectedPetId((current) => current ?? pets[0]?.id ?? null);
  }, [pets]);

  const createPetMutation = useMutation({
    mutationFn: createPet,
    onSuccess: async (pet) => {
      setSelectedPetId(pet.id);
      await queryClient.invalidateQueries({ queryKey: queryKeys.pets });
      toast.success("마이펫이 등록되었습니다.");
    },
    onError: () => {
      toast.error("마이펫 등록 중 문제가 발생했습니다.");
    }
  });

  async function handleCreatePet(form: PetFormState) {
    await createPetMutation.mutateAsync(form);
  }

  return {
    pets,
    selectedPet,
    selectedPetId,
    handleCreatePet,
    setSelectedPetId
  };
}
