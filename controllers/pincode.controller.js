import Pincode from '../models/Pincode.js';

export const checkPincode = async (req, res, next) => {
  try {
    const { code } = req.params;
    const pincode = await Pincode.findOne({ code, isActive: true }).lean();

    if (!pincode) {
      return res.status(404).json({ message: 'Pincode not available', isServiceable: false });
    }

    res.json({
      message: 'Pincode is serviceable',
      isServiceable: true,
      pincode: pincode.code,
      city: pincode.city,
      state: pincode.state,
    });
  } catch (error) {
    next(error);
  }
};
