export const ORDER_STATUSES = [
  "order_placed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export const ORDER_STATUS_LABELS = {
  order_placed: "Order Placed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  pending: "Order Placed",
  confirmed: "Order Placed",
};

export function formatOrderStatus(status) {
  return ORDER_STATUS_LABELS[status] || status || "—";
}
