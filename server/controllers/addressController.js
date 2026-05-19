import User from "../models/User.js";
import Address from "../models/Address.js";

// Add address : /api/address/add
export const addAddress = async (req, res) => {
    try {
        const { userId, address } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await Address.create({ ...address, userId });

        res.status(200).json({ success: true, message: "Address added successfully",});
    } catch (error) {
        console.error("Error adding address:", error);
        res.status(500).json({ success: false, message: "Error adding address", error });
    }
}

//Get Address: /api/address/get
export const getAddress = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const addresses = await Address.find({ userId });
        res.status(200).json({ success: true, addresses,});

    } catch (error) {
        console.error("Error adding address:", error);
        res.status(500).json({ success: false, message: "Error adding address", error });
    }
}

// Update Address: api/address/update
export const updateAddress = async (req, res) => {
    try {
        const { userId, _id, updatedAddress } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const address = await Address.findById(addressId);

        if (!address) {
            return res.status(404).json({ message: "Address not found" });
        }

        await Address.findByIdAndUpdate(_id, updatedAddress);
        res.status(200).json({ success: true, message: "Address updated successfully" });
    } catch (error) {
        console.error("Error updating address:", error);
        res.status(500).json({ success: false, message: "Error updating address", error });
    }
}

// Delete Address: api/address/delete
export const deleteAddress = async (req, res) => {
    try {
        const { userId, _id } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const address = await Address.findById(_id);

        if (!address) {
            return res.status(404).json({ message: "Address not found" });
        }

        await Address.findByIdAndDelete(_id);
        res.status(200).json({ success: true, message: "Address deleted successfully" });
    } catch (error) {
        console.error("Error deleting address:", error);
        res.status(500).json({ success: false, message: "Error deleting address", error });
    }
}

