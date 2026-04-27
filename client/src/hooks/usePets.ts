import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
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
