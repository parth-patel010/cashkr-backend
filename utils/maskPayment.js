export function maskAccountNumber(accountNumber = '') {
  const digits = String(accountNumber).replace(/\s/g, '');
  if (digits.length <= 4) return '****';
  return `${'*'.repeat(Math.max(digits.length - 4, 4))}${digits.slice(-4)}`;
}

export function maskPaymentMethod(pm) {
  if (!pm) return pm;
  const obj = typeof pm.toObject === 'function' ? pm.toObject() : { ...pm };
  if (obj.type === 'bank' && obj.accountNumber) {
    obj.accountNumberMasked = maskAccountNumber(obj.accountNumber);
    obj.accountNumber = maskAccountNumber(obj.accountNumber);
    if (obj.ifscCode && obj.ifscCode.length > 4) {
      obj.ifscCode = `${obj.ifscCode.slice(0, 4)}****`;
    }
  }
  if (obj.type === 'upi' && obj.upiId) {
    const [user, domain] = String(obj.upiId).split('@');
    if (domain) {
      const visible = user.slice(0, Math.min(2, user.length));
      obj.upiId = `${visible}${'*'.repeat(Math.max(user.length - 2, 2))}@${domain}`;
    }
  }
  return obj;
}

export function maskPaymentMethods(list = []) {
  return list.map(maskPaymentMethod);
}
