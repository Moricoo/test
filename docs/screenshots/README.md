# 界面截图

这些截图由 `npm run screenshots` 使用本机 Chrome 对生产构建（`npm run build && npm run preview`）实际拍摄，桌面视口为 1440×1080，移动视口为 390×844（2×）。截图脚本会注入固定随机种子，使每次生成的棋盘与果实位置保持一致。

- `before-empty-repository.png`：初始化前的基线截图，2026-11-18 拍摄自 `https://github.com/Moricoo/test`，当时仓库为空、没有任何应用界面。
- `after-*.png`：本 PR 的商店与两款游戏截图。

重新生成：

```bash
npm run build
npm run preview
# 另开一个终端
npm run screenshots
```
