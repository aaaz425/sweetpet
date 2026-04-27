import type { FormEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createOrder, exportOrder, getOrders, updateOrderStatus } from "../api/orders";
import { createPet, getPets } from "../api/pets";
import { createRecord, deleteRecord, getRecords } from "../api/records";
import type { Order, OrderFormState, OrderStatus, Page, Pet, PetFormState, RecordFormState, RecordItem } from "../types";

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
  const [activePage, setActivePage] = useState<Page>("records");
  const [pets, setPets] = useState<Pet[]>([]);
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [petForm, setPetForm] = useState<PetFormState>(initialPetForm);
  const [recordForm, setRecordForm] = useState<RecordFormState>(initialRecordForm);
  const [orderForm, setOrderForm] = useState<OrderFormState>(initialOrderForm);
  const [exportJson, setExportJson] = useState("");

  const selectedPet = useMemo(() => pets.find((pet) => pet.id === selectedPetId), [pets, selectedPetId]);
  const selectedRecords = useMemo(
    () => records.filter((record) => !selectedPetId || record.petId === selectedPetId),
    [records, selectedPetId]
  );
  const selectedOrders = useMemo(
    () => orders.filter((order) => !selectedPetId || order.petId === selectedPetId),
    [orders, selectedPetId]
  );

  const loadAll = useCallback(async () => {
    const [nextPets, nextRecords, nextOrders] = await Promise.all([getPets(), getRecords(), getOrders()]);
    setPets(nextPets);
    setRecords(nextRecords);
    setOrders(nextOrders);
    setSelectedPetId((current) => current ?? nextPets[0]?.id ?? null);
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  async function handleCreatePet(event: FormEvent) {
    event.preventDefault();

    const pet = await createPet(petForm);
    setPetForm(initialPetForm);
    setSelectedPetId(pet.id);
    await loadAll();
  }

  async function handleCreateRecord(event: FormEvent) {
    event.preventDefault();
    if (!selectedPetId) return;

    await createRecord(selectedPetId, {
      recordDate: recordForm.recordDate,
      weight: recordForm.weight ? Number(recordForm.weight) : null,
      condition: recordForm.condition,
      memo: recordForm.memo,
      tags: recordForm.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      photo: recordForm.photo
    });
    setRecordForm((form) => ({ ...form, memo: "", tags: "", photo: null }));
    await loadAll();
  }

  async function handleDeleteRecord(id: number) {
    await deleteRecord(id);
    await loadAll();
  }

  async function handleCreateOrder(event: FormEvent) {
    event.preventDefault();
    if (!selectedPetId) return;

    await createOrder({
      petId: selectedPetId,
      title: orderForm.title,
      startDate: orderForm.startDate,
      endDate: orderForm.endDate
    });
    setActivePage("my-orders");
    await loadAll();
  }

  async function handleUpdateOrderStatus(order: Order, status: OrderStatus) {
    if (!order.orderUid) return;

    await updateOrderStatus(order.orderUid, status);
    await loadAll();
  }

  async function handleExportOrder(order: Order) {
    if (!order.orderUid) return;

    const exportedOrder = await exportOrder(order.orderUid);
    setExportJson(JSON.stringify(exportedOrder, null, 2));
    setActivePage("export");
  }

  return {
    activePage,
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
    setActivePage,
    setOrderForm,
    setPetForm,
    setRecordForm,
    setSelectedPetId
  };
}
