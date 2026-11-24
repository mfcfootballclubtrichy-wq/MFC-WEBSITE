import test from 'node:test';
import assert from 'node:assert/strict';

import {
  escapeHtml,
  sanitizeText,
  sanitizeUrl,
  isValidRedirect,
  validatePassword,
  validateUploadedImage,
  isValidEmail,
  isValidPhone,
} from '../utils/security.js';

test('1. escapeHtml neutralizes XSS characters and payloads', () => {
  assert.equal(
    escapeHtml('<script>alert("XSS")</script>'),
    '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
  );
  assert.equal(
    escapeHtml('"><img src=x onerror=alert(1)>'),
    '&quot;&gt;&lt;img src=x onerror=alert(1)&gt;'
  );
  assert.equal(
    escapeHtml("Tom & Jerry's Football"),
    'Tom &amp; Jerry&#39;s Football'
  );
  assert.equal(escapeHtml(null), '');
  assert.equal(escapeHtml(undefined), '');
  assert.equal(escapeHtml(123), '');
});

test('2. sanitizeText strips angle brackets', () => {
  assert.equal(sanitizeText('<b>John Doe</b>'), 'John Doe');
  assert.equal(sanitizeText('  Coach Santhosh  '), 'Coach Santhosh');
  assert.equal(sanitizeText(null), '');
});

test('3. sanitizeUrl blocks javascript: and data: URI attacks', () => {
  assert.equal(sanitizeUrl('javascript:alert(1)'), '#');
  assert.equal(sanitizeUrl('JAVASCRIPT:alert(1)'), '#');
  assert.equal(sanitizeUrl('data:text/html,<script>alert(1)</script>'), '#');
  assert.equal(sanitizeUrl('vbscript:msgbox(1)'), '#');

  assert.equal(sanitizeUrl('https://mfcfootballclub.com'), 'https://mfcfootballclub.com');
  assert.equal(sanitizeUrl('mailto:info@mfc.com'), 'mailto:info@mfc.com');
  assert.equal(sanitizeUrl('tel:+918072694818'), 'tel:+918072694818');
  assert.equal(sanitizeUrl('/portal'), '/portal');
  assert.equal(sanitizeUrl('#section'), '#section');
});

test('4. isValidRedirect prevents open redirects', () => {
  assert.equal(isValidRedirect('/portal'), true);
  assert.equal(isValidRedirect('/admin/dashboard'), true);
  assert.equal(isValidRedirect('/coaches'), true);

  // Attack vectors
  assert.equal(isValidRedirect('//evil.com'), false);
  assert.equal(isValidRedirect('https://evil.com'), false);
  assert.equal(isValidRedirect('http://evil.com'), false);
  assert.equal(isValidRedirect('/\\evil.com'), false);
  assert.equal(isValidRedirect('/javascript:alert(1)'), false);
  assert.equal(isValidRedirect(''), false);
  assert.equal(isValidRedirect(null), false);
});

test('5. validatePassword enforces OWASP authentication standard', () => {
  // Too short (< 8 chars)
  assert.equal(validatePassword('Pass1').valid, false);

  // Missing numbers
  assert.equal(validatePassword('NoNumbersHere').valid, false);

  // Missing letters
  assert.equal(validatePassword('1234567890').valid, false);

  // Strong compliant password
  const result = validatePassword('TrichyMFC2026!');
  assert.equal(result.valid, true);
  assert.equal(result.message, '');
});

test('6. validateUploadedImage enforces size limits and MIME allowlist', () => {
  const validFile = {
    name: 'team.jpg',
    size: 500 * 1024, // 500 KB
    type: 'image/jpeg',
  };
  assert.equal(validateUploadedImage(validFile).valid, true);

  const oversizedFile = {
    name: 'giant.png',
    size: 5 * 1024 * 1024, // 5 MB > 2 MB cap
    type: 'image/png',
  };
  const overRes = validateUploadedImage(oversizedFile);
  assert.equal(overRes.valid, false);
  assert.match(overRes.message, /exceeds maximum allowed size/);

  const svgXssFile = {
    name: 'malicious.svg',
    size: 2048,
    type: 'image/svg+xml',
  };
  const svgRes = validateUploadedImage(svgXssFile);
  assert.equal(svgRes.valid, false);
  assert.match(svgRes.message, /Only JPEG, PNG, and WebP/);

  const exeFile = {
    name: 'payload.exe',
    size: 1024,
    type: 'application/x-msdownload',
  };
  assert.equal(validateUploadedImage(exeFile).valid, false);
  assert.equal(validateUploadedImage(null).valid, false);
});

test('7. isValidEmail and isValidPhone enforce strict format constraints', () => {
  assert.equal(isValidEmail('admin@mfcfootball.com'), true);
  assert.equal(isValidEmail('invalid-email'), false);
  assert.equal(isValidEmail('admin@'), false);
  assert.equal(isValidEmail(''), false);

  assert.equal(isValidPhone('8072694818'), true);
  assert.equal(isValidPhone('+91 80726 94818'), true);
  assert.equal(isValidPhone('123'), false);
  assert.equal(isValidPhone('abcdefghij'), false);
});
