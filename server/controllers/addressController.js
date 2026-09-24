import Address from "../models/Address.js";

// Add Address: /api/address/add
export const addAddress = async (req, res) => {
  try {
    const { address } = req.body;
    const userId = req.userId;   // set by authUser

    await Address.create({ ...address, userId });
    res.json({ success: true, message: "Address Added Successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get Address: /api/address/get
export const getAddress = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.userId });
    res.json({ success: true, addresses });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};