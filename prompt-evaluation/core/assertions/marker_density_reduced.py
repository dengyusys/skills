# 去 AI 味改写的密度检查：加粗 / 破折号（——）/ 箭头（→）三类标记，改写后不得比原文更密。
# 代码块与行内代码内的记号不计（技术内容里的箭头、星号允许原样保留）。

import re


def _strip_code(text):
    text = re.sub(r"```.*?```", "", text, flags=re.S)
    return re.sub(r"`[^`\n]*`", "", text)


def _counts(text):
    text = _strip_code(text)
    return {
        "加粗": text.count("**") // 2,
        "破折号": text.count("——"),
        "箭头": text.count("→"),
    }


def get_assert(output, context):
    src = (context.get("vars") or {}).get("doc", "")
    if not src.strip():
        return {"pass": True, "score": 1.0, "reason": "无原文可对比"}
    src_c, out_c = _counts(src), _counts(output)
    problems = []
    for k in src_c:
        if out_c[k] > src_c[k]:
            problems.append(f"{k}不降反升（{src_c[k]} 变 {out_c[k]}）")
    total_src, total_out = sum(src_c.values()), sum(out_c.values())
    if total_src >= 4 and total_out >= total_src:
        problems.append(f"三类标记总量未降（{total_src} 变 {total_out}）")
    if problems:
        return {"pass": False, "score": 0.0, "reason": "；".join(problems)}
    return {"pass": True, "score": 1.0, "reason": f"标记密度下降（{total_src} 变 {total_out}）"}
