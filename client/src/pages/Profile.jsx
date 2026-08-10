/**
 * Profile — User Profile management page.
 * Route: /profile
 * Features: Profile overview, local device image upload to Cloudinary, personal details editing, address management, order history preview, and security/password updates.
 */
import React, { useState, useEffect, useRef } from "react";
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Package,
  KeyRound,
  ShieldCheck,
  Plus,
  Trash2,
  Camera,
  LogOut,
  ShoppingBag,
  Clock,
  Heart,
  Upload,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useLanguage } from "../context/LanguageContext";
import { Card, Button, Input, Badge, EmptyState } from "../components/ui";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, setUser, fetchUser, axios, navigate, currency, setShowUserLogin, setCartItems } = useAppContext();
  const { t, formatPrice } = useLanguage();

  // Active Tab
  const [activeTab, setActiveTab] = useState("info"); // 'info' | 'addresses' | 'orders' | 'security'

  // Personal Info Form State
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    avatar: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const fileInputRef = useRef(null);

  // Address State
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });
  const [savingAddress, setSavingAddress] = useState(false);

  // Orders State
  const [recentOrders, setRecentOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Security / Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);

  // Initialize profile form values when user changes
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        phone: user.phone || "",
        avatar: user.avatar || "",
      });
      setImagePreview(user.avatar || "");
      setSelectedFile(null);
      fetchAddresses();
      fetchRecentOrders();
    }
  }, [user]);

  // Handle local file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        return toast.error("Please select a valid image file");
      }
      if (file.size > 5 * 1024 * 1024) {
        return toast.error("Image size should be less than 5MB");
      }
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      toast.success("Image selected! Click 'Save Changes' to upload to Cloudinary.");
    }
  };

  // Remove selected file / clear avatar
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview("");
    setProfileForm((prev) => ({ ...prev, avatar: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Fetch Addresses
  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const { data } = await axios.get("/api/address/get");
      if (data.success) {
        setAddresses(data.addresses || []);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  // Fetch Recent Orders
  const fetchRecentOrders = async () => {
    setLoadingOrders(true);
    try {
      const { data } = await axios.get("/api/order/user");
      if (data.success) {
        setRecentOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching recent orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Profile Form Handler (Multipart form-data for Cloudinary upload)
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const formData = new FormData();
      formData.append("name", profileForm.name);
      formData.append("phone", profileForm.phone);

      if (selectedFile) {
        formData.append("image", selectedFile);
      } else {
        formData.append("avatar", profileForm.avatar || "");
      }

      const { data } = await axios.put("/api/users/profile", formData);

      if (data.success) {
        toast.success("Profile updated successfully!");
        setSelectedFile(null);
        if (data.user?.avatar) {
          setImagePreview(data.user.avatar);
        }
        if (fetchUser) await fetchUser();
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Error updating profile");
    } finally {
      setSavingProfile(false);
    }
  };

  // Add Address Handler
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setSavingAddress(true);
    try {
      const { data } = await axios.post("/api/address/add", { address: addressForm });
      if (data.success) {
        toast.success("Address added successfully!");
        setShowAddAddressModal(false);
        setAddressForm({
          firstName: "",
          lastName: "",
          email: "",
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
          phone: "",
        });
        fetchAddresses();
      } else {
        toast.error(data.message || "Failed to add address");
      }
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error("Error adding address");
    } finally {
      setSavingAddress(false);
    }
  };

  // Delete Address Handler
  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      const { data } = await axios.delete("/api/address/delete", { data: { _id: id } });
      if (data.success) {
        toast.success("Address deleted");
        fetchAddresses();
      } else {
        toast.error(data.message || "Failed to delete address");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Error deleting address");
    }
  };

  // Password Change Handler
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error("New passwords do not match!");
    }
    if (passwordForm.newPassword.length < 6) {
      return toast.error("New password must be at least 6 characters!");
    }

    setChangingPassword(true);
    try {
      const { data } = await axios.put("/api/users/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      if (data.success) {
        toast.success("Password changed successfully!");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(data.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(error.response?.data?.message || "Error changing password");
    } finally {
      setChangingPassword(false);
    }
  };

  // Logout Handler
  const handleLogout = async () => {
    try {
      const { data } = await axios.get("/api/users/logout");
      if (data.success) {
        toast.success("Logged out successfully");
        setCartItems({});
        setUser(null);
        navigate("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!user) {
    return (
      <div className="py-16 mb-nav">
        <EmptyState
          icon={UserIcon}
          title={t("myorder.sign_in")}
          description={t("myorder.sign_in_desc")}
          action={<Button onClick={() => setShowUserLogin(true)}>{t("myorder.login")}</Button>}
        />
      </div>
    );
  }

  const userInitials = (user.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="py-8 md:py-12 mb-nav max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Hidden File Input for Device Image Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp, image/jpg"
        className="hidden"
      />

      {/* ── Top Profile Header Banner ────────────────────────────── */}
      <Card className="relative overflow-hidden p-6 md:p-8 bg-gradient-to-r from-primary/10 via-bg-white to-accent/10 border-border/80 shadow-md">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            {/* Avatar Container */}
            <div className="relative group">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-bg-white shadow-md overflow-hidden bg-primary/10 flex items-center justify-center text-primary font-heading text-2xl md:text-3xl font-bold shrink-0">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  userInitials
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2.5 rounded-full bg-primary text-white shadow-md hover:bg-primary-dark transition-all cursor-pointer group-hover:scale-105"
                title={t("profile.change_photo")}
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
                <h1 className="font-heading text-2xl md:text-3xl font-bold text-text-primary">
                  {user.name}
                </h1>
                <Badge variant="success" className="gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Customer
                </Badge>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs md:text-sm text-text-secondary">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-text-tertiary" /> {user.email}
                </span>
                {user.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-text-tertiary" /> {user.phone}
                  </span>
                )}
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" /> {t("profile.change_photo")}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions & Logout */}
          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/my-orders")}
              className="gap-2"
            >
              <Package className="w-4 h-4" /> {t("nav.orders")} ({recentOrders.length})
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" /> {t("nav.logout")}
            </Button>
          </div>
        </div>
      </Card>

      {/* ── Summary Stats Cards ──────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="flex items-center gap-4 p-5 hover:border-primary/30 transition-all">
          <div className="w-12 h-12 rounded-[16px] bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-text-tertiary font-medium uppercase tracking-wider">
              {t("profile.orders")}
            </p>
            <p className="font-heading text-2xl font-bold text-text-primary mt-0.5">
              {recentOrders.length}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-5 hover:border-primary/30 transition-all">
          <div className="w-12 h-12 rounded-[16px] bg-accent/10 text-accent flex items-center justify-center shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-text-tertiary font-medium uppercase tracking-wider">
              {t("profile.addresses")}
            </p>
            <p className="font-heading text-2xl font-bold text-text-primary mt-0.5">
              {addresses.length}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-5 hover:border-primary/30 transition-all">
          <div className="w-12 h-12 rounded-[16px] bg-info/10 text-info flex items-center justify-center shrink-0">
            <Heart className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-text-tertiary font-medium uppercase tracking-wider">
              {t("nav.wishlist")}
            </p>
            <button
              onClick={() => navigate("/wishlist")}
              className="text-xs text-primary font-semibold hover:underline mt-1 block cursor-pointer"
            >
              {t("wishlist.browse")} &rarr;
            </button>
          </div>
        </Card>
      </div>

      {/* ── Main Tabbed Navigation ──────────────────────────────── */}
      <div className="grid md:grid-cols-4 gap-8">
        {/* Left Tab Links */}
        <div className="md:col-span-1 space-y-1">
          {[
            { id: "info", label: t("profile.tab_info"), icon: UserIcon },
            { id: "addresses", label: t("profile.tab_addresses"), icon: MapPin, count: addresses.length },
            { id: "orders", label: t("profile.tab_orders"), icon: Package, count: recentOrders.length },
            { id: "security", label: t("profile.tab_security"), icon: KeyRound },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-[16px] text-sm font-medium transition-all cursor-pointer ${
                  active
                    ? "bg-primary text-white shadow-md font-semibold"
                    : "text-text-secondary hover:bg-bg-light-mint hover:text-primary"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4.5 h-4.5 ${active ? "text-white" : "text-text-tertiary"}`} />
                  <span>{tab.label}</span>
                </div>
                {tab.count !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      active ? "bg-white/20 text-white" : "bg-surface-muted text-text-tertiary"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Content Panel */}
        <div className="md:col-span-3">
          {/* TAB 1: PERSONAL INFO */}
          {activeTab === "info" && (
            <Card className="p-6 md:p-8 space-y-6">
              <div>
                <h3 className="font-heading text-xl font-bold text-text-primary">
                  {t("profile.personal_title")}
                </h3>
                <p className="text-sm text-text-secondary mt-1">
                  {t("profile.personal_subtitle")}
                </p>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-6">
                {/* Device Image Uploader Section */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-text-secondary">
                    {t("profile.change_photo")}
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-[20px] bg-surface-muted border border-border">
                    <div className="relative shrink-0">
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-primary/10 border-2 border-bg-white shadow flex items-center justify-center font-bold text-primary text-xl">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          userInitials
                        )}
                      </div>
                    </div>

                    <div className="flex-1 text-center sm:text-left space-y-2">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          className="gap-2"
                        >
                          <Upload className="w-4 h-4" /> {t("profile.change_photo")}
                        </Button>

                        {(imagePreview || selectedFile) && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleRemoveImage}
                            className="text-error hover:bg-error/10 gap-1.5"
                          >
                            <X className="w-4 h-4" /> {t("profile.remove_photo")}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <Input
                  label={t("profile.full_name")}
                  name="name"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  placeholder={t("profile.full_name")}
                  required
                />

                <Input
                  label={t("profile.email_address")}
                  name="email"
                  type="email"
                  value={user.email}
                  disabled
                />

                <Input
                  label={t("profile.phone_number")}
                  name="phone"
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  placeholder={t("profile.phone_number")}
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    loading={savingProfile}
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    {t("profile.save_changes")}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* TAB 2: SAVED ADDRESSES */}
          {activeTab === "addresses" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-xl font-bold text-text-primary">
                    {t("profile.addresses_title")}
                  </h3>
                  <p className="text-sm text-text-secondary mt-1">
                    {t("profile.addresses_subtitle")}
                  </p>
                </div>
                <Button
                  onClick={() => setShowAddAddressModal(true)}
                  size="sm"
                  className="gap-2 shrink-0"
                >
                  <Plus className="w-4 h-4" /> {t("profile.add_new_address")}
                </Button>
              </div>

              {/* Add Address Modal / Form */}
              {showAddAddressModal && (
                <Card className="p-6 border-primary/30 shadow-lg animate-scale-in space-y-4 bg-bg-light-mint/30">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <h4 className="font-heading font-bold text-text-primary flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" /> {t("profile.add_new_address")}
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowAddAddressModal(false)}
                      className="text-xs text-text-tertiary hover:text-error"
                    >
                      {t("seller.cancel")}
                    </button>
                  </div>
                  <form onSubmit={handleAddressSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label={t("addaddress.first_name")}
                        name="firstName"
                        value={addressForm.firstName}
                        onChange={(e) => setAddressForm({ ...addressForm, firstName: e.target.value })}
                        required
                      />
                      <Input
                        label={t("addaddress.last_name")}
                        name="lastName"
                        value={addressForm.lastName}
                        onChange={(e) => setAddressForm({ ...addressForm, lastName: e.target.value })}
                        required
                      />
                    </div>
                    <Input
                      label={t("addaddress.email")}
                      name="email"
                      type="email"
                      value={addressForm.email}
                      onChange={(e) => setAddressForm({ ...addressForm, email: e.target.value })}
                      required
                    />
                    <Input
                      label={t("addaddress.street")}
                      name="street"
                      value={addressForm.street}
                      onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                      required
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label={t("addaddress.city")}
                        name="city"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        required
                      />
                      <Input
                        label={t("addaddress.state")}
                        name="state"
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label={t("addaddress.zip")}
                        name="zipCode"
                        value={addressForm.zipCode}
                        onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                        required
                      />
                      <Input
                        label={t("addaddress.country")}
                        name="country"
                        value={addressForm.country}
                        onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                        required
                      />
                    </div>
                    <Input
                      label={t("addaddress.phone")}
                      name="phone"
                      type="tel"
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                      required
                    />
                    <div className="flex gap-3 pt-2">
                      <Button type="submit" loading={savingAddress} className="flex-1">
                        {t("addaddress.save")}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowAddAddressModal(false)}
                      >
                        {t("seller.cancel")}
                      </Button>
                    </div>
                  </form>
                </Card>
              )}

              {/* Address List */}
              {loadingAddresses ? (
                <div className="space-y-3">
                  <div className="skeleton h-24 rounded-[20px]" />
                  <div className="skeleton h-24 rounded-[20px]" />
                </div>
              ) : addresses.length === 0 ? (
                <EmptyState
                  icon={MapPin}
                  title={t("profile.no_addresses")}
                  description={t("profile.no_addresses_desc")}
                  action={
                    <Button onClick={() => setShowAddAddressModal(true)} size="sm">
                      {t("profile.add_new_address")}
                    </Button>
                  }
                />
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <Card
                      key={addr._id}
                      className="p-5 flex flex-col justify-between hover:border-primary/40 transition-all space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-heading font-bold text-text-primary">
                            {addr.firstName} {addr.lastName}
                          </p>
                          <Badge variant="outline">{t("profile.addresses")}</Badge>
                        </div>
                        <p className="text-sm text-text-secondary">{addr.street}</p>
                        <p className="text-sm text-text-secondary">
                          {addr.city}, {addr.state} {addr.zipCode}
                        </p>
                        <p className="text-sm text-text-secondary">{addr.country}</p>
                        <p className="text-xs text-text-tertiary mt-2">{t("addaddress.phone")}: {addr.phone}</p>
                      </div>
                      <div className="pt-2 border-t border-border/60 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleDeleteAddress(addr._id)}
                          className="text-xs font-semibold text-error hover:bg-error/10 px-2.5 py-1 rounded-[10px] transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> {t("seller.delete")}
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ORDER HISTORY PREVIEW */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-xl font-bold text-text-primary">
                    {t("profile.orders_title")}
                  </h3>
                  <p className="text-sm text-text-secondary mt-1">
                    {t("profile.orders_subtitle")}
                  </p>
                </div>
                <Button onClick={() => navigate("/my-orders")} variant="outline" size="sm">
                  {t("profile.view_all_orders")} &rarr;
                </Button>
              </div>

              {loadingOrders ? (
                <div className="space-y-3">
                  <div className="skeleton h-24 rounded-[20px]" />
                  <div className="skeleton h-24 rounded-[20px]" />
                </div>
              ) : recentOrders.length === 0 ? (
                <EmptyState
                  icon={ShoppingBag}
                  title={t("myorder.no_orders")}
                  description={t("myorder.no_orders_desc")}
                  action={<Button onClick={() => navigate("/products")}>{t("myorder.start_shopping")}</Button>}
                />
              ) : (
                <div className="space-y-4">
                  {recentOrders.slice(0, 5).map((order) => (
                    <Card key={order._id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-text-tertiary">#{order._id.slice(-8)}</span>
                          <Badge variant={order.status === "Delivered" ? "success" : "accent"}>
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm font-semibold text-text-primary">
                          {order.items?.length || 0} {t("myorder.qty")} · {formatPrice(order.amount, currency)}
                        </p>
                        <p className="text-xs text-text-tertiary flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate("/my-orders")}
                      >
                        {t("myorder.order_id")}
                      </Button>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SECURITY & PASSWORD */}
          {activeTab === "security" && (
            <Card className="p-6 md:p-8 space-y-6">
              <div>
                <h3 className="font-heading text-xl font-bold text-text-primary">
                  {t("profile.security_title")}
                </h3>
                <p className="text-sm text-text-secondary mt-1">
                  {t("profile.security_subtitle")}
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <Input
                  label={t("profile.current_password")}
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                  }
                  placeholder={t("profile.current_password")}
                  required
                />

                <Input
                  label={t("profile.new_password")}
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                  }
                  placeholder={t("profile.new_password")}
                  required
                />

                <Input
                  label={t("profile.confirm_password")}
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                  }
                  placeholder={t("profile.confirm_password")}
                  required
                />

                <div className="pt-2">
                  <Button type="submit" loading={changingPassword} size="lg" className="w-full sm:w-auto">
                    {t("profile.update_password")}
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
