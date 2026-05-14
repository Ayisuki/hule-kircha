export const formatPrice = (amount) => {
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
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

export const getStatusColor = (status) => {
  const colors = {
    pending: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
    paid: "bg-green-500/20 text-green-500 border-green-500/30",
    processing: "bg-blue-500/20 text-blue-500 border-blue-500/30",
    shipped: "bg-purple-500/20 text-purple-500 border-purple-500/30",
    delivered: "bg-emerald-500/20 text-emerald-500 border-emerald-500/30",
    cancelled: "bg-red-500/20 text-red-500 border-red-500/30",
    refunded: "bg-gray-500/20 text-gray-500 border-gray-500/30"
  };
  return colors[status] || colors.pending;
};

export const getStatusLabel = (status) => {
  const labels = {
    pending: "በመጠባበቅ ላይ",
    paid: "ከፍለዋል",
    processing: "በሂደት ላይ",
    shipped: "ተልኳል",
    delivered: "ደርሷል",
    cancelled: "ተሰርዟል",
    refunded: "ተመላሽ ተደርጓል"
  };
  return labels[status] || status;
};

export const getCategoryIcon = (category) => {
  const icons = {
    "የበሬ ቅርጫ": "🐂",
    "በግ": "🐑",
    "ፍየል": "🐐",
    "ቋንጣ": "🍖"
  };
  return icons[category] || "📦";
};

export const getCategoryColor = (category) => {
  const colors = {
    "የበሬ ቅርጫ": "from-amber-900/40 to-amber-950/40 border-amber-700/30",
    "በግ": "from-emerald-900/40 to-emerald-950/40 border-emerald-700/30",
    "ፍየል": "from-orange-900/40 to-orange-950/40 border-orange-700/30",
    "ቋንጣ": "from-rose-900/40 to-rose-950/40 border-rose-700/30"
  };
  return colors[category] || "from-gray-900/40 to-gray-950/40 border-gray-700/30";
};

export const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
