/**
 * ProductsList — seller product table with stock toggle, edit, delete.
 * Route: /seller/products
 */
import { useEffect, useState } from "react";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { Card, Badge, Button, SectionHeader, EmptyState } from "../../components/ui";
import { Package } from "lucide-react";
import toast from "react-hot-toast";

const ProductsList = () => {
  const { products, currency, fetchProducts, axios, navigate } = useAppContext();
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (productId) => {
    try {
      const { data } = await axios.delete("/api/products/delete", {
        data: { id: productId },
      });
      if (data.message === "Product deleted successfully") {
        toast.success("Product deleted successfully");
        setConfirmDeleteId(null);
        fetchProducts();
      } else {
        toast.error("Error deleting product");
      }
    } catch (error) {
      toast.error("Error deleting product");
      console.error("Error deleting product:", error);
    }
  };

  const handleToggleStock = async (productId, currentStockStatus) => {
    try {
      const { data } = await axios.put("/api/products/stock", {
        id: productId,
        inStock: !currentStockStatus,
      });
      if (data.success) {
        toast.success("Product stock status changed successfully");
        fetchProducts();
      } else {
        toast.error("Error changing product stock status");
      }
    } catch (error) {
      toast.error("Error changing product stock status");
      console.error("Error changing product stock status:", error);
    }
  };

  return (
    <div className="animate-fade-in max-w-6xl">
      <SectionHeader
        eyebrow="Catalog"
        title="Products"
        subtitle="Manage stock, pricing, and listings."
        action={
          <Button size="sm" onClick={() => navigate("/seller")}>
            Add product
          </Button>
        }
      />

      {products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products yet"
          description="Add your first grocery item to get started."
          action={<Button onClick={() => navigate("/seller")}>Add product</Button>}
        />
      ) : (
        <Card className="!p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-text-tertiary bg-surface-muted/60 border-b border-border">
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold hidden sm:table-cell">Category</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold hidden md:table-cell">Offer</th>
                  <th className="px-4 py-3 font-semibold">Stock</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="border-t border-border hover:bg-surface-muted/40 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-[12px] bg-surface-muted overflow-hidden shrink-0">
                          <img
                            src={product.images?.[0]}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-medium text-text-primary truncate max-w-[140px] md:max-w-xs">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-text-secondary">
                      {product.category}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {currency}{product.price}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-text-secondary">
                      {currency}{product.offerPrice}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleToggleStock(product._id, product.inStock)}
                        className="cursor-pointer"
                        aria-label="Toggle stock"
                      >
                        <Badge variant={product.inStock ? "success" : "error"}>
                          {product.inStock ? "In stock" : "Out"}
                        </Badge>
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => navigate(`/seller/update-product/${product._id}`)}
                          className="w-9 h-9 rounded-[12px] border border-border flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary/40 cursor-pointer"
                          aria-label="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        {confirmDeleteId === product._id ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(product._id)}
                              className="w-9 h-9 rounded-[12px] bg-error text-white flex items-center justify-center cursor-pointer"
                              aria-label="Confirm delete"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="w-9 h-9 rounded-[12px] bg-surface-muted flex items-center justify-center cursor-pointer"
                              aria-label="Cancel delete"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(product._id)}
                            className="w-9 h-9 rounded-[12px] border border-border flex items-center justify-center text-text-secondary hover:text-error hover:border-error/40 cursor-pointer"
                            aria-label="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ProductsList;
