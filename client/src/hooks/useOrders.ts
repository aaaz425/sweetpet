import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createOrder, getOrders, updateOrder, updateOrderStatus } from "../api/orders";
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
      navigate(pagePaths.albums);
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

  const updateOrdersStatusMutation = useMutation({
    mutationFn: ({ orders, status }: { orders: Order[]; status: OrderStatus }) =>
      Promise.all(orders.filter((order) => order.orderUid).map((order) => updateOrderStatus(order.orderUid ?? "", status))),
    onSuccess: async (_updatedOrders, variables) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.orders });
      toast.success(`${variables.orders.length}건의 주문 상태가 변경되었습니다.`);
    },
    onError: () => {
      toast.error("주문 상태 일괄 변경 중 문제가 발생했습니다.");
    }
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ order, form }: { order: Order; form: OrderFormState }) =>
      updateOrder(order.orderUid ?? "", {
        petId: order.petId,
        title: form.title,
        startDate: form.startDate,
        endDate: form.endDate,
        printOptions: form.printOptions
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.orders });
      toast.success("주문이 수정되었습니다.");
    },
    onError: () => {
      toast.error("주문 수정 중 문제가 발생했습니다.");
    }
  });

  async function handleCreateOrder(petId: number, form: OrderFormState) {
    await createOrderMutation.mutateAsync({
      petId,
      title: form.title,
      startDate: form.startDate,
      endDate: form.endDate,
      printOptions: form.printOptions
    });
  }

  async function handleUpdateOrderStatus(order: Order, status: OrderStatus) {
    if (!order.orderUid) return;

    await updateOrderStatusMutation.mutateAsync({ order, status });
  }

  async function handleUpdateOrdersStatus(orders: Order[], status: OrderStatus) {
    const updatableOrders = orders.filter((order) => order.orderUid);
    if (updatableOrders.length === 0) return;

    await updateOrdersStatusMutation.mutateAsync({ orders: updatableOrders, status });
  }

  async function handleUpdateOrder(order: Order, form: OrderFormState) {
    if (!order.orderUid) return;

    await updateOrderMutation.mutateAsync({ order, form });
  }

  return {
    orders,
    handleCreateOrder,
    handleUpdateOrder,
    handleUpdateOrdersStatus,
    handleUpdateOrderStatus
  };
}
