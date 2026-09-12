// 新建测评项目：npm run new -- <名字>
// 从 core/template/ 复制骨架到 evals/<名字>/，替换占位符
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { EVALS_DIR } = require('./lib.cjs');

const name = process.argv[2];
if (!name || !/^[a-z0-9][a-z0-9-]*$/.test(name)) {
  console.error('用法：npm run new -- <名字>（小写字母/数字/连字符，如 code-review）');
  process.exit(1);
}
const dest = path.join(EVALS_DIR, name);
if (fs.existsSync(dest)) {
  console.error(`evals/${name} 已存在`);
  process.exit(1);
}

function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.isDirectory()) copyDir(path.join(src, entry.name), path.join(dst, entry.name));
    else {
      let text = fs.readFileSync(path.join(src, entry.name), 'utf8');
      text = text
        .replace(/__NAME__/g, name)
        .replace(/__TITLE__/g, name);
      fs.writeFileSync(path.join(dst, entry.name), text);
    }
  }
}

copyDir(path.join(__dirname, '..', 'template'), dest);
console.log(`已创建 evals/${name}/（eval.yaml + prompts/ + cases/ + README.md）`);
console.log('\n下一步：');
console.log('  1. 编辑 eval.yaml：标题、变体标签（与 prompts/ 文件数量一致）');
console.log('  2. 写 prompts/*.txt（文件名排序即变体顺序；正文中不能用 --- 分隔线）');
console.log('  3. 写 cases/*.yaml（一案例一文件）');
console.log(`  4. 运行：npm run eval -- ${name}`);
