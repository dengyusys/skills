# 检查讲解输出是否使用了非 ASCII 制表符画流程图。
# 四个版本都承诺"流程图仅用基础 ASCII 字符"，这是可机械判定的硬约束。

BOX_CHARS = "─│┌┐└┘├┤┬┴┼═║╔╗╚╝╠╣╦╩╬"


def get_assert(output, context):
    hits = sorted({c for c in BOX_CHARS if c in output})
    if hits:
        return {
            "pass": False,
            "score": 0.0,
            "reason": "流程图使用了非 ASCII 制表符: " + " ".join(hits),
        }
    return {"pass": True, "score": 1.0, "reason": "未使用非 ASCII 制表符"}
