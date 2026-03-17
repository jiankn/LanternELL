---
inclusion: always
---

# 全局规则

## 语言规则
- 始终使用中文与用户沟通，包括解释、说明、提问和总结
- 代码注释可根据项目语言习惯决定，但对话必须用中文

## Git 管理规则
- 凡是涉及较大代码改动（新增功能、重构、删除模块、多文件修改等），必须使用 git 进行管理
- 大改动前，提示用户确认是否需要先 commit 当前状态
- 每次大改动完成后，建议用户执行 git commit，并提供清晰的中文 commit message 建议
- commit message 格式：`<类型>: <简短描述>`，类型包括 feat / fix / refactor / chore / docs 等
