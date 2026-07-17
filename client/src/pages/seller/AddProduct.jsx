/**
 * AddProduct — seller form to create a product (images + details).
 * Route: /seller (index). Posts multipart to /api/products/add.
 */
import { useState } from "react";
import { Plus, ImagePlus } from "lucide-react";
import { categories } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import { Button, Input, Textarea, Card, SectionHeader } from "../../components/ui";
import toast from "react-hot-toast";

const AddProduct = () => {
  const { axios, navigate, fetchProducts } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    offerPrice: "",
    images: [],
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (!productData.name || !productData.category || !productData.price) {
        toast.error("Please fill all required fields");
        return;
      }
      const files = productData.images.filter(Boolean);
      if (files.length === 0) {
        toast.error("At least one image is required");
        return;
      }
      setLoading(true);
      const formData = new FormData();
      formData.append(
        "productDate",
        JSON.stringify({
          name: productData.name,
          description: productData.description,
          category: productData.category,
          price: productData.price,
          offerPrice: productData.offerPrice,
        })
      );
      files.forEach((image) => formData.append("images", image));

      const { data } = await axios.post("/api/products/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data.success) {
        toast.success(data.message || "Product added successfully");
        setProductData({
          name: "",
          description: "",
          category: "",
          price: "",
          offerPrice: "",
          images: [],
        });
        fetchProducts?.();
        navigate("/seller/products");
      } else {
        toast.error(data.message || "Error adding product");
      }
    } catch (error) {
      toast.error("Error adding product");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-xl">
      <SectionHeader
        eyebrow="Catalog"
        title="Add product"
        subtitle="Upload images and set pricing for a new grocery item."
      />
      <Card className="!p-6">
        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <p className="text-sm font-medium text-text-secondary mb-2">Product images</p>
            <div className="flex flex-wrap gap-3">
              {Array(4)
                .fill("")
                .map((_, index) => (
                  <label key={index} htmlFor={`image${index}`} className="cursor-pointer">
                    <input
                      accept="image/*"
                      type="file"
                      id={`image${index}`}
                      hidden
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const newImages = [...productData.images];
                          newImages[index] = file;
                          setProductData({ ...productData, images: newImages });
                        }
                      }}
                    />
                    <div className="w-20 h-20 rounded-[16px] border-2 border-dashed border-primary/30 bg-bg-light-mint/50 flex items-center justify-center overflow-hidden hover:border-primary transition-colors">
                      {productData.images[index] ? (
                        <img
                          src={URL.createObjectURL(productData.images[index])}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImagePlus className="w-6 h-6 text-primary/50" />
                      )}
                    </div>
                  </label>
                ))}
            </div>
          </div>

          <Input
            label="Product name"
            value={productData.name}
            onChange={(e) => setProductData({ ...productData, name: e.target.value })}
            required
          />
          <Textarea
            label="Description"
            value={productData.description}
            onChange={(e) => setProductData({ ...productData, description: e.target.value })}
            placeholder="One benefit per line or short copy"
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text-secondary" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              value={productData.category}
              onChange={(e) => setProductData({ ...productData, category: e.target.value })}
              className="w-full h-12 px-4 rounded-[16px] bg-bg-white border border-border text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              required
            >
              <option value="">Select category</option>
              {categories.map((item, index) => (
                <option key={index} value={item.path}>
                  {item.text}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Price"
              type="number"
              value={productData.price}
              onChange={(e) => setProductData({ ...productData, price: e.target.value })}
              required
            />
            <Input
              label="Offer price"
              type="number"
              value={productData.offerPrice}
              onChange={(e) => setProductData({ ...productData, offerPrice: e.target.value })}
            />
          </div>
          <Button type="submit" loading={loading} className="w-full sm:w-auto">
            <Plus className="w-4 h-4" /> Add product
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AddProduct;
