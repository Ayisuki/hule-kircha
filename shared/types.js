// Shared TypeScript-style types (JSDoc comments for documentation)

/**
 * @typedef {Object} User
 * @property {string} _id
 * @property {string} name
 * @property {string} phone
 * @property {string} [telebirrId]
 * @property {string} [profileImage]
 * @property {'dark'|'light'} preferredTheme
 * @property {boolean} isAdmin
 * @property {boolean} isActive
 * @property {Date} createdAt
 * @property {Date} [lastLogin]
 */

/**
 * @typedef {Object} Product
 * @property {string} _id
 * @property {string} name
 * @property {string} description
 * @property {'የበሬ ቅርጫ'|'በግ'|'ፍየል'|'ቋንጣ'} category
 * @property {'full'|'half'|'quarter'|null} [subCategory]
 * @property {string} [image]
 * @property {number} price
 * @property {number} deliveryFee
 * @property {number} stock
 * @property {boolean} isAvailable
 * @property {number} minOrderQty
 * @property {number} maxOrderQty
 * @property {boolean} featured
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} OrderItem
 * @property {string} productId
 * @property {string} name
 * @property {string} category
 * @property {number} quantity
 * @property {number} unitPrice
 * @property {number} deliveryFee
 * @property {number} totalPrice
 */

/**
 * @typedef {Object} Order
 * @property {string} _id
 * @property {string} userId
 * @property {OrderItem[]} items
 * @property {number} subtotal
 * @property {number} totalDeliveryFee
 * @property {number} finalAmount
 * @property {string} [paymentRef]
 * @property {string} [telebirrTransactionId]
 * @property {'pending'|'paid'|'processing'|'shipped'|'delivered'|'cancelled'|'refunded'} status
 * @property {'pending'|'completed'|'failed'|'timeout'} paymentStatus
 * @property {string} [deliveryAddress]
 * @property {string} [deliveryPhone]
 * @property {string} [notes]
 * @property {Date} [paidAt]
 * @property {Date} [deliveredAt]
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success
 * @property {string} [message]
 * @property {Object} [data]
 */

export {};
