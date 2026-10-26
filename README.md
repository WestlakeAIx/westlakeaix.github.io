# AI交叉科学社 · 西湖大学

独立静态网站：根目录 `index.html` 就是完整首页，所有页面内容直接保存在 HTML 中。无需安装依赖、运行构建或启动后端服务。移动导航、活动筛选和照片预览由渐进增强 JavaScript 提供，禁用 JavaScript 仍可浏览全部内容。

## 发布到任意 GitHub 仓库

1. 将本目录中的网站文件复制到目标仓库的**根目录**，保留隐藏文件 `.nojekyll`，不要再套一层 `docs/`。迁移到独立仓库时不要复制原目录的 `.git/`。
2. 打开 **Settings → Pages**，选择 **Deploy from a branch**。
3. 选择存放网站的分支（通常为 `main`）和 **/(root)**，保存。
4. 使用 Pages 设置页提供的网址访问。

链接和资源使用相对路径，支持 `https://用户名.github.io/仓库名/`、用户主页仓库和自定义域名，不需要改代码。

网站运行所需文件为 `index.html`、`style.css`、`theme.css`、`enhancements.js`、`assets/`、`about/`、`weekly/`、`events/` 和 `activity/`。旧工具及资料集中保存在 `_archived/`，可以随仓库保存，也可以在仅发布网站时省略。

## 编辑与预览

- `index.html`：首页。
- `weekly/index.html`、`events/index.html`：活动列表。
- `activity/*/index.html`：活动详情。
- `about/index.html`：社团介绍。
- `assets/`：网站原始图片及 Logo；`assets/thumbs/`：首页与活动卡片使用的 WebP 预览图片。
- `style.css`：基础布局；`theme.css`：新版视觉和响应式样式。
- `enhancements.js`：手机菜单、活动搜索与年份筛选、照片放大和键盘切换，无后端依赖。
- `_archived/`：旧入口、工具、说明、资料和改版前的 HTML/CSS 备份，不是运行依赖。

可以直接双击 `index.html` 预览，也可以在本目录执行：

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

打开 `http://localhost:8000`，按 `Ctrl+C` 停止预览。修改活动时同步更新相应详情和列表卡片；首页展示最新三项日常活动。新增文件继续使用相对链接，不要把仓库名称或本机路径写进页面。

筛选结果可以直接分享浏览器地址，例如 `weekly/index.html?q=科研&year=2026`。照片预览支持左右方向键切换和 `Esc` 关闭，手机菜单也支持 `Esc` 关闭。系统开启“减少动态效果”时，网站会取消动画。

首页与卡片通过 `<picture>` 优先加载 WebP，浏览器不支持时回退到 JPG。替换图片时同步更新对应预览图片，以及 HTML 中的 `width`、`height` 和 `alt`；详情页使用原图。普通预览图片宽度为 720 像素，首页主图另有 1200 像素版本。

GitHub Pages 不运行服务器后端。如果将来需要登录、报名或内容管理，需要另行接入服务。当前内容和导航全部静态化；归档中的 Python 服务只用于旧版局域网分享和二维码海报，不需要安装或启动。

`.nojekyll` 让 Pages 直接发布静态文件。根目录发布时 `_archived/` 也会被上传；它是归档目录，不是访问控制机制。只部署网站时可以省略该目录。
