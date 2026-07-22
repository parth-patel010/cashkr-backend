import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import multer from 'multer';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const UPLOADS_ROOT = path.join(__dirname, '..', 'uploads');

const FOLDERS = {
  brands: 'brands',
  products: 'products',
  videos: 'videos',
  'buy-videos': 'buy-videos',
};

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

ensureDir(UPLOADS_ROOT);
Object.values(FOLDERS).forEach((folder) => ensureDir(path.join(UPLOADS_ROOT, folder)));

function safeExt(originalName = '', mimetype = '') {
  const fromName = path.extname(originalName || '').toLowerCase().replace(/[^.a-z0-9]/gi, '');
  if (fromName && fromName.length <= 10) return fromName;
  if (mimetype.startsWith('image/')) {
    const map = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif' };
    return map[mimetype] || '.jpg';
  }
  if (mimetype.startsWith('video/')) {
    const map = { 'video/mp4': '.mp4', 'video/webm': '.webm', 'video/quicktime': '.mov' };
    return map[mimetype] || '.mp4';
  }
  return '';
}

function makeFilename(file) {
  const id = crypto.randomBytes(12).toString('hex');
  return `${Date.now()}-${id}${safeExt(file.originalname, file.mimetype)}`;
}

function diskStorageFor(folderKey) {
  const folder = FOLDERS[folderKey] || folderKey;
  return multer.diskStorage({
    destination(_req, _file, cb) {
      const dest = path.join(UPLOADS_ROOT, folder);
      ensureDir(dest);
      cb(null, dest);
    },
    filename(_req, file, cb) {
      cb(null, makeFilename(file));
    },
  });
}

/** Public URL path served by Express at /api/uploads/... */
export function publicUploadUrl(folderKey, filename) {
  const folder = FOLDERS[folderKey] || folderKey;
  return `/api/uploads/${folder}/${filename}`;
}

export function uploadedFileUrl(req, folderKey = 'products') {
  if (!req.file?.filename) return '';
  return publicUploadUrl(folderKey, req.file.filename);
}

export const upload = multer({
  storage: diskStorageFor('products'),
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (!file.mimetype?.startsWith('image/')) {
      cb(new Error('Only image uploads are allowed'));
      return;
    }
    cb(null, true);
  },
});

export const uploadBrandImage = multer({
  storage: diskStorageFor('brands'),
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (!file.mimetype?.startsWith('image/')) {
      cb(new Error('Only image uploads are allowed'));
      return;
    }
    cb(null, true);
  },
});

/** Videos capped at 10MB */
export const uploadVideo = multer({
  storage: diskStorageFor('videos'),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (!file.mimetype?.startsWith('video/')) {
      cb(new Error('Only video uploads are allowed'));
      return;
    }
    cb(null, true);
  },
});

export const uploadBuyVideoMulter = multer({
  storage: diskStorageFor('buy-videos'),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (!file.mimetype?.startsWith('video/')) {
      cb(new Error('Only video uploads are allowed'));
      return;
    }
    cb(null, true);
  },
});
