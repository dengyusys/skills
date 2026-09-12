// 本地查看服务：npm run dashboard → http://localhost:15600
// 零依赖静态服务，只托管 reports/ 目录；文件双击打开也可（数据内嵌）
const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { REPORTS_DIR } = require('./lib.cjs');

const PORT = 15600;
const MIME = { '.html': 'text/html; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml' };

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  let file = path.normalize(path.join(REPORTS_DIR, urlPath === '/' ? 'dashboard.html' : urlPath));
  if (!file.startsWith(REPORTS_DIR)) {
    res.writeHead(403);
    return res.end('禁止访问');
  }
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    file = path.join(REPORTS_DIR, 'dashboard.html');
  }
  if (!fs.existsSync(file)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('还没有报告。先运行 npm run eval 生成。');
  }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`评测报告服务已启动：${url}（Ctrl+C 退出）`);
  if (process.platform === 'win32') exec(`start "" "${url}"`);
  else if (process.platform === 'darwin') exec(`open "${url}"`);
});
