import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createOrder, getOrders, updateOrderStatus } from "../api/orders";
import { pagePaths } from "../constants";
import type { Order, OrderFormState, OrderStatus } from "../types";
import { queryKeys } from "./queryKeys";

export function useOrders() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({ queryKey: queryKeys.orders, queryFn: getOrders });
  const orders = ordersQuery.data ?? [];

  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.orders });
      toast.success("주문이 생성되었습니다.");
      navigate(pagePaths["my-orders"]);
    },
    onError: () => {
      toast.error("주문 생성 중 문제가 발생했습니다.");
    }
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: ({ order, status }: { order: Order; status: OrderStatus }) => updateOrderStatus(order.orderUid ?? "", status),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.orders });
      toast.success("주문 상태가 변경되었습니다.");
    },
    onError: () => {
      toast.error("주문 상태 변경 중 문제가 발생했습니다.");
    }
  });

  async function handleCreateOrder(petId: number, form: OrderFormState) {
    await createOrderMutation.mutateAsync({
      petId,
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
    handleCreateOrder,
    handleUpdateOrderStatus
  };
}
