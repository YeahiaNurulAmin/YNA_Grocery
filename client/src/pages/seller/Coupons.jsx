import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { useLanguage } from "../../context/LanguageContext";
import toast from "react-hot-toast";

const Coupons = () => {
    const { axios } = useAppContext();
    const { t, isRTL, formatPrice } = useLanguage();
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const defaultForm = {
        code: "",
        discountType: "percentage",
        discountValue: "",
        minOrderAmount: "",
        expiresAt: "",
    };
    const [form, setForm] = useState(defaultForm);

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get("/api/coupons/list");
            if (data.success) setCoupons(data.coupons);
        } catch {
            toast.error("Failed to load coupons.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.code || !form.discountValue || !form.expiresAt) {
            toast.error("Please fill in all required fields.");
            return;
        }
        try {
            setSubmitting(true);
            const { data } = await axios.post("/api/coupons/add", form);
            if (data.success) {
                toast.success("Coupon created!");
                setForm(defaultForm);
                fetchCoupons();
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to create coupon.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm(t("seller.delete_confirm"))) return;
        try {
            const { data } = await axios.delete(`/api/coupons/delete/${id}`);
            if (data.success) {
                toast.success(t("seller.delete"));
                fetchCoupons();
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error("Failed to delete coupon.");
        }
    };

    const handleToggle = async (id) => {
        try {
            const { data } = await axios.patch(`/api/coupons/toggle/${id}`);
            if (data.success) {
                toast.success(data.message);
                fetchCoupons();
            }
        } catch {
            toast.error("Failed to toggle coupon.");
        }
    };

    const isExpired = (expiresAt) => new Date() > new Date(expiresAt);

    const getStatusBadge = (coupon) => {
        if (isExpired(coupon.expiresAt)) {
            return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 uppercase">{isRTL ? "منتهي" : "Expired"}</span>;
        }
        return coupon.isActive
            ? <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 uppercase"><span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse"></span>{isRTL ? "نشط" : "Active"}</span>
            : <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 uppercase">{isRTL ? "غير نشط" : "Inactive"}</span>;
    };

    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 1);
    const minDateStr = minDate.toISOString().split("T")[0];

    return (
        <div className="space-y-8 animate-fade-in max-w-4xl text-text-primary">
            {/* Header */}
            <div>
                <h2 className="font-heading text-2xl font-bold text-text-primary">{t("seller.coupons_title")}</h2>
                <p className="text-sm text-text-secondary mt-1">{t("seller.coupons_subtitle")}</p>
            </div>

            {/* Create Coupon Form */}
            <div className="bg-bg-white rounded-[24px] border border-border shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-bg-light-mint/50 border-b border-border">
                    <h3 className="font-heading font-semibold text-text-primary flex items-center gap-2">
                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        {t("seller.create_coupon")}
                    </h3>
                </div>
                <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Code */}
                    <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">{t("seller.coupon_code")} <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            placeholder="e.g. FRESH20"
                            value={form.code}
                            onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                            className="w-full border border-border rounded-lg px-3.5 py-2.5 text-sm font-mono font-bold tracking-widest text-text-primary bg-bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:ring-offset-0"
                            required
                            dir="ltr"
                        />
                    </div>

                    {/* Discount Type */}
                    <div>
                        <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">{t("cart.discount")} <span className="text-red-500">*</span></label>
                        <select
                            value={form.discountType}
                            onChange={e => setForm(f => ({ ...f, discountType: e.target.value }))}
                            className="w-full border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer bg-bg-white"
                        >
                            <option value="percentage">{t("seller.discount_percent")}</option>
                            <option value="flat">{isRTL ? "مبلغ ثابت" : "Flat Amount"}</option>
                        </select>
                    </div>

                    {/* Discount Value */}
                    <div>
                        <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">
                            {t("cart.discount")} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            placeholder={form.discountType === "percentage" ? "20" : "5"}
                            min="0"
                            max={form.discountType === "percentage" ? "100" : undefined}
                            value={form.discountValue}
                            onChange={e => setForm(f => ({ ...f, discountValue: e.target.value }))}
                            className="w-full border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary bg-bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            required
                        />
                    </div>

                    {/* Min Order Amount */}
                    <div>
                        <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">{isRTL ? "الحد الأدنى للطلب" : "Min Order Amount"}</label>
                        <input
                            type="number"
                            placeholder="50"
                            min="0"
                            value={form.minOrderAmount}
                            onChange={e => setForm(f => ({ ...f, minOrderAmount: e.target.value }))}
                            className="w-full border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary bg-bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    {/* Expiry Date */}
                    <div>
                        <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">{t("seller.expiry_date")} <span className="text-red-500">*</span></label>
                        <input
                            type="date"
                            min={minDateStr}
                            value={form.expiresAt}
                            onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))}
                            className="w-full border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary bg-bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
                            required
                        />
                    </div>

                    {/* Submit */}
                    <div className={`sm:col-span-2 flex ${isRTL ? "justify-start" : "justify-end"} pt-2`}>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-2.5 rounded-lg transition text-sm flex items-center gap-2 disabled:opacity-60 cursor-pointer shadow-sm"
                        >
                            {submitting ? "..." : t("seller.create_coupon")}
                        </button>
                    </div>
                </form>
            </div>

            {/* Coupons Table */}
            <div className="max-w-4xl">
                <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                    {t("seller.active_coupons")}
                    {!loading && (
                        <span className="text-[11px] font-bold bg-surface-muted text-text-secondary px-2 py-0.5 rounded-full">{coupons.length}</span>
                    )}
                </h3>

                {loading ? (
                    <div className="text-center py-10 text-text-tertiary text-sm">...</div>
                ) : coupons.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-border rounded-xl text-text-tertiary flex flex-col items-center gap-2">
                        <p className="font-medium">{t("seller.no_coupons")}</p>
                    </div>
                ) : (
                    <div className="bg-bg-white rounded-xl border border-border shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className={`bg-surface-muted text-xs uppercase tracking-wider text-text-tertiary border-b border-border ${isRTL ? "text-right" : "text-left"}`}>
                                    <tr>
                                        <th className="px-4 py-3 font-bold">{t("seller.coupon_code")}</th>
                                        <th className="px-4 py-3 font-bold">{t("cart.discount")}</th>
                                        <th className="px-4 py-3 font-bold hidden sm:table-cell">{isRTL ? "الحد الأدنى" : "Min Order"}</th>
                                        <th className="px-4 py-3 font-bold hidden md:table-cell">{t("seller.expiry_date")}</th>
                                        <th className="px-4 py-3 font-bold">{t("seller.status")}</th>
                                        <th className="px-4 py-3 font-bold">{t("seller.action")}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {coupons.map(coupon => (
                                        <tr key={coupon._id} className="hover:bg-surface-muted/40 transition-colors">
                                            <td className="px-4 py-3">
                                                <span className="font-mono font-bold text-primary tracking-widest text-sm bg-primary/10 px-2 py-0.5 rounded">
                                                    {coupon.code}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-text-primary">
                                                {coupon.discountType === "percentage"
                                                    ? `${coupon.discountValue}%`
                                                    : formatPrice(coupon.discountValue)}
                                            </td>
                                            <td className="px-4 py-3 text-text-secondary hidden sm:table-cell">
                                                {coupon.minOrderAmount > 0 ? formatPrice(coupon.minOrderAmount) : "—"}
                                            </td>
                                            <td className="px-4 py-3 text-text-secondary hidden md:table-cell">
                                                <span className={isExpired(coupon.expiresAt) ? "text-error font-medium" : ""}>
                                                    {new Date(coupon.expiresAt).toLocaleDateString()}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                {getStatusBadge(coupon)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    {!isExpired(coupon.expiresAt) && (
                                                        <button
                                                            onClick={() => handleToggle(coupon._id)}
                                                            className={`text-xs font-semibold px-2.5 py-1 rounded-md cursor-pointer transition ${coupon.isActive
                                                                ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                                                                : "bg-green-100 text-green-700 hover:bg-green-200"
                                                            }`}
                                                        >
                                                            {coupon.isActive ? (isRTL ? "تعطيل" : "Disable") : (isRTL ? "تفعيل" : "Enable")}
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(coupon._id)}
                                                        className="text-xs font-semibold px-2.5 py-1 rounded-md bg-error/10 text-error hover:bg-error/20 cursor-pointer transition"
                                                    >
                                                        {t("seller.delete")}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Coupons;
