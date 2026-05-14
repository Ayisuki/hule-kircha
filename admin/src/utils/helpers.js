export const formatPrice = (amount) => {
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    minimumFractionDigits: 0
  }).format(amount).replace("ETB", "ብር");
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("am-ET", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
};

export const getStatusBadge = (status) => {
  const styles = {
    pending: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
    paid: "bg-green-500/20 text-green-500 border-green-500/30",
    processing: "bg-blue-500/20 text-blue-500 border-blue-500/30",
    shipped: "bg-purple-500/20 text-purple-500 border-purple-500/30",
    delivered: "bg-emerald-500/20 text-emerald-500 border-emerald-500/30",
    cancelled: "bg-red-500/20 text-red-500 border-red-500/30",
    refunded: "bg-gray-500/20 text-gray-500 border-gray-500/30"
  };
  return styles[status] || styles.pending;
};

export const getStatusLabel = (status) => {
  const labels = {
    pending: "Pending",
    paid: "Paid",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
    refunded: "Refunded"
  };
  return labels[status] || status;
};
