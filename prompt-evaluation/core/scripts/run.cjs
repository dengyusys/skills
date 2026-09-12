// 运行测评：组装配置 → 跑 promptfoo → 记 history → 生成报告
// 用法：node run.cjs <测评名> | --all（缺省 --all）
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const {
  ROOT,
  EVALS_DIR,
  RESULTS_DIR,
  listEvals,
  parseEvalYaml,
  summarize,
  appendHistory,
} = require('./lib.cjs');

const arg = process.argv[2] || '--all';
const all = arg === '--all';
const names = listEvals();
if (!names.length) {
  console.error('evals/ 下没有发现任何测评（需含 eval.yaml）');
  process.exit(1);
}
const selected = all ? names : names.filter((n) => n === arg);
if (!selected.length) {
  console.error(`未找到测评「${arg}」。可用：${names.join('、')}`);
  process.exit(1);
}

const providersTpl = fs.readFileSync(path.join(ROOT, 'core', 'providers.yaml'), 'utf8');

function buildConfig(evalName) {
  const dir = path.join(EVALS_DIR, evalName);
  const meta = parseEvalYaml(dir);
  const promptFiles = fs
    .readdirSync(path.join(dir, 'prompts'))
    .filter((f) => f.endsWith('.txt') || f.endsWith('.md'))
    .sort();
  if (promptFiles.length !== meta.labels.length) {
    throw new Error(
      `${evalName}: prompts/ 有 ${promptFiles.length} 个提示词，eval.yaml labels 有 ${meta.labels.length} 个，数量需一致`,
    );
  }
  const caseFiles = fs
    .readdirSync(path.join(dir, 'cases'))
    .filter((f) => f.endsWith('.yaml') || f.endsWith('.yml'))
    .sort();
  if (!caseFiles.length) throw new Error(`${evalName}: cases/ 下没有任何用例 YAML`);

  // 组装 defaultTest 断言块
  const asserts = (meta.defaultAsserts || '')
    .split('\n')
    .filter((l) => l.trim());
  const assertBlock = asserts.length
    ? '  assert:\n' + asserts.map((l) => '    ' + l).join('\n')
    : '';
  const providers = providersTpl.replace(/\n?\s*#__ASSERTS__#/, assertBlock ? '\n' + assertBlock : '');

  const lines = [
    `# 自动生成于 ${new Date().toISOString()}，npm run eval 时重建，勿手改`,
    `description: ${meta.title || evalName}`,
    'prompts:',
    ...promptFiles.map((f) => `  - file://prompts/${f}`),
    providers.trimEnd(),
    'tests:',
  ];
  for (const f of caseFiles) {
    const frag = fs
      .readFileSync(path.join(dir, 'cases', f), 'utf8')
      .replace(/\r\n/g, '\n')
      .replace(/\n+$/, '');
    const fragLines = frag.split('\n');
    lines.push('  - ' + fragLines[0]);
    for (const l of fragLines.slice(1)) lines.push('    ' + l);
  }
  return { configPath: path.join(dir, 'generated.yaml'), text: lines.join('\n') + '\n', meta };
}

function runEval(evalName) {
  const { configPath, text, meta } = buildConfig(evalName);
  fs.writeFileSync(configPath, text, 'utf8');

  const outDir = path.join(RESULTS_DIR, evalName);
  fs.mkdirSync(outDir, { recursive: true });
  const ts = new Date()
    .toISOString()
    .slice(0, 19)
    .replace(/[-:T]/g, '')
    .replace(/^(\d{8})(\d{6})$/, '$1-$2');
  const outPath = path.join(outDir, `${ts}.json`);

  console.log(`\n=== 运行测评：${evalName}（${meta.title || ''}）===`);
  const t0 = Date.now();
  const res = spawnSync(
    'npx -y promptfoo@latest eval -c "%CONFIG%" --env-file .env --output "%OUT%"'
      .replace('%CONFIG%', configPath)
      .replace('%OUT%', outPath),
    { cwd: ROOT, shell: true, stdio: 'inherit' },
  );
  const durationSec = Math.round((Date.now() - t0) / 1000);
  // promptfoo：0 = 全过；100 = 正常完成但存在失败断言；其他 = 真失败
  if ((res.status !== 0 && res.status !== 100) || !fs.existsSync(outPath)) {
    console.error(`测评 ${evalName} 运行失败（exit ${res.status}）`);
    return false;
  }
  fs.copyFileSync(outPath, path.join(outDir, 'latest.json'));

  const data = JSON.parse(fs.readFileSync(outPath, 'utf8'));
  data.__file = outPath;
  const s = summarize(data, meta.labels);
  appendHistory({
    ts: new Date().toISOString(),
    eval: evalName,
    title: meta.title || evalName,
    pass: s.pass,
    total: s.total,
    durationSec,
    model: 'glm-5.3-flash',
    judge: 'glm-5.3',
    variants: s.variants,
  });
  console.log(
    `${evalName} 完成：${s.pass}/${s.total} 通过，用时 ${durationSec}s，已记入 history.jsonl`,
  );
  return true;
}

let ok = true;
for (const name of selected) {
  if (!runEval(name)) ok = false;
}
if (!ok) process.exit(1);

// 重新生成全部报告与 dashboard
const rep = spawnSync('node core/scripts/report.cjs', { cwd: ROOT, shell: true, stdio: 'inherit' });
process.exit(rep.status || 0);
