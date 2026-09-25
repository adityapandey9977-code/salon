export function normalizePhoneNumber(phone) {
    if (!phone)
        return '';
    // Strip non-digit characters except leading plus
    let cleaned = phone.replace(/[^\d+]/g, '');
    if (cleaned.startsWith('+91')) {
        cleaned = cleaned.substring(3);
    }
    else if (cleaned.startsWith('91') && cleaned.length === 12) {
        cleaned = cleaned.substring(2);
    }
    else if (cleaned.startsWith('0') && cleaned.length === 11) {
        cleaned = cleaned.substring(1);
    }
    return cleaned.replace(/\D/g, '');
}
export function normalizeEmail(email) {
    if (!email)
        return null;
    const trimmed = email.trim().toLowerCase();
    return trimmed.length > 0 ? trimmed : null;
}
