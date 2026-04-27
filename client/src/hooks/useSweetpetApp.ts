import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { FormEvent } from "react";
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

const initialPetForm: PetFormState = {
  name: "",
  species: "강아지",
  breed: "",
  birthday: "",
  memo: "",
  photo: null
};

const initialRecordForm: RecordFormState = {
  recordDate: "2026-04-27",
  weight: "",
  condition: "좋음",
  memo: "",
  tags: "",
  photo: null
};

const initialOrderForm: OrderFormState = {
  title: "몽이의 4월 앨범",
  startDate: "2026-04-01",
  endDate: "2026-04-30"
};

export function useSweetpetApp() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [petForm, setPetForm] = useState<PetFormState>(initialPetForm);
  const [recordForm, setRecordForm] = useState<RecordFormState>(initialRecordForm);
  const [orderForm, setOrderForm] = useState<OrderFormState>(initialOrderForm);
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
      setPetForm(initialPetForm);
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
      setRecordForm((form) => ({ ...form, memo: "", tags: "", photo: null }));
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

  async function handleCreatePet(event: FormEvent) {
    event.preventDefault();
    await createPetMutation.mutateAsync(petForm);
  }

  async function handleCreateRecord(event: FormEvent) {
    event.preventDefault();
    if (!selectedPetId) return;

    await createRecordMutation.mutateAsync({ petId: selectedPetId, form: recordForm });
  }

  async function handleDeleteRecord(id: number) {
    await deleteRecordMutation.mutateAsync(id);
  }

  async function handleCreateOrder(event: FormEvent) {
    event.preventDefault();
    if (!selectedPetId) return;

    await createOrderMutation.mutateAsync({
      petId: selectedPetId,
      title: orderForm.title,
      startDate: orderForm.startDate,
      endDate: orderForm.endDate
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
    orderForm,
    orders,
    petForm,
    pets,
    recordForm,
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
    setOrderForm,
    setPetForm,
    setRecordForm,
    setSelectedPetId
  };
}
