import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, X, Save, Search } from "lucide-react";
import { AdminNavbar } from "../components/AdminNavbar.jsx";
import { adminProductAPI } from "../utils/api.js";
import { formatPrice } from "../utils/helpers.js";

export const ProductsPage = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "የበሬ ቅርጫ",
    subCategory: "",
    price: "",
    deliveryFee: "",
    stock: "",
    minOrderQty: 1,
    maxOrderQty: 100,
    isAvailable: true,
    featured: false
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: async () => {
      const res = await adminProductAPI.getAll();
      return res.data.data.products;
    }
  });

  const createMutation = useMutation({
    mutationFn: adminProductAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      closeModal();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminProductAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      closeModal();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: adminProductAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    }
  });

  const filteredProducts = products?.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        category: product.category,
        subCategory: product.subCategory || "",
        price: product.price,
        deliveryFee: product.deliveryFee,
        stock: product.stock,
        minOrderQty: product.minOrderQty,
        maxOrderQty: product.maxOrderQty,
        isAvailable: product.isAvailable,
        featured: product.featured
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        description: "",
        category: "የበሬ ቅርጫ",
        subCategory: "",
        price: "",
        deliveryFee: "",
        stock: "",
        minOrderQty: 1,
        maxOrderQty: 100,
        isAvailable: true,
        featured: false
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      price: Number(formData.price),
      deliveryFee: Number(formData.deliveryFee),
      stock: Number(formData.stock),
      minOrderQty: Number(formData.minOrderQty),
      maxOrderQty: Number(formData.maxOrderQty)
    };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary lg:pl-64">
      <AdminNavbar />

      <main className="p-4 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-text-primary">Products</h1>
          <button
            onClick={() => openModal()}
            className="admin-btn admin-btn-primary flex items-center gap-2 w-fit"
          >
            <Plus size={18} /> Add Product
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="admin-input pl-11"
          />
        </div>

        {/* Products Table */}
        <div className="admin-card overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-text-muted text-sm font-medium py-3 px-2">Name</th>
                  <th className="text-left text-text-muted text-sm font-medium py-3 px-2">Category</th>
                  <th className="text-left text-text-muted text-sm font-medium py-3 px-2">Price</th>
                  <th className="text-left text-text-muted text-sm font-medium py-3 px-2">Stock</th>
                  <th className="text-left text-text-muted text-sm font-medium py-3 px-2">Status</th>
                  <th className="text-left text-text-muted text-sm font-medium py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts?.map((product) => (
                  <tr key={product._id} className="border-b border-border/50 hover:bg-bg-elevated/50">
                    <td className="py-3 px-2">
                      <div>
                        <p className="text-sm font-medium text-text-primary">{product.name}</p>
                        {product.featured && (
                          <span className="text-xs text-gold">⭐ Featured</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-sm text-text-secondary">{product.category}</td>
                    <td className="py-3 px-2 text-sm text-gold font-semibold">{formatPrice(product.price)}</td>
                    <td className="py-3 px-2 text-sm text-text-secondary">{product.stock}</td>
                    <td className="py-3 px-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        product.isAvailable && product.stock > 0
                          ? "bg-green-500/20 text-green-500"
                          : "bg-red-500/20 text-red-500"
                      }`}>
                        {product.isAvailable && product.stock > 0 ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openModal(product)}
                          className="p-2 rounded-lg hover:bg-gold/10 text-gold transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Product Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-bg-secondary rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto border border-border"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-text-primary">
                  {editingProduct ? "Edit Product" : "Add Product"}
                </h2>
                <button onClick={closeModal} className="p-2 rounded-lg hover:bg-bg-elevated">
                  <X size={20} className="text-text-secondary" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-text-secondary mb-1 block">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="admin-input"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-text-secondary mb-1 block">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="admin-input min-h-[80px] resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-text-secondary mb-1 block">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="admin-input"
                    >
                      <option value="የበሬ ቅርጫ">የበሬ ቅርጫ</option>
                      <option value="በግ">በግ</option>
                      <option value="ፍየል">ፍየል</option>
                      <option value="ቋንጣ">ቋንጣ</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-text-secondary mb-1 block">Sub Category</label>
                    <select
                      value={formData.subCategory}
                      onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                      className="admin-input"
                    >
                      <option value="">None</option>
                      <option value="full">Full</option>
                      <option value="half">Half</option>
                      <option value="quarter">Quarter</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-text-secondary mb-1 block">Price (ETB)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="admin-input"
                      required
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-text-secondary mb-1 block">Delivery Fee</label>
                    <input
                      type="number"
                      value={formData.deliveryFee}
                      onChange={(e) => setFormData({ ...formData, deliveryFee: e.target.value })}
                      className="admin-input"
                      required
                      min="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-text-secondary mb-1 block">Stock</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="admin-input"
                      required
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-text-secondary mb-1 block">Min Qty</label>
                    <input
                      type="number"
                      value={formData.minOrderQty}
                      onChange={(e) => setFormData({ ...formData, minOrderQty: e.target.value })}
                      className="admin-input"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-text-secondary mb-1 block">Max Qty</label>
                    <input
                      type="number"
                      value={formData.maxOrderQty}
                      onChange={(e) => setFormData({ ...formData, maxOrderQty: e.target.value })}
                      className="admin-input"
                      min="1"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isAvailable}
                      onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                      className="w-4 h-4 accent-gold"
                    />
                    <span className="text-sm text-text-secondary">Available</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 accent-gold"
                    />
                    <span className="text-sm text-text-secondary">Featured</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 admin-btn admin-btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="flex-1 admin-btn admin-btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {(createMutation.isPending || updateMutation.isPending) ? (
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <><Save size={16} /> Save</>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
