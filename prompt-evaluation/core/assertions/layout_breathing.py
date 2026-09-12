# 版式呼吸检查：输出不能密密麻麻。预算（代码块不计）：
# 段落 ≤150 字；列表项 ≤120 字；表格单元格 ≤45 字；表格字符占比 ≤50%；连续列表 ≤8 项。

import re

PARA_MAX = 150
BULLET_MAX = 120
CELL_MAX = 45
TABLE_SHARE_MAX = 0.5
BULLET_RUN_MAX = 8

BULLET = re.compile(r"^(?:[-*+>]|\d+[.、)])\s")


def get_assert(output, context):
    lines = output.split("\n")
    in_code = False
    over_para, over_bullet, over_cell = [], [], []
    table_chars = total_chars = 0
    run = max_run = 0
    for ln in lines:
        s = ln.strip()
        if s.startswith("```"):
            in_code = not in_code
            run = 0
            continue
        if in_code:
            continue
        total_chars += len(s)
        if s.startswith("|"):
            table_chars += len(s)
            for c in s.split("|")[1:-1]:
                c = c.strip()
                if c and not set(c) <= set("-: ") and len(c) > CELL_MAX:
                    over_cell.append(c[:30])
            run = 0
        elif BULLET.match(s):
            if len(s) > BULLET_MAX:
                over_bullet.append(s[:30])
            run += 1
            max_run = max(max_run, run)
        elif not s or re.match(r"^(#{1,6}\s|!)", s):
            run = 0
        else:
            if len(s) > PARA_MAX:
                over_para.append(s[:30])
            run = 0
    problems = []
    if over_para:
        problems.append(f"段落超 {PARA_MAX} 字 {len(over_para)} 处，如「{over_para[0]}…」")
    if over_bullet:
        problems.append(f"列表项超 {BULLET_MAX} 字 {len(over_bullet)} 处，如「{over_bullet[0]}…」")
    if over_cell:
        problems.append(f"表格格超 {CELL_MAX} 字 {len(over_cell)} 处，如「{over_cell[0]}…」")
    if total_chars >= 400 and table_chars / total_chars > TABLE_SHARE_MAX:
        problems.append(f"表格字符占比 {table_chars / total_chars:.0%}（预算 {TABLE_SHARE_MAX:.0%}）")
    if max_run > BULLET_RUN_MAX:
        problems.append(f"连续列表 {max_run} 项（预算 {BULLET_RUN_MAX}）")
    if problems:
        return {"pass": False, "score": 0.0, "reason": "；".join(problems)}
    return {"pass": True, "score": 1.0, "reason": "版式在预算内"}
