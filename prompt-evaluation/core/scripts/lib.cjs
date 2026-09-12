// 公共工具：路径、测评发现、eval.yaml 轻量解析（零依赖，不引 YAML 库）
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const EVALS_DIR = path.join(ROOT, 'evals');
const RESULTS_DIR = path.join(ROOT, 'results');
const REPORTS_DIR = path.join(ROOT, 'reports');
const HISTORY_FILE = path.join(ROOT, 'history.jsonl');

function listEvals() {
  if (!fs.existsSync(EVALS_DIR)) return [];
  return fs
    .readdirSync(EVALS_DIR)
    .filter((d) => fs.existsSync(path.join(EVALS_DIR, d, 'eval.yaml')))
    .sort();
}

// 解析 eval.yaml：flat 键 + labels 列表 + defaultAsserts 竖线块
function parseEvalYaml(dir) {
  const text = fs.readFileSync(path.join(dir, 'eval.yaml'), 'utf8');
  const lines = text.split(/\r?\n/);
  const out = { labels: [] };
  let mode = 'root';
  let block = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (mode === 'block') {
      if (line.trim() === '' || /^\s/.test(line)) {
        block.push(line);
        continue;
      }
      out.defaultAsserts = dedent(block);
      mode = 'root';
      // 落回正常处理当前行
    }
    if (mode === 'labels') {
      const lm = line.match(/^\s+-\s+(.+)$/);
      if (lm) {
        out.labels.push(lm[1].trim());
        continue;
      }
      if (line.trim() === '') continue;
      mode = 'root';
    }
    const m = line.match(/^(name|title|description):\s*(.*)$/);
    if (m) {
      out[m[1]] = m[2].trim();
      continue;
    }
    if (/^labels:\s*$/.test(line)) {
      mode = 'labels';
      continue;
    }
    if (/^defaultAsserts:\s*\|/.test(line)) {
      mode = 'block';
      block = [];
    }
  }
  if (mode === 'block') out.defaultAsserts = dedent(block);
  return out;
}

function dedent(lines) {
  while (lines.length && lines[lines.length - 1].trim() === '') lines.pop();
  const nonBlank = lines.filter((l) => l.trim());
  if (!nonBlank.length) return '';
  const ind = Math.min(...nonBlank.map((l) => l.match(/^ */)[0].length));
  return lines.map((l) => (l.trim() ? l.slice(ind) : '')).join('\n');
}

// 从 promptfoo 结果 JSON 提取汇总
function summarize(data, labels) {
  const rows = (data.results && data.results.results) || [];
  const variants = labels.map((label, i) => {
    const sub = rows.filter((r) => r.promptIdx === i);
    return { label, pass: sub.filter((r) => r.success).length, total: sub.length };
  });
  const tsMatch = (data.evalId || '').match(/\d{4}-\d{2}-\d{2}T[\d:.]+/);
  return {
    ts: tsMatch ? tsMatch[0] : new Date(fs.statSync(data.__file || '').mtime || Date.now()).toISOString(),
    pass: rows.filter((r) => r.success).length,
    total: rows.length,
    variants,
  };
}

function readHistory() {
  if (!fs.existsSync(HISTORY_FILE)) return [];
  return fs
    .readFileSync(HISTORY_FILE, 'utf8')
    .split(/\r?\n/)
    .filter((l) => l.trim())
    .map((l) => JSON.parse(l));
}

function appendHistory(entry) {
  fs.appendFileSync(HISTORY_FILE, JSON.stringify(entry) + '\n');
}

const esc = (s) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

module.exports = {
  ROOT,
  EVALS_DIR,
  RESULTS_DIR,
  REPORTS_DIR,
  HISTORY_FILE,
  listEvals,
  parseEvalYaml,
  summarize,
  readHistory,
  appendHistory,
  esc,
};
