# Refiget 的技术笔记

一个纯 HTML 和 CSS 构成的静态技术博客，可直接部署到 GitHub Pages，无需安装依赖或构建。

## 本地预览

在浏览器中打开 `index.html`。单篇文章放在 `posts/` 目录下。

## 发布

将仓库 `main` 分支根目录设置为 GitHub Pages 发布源。推送后 GitHub Pages 会直接发布静态文件。

## 新增文章

1. 在 `posts/` 中复制一篇现有文章页面并修改标题、日期、分类和正文。
2. 在 `index.html` 的文章列表中添加对应的文章摘要和链接。
3. 按需更新侧栏的分类与归档。

全站样式在 `styles.css`，文章正文样式在 `posts/post.css`。
