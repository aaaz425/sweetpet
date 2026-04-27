import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder, getOrders, updateOrderStatus } from "../api/orders";
import { pagePaths } from "../constants";
import type { Order, OrderFormState, OrderStatus } from "../types";
import { queryKeys } from "./queryKeys";

type UseOrdersOptions = {
  selectedPetId: number | null;
};

export function useOrders({ selectedPetId }: UseOrdersOptions) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({ queryKey: queryKeys.orders, queryFn: getOrders });
  const orders = ordersQuery.data ?? [];
  const selectedOrders = useMemo(
    () => orders.filter((order) => !selectedPetId || order.petId === selectedPetId),
    [orders, selectedPetId]
  );

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

  return {
    orders,
    selectedOrders,
    handleCreateOrder,
    handleUpdateOrderStatus
  };
}
