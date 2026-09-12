# 结构密度检查：正文里不应出现大段连续未分段的文字。
# 判定：连续超过 MAX_RUN 行既非标题/列表/表格/代码/空行的文字块，视为文字墙。

import re

MAX_RUN = 6

STRUCTURED = re.compile(r"^(#{1,6}\s|[-*+>]\s|\d+[.、)]\s|\|)")


def get_assert(output, context):
    lines = output.split("\n")
    worst = 0
    worst_start = 0
    run = 0
    in_code = False
    for i, line in enumerate(lines):
        s = line.strip()
        if s.startswith("```"):
            in_code = not in_code
            run = 0
            continue
        if in_code or not s or STRUCTURED.match(s):
            run = 0
            continue
        run += 1
        if run > worst:
            worst = run
            worst_start = i - run + 1
    if worst > MAX_RUN:
        excerpt = "".join(lines[worst_start : worst_start + 2]).strip()[:60]
        return {
            "pass": False,
            "score": 0.0,
            "reason": f"存在 {worst} 行连续未分段文字（阈值 {MAX_RUN}），如：{excerpt}…",
        }
    return {"pass": True, "score": 1.0, "reason": "未发现大段连续文字"}
