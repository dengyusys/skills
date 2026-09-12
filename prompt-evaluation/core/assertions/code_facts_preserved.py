# 事实保全检查：改写不得丢失技术事实。
# - 代码块与链接 URL：逐字保留（代码就是代码，链接就是链接）。
# - 行内代码：含中文的记号允许转成自然语言（语义保全交给裁判）；
#   纯英文/数字/符号的记号（变量名、状态名、数值、文件名等）必须逐 token 存活。

import re

TOKEN = re.compile(r"[A-Za-z0-9_.$#*/:=+\[\]()%-]+")
CJK = re.compile(r"[\u4e00-\u9fff]")


def _collect(text):
    inline = re.findall(r"`[^`\n]+`", text)
    fenced = re.findall(r"```.*?```", text, flags=re.S)
    links = re.findall(r"\]\((https?://[^)\s]+)\)", text)
    return inline, fenced, links


def _technical_tokens(span):
    inner = span[1:-1]
    if CJK.search(inner):
        return []  # 中英混排记号：语义是否保全交给裁判
    return [t for t in TOKEN.findall(inner) if re.search(r"[A-Za-z0-9]", t)]


def get_assert(output, context):
    src = (context.get("vars") or {}).get("doc", "")
    if not src.strip():
        return {"pass": True, "score": 1.0, "reason": "无原文可对比"}
    inline, fenced, links = _collect(src)
    missing = [s for s in fenced if s.strip() not in output]
    missing += [s for s in links if s not in output]
    lost_tokens = []
    for span in inline:
        for tok in _technical_tokens(span):
            if tok not in output:
                lost_tokens.append(tok)
    if missing or lost_tokens:
        parts = []
        if missing:
            parts.append("整块丢失：" + "、".join(m[:40] for m in missing[:3]))
        if lost_tokens:
            parts.append("丢失记号：" + "、".join(lost_tokens[:8]))
        return {"pass": False, "score": 0.0, "reason": "；".join(parts)}
    n = len(inline) + len(fenced) + len(links)
    return {"pass": True, "score": 1.0, "reason": f"全部 {n} 处代码记号与链接的技术内容保留"}
