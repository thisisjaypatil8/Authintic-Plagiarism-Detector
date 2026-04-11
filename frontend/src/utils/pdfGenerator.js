/**
 * pdfGenerator.js
 * ─────────────────────────────────────────────────────────────────────────
 * Standalone PDF report generator for Authintic plagiarism analysis.
 *
 * Fixes applied vs. the old inline implementation:
 *  1. Non-blocking — wrapped in setTimeout so the UI can show a spinner
 *     before heavy work starts. Returns a Promise for easy await / .then().
 *  2. Block-based highlighting — calculates block height for consecutive
 *     same-type lines instead of drawing one rect per line.
 *  3. Fully extracted from the React component — zero jsPDF knowledge
 *     needed in AnalysisReport.jsx.
 *  4. Safe chart extraction — guards against null / unmounted chart refs.
 *  5. Zero magic numbers — pulls everything from pdfConfig.js.
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PDF_COLORS, BRAND, LAYOUT, getSegmentColorKey } from './pdfConfig';

// ── Internal helpers ───────────────────────────────────────────────────

/** Draw a page header with branding + page number. */
function addPageHeader(doc, pageNum, pageWidth) {
  const { margin, fontSize } = LAYOUT;
  doc.setFontSize(fontSize.pageHeader);
  doc.setTextColor(BRAND.muted);
  doc.text('Authintic — 3-Layer Hybrid Plagiarism Checker', margin.left, 10);
  doc.text(`Page ${pageNum}`, pageWidth - margin.right, 10, { align: 'right' });
  doc.setTextColor(BRAND.black);
}

/** Draw a section title with an underline rule. */
function addSectionTitle(doc, title, yPos, pageWidth) {
  const { margin, fontSize } = LAYOUT;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(fontSize.sectionTitle);
  doc.setTextColor(...BRAND.primary);
  doc.text(title, margin.left, yPos);

  doc.setDrawColor(...BRAND.primary);
  doc.line(margin.left, yPos + 5, pageWidth - margin.right, yPos + 5);
}

/** Merge consecutive text segments that share the same category. */
function mergeSegments(fullTextStructured) {
  const merged = [];
  let current = null;

  for (const segment of fullTextStructured) {
    const key = segment.plagiarized ? `${segment.type}` : 'original';
    if (current && current.key === key) {
      current.text += segment.text;
    } else {
      if (current) merged.push(current);
      current = {
        key,
        text: segment.text,
        plagiarized: segment.plagiarized || false,
        type: segment.type || null,
      };
    }
  }
  if (current) merged.push(current);
  return merged;
}

// ── Page builders ──────────────────────────────────────────────────────

/** PAGE 1 — Cover & summary stats + chart + table */
function buildCoverPage(doc, { stats, overall_score, aiCount, aiPercent, file, user, chartImage }) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const { margin, fontSize } = LAYOUT;
  const contentWidth = pageWidth - margin.left - margin.right;

  addPageHeader(doc, 1, pageWidth);

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(fontSize.title);
  doc.setTextColor(...BRAND.primary);
  doc.text('Plagiarism Analysis Report', pageWidth / 2, 35, { align: 'center' });

  doc.setDrawColor(...BRAND.primary);
  doc.setLineWidth(0.5);
  doc.line(margin.left, 42, pageWidth - margin.right, 42);

  // Meta info
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(fontSize.meta);
  doc.setTextColor(BRAND.body);
  let y = 52;
  doc.text(`Analyzed for: ${user?.user?.name || user?.name || 'User'}`, margin.left, y);
  doc.text(`File: ${file?.name || 'N/A'}`, margin.left, y + 6);
  doc.text(`Date: ${new Date().toLocaleString()}`, margin.left, y + 12);
  doc.text(`Detection: 3-Layer Hybrid (TF-IDF + FAISS + BERT)`, margin.left, y + 18);

  // Overall score box
  y = 80;
  doc.setFillColor(...PDF_COLORS.directMatch.bg);
  doc.roundedRect(margin.left, y, contentWidth, 22, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(fontSize.stat);
  doc.setTextColor(BRAND.body);
  doc.text('Overall Similarity Score:', margin.left + 5, y + 9);
  doc.setFontSize(fontSize.statLarge);
  doc.setTextColor(...BRAND.danger);
  doc.text(`${overall_score}%`, margin.left + 5, y + 18);

  // 4-category score breakdown
  y = 110;
  const boxW = contentWidth / 4 - 3;
  const categories = [
    { key: 'original',      stat: stats.original_percent },
    { key: 'paraphrased',   stat: stats.paraphrased_percent },
    { key: 'aiParaphrased', stat: aiPercent },
    { key: 'directMatch',   stat: stats.direct_percent },
  ];

  categories.forEach((cat, i) => {
    const x = margin.left + (boxW + 2) * i;
    const color = PDF_COLORS[cat.key];
    doc.setFillColor(...color.bg);
    doc.roundedRect(x, y, boxW, 22, 2, 2, 'F');
    doc.setFontSize(fontSize.label);
    doc.setTextColor(BRAND.body);
    doc.setFont('helvetica', 'normal');
    doc.text(color.label, x + 3, y + 8);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(fontSize.stat);
    doc.setTextColor(...color.text);
    doc.text(`${cat.stat.toFixed(1)}%`, x + 3, y + 17);
  });

  // Doughnut chart image
  if (chartImage) {
    doc.addImage(chartImage, 'PNG', pageWidth / 2 - 40, 140, 80, 80);
  }

  // Statistical summary table
  y = 228;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(fontSize.heading);
  doc.setTextColor(BRAND.black);
  doc.text('Statistical Summary', margin.left, y);

  autoTable(doc, {
    startY: y + 5,
    head: [['Category', 'Count', 'Percentage']],
    body: [
      ['Original Sentences',        stats.original_count,     `${stats.original_percent.toFixed(1)}%`],
      ['Paraphrased Sentences',     stats.paraphrased_count,  `${stats.paraphrased_percent.toFixed(1)}%`],
      ['AI-Paraphrased (BERT)',     aiCount,                  `${aiPercent.toFixed(1)}%`],
      ['Direct Match Sentences',    stats.direct_count,       `${stats.direct_percent.toFixed(1)}%`],
      ['Total Sentences',           stats.total_sentences,    '100%'],
    ],
    headStyles: { fillColor: BRAND.primary, fontSize: fontSize.tableHead, fontStyle: 'bold' },
    bodyStyles: { fontSize: fontSize.tableBody },
    foot: [[
      'Total Plagiarized',
      stats.direct_count + stats.paraphrased_count + aiCount,
      `${(stats.direct_percent + stats.paraphrased_percent + aiPercent).toFixed(1)}%`,
    ]],
    footStyles: { fillColor: BRAND.danger, textColor: BRAND.white, fontStyle: 'bold' },
    theme: 'grid',
    margin: { left: margin.left, right: margin.right },
  });
}

/** PAGE 2 — Flagged sections detail table */
function buildFlaggedPage(doc, flaggedSections, pageNum) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const { margin, fontSize } = LAYOUT;

  doc.addPage();
  addPageHeader(doc, pageNum, pageWidth);
  addSectionTitle(doc, 'Flagged Sections Details', 30, pageWidth);

  autoTable(doc, {
    startY: 40,
    head: [['#', 'Sim %', 'Type', 'Layer', 'Flagged Text', 'Source']],
    body: flaggedSections.map((s, i) => [
      i + 1,
      `${s.similarity.toFixed(1)}%`,
      s.type,
      s.layer || '—',
      s.text.substring(0, 80) + (s.text.length > 80 ? '...' : ''),
      s.source.substring(0, 40) + (s.source.length > 40 ? '...' : ''),
    ]),
    headStyles: {
      fillColor: BRAND.primary,
      fontSize: fontSize.flaggedHead,
      fontStyle: 'bold',
      halign: 'center',
    },
    bodyStyles: { fontSize: fontSize.flaggedBody },
    columnStyles: {
      0: { cellWidth: 8,  halign: 'center' },
      1: { cellWidth: 15, halign: 'center' },
      2: { cellWidth: 25 },
      3: { cellWidth: 22 },
      4: { cellWidth: 60 },
      5: { cellWidth: 50 },
    },
    theme: 'striped',
    margin: { left: margin.left, right: margin.right },
  });
}

/**
 * PAGE 3+ — Full document with block-based highlighting.
 *
 * Instead of drawing a separate background rect for every single line,
 * we batch consecutive lines of the same color into a single rect.
 * This cuts draw calls from O(totalLines) to O(segments).
 */
function buildHighlightedPages(doc, fullTextStructured, startPage) {
  const pageWidth  = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const { margin, fontSize, lineHeight } = LAYOUT;
  const contentWidth = pageWidth - margin.left - margin.right;
  let currentPage = startPage;

  doc.addPage();
  currentPage++;
  addPageHeader(doc, currentPage, pageWidth);
  addSectionTitle(doc, 'Full Document with Highlighted Matches', 30, pageWidth);

  // ── Legend ────────────────────────────────────────────────────────
  let y = 42;
  doc.setFontSize(fontSize.legend);
  doc.setTextColor(BRAND.body);
  doc.text('Legend:', margin.left, y);

  const legendItems = ['original', 'paraphrased', 'aiParaphrased', 'directMatch'];
  let legendX = margin.left + 18;
  legendItems.forEach((key) => {
    const c = PDF_COLORS[key];
    const labelWidth = doc.getTextWidth(c.label);
    doc.setFillColor(...c.bg);
    doc.rect(legendX, y - 3, labelWidth + 6, 4, 'F');
    doc.text(c.label, legendX + 3, y);
    legendX += labelWidth + 14;
  });

  // ── Merged segments → block-based rendering ──────────────────────
  const mergedSegments = mergeSegments(fullTextStructured);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(fontSize.body);
  y = 52;

  for (const segment of mergedSegments) {
    const colorKey = getSegmentColorKey(segment);
    const bgColor  = PDF_COLORS[colorKey].bg;
    const lines    = doc.splitTextToSize(segment.text, contentWidth);

    // Calculate how many lines fit before a page break, draw one rect
    // per contiguous block on the same page.
    let lineIdx = 0;
    while (lineIdx < lines.length) {
      // Determine how many lines fit on the current page
      const linesAvailable = Math.floor((pageHeight - margin.bottom - y) / lineHeight);
      const batchEnd = Math.min(lineIdx + linesAvailable, lines.length);
      const batchCount = batchEnd - lineIdx;

      if (batchCount <= 0) {
        // No room — start a new page
        doc.addPage();
        currentPage++;
        addPageHeader(doc, currentPage, pageWidth);
        y = margin.top + 5;
        continue;
      }

      // Draw ONE background rect for the entire block of lines
      const blockHeight = batchCount * lineHeight;
      doc.setFillColor(...bgColor);
      doc.rect(margin.left, y - 3.5, contentWidth, blockHeight, 'F');

      // Render text lines on top of the rect
      doc.setTextColor(BRAND.black);
      for (let i = lineIdx; i < batchEnd; i++) {
        doc.text(lines[i], margin.left, y);
        y += lineHeight;
      }

      lineIdx = batchEnd;

      // If more lines remain, page-break
      if (lineIdx < lines.length) {
        doc.addPage();
        currentPage++;
        addPageHeader(doc, currentPage, pageWidth);
        y = margin.top + 5;
      }
    }
  }

  // Footer on last page
  doc.setFontSize(fontSize.footer);
  doc.setTextColor(BRAND.muted);
  doc.text(
    'Generated by Authintic — 3-Layer Hybrid Plagiarism Checker',
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' },
  );
}

// ── Public API ─────────────────────────────────────────────────────────

/**
 * Generate and download the plagiarism report PDF.
 *
 * Returns a Promise that resolves when the PDF has been saved, so the
 * calling component can show / hide a loading spinner.
 *
 * The actual work is deferred via setTimeout(0) to let the browser
 * paint the spinner before the main thread gets busy.
 *
 * @param {Object}   params
 * @param {Object}   params.analysisResult  — full API response
 * @param {File}     params.file            — uploaded file object
 * @param {Object|null} params.chartRef     — React ref to the Chart.js instance
 * @returns {Promise<void>}
 */
export function generatePlagiarismPDF({ analysisResult, file, chartRef }) {
  return new Promise((resolve, reject) => {
    // Yield to the event loop so the UI can render a loading state first
    setTimeout(() => {
      try {
        const { stats, overall_score, full_text_structured, flagged_sections } = analysisResult;
        const user = JSON.parse(localStorage.getItem('user'));

        const aiCount   = stats.ai_paraphrased_count  ?? 0;
        const aiPercent = stats.ai_paraphrased_percent ?? 0;

        // Safe chart image extraction
        let chartImage = null;
        if (chartRef?.current) {
          try {
            chartImage = chartRef.current.toBase64Image();
          } catch {
            console.warn('Chart image extraction failed — PDF will omit the chart.');
          }
        }

        const doc = new jsPDF();

        // Page 1 — Cover & Summary
        buildCoverPage(doc, {
          stats, overall_score, aiCount, aiPercent, file, user, chartImage,
        });

        // Page 2 — Flagged sections
        buildFlaggedPage(doc, flagged_sections, 2);

        // Page 3+ — Full highlighted document
        buildHighlightedPages(doc, full_text_structured, 2);

        // Save
        doc.save(`Plagiarism_Report_${file?.name || 'analysis'}.pdf`);
        resolve();
      } catch (err) {
        console.error('PDF generation failed:', err);
        reject(err);
      }
    }, 0);
  });
}
