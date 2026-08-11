/**
 * AddProduct — seller form to create a product (images + details).
 * Route: /seller (index). Posts multipart to /api/products/add.
 * Fully localized for Arabic & multi-language.
 */
import { useState } from "react";
import { Plus, ImagePlus } from "lucide-react";
import { categories } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import { useLanguage } from "../../context/LanguageContext";
import { Button, Input, Textarea, Card, SectionHeader } from "../../components/ui";
import toast from "react-hot-toast";

const AddProduct = () => {
  const { axios, navigate, fetchProducts } = useAppContext();
  const { t, tCategory } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    offerPrice: "",
    quantity: "10",
    images: [],
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (!productData.name || !productData.category || !productData.price) {
        toast.error(t("addaddress.error"));
        return;
      }
      const files = productData.images.filter(Boolean);
      if (files.length === 0) {
        toast.error(t("seller.upload_image"));
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
          quantity: Number(productData.quantity) || 10,
        })
      );
      files.forEach((image) => formData.append("images", image));

      const { data } = await axios.post("/api/products/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data.success) {
        toast.success(data.message || t("seller.save_product"));
        setProductData({
          name: "",
          description: "",
          category: "",
          price: "",
          offerPrice: "",
          quantity: "10",
          images: [],
        });
        fetchProducts?.();
        navigate("/seller/products");
      } else {
        toast.error(data.message || t("seller.add_product_error"));
      }
    } catch (error) {
      toast.error(t("seller.add_product_error"));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-xl">
      <SectionHeader
        eyebrow={t("seller.store_section")}
        title={t("seller.add_new_product")}
        subtitle={t("seller.add_product")}
      />
      <Card className="p-6!">
        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <p className="text-sm font-medium text-text-secondary mb-2">{t("seller.upload_image")}</p>
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
            label={t("seller.product_title")}
            placeholder={t("seller.enter_title")}
            value={productData.name}
            onChange={(e) => setProductData({ ...productData, name: e.target.value })}
            required
          />
          <Textarea
            label={t("seller.product_desc")}
            placeholder={t("seller.enter_desc")}
            value={productData.description}
            onChange={(e) => setProductData({ ...productData, description: e.target.value })}
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text-secondary" htmlFor="category">
              {t("seller.category")}
            </label>
            <select
              id="category"
              value={productData.category}
              onChange={(e) => setProductData({ ...productData, category: e.target.value })}
              className="w-full h-12 px-4 rounded-[16px] bg-bg-white border border-border text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              required
            >
              <option value="">{t("seller.select_category")}</option>
              {categories.map((item, index) => (
                <option key={index} value={item.path}>
                  {tCategory(item.text)}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label={t("seller.price")}
              type="number"
              value={productData.price}
              onChange={(e) => setProductData({ ...productData, price: e.target.value })}
              required
            />
            <Input
              label={t("seller.offer_price")}
              type="number"
              value={productData.offerPrice}
              onChange={(e) => setProductData({ ...productData, offerPrice: e.target.value })}
            />
          </div>
          <Input
            label={t("seller.in_stock_qty")}
            type="number"
            min={0}
            value={productData.quantity}
            onChange={(e) => setProductData({ ...productData, quantity: e.target.value })}
            required
          />
          <Button type="submit" loading={loading} className="w-full sm:w-auto">
            <Plus className="w-4 h-4" /> {t("seller.save_product")}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AddProduct;
