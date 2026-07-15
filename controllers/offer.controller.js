import Offer from '../models/Offer.js';
import { validationResult } from 'express-validator';

export const getActiveOffers = async (req, res, next) => {
  try {
    const now = new Date();
    const offers = await Offer.find({
      isActive: true,
      startsAt: { $lte: now },
      $or: [{ endsAt: null }, { endsAt: { $gte: now } }],
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json(offers);
  } catch (error) {
    next(error);
  }
};

export const adminListOffers = async (req, res, next) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 }).lean();
    res.json(offers);
  } catch (error) {
    next(error);
  }
};

export const adminCreateOffer = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const offer = await Offer.create(req.body);
    res.status(201).json(offer);
  } catch (error) {
    next(error);
  }
};

export const adminUpdateOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    res.json(offer);
  } catch (error) {
    next(error);
  }
};

export const adminDeleteOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    res.json({ message: 'Offer deleted' });
  } catch (error) {
    next(error);
  }
};
