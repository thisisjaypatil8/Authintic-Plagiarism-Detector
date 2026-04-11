/**
 * PDF Report Configuration
 * Centralized colors, layout, and style tokens for the plagiarism report PDF.
 * Change colors or spacing here — they propagate everywhere automatically.
 */

// ── Category Color Definitions ─────────────────────────────────────────
// Each category has: bg (fill for highlight rects), text (font color), label
export const PDF_COLORS = {
  original:       { bg: [220, 252, 231], text: [34, 197, 94],   label: 'Original' },
  paraphrased:    { bg: [254, 249, 195], text: [234, 179, 8],   label: 'Paraphrased' },
  aiParaphrased:  { bg: [237, 233, 254], text: [139, 92, 246],  label: 'AI-Paraphrased' },
  directMatch:    { bg: [254, 226, 226], text: [220, 38, 38],   label: 'Direct Match' },
};

// ── Brand / Accent Colors ──────────────────────────────────────────────
export const BRAND = {
  primary:     [79, 70, 229],   // Indigo-600  — headings, table headers
  danger:      [220, 38, 38],   // Red-600     — overall score, footer row
  muted:       150,             // Gray        — page header text
  body:        60,              // Dark gray   — body copy
  black:       0,               // Pure black  — highlighted text body
  white:       255,             // White       — footer text on danger bg
};

// ── Page Layout ────────────────────────────────────────────────────────
export const LAYOUT = {
  margin: { top: 20, right: 15, bottom: 20, left: 15 },
  fontSize: {
    pageHeader: 8,
    title: 22,
    sectionTitle: 15,
    heading: 12,
    body: 10,
    meta: 10,
    label: 9,
    stat: 13,
    statLarge: 18,
    legend: 8,
    tableHead: 9,
    tableBody: 9,
    flaggedHead: 8,
    flaggedBody: 7,
    footer: 8,
  },
  lineHeight: 5,
};

// ── Helpers ────────────────────────────────────────────────────────────

/**
 * Returns the PDF_COLORS key for a given text segment.
 */
export function getSegmentColorKey(segment) {
  if (!segment.plagiarized) return 'original';
  if (segment.type === 'Direct Match') return 'directMatch';
  if (segment.type === 'AI-Paraphrased') return 'aiParaphrased';
  return 'paraphrased';
}
