import PartnerApplication from '../models/PartnerApplication.js';

export const submitPartnerApplication = async (req, res, next) => {
  try {
    const { businessName, contactPerson, email, mobile, city, shopType } = req.body;

    if (!businessName || !contactPerson || !email || !mobile || !city || !shopType) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const application = await PartnerApplication.create({
      businessName,
      contactPerson,
      email,
      mobile,
      city,
      shopType,
    });

    res.status(201).json({
      message: 'Partner application submitted successfully',
      applicationId: application._id,
    });
  } catch (error) {
    next(error);
  }
};
