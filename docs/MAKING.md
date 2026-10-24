# 制作、复现与发布

## 视频

完整的视觉方案、时间码与数据核对见 [分镜](../film/treatment.md)，逐步制作说明见 [视频 README](../film/README.md)。

影片使用 1920×1080 Canvas，60fps，共 900 帧。`window.draw(t)` 纯时间驱动，先加载字体。背景被卡片裁剪并模糊采样，再叠加反光、深色透明层与固定颗粒。五种图形的数值比例可直接检查。

128 BPM 下 32 拍正好 15 秒，最后一个主和弦保留尾音并淡出。视频采用 H.264 Main、yuv420p、TV range、AAC-LC、faststart，适合浏览器播放。

### 重新渲染

需要 Node.js、Python 3、FFmpeg 和 Chrome：

```sh
cd film
npm install
python3 -m venv .venv
. .venv/bin/activate
pip install numpy
python3 make_audio.py
node render.mjs keys
node render.mjs full
bash encode.sh
```

默认 Chrome 路径为 macOS 应用路径，其他系统通过 `CHROME_PATH` 设置实际浏览器路径。关键帧在 `previews/`，完整帧在 `frames/`，影片输出 `charts-glass-15s.mp4`。更新成片后，复制到仓库 `media/` 并刷新源码 ZIP 和预览图。

### 生成 README 动态预览

仓库根目录执行：

```sh
ffmpeg -y -i media/charts-glass-15s.mp4 -filter_complex "[0:v]fps=10,scale=720:-1:flags=lanczos,split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=3" -loop 0 media/preview.gif
```

README 用 GIF 展示动态效果并链接网页播放器，完整 MP4 保留声音与 60fps。

## 网页

`site/charts.js` 复用影片绘制函数。原始卡片尺寸仍为 850×660，外侧画布 1020×800，显示尺寸随屏幕缩放。指针坐标换算回原始图表坐标，避免手机触摸偏移。

- 漏斗：横坐标选择阶段，显示对应人数与转化。
- 桑基：来源节点或带状流命中选择来源；曲线命中使用贝塞尔横坐标反解。
- 多环：根据半径或图例行选择目标。
- 仪表：滑块与圆弧角度共同控制百分比，数字、弧长、指针与剩余目标同步。
- 面积：选择最近月份，更新游标、各渠道数值与合计。

网页进场动画使用 requestAnimationFrame；减少动态效果设置下直接显示完成状态。无后端、无追踪代码、字体均本地加载。

## 本地预览

在仓库根目录执行 `python3 -m http.server 8000`，打开 `http://localhost:8000`。

检查五个标签、悬停与点按、左右键、滑块、重播动效；在手机宽度检查溢出和触摸命中。视频应为 15 秒、1080p、60fps，并可正常播放、拖动进度。

## GitHub Pages

提交到 `main`。仓库 Settings → Pages → Deploy from a branch，选择 `main` 和 `/ (root)`。根目录 `.nojekyll` 关闭 Jekyll 处理，不需要安装构建依赖。

部署地址：https://jdb156158.github.io/vibe-charts2/ 。全部站内资源采用相对路径，适配仓库子目录。
