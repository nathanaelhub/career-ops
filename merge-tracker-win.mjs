#!/usr/bin/env node
// Windows path fix wrapper for merge-tracker.mjs
// Patches the URL pathname resolution before delegating to the real script

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, renameSync } from 'fs';
import { join } from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

// Fix: use fileURLToPath for correct Windows path handling
const __filename = fileURLToPath(import.meta.url);
const CAREER_OPS = __filename.replace(/[/\\][^/\\]+$/, ''); // dirname

const APPS_FILE = existsSync(join(CAREER_OPS, 'data', 'applications.md'))
  ? join(CAREER_OPS, 'data', 'applications.md')
  : join(CAREER_OPS, 'applications.md');
const ADDITIONS_DIR = join(CAREER_OPS, 'batch', 'tracker-additions');
const MERGED_DIR = join(ADDITIONS_DIR, 'merged');
const DRY_RUN = process.argv.includes('--dry-run');

console.log('CAREER_OPS:', CAREER_OPS);
console.log('APPS_FILE:', APPS_FILE, '| exists:', existsSync(APPS_FILE));
console.log('ADDITIONS_DIR:', ADDITIONS_DIR, '| exists:', existsSync(ADDITIONS_DIR));

if (!existsSync(APPS_FILE)) {
  console.log('No applications.md found. Nothing to merge into.');
  process.exit(0);
}

// Read tracker additions
if (!existsSync(ADDITIONS_DIR)) {
  console.log('No tracker-additions directory found.');
  process.exit(0);
}

const tsvFiles = readdirSync(ADDITIONS_DIR)
  .filter(f => f.endsWith('.tsv'))
  .sort();

if (tsvFiles.length === 0) {
  console.log('No TSV files to merge.');
  process.exit(0);
}

console.log(`Found ${tsvFiles.length} TSV files to merge.`);

// Read applications.md
let appContent = readFileSync(APPS_FILE, 'utf-8');

// Parse header line to determine column order
const lines = appContent.split('\n');
let headerLine = lines.find(l => l.startsWith('|') && l.includes('Company'));
let headerIdx = lines.indexOf(headerLine);

// Canonical status mapping
const STATUS_MAP = {
  'evaluated': 'Evaluated', 'evaluada': 'Evaluated',
  'applied': 'Applied', 'aplicado': 'Applied',
  'responded': 'Responded', 'respondido': 'Responded',
  'interview': 'Interview', 'entrevista': 'Interview',
  'offer': 'Offer', 'oferta': 'Offer',
  'rejected': 'Rejected', 'rechazado': 'Rejected',
  'discarded': 'Discarded', 'descartado': 'Discarded',
  'skip': 'SKIP', 'no aplicar': 'SKIP',
};

function normalizeStatus(s) {
  const clean = (s || '').replace(/\*\*/g, '').trim().toLowerCase();
  return STATUS_MAP[clean] || s;
}

if (!existsSync(MERGED_DIR)) mkdirSync(MERGED_DIR, { recursive: true });

let mergedCount = 0;
let updatedCount = 0;

for (const file of tsvFiles) {
  const filePath = join(ADDITIONS_DIR, file);
  const content = readFileSync(filePath, 'utf-8').trim();
  if (!content) continue;

  // Parse TSV: 9 columns: num date company role status score pdf report notes
  const parts = content.split('\t');
  if (parts.length < 8) {
    console.log(`Skipping ${file}: only ${parts.length} columns`);
    continue;
  }

  const [num, date, company, role, status, score, pdf, report, ...noteParts] = parts;
  const notes = noteParts.join('\t');
  const canonicalStatus = normalizeStatus(status);

  // Check for existing entry by company+role
  const companyNorm = company.toLowerCase().replace(/[^a-z0-9]/g, '');
  const roleNorm = role.toLowerCase().replace(/[^a-z0-9]/g, '');

  let existingIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.startsWith('|')) continue;
    const cols = line.split('|').map(c => c.trim()).filter(Boolean);
    if (cols.length < 4) continue;
    // applications.md format: # | Date | Company | Role | Score | Status | PDF | Report | Notes
    const lineCompany = (cols[2] || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const lineRole = (cols[3] || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (lineCompany === companyNorm && lineRole.includes(roleNorm.slice(0, 10))) {
      existingIdx = i;
      break;
    }
  }

  if (existingIdx >= 0) {
    // Update existing entry's status and notes
    const cols = lines[existingIdx].split('|').map(c => c.trim()).filter(Boolean);
    cols[4] = canonicalStatus; // Status column (0-indexed after filter)
    if (notes) cols[8] = notes;
    if (!DRY_RUN) {
      lines[existingIdx] = '| ' + cols.join(' | ') + ' |';
    }
    console.log(`Updated: ${company} - ${role} → ${canonicalStatus}`);
    updatedCount++;
  } else {
    // Add new entry before the last separator or at end of table
    // Format: | # | Date | Company | Role | Score | Status | PDF | Report | Notes |
    const newLine = `| ${num} | ${date} | ${company} | ${role} | ${score} | ${canonicalStatus} | ${pdf} | ${report} | ${notes || ''} |`;

    // Find last table line
    let lastTableLine = -1;
    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i].startsWith('|')) { lastTableLine = i; break; }
    }

    if (!DRY_RUN) {
      if (lastTableLine >= 0) {
        lines.splice(lastTableLine + 1, 0, newLine);
      } else {
        lines.push(newLine);
      }
    }
    console.log(`Added: ${company} - ${role} (${canonicalStatus})`);
    mergedCount++;
  }

  // Move to merged dir
  if (!DRY_RUN) {
    renameSync(filePath, join(MERGED_DIR, file));
  }
}

if (!DRY_RUN) {
  writeFileSync(APPS_FILE, lines.join('\n'), 'utf-8');
  console.log(`\nDone: ${mergedCount} added, ${updatedCount} updated. Merged ${tsvFiles.length} files.`);
} else {
  console.log(`\n[DRY RUN] Would add ${mergedCount}, update ${updatedCount} entries.`);
}
