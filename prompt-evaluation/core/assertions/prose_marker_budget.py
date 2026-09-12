# 表达卫生预算：正文（去掉代码块与行内代码后）中的 AI 味标记不得超过预算。
# 预额：加粗 ≤ 8、破折号—— ≤ 2、全角箭头 → = 0、中文斜杠并列 ≤ 2。
# 代码块/行内代码/ASCII 示意图（通常 fenced）不计。

import re

BUDGET = [
    ("加粗", 8, lambda t: t.count("**") // 2),
    ("破折号——", 2, lambda t: t.count("——")),
    ("全角箭头→", 0, lambda t: t.count("→")),
    ("斜杠并列", 2, lambda t: len(re.findall(r"[\u4e00-\u9fff]\s*/\s*[\u4e00-\u9fff]", t))),
]


def get_assert(output, context):
    t = re.sub(r"```.*?```", "", output, flags=re.S)
    t = re.sub(r"`[^`\n]*`", "", t)
    over = []
    for name, cap, fn in BUDGET:
        n = fn(t)
        if n > cap:
            over.append(f"{name} {n} 处（预算 {cap}）")
    if over:
        return {"pass": False, "score": 0.0, "reason": "；".join(over)}
    return {"pass": True, "score": 1.0, "reason": "标记均在预算内"}
