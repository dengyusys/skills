// 生成报告：各测评详情页 reports/<name>.html + 总览 reports/dashboard.html
// 数据来源：results/<name>/（本地优先），为空时回退 history.jsonl
const fs = require('fs');
const path = require('path');
const { RESULTS_DIR, REPORTS_DIR, listEvals, parseEvalYaml, summarize, readHistory, esc } = require('./lib.cjs');

const TYPE_CN = { 'llm-rubric': 'AI 裁判', python: '机械检查', contains: '文本检查', regex: '正则检查' };

function collectTrend(name) {
  const dir = path.join(RESULTS_DIR, name);
  const pts = [];
  if (fs.existsSync(dir)) {
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith('.json') || f === 'latest.json') continue;
      try {
        const data = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
        const rows = (data.results && data.results.results) || [];
        if (!rows.length) continue;
        const m = (data.evalId || '').match(/\d{4}-\d{2}-\d{2}T[\d:.]+/);
        pts.push({
          ts: m ? m[0] : new Date(fs.statSync(path.join(dir, f)).mtime).toISOString(),
          rate: rows.filter((r) => r.success).length / rows.length,
        });
      } catch (e) {
        /* 跳过损坏文件 */
      }
    }
  }
  if (!pts.length) {
    for (const h of readHistory().filter((h) => h.eval === name)) {
      pts.push({ ts: h.ts, rate: h.total ? h.pass / h.total : 0 });
    }
  }
  return pts.sort((a, b) => a.ts.localeCompare(b.ts));
}

// ---- 测评详情页 ----
function renderEvalPage(name, meta, data) {
  const rows = (data.results && data.results.results) || [];
  const labels = meta.labels;
  const byTest = new Map();
  for (const r of rows) {
    const key = (r.testCase && r.testCase.description) || `用例 ${(r.testIdx || 0) + 1}`;
    if (!byTest.has(key)) byTest.set(key, []);
    byTest.get(key).push(r);
  }
  let body = '';
  for (const [desc, group] of byTest) {
    const sorted = [...group].sort((a, b) => a.promptIdx - b.promptIdx);
    const blocks = sorted
      .map((r) => {
        const label = labels[r.promptIdx] || `变体${(r.promptIdx || 0) + 1}`;
        let asserts = '';
        const gr = r.gradingResult || {};
        const comps = gr.componentResults || gr.components || [];
        if (comps.length) {
          asserts = comps
            .map((c) => {
              const t = TYPE_CN[c.assertion && c.assertion.type] || (c.assertion && c.assertion.type) || '断言';
              const mark = c.pass ? '✅ 通过' : '❌ 未通过';
              const crit = c.assertion && c.assertion.value ? `<div class="crit">判定标准：${esc(c.assertion.value)}</div>` : '';
              const reason = c.reason ? `<div class="reason">判定理由：${esc(c.reason)}</div>` : '';
              return `<div class="assert"><span class="tag">${esc(t)}</span> ${mark}${crit}${reason}</div>`;
            })
            .join('');
        } else if (r.error) {
          asserts = `<div class="assert"><span class="tag">错误</span> ❌ ${esc(r.error)}</div>`;
        }
        return `
      <details class="variant" ${r.success ? '' : 'open'}>
        <summary><span class="mark">${r.success ? '✅' : '❌'}</span> ${esc(label)} ${r.success ? '通过' : '未通过'}</summary>
        ${asserts}
        <div class="sec">模型输出</div>
        <pre>${esc(r.response && r.response.output)}</pre>
      </details>`;
      })
      .join('\n');
    const first = group[0];
    const vars = (first.testCase && first.testCase.vars) || {};
    body += `
  <section class="case">
    <h3>${esc(desc)}</h3>
    <div class="sec">任务请求</div>
    <pre class="req">${esc(vars.request)}</pre>
    ${vars.code ? `<div class="sec">输入代码</div>\n    <pre class="code">${esc(vars.code)}</pre>` : ''}
    ${vars.diff ? `<div class="sec">输入差异</div>\n    <pre class="code">${esc(vars.diff)}</pre>` : ''}
    ${blocks}
  </section>`;
  }

  const sum = summarize({ ...data, __file: '' }, labels);
  const variantCells = labels
    .map((lb, i) => `<td>${esc(lb)}<br><b>${sum.variants[i].pass}/${sum.variants[i].total}</b></td>`)
    .join('');
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="utf-8"><title>${esc(meta.title || name)} · 测评详情</title>
<style>
  body { font-family: "Microsoft YaHei", system-ui, sans-serif; max-width: 1000px; margin: 0 auto; padding: 24px; color: #1a1a1a; background: #fafafa; }
  h1 { font-size: 20px; } h3 { font-size: 16px; margin-bottom: 8px; }
  .meta { color: #666; font-size: 13px; margin-bottom: 8px; }
  .back { font-size: 13px; margin-bottom: 16px; }
  .back a { color: #1565c0; text-decoration: none; }
  table { border-collapse: collapse; margin: 12px 0 24px; }
  td, th { border: 1px solid #ddd; padding: 8px 14px; text-align: center; background: #fff; }
  .case { background: #fff; border: 1px solid #e5e5e5; border-radius: 8px; padding: 16px; margin-bottom: 20px; }
  .sec { font-weight: bold; font-size: 13px; color: #888; margin: 10px 0 4px; }
  pre { background: #f6f8fa; border: 1px solid #e5e5e5; border-radius: 6px; padding: 12px; font-size: 12.5px; white-space: pre-wrap; word-break: break-word; max-height: 420px; overflow: auto; }
  pre.req { max-height: 120px; }
  details { border: 1px solid #e5e5e5; border-radius: 6px; margin-top: 10px; padding: 8px 12px; background: #fcfcfc; }
  summary { cursor: pointer; font-weight: bold; font-size: 14px; }
  .assert { font-size: 13px; margin: 6px 0 2px; }
  .assert .tag { display: inline-block; background: #eee; border-radius: 4px; padding: 1px 6px; font-size: 12px; margin-right: 6px; }
  .reason { color: #555; margin: 2px 0 6px 24px; font-size: 12.5px; white-space: pre-wrap; }
  .crit { color: #7a5900; margin: 2px 0 0 24px; font-size: 12.5px; }
</style></head>
<body>
<div class="back"><a href="dashboard.html">← 返回总览</a></div>
<h1>${esc(meta.title || name)}</h1>
<div class="meta">共 ${sum.total} 组 · 通过 ${sum.pass} · 运行时间 ${esc(sum.ts)} · 被测 glm-5.3-flash · 裁判 glm-5.3</div>
<table><tr><th>变体得分</th>${variantCells}</tr></table>
${body}
</body></html>`;
}

// ---- 总览 dashboard ----
function renderDashboard(evals) {
  const data = { generatedAt: new Date().toISOString(), evals };
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="utf-8"><title>提示词测评总览</title>
<style>
  body { font-family: "Microsoft YaHei", system-ui, sans-serif; max-width: 1080px; margin: 0 auto; padding: 24px; color: #1a1a1a; background: #fafafa; }
  h1 { font-size: 22px; margin-bottom: 4px; }
  .sub { color: #666; font-size: 13px; margin-bottom: 20px; }
  .cards { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 24px; }
  .card { background: #fff; border: 1px solid #e5e5e5; border-radius: 10px; padding: 14px 20px; min-width: 150px; }
  .card .num { font-size: 26px; font-weight: bold; }
  .card .lbl { font-size: 12px; color: #888; }
  section.eval { background: #fff; border: 1px solid #e5e5e5; border-radius: 10px; padding: 18px 20px; margin-bottom: 18px; }
  section.eval h2 { font-size: 16px; margin: 0 0 4px; }
  section.eval .desc { color: #666; font-size: 13px; margin-bottom: 12px; }
  .row { display: flex; gap: 24px; flex-wrap: wrap; align-items: flex-start; }
  .bars { flex: 1 1 420px; }
  .bar-row { display: flex; align-items: center; gap: 10px; margin: 7px 0; font-size: 13px; }
  .bar-label { width: 130px; text-align: right; color: #444; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .bar-track { flex: 1; height: 16px; background: #f0f0f0; border-radius: 8px; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 8px; }
  .bar-num { width: 44px; font-weight: bold; }
  .trend { flex: 0 0 260px; font-size: 12px; color: #888; }
  .trend svg { display: block; margin-top: 4px; }
  .open { margin-top: 12px; font-size: 13px; }
  .open a { color: #1565c0; text-decoration: none; font-weight: bold; }
  .empty { color: #999; font-size: 13px; }
</style></head>
<body>
<h1>提示词测评总览</h1>
<div class="sub" id="sub"></div>
<div class="cards" id="cards"></div>
<div id="list"></div>
<script>
const DATA = ${json};
const pct = (x) => Math.round(x * 100) + '%';
const color = (r) => (r >= 0.999 ? '#2e7d32' : r >= 0.5 ? '#ef6c00' : '#c62800');
const fmtTs = (ts) => (ts || '').replace('T', ' ').slice(0, 16);

document.getElementById('sub').textContent =
  '生成时间 ' + fmtTs(DATA.generatedAt) + ' · 被测 glm-5.3-flash · 裁判 glm-5.3 · 双击本文件即可离线查看';

const withLatest = DATA.evals.filter((e) => e.latest);
const totalGroups = withLatest.reduce((a, e) => a + e.latest.total, 0);
const totalPass = withLatest.reduce((a, e) => a + e.latest.pass, 0);
document.getElementById('cards').innerHTML = [
  ['测评项目', DATA.evals.length + ' 个'],
  ['已有结果', withLatest.length + ' / ' + DATA.evals.length],
  ['最近总体通过率', totalGroups ? totalPass + ' / ' + totalGroups + '（' + pct(totalPass / totalGroups) + '）' : '—'],
].map(([l, n]) => '<div class="card"><div class="num">' + n + '</div><div class="lbl">' + l + '</div></div>').join('');

function sparkline(pts) {
  if (pts.length < 2) return '<div class="empty">再跑一次即有趋势线</div>';
  const W = 240, H = 46, PAD = 4;
  const minT = Date.parse(pts[0].ts), maxT = Date.parse(pts[pts.length - 1].ts) || minT + 1;
  const xy = pts.map((p) => {
    const x = PAD + ((Date.parse(p.ts) - minT) / (maxT - minT)) * (W - 2 * PAD);
    const y = H - PAD - p.rate * (H - 2 * PAD);
    return x.toFixed(1) + ',' + y.toFixed(1);
  });
  return '<svg width="' + W + '" height="' + H + '">' +
    '<line x1="' + PAD + '" y1="' + (H - PAD) + '" x2="' + (W - PAD) + '" y2="' + (H - PAD) + '" stroke="#ddd"/>' +
    '<polyline points="' + xy.join(' ') + '" fill="none" stroke="#1565c0" stroke-width="1.6"/>' +
    xy.map((p, i) => { const [x, y] = p.split(','); return '<circle cx="' + x + '" cy="' + y + '" r="2.2" fill="#1565c0"><title>' + fmtTs(pts[i].ts) + ' · ' + pct(pts[i].rate) + '</title></circle>'; }).join('') +
    '</svg>';
}

document.getElementById('list').innerHTML = DATA.evals.map(function (e) {
  let middle;
  if (e.latest) {
    const bars = e.latest.variants.map(function (v) {
      const r = v.total ? v.pass / v.total : 0;
      return '<div class="bar-row"><div class="bar-label" title="' + v.label + '">' + v.label + '</div>' +
        '<div class="bar-track"><div class="bar-fill" style="width:' + pct(r) + ';background:' + color(r) + '"></div></div>' +
        '<div class="bar-num">' + v.pass + '/' + v.total + '</div></div>';
    }).join('');
    middle = '<div class="row"><div class="bars">' + bars + '</div>' +
      '<div class="trend">通过率趋势（' + e.trend.length + ' 次运行）' + sparkline(e.trend) + '</div></div>';
  } else {
    middle = '<div class="empty">尚未运行。执行 npm run eval -- ' + e.name + '</div>';
  }
  return '<section class="eval"><h2>' + e.title + ' <small style="color:#999;font-weight:normal">(' + e.name + ')</small></h2>' +
    '<div class="desc">' + (e.description || '') + (e.latest ? ' · 最近运行 ' + fmtTs(e.latest.ts) : '') + '</div>' +
    middle +
    (e.latest ? '<div class="open"><a href="' + e.report + '">查看逐用例详情与模型输出 →</a></div>' : '') +
    '</section>';
}).join('');
</script>
</body></html>`;
}

// ---- 主流程 ----
fs.mkdirSync(REPORTS_DIR, { recursive: true });
const evals = [];
for (const name of listEvals()) {
  const dir = path.join(path.dirname(REPORTS_DIR), 'evals', name);
  const meta = parseEvalYaml(dir);
  const latestPath = path.join(RESULTS_DIR, name, 'latest.json');
  let latest = null;
  if (fs.existsSync(latestPath)) {
    const data = JSON.parse(fs.readFileSync(latestPath, 'utf8'));
    fs.writeFileSync(path.join(REPORTS_DIR, `${name}.html`), renderEvalPage(name, meta, data));
    const s = summarize({ ...data, __file: latestPath }, meta.labels);
    latest = { ts: s.ts, pass: s.pass, total: s.total, variants: s.variants };
    console.log(`报告已生成：reports/${name}.html（${s.pass}/${s.total}）`);
  } else {
    console.log(`跳过 ${name}：results/${name}/latest.json 不存在`);
  }
  evals.push({
    name,
    title: meta.title || name,
    description: meta.description || '',
    latest,
    trend: collectTrend(name),
    report: `${name}.html`,
  });
}
fs.writeFileSync(path.join(REPORTS_DIR, 'dashboard.html'), renderDashboard(evals));
console.log('总览已生成：reports/dashboard.html');
