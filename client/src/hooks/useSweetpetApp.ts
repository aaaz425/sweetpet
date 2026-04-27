import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder, exportOrder, getOrders, updateOrderStatus } from "../api/orders";
import { createPet, getPets } from "../api/pets";
import { createRecord, deleteRecord, getRecords } from "../api/records";
import { pagePaths } from "../constants";
import type { Order, OrderFormState, OrderStatus, Pet, PetFormState, RecordFormState, RecordItem } from "../types";

const queryKeys = {
  orders: ["orders"],
  pets: ["pets"],
  records: ["records"]
} as const;

export function useSweetpetApp() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [exportJson, setExportJson] = useState("");

  const petsQuery = useQuery({ queryKey: queryKeys.pets, queryFn: getPets });
  const recordsQuery = useQuery({ queryKey: queryKeys.records, queryFn: () => getRecords() });
  const ordersQuery = useQuery({ queryKey: queryKeys.orders, queryFn: getOrders });

  const pets = petsQuery.data ?? [];
  const records = recordsQuery.data ?? [];
  const orders = ordersQuery.data ?? [];

  const selectedPet = useMemo(() => pets.find((pet) => pet.id === selectedPetId), [pets, selectedPetId]);
  const selectedRecords = useMemo(
    () => records.filter((record) => !selectedPetId || record.petId === selectedPetId),
    [records, selectedPetId]
  );
  const selectedOrders = useMemo(
    () => orders.filter((order) => !selectedPetId || order.petId === selectedPetId),
    [orders, selectedPetId]
  );

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
    }
  });

  const deleteRecordMutation = useMutation({
    mutationFn: deleteRecord,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.records });
    }
  });

  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.orders });
      navigate(pagePaths["my-orders"]);
    }
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: ({ order, status }: { order: Order; status: OrderStatus }) => updateOrderStatus(order.orderUid ?? "", status),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.orders });
    }
  });

  async function handleCreatePet(form: PetFormState) {
    await createPetMutation.mutateAsync(form);
  }

  async function handleCreateRecord(form: RecordFormState) {
    if (!selectedPetId) return;

    await createRecordMutation.mutateAsync({ petId: selectedPetId, form });
  }

  async function handleDeleteRecord(id: number) {
    await deleteRecordMutation.mutateAsync(id);
  }

  async function handleCreateOrder(form: OrderFormState) {
    if (!selectedPetId) return;

    await createOrderMutation.mutateAsync({
      petId: selectedPetId,
      title: form.title,
      startDate: form.startDate,
      endDate: form.endDate
    });
  }

  async function handleUpdateOrderStatus(order: Order, status: OrderStatus) {
    if (!order.orderUid) return;

    await updateOrderStatusMutation.mutateAsync({ order, status });
  }

  async function handleExportOrder(order: Order) {
    if (!order.orderUid) return;

    const exportedOrder = await exportOrder(order.orderUid);
    setExportJson(JSON.stringify(exportedOrder, null, 2));
    navigate(pagePaths.export);
  }

  return {
    exportJson,
    orders,
    pets,
    records,
    selectedOrders,
    selectedPet,
    selectedPetId,
    selectedRecords,
    handleCreateOrder,
    handleCreatePet,
    handleCreateRecord,
    handleDeleteRecord,
    handleExportOrder,
    handleUpdateOrderStatus,
    setSelectedPetId
  };
}
