import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Coupons = () => {
    const { axios } = useAppContext();
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

    // ── Fetch all coupons ─────────────────────────────────────────────────────
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

    // ── Create coupon ─────────────────────────────────────────────────────────
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

    // ── Delete coupon ─────────────────────────────────────────────────────────
    const handleDelete = async (id) => {
        if (!confirm("Delete this coupon?")) return;
        try {
            const { data } = await axios.delete(`/api/coupons/delete/${id}`);
            if (data.success) {
                toast.success("Coupon deleted.");
                fetchCoupons();
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error("Failed to delete coupon.");
        }
    };

    // ── Toggle coupon active status ────────────────────────────────────────────
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

    // ── Helpers ───────────────────────────────────────────────────────────────
    const isExpired = (expiresAt) => new Date() > new Date(expiresAt);

    const getStatusBadge = (coupon) => {
        if (isExpired(coupon.expiresAt)) {
            return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 uppercase">Expired</span>;
        }
        return coupon.isActive
            ? <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 uppercase"><span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse"></span>Active</span>
            : <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 uppercase">Inactive</span>;
    };

    // Minimum date for the expiry picker – tomorrow
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 1);
    const minDateStr = minDate.toISOString().split("T")[0];

    return (
        <div className="space-y-8 animate-fade-in max-w-4xl text-text-primary">
            {/* ── Header ──────────────────────────────────────────────────────── */}
            <div>
                <h2 className="font-heading text-2xl font-bold text-text-primary">Coupons</h2>
                <p className="text-sm text-text-secondary mt-1">Create and manage discount codes for your customers.</p>
            </div>

            {/* ── Create Coupon Form ───────────────────────────────────────────── */}
            <div className="bg-bg-white rounded-[24px] border border-border shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-bg-light-mint/50 border-b border-border">
                    <h3 className="font-heading font-semibold text-text-primary flex items-center gap-2">
                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Create New Coupon
                    </h3>
                </div>
                <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Code */}
                    <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-600 dark:text-slate-355 uppercase tracking-wider mb-1.5">Coupon Code <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            placeholder="e.g. FRESH20"
                            value={form.code}
                            onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                            className="w-full border border-gray-300 dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-sm font-mono font-bold tracking-widest text-gray-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:ring-offset-0"
                            required
                        />
                    </div>

                    {/* Discount Type */}
                    <div>
                        <label className="block text-xs font-bold text-gray-600 dark:text-slate-355 uppercase tracking-wider mb-1.5">Discount Type <span className="text-red-500">*</span></label>
                        <select
                            value={form.discountType}
                            onChange={e => setForm(f => ({ ...f, discountType: e.target.value }))}
                            className="w-full border border-gray-300 dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-gray-750 dark:text-slate-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer bg-white dark:bg-slate-900"
                        >
                            <option value="percentage">Percentage (%)</option>
                            <option value="flat">Flat Amount ($)</option>
                        </select>
                    </div>

                    {/* Discount Value */}
                    <div>
                        <label className="block text-xs font-bold text-gray-600 dark:text-slate-355 uppercase tracking-wider mb-1.5">
                            Discount Value <span className="text-red-500">*</span>
                            <span className="ml-1 text-gray-400 font-normal normal-case">
                                ({form.discountType === "percentage" ? "%" : "$"})
                            </span>
                        </label>
                        <input
                            type="number"
                            placeholder={form.discountType === "percentage" ? "e.g. 20" : "e.g. 5"}
                            min="0"
                            max={form.discountType === "percentage" ? "100" : undefined}
                            value={form.discountValue}
                            onChange={e => setForm(f => ({ ...f, discountValue: e.target.value }))}
                            className="w-full border border-gray-300 dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-gray-750 dark:text-slate-200 bg-white dark:bg-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            required
                        />
                    </div>

                    {/* Min Order Amount */}
                    <div>
                        <label className="block text-xs font-bold text-gray-600 dark:text-slate-355 uppercase tracking-wider mb-1.5">Min Order Amount ($)</label>
                        <input
                            type="number"
                            placeholder="e.g. 50 (0 = no minimum)"
                            min="0"
                            value={form.minOrderAmount}
                            onChange={e => setForm(f => ({ ...f, minOrderAmount: e.target.value }))}
                            className="w-full border border-gray-300 dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-gray-750 dark:text-slate-200 bg-white dark:bg-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    {/* Expiry Date */}
                    <div>
                        <label className="block text-xs font-bold text-gray-600 dark:text-slate-355 uppercase tracking-wider mb-1.5">Expiry Date <span className="text-red-500">*</span></label>
                        <input
                            type="date"
                            min={minDateStr}
                            value={form.expiresAt}
                            onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))}
                            className="w-full border border-gray-300 dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-gray-750 dark:text-slate-200 bg-white dark:bg-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
                            required
                        />
                    </div>

                    {/* Submit */}
                    <div className="sm:col-span-2 flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-2.5 rounded-lg transition text-sm flex items-center gap-2 disabled:opacity-60 cursor-pointer shadow-sm"
                        >
                            {submitting ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                    </svg>
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    Create Coupon
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* ── Coupons Table ────────────────────────────────────────────────── */}
            <div className="max-w-4xl">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    All Coupons
                    {!loading && (
                        <span className="text-[11px] font-bold bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-355 px-2 py-0.5 rounded-full">{coupons.length}</span>
                    )}
                </h3>

                {loading ? (
                    <div className="text-center py-10 text-gray-400 text-sm">Loading coupons...</div>
                ) : coupons.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-gray-350 dark:border-slate-700 rounded-xl text-gray-400 dark:text-slate-500 flex flex-col items-center gap-2">
                        <svg className="w-10 h-10 text-gray-300 dark:text-slate-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l1.5-1.5m3-3l1.5-1.5M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z" />
                        </svg>
                        <p className="font-medium">No coupons yet. Create your first promo above!</p>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 dark:bg-slate-900/50 text-left border-b border-gray-200 dark:border-slate-700">
                                    <tr>
                                        <th className="px-4 py-3 text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-wider">Code</th>
                                        <th className="px-4 py-3 text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-wider">Discount</th>
                                        <th className="px-4 py-3 text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-wider hidden sm:table-cell">Min Order</th>
                                        <th className="px-4 py-3 text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">Expires</th>
                                        <th className="px-4 py-3 text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-3 text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                    {coupons.map(coupon => (
                                        <tr key={coupon._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                                            <td className="px-4 py-3">
                                                <span className="font-mono font-bold text-primary tracking-widest text-sm bg-primary/10 dark:bg-primary/20 px-2 py-0.5 rounded">
                                                    {coupon.code}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-gray-900 dark:text-slate-100">
                                                {coupon.discountType === "percentage"
                                                    ? `${coupon.discountValue}% off`
                                                    : `$${coupon.discountValue} off`}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600 dark:text-slate-300 hidden sm:table-cell">
                                                {coupon.minOrderAmount > 0 ? `$${coupon.minOrderAmount}` : <span className="text-gray-400 dark:text-slate-500">None</span>}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600 dark:text-slate-300 hidden md:table-cell">
                                                <span className={isExpired(coupon.expiresAt) ? "text-red-500 font-medium" : ""}>
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
                                                            {coupon.isActive ? "Disable" : "Enable"}
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(coupon._id)}
                                                        className="text-xs font-semibold px-2.5 py-1 rounded-md bg-red-100 text-red-650 hover:bg-red-200 cursor-pointer transition"
                                                    >
                                                        Delete
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
