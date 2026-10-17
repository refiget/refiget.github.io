# Refiget

个人主页，纯静态页面。

首页保留最近更新的 5 篇文章，按更新时间从新到旧排列。文章页放在 `posts/`；空分类页放在 `categories/`。

## 本地预览

macOS 下双击 `preview.command`，浏览器会打开 `http://127.0.0.1:18473`。关闭启动器对应的终端窗口即可停止预览。

也可以在项目目录运行：

```sh
python3 -m http.server 18473 --bind 127.0.0.1
```
