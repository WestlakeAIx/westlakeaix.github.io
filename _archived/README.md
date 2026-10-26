# 历史归档

本目录保存重构前的资料与本地工具，不参与当前网站运行。

- `previous-site/`：本次改版前的 HTML 与 CSS 源码快照，图片仍在根目录 `assets/`；内部相对资源路径保留原样，不能直接当作独立网站预览。
- `before-visual-refresh/`：本轮视觉优化前的页面、样式和脚本快照，方便对照或恢复；同样不包含独立图片副本。
- `design-directions/`：三种首页视觉方向的交互样稿，可打开其中的 `index.html` 对比布局与配色。
- `index.html`：旧的跳转入口。
- `assets/`：旧仓库 README 海报素材。
- `local-share/`、`serve_local.py`、`启动社团网页.command`：旧局域网分享工具。
- `weekly-records.json`：周活动原始补充记录。
- `网站启动说明.md`：旧部署说明，仅供历史参考。
- `previous-README.md`：旧仓库的说明文件。

旧工具保留原样，其中的 `docs/` 路径已不适用于新目录；当前预览方式请查看根目录 README。

当前网站不引用本目录中的文件。`serve_local.py` 的功能是本地静态预览、局域网分享和二维码海报生成，不是当前网站所需的业务后端。

根目录的 `.nojekyll` 会让 GitHub Pages 原样发布静态文件，因此 `_archived/` 只是资料整理目录，不会自动被排除在发布之外。仅发布网站时可不上传本目录。
