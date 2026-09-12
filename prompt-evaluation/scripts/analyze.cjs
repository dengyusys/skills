// 分析 results/code-reading.json：版本总分、案例难度、失败原因
const data = require('../results/code-reading.json');
const rows = data.results.results;
const names = ['v1', 'v2', 'v3', 'v4', 'v5'];

const polluted = rows.filter((r) => (r.response.output || '').includes('Thinking:'));
console.log('仍含 Thinking 的输出:', polluted.length, '/', rows.length);

const s = {};
for (const r of rows) {
  const p = names[r.promptIdx];
  s[p] = s[p] || { pass: 0, fail: 0 };
  if (r.success) s[p].pass++;
  else s[p].fail++;
}
console.log('--- 版本总分 ---');
for (const n of names) console.log(n + ': ' + s[n].pass + '/' + (s[n].pass + s[n].fail));

console.log('--- 案例难度（各版本通过数） ---');
const byTest = {};
for (const r of rows) {
  const d = (r.testCase.description || '').slice(0, 18);
  byTest[d] = byTest[d] || { pass: 0, total: 0, versions: [] };
  byTest[d].total++;
  if (r.success) byTest[d].pass++;
  byTest[d].versions.push(names[r.promptIdx] + (r.success ? '(P)' : '(F)'));
}
for (const [d, v] of Object.entries(byTest))
  console.log(d + ': ' + v.pass + '/' + v.total + '  [' + v.versions.join(' ') + ']');

console.log('--- 失败明细（按断言） ---');
for (const r of rows) {
  if (r.success) continue;
  const p = names[r.promptIdx];
  const d = (r.testCase.description || '').slice(0, 14);
  const gr = r.gradingResult;
  if (gr && gr.components) {
    for (const c of gr.components) {
      if (!c.pass) {
        const reason = (c.reason || JSON.stringify(c)).replace(/\s+/g, ' ').slice(0, 130);
        console.log('[' + p + '|' + d + '] ' + reason);
      }
    }
  } else {
    console.log('[' + p + '|' + d + '] 无 gradingResult，error=' + (r.error || '').slice(0, 80));
  }
}
