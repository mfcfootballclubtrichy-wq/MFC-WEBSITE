/**
 * security.js — Client-side rate limiting and sanitization utilities.
 */

// Simple in-memory / localStorage based rate limiter
export function checkRateLimit(key, maxAttempts = 3, windowSeconds = 60) {
  const storageKey = `mfc_rl_${key}`;
  const now = Date.now();
  const rawData = localStorage.getItem(storageKey);

  let record = rawData ? JSON.parse(rawData) : null;

  if (!record || now - record.startTime > windowSeconds * 1000) {
    // Reset window
    record = {
      count: 1,
      startTime: now,
    };
    localStorage.setItem(storageKey, JSON.stringify(record));
    return { allowed: true, remaining: maxAttempts - 1 };
  }

  if (record.count >= maxAttempts) {
    const retryAfter = Math.ceil((record.startTime + windowSeconds * 1000 - now) / 1000);
    return { allowed: false, retryAfter };
  }

  record.count += 1;
  localStorage.setItem(storageKey, JSON.stringify(record));
  return { allowed: true, remaining: maxAttempts - record.count };
}

// Input sanitizer to prevent XSS / malicious tags
export function sanitizeText(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '') // Strip < and >
    .trim();
}

// Strict email regex validation
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email.trim());
}

// Indian & International phone regex validation
export function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  // Accepts 10 digits with optional +91 or leading 0
  const clean = phone.replace(/[\s\-()]/g, '');
  return clean.length >= 10 && clean.length <= 13;
}

// Strict URL protocol validation to prevent javascript: / data: URI injections
export function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') return '#';
  const trimmed = url.trim();
  // Safe relative paths
  if (trimmed.startsWith('/') || trimmed.startsWith('#') || trimmed.startsWith('./')) {
    return trimmed;
  }
  // Safe protocols
  const safeProtocols = ['https:', 'http:', 'mailto:', 'tel:'];
  try {
    const parsed = new URL(trimmed, window.location.origin);
    if (safeProtocols.includes(parsed.protocol)) {
      return trimmed;
    }
  } catch {
    return '#';
  }
  return '#';
}

// -------------------------------------------------------------
// Global Web Application & Media Protection System
// -------------------------------------------------------------
let isProtectionInitialized = false;

export function initWebSecurity() {
  if (typeof window === 'undefined' || isProtectionInitialized) return;
  isProtectionInitialized = true;

  let toastTimer = null;

  const showSecurityNotice = (message) => {
    let toast = document.getElementById('mfc-security-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'mfc-security-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.className = 'mfc-security-toast active';

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      if (toast) {
        toast.className = 'mfc-security-toast';
      }
    }, 2400);
  };

  // 1. Right-Click Prevention on Images and Media
  const onContextMenu = (e) => {
    // Permit right-click in text fields, textareas, and editable areas
    if (['INPUT', 'TEXTAREA'].includes(e.target.tagName) || e.target.isContentEditable) {
      return;
    }

    const isImageOrMedia =
      e.target.tagName === 'IMG' ||
      e.target.tagName === 'PICTURE' ||
      e.target.tagName === 'VIDEO' ||
      e.target.tagName === 'CANVAS' ||
      e.target.tagName === 'FIGURE' ||
      e.target.closest('img') ||
      e.target.closest('.card') ||
      e.target.closest('.coach-card') ||
      e.target.closest('.hero-action-showcase') ||
      e.target.closest('.squad-card') ||
      e.target.closest('.gallery-card') ||
      e.target.closest('[data-protected-img]') ||
      e.target.classList.contains('coach-card') ||
      e.target.classList.contains('hero-action-showcase');

    if (isImageOrMedia) {
      e.preventDefault();
      showSecurityNotice('MFC image and media assets are protected against unauthorized saving.');
      return false;
    }
  };

  // 2. Drag & Drop Prevention on Images and Media
  const onDragStart = (e) => {
    if (
      e.target.tagName === 'IMG' ||
      e.target.tagName === 'PICTURE' ||
      e.target.tagName === 'VIDEO' ||
      e.target.tagName === 'CANVAS' ||
      e.target.closest('img')
    ) {
      e.preventDefault();
      return false;
    }
  };

  // 3. Save & Print Shortcut Prevention
  const onKeyDown = (e) => {
    const isSave = (e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S');
    const isPrint = (e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P');
    const isViewSource = (e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U');

    if (isSave) {
      e.preventDefault();
      showSecurityNotice('Saving this webpage or media is disabled for security.');
      return false;
    }

    if (isPrint) {
      e.preventDefault();
      showSecurityNotice('Printing and media export is disabled.');
      return false;
    }

    if (isViewSource) {
      e.preventDefault();
      return false;
    }
  };

  // 4. Copy protection on media
  const onCopy = (e) => {
    const selection = window.getSelection();
    if (!selection || selection.toString().trim() === '') {
      if (e.clipboardData) {
        e.clipboardData.setData('text/plain', 'MFC Trichy — Protected Content.');
        e.preventDefault();
      }
    }
  };

  // Attach global protection listeners
  window.addEventListener('contextmenu', onContextMenu, { passive: false });
  window.addEventListener('dragstart', onDragStart, { passive: false });
  window.addEventListener('keydown', onKeyDown, { passive: false });
  window.addEventListener('copy', onCopy, { passive: false });
}

// -------------------------------------------------------------
// AES-GCM 256-bit Encryption & Decryption (In-Transit & Storage)
// -------------------------------------------------------------
const ENCRYPTION_SALT = 'MFC_TRICHY_SECURE_SALT_2026';

async function deriveKey(secret) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode(ENCRYPTION_SALT),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt plain text using AES-GCM 256-bit
 */
export async function encryptData(plainText, secret = 'mfc-master-encryption-key') {
  if (!plainText) return '';
  try {
    const enc = new TextEncoder();
    const key = await deriveKey(secret);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      enc.encode(plainText)
    );

    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    // Convert to Base64
    let binary = '';
    for (let i = 0; i < combined.byteLength; i++) {
      binary += String.fromCharCode(combined[i]);
    }
    return `enc:${btoa(binary)}`;
  } catch (err) {
    console.error('Encryption failed:', err);
    return plainText;
  }
}

/**
 * Decrypt cipher text using AES-GCM 256-bit
 */
export async function decryptData(cipherText, secret = 'mfc-master-encryption-key') {
  if (!cipherText || !cipherText.startsWith('enc:')) return cipherText;
  try {
    const base64 = cipherText.slice(4);
    const binary = atob(base64);
    const combined = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      combined[i] = binary.charCodeAt(i);
    }

    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    const key = await deriveKey(secret);
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );

    return new TextDecoder().decode(decrypted);
  } catch (err) {
    console.warn('Decryption notice (unencrypted or key mismatch):', err);
    return cipherText;
  }
}

/**
 * Cryptographic SHA-256 Hashing for credentials
 */
export async function hashString(value) {
  if (!value) return '';
  const enc = new TextEncoder();
  const digest = await crypto.subtle.digest('SHA-256', enc.encode(value.trim()));
  const hashArray = Array.from(new Uint8Array(digest));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

