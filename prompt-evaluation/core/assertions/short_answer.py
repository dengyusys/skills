# 短答案预算：一行代码的提问，答案必须短。
# 正文（去空白后）不超过 120 字；不得使用编号/列表/加粗/标题/代码块——
# 对"一句话讲清"的题，这些结构本身就是过度解释的证据。

import re

MAX_CHARS = 120

STRUCTURE = [
    (r"^#{1,6}\s", "标题"),
    (r"^\s*(?:[-*+]\s|\d+[.、)])", "列表"),
    (r"\*\*", "加粗"),
    (r"```", "代码块"),
]


def get_assert(output, context):
    t = output.strip()
    problems = []
    n = len(re.sub(r"\s", "", t))
    if n > MAX_CHARS:
        problems.append(f"正文 {n} 字（预算 {MAX_CHARS}）")
    for pat, name in STRUCTURE:
        if re.search(pat, t, flags=re.M):
            problems.append(name)
    if problems:
        return {"pass": False, "score": 0.0, "reason": "过度解释：" + "、".join(problems)}
    return {"pass": True, "score": 1.0, "reason": f"短答案合规（{n} 字，无结构化展开）"}
