import LeadRequest from '../models/LeadRequest.js';
import { uploadedFileUrl, absoluteUploadedFileUrl } from '../middleware/upload.js';

const LEAD_TYPES = ['sell_tv', 'sell_refrigerator', 'repair'];
const PHOTO_KEYS = ['front', 'left', 'right', 'back'];

function cleanStr(v, max = 200) {
  return String(v || '')
    .trim()
    .slice(0, max);
}

function cleanPhone(v) {
  const digits = String(v || '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  return digits.slice(0, 10);
}

export const uploadLeadPhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }
    const relative = uploadedFileUrl(req, 'leads');
    const url = absoluteUploadedFileUrl(req, 'leads') || relative;
    res.json({ url, path: relative });
  } catch (error) {
    next(error);
  }
};

export const createLead = async (req, res, next) => {
  try {
    const body = req.body || {};
    const type = cleanStr(body.type, 40);
    if (!LEAD_TYPES.includes(type)) {
      return res.status(400).json({ message: 'Invalid lead type' });
    }

    const name = cleanStr(body.name, 80);
    const phone = cleanPhone(body.phone);
    if (!name || phone.length !== 10) {
      return res.status(400).json({ message: 'Name and valid 10-digit phone are required' });
    }

    const photos = {};
    const incomingPhotos = body.photos || {};
    for (const key of PHOTO_KEYS) {
      photos[key] = cleanStr(incomingPhotos[key], 500);
    }

    if (type === 'sell_tv' || type === 'sell_refrigerator') {
      const missing = PHOTO_KEYS.filter((k) => !photos[k]);
      if (missing.length) {
        return res.status(400).json({
          message: `Please upload all 4 photos (${missing.join(', ')})`,
        });
      }
    }

    const issues = Array.isArray(body.issues)
      ? body.issues.map((i) => cleanStr(i, 80)).filter(Boolean).slice(0, 12)
      : [];

    if (type === 'repair' && !issues.length && !cleanStr(body.note, 500)) {
      return res.status(400).json({ message: 'Please select what to repair or add a short note' });
    }

    const lead = await LeadRequest.create({
      type,
      name,
      phone,
      address: cleanStr(body.address, 300),
      pincode: cleanStr(body.pincode, 10),
      city: cleanStr(body.city, 80),
      brand: cleanStr(body.brand, 80),
      modelName: cleanStr(body.modelName, 120),
      screenSize: cleanStr(body.screenSize, 40),
      applianceType: cleanStr(body.applianceType, 60),
      ageBand: cleanStr(body.ageBand, 40),
      condition: cleanStr(body.condition, 60),
      note: cleanStr(body.note, 500),
      photos,
      deviceCategory: cleanStr(body.deviceCategory, 40),
      issues,
      preferredSlot: cleanStr(body.preferredSlot, 40),
      preferredDate: cleanStr(body.preferredDate, 40),
      source: 'website',
    });

    res.status(201).json({
      leadId: lead.leadId,
      id: lead._id,
      message: "Thanks! We'll call you shortly.",
    });
  } catch (error) {
    next(error);
  }
};

export const getAllLeads = async (req, res, next) => {
  try {
    const { type, status, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (type && LEAD_TYPES.includes(type)) filter.type = type;
    if (status && ['new', 'contacted', 'closed'].includes(status)) filter.status = status;
    if (search) {
      const q = new RegExp(String(search).trim(), 'i');
      filter.$or = [{ name: q }, { phone: q }, { leadId: q }, { brand: q }, { modelName: q }];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [leads, total] = await Promise.all([
      LeadRequest.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit, 10)).lean(),
      LeadRequest.countDocuments(filter),
    ]);

    res.json({
      leads,
      total,
      page: parseInt(page, 10),
      totalPages: Math.ceil(total / parseInt(limit, 10)) || 1,
    });
  } catch (error) {
    next(error);
  }
};

export const updateLeadStatus = async (req, res, next) => {
  try {
    const { status } = req.body || {};
    if (!['new', 'contacted', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const lead = await LeadRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    ).lean();
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (error) {
    next(error);
  }
};
