# Glass Statistics · 黑色毛玻璃统计 UI

15 秒 / 1920×1080 / 60fps / 128 BPM。无旁白，短字幕 + 合成配乐。沿用前作的大字标题和左右分栏，改为近黑背景、磨砂玻璃、微颗粒及薄荷 / 灰紫 / 冰蓝 / 浅金图形。

## 五种效果

1. **漏斗看转化**：四个阶段逐步收窄，显示阶段人数与相邻转化。
2. **流向看去处**：桑基色带按来源着色，聚焦搜索流量。
3. **多环看进度**：三个独立目标，从整体展示切换到单环聚焦。
4. **仪表看达成**：半圆弧与指针扫到 72%，显示剩余目标。
5. **面积看构成**：三层面积展开，月份游标与合计数联动。

开场和片尾完整展示五种，并标注编号、名称。所有业务数值均为合成演示数据。

## 参考与数据

参考 [BoardUI](https://www.boardui.com/zh-hans) 的公开图表展示，独立绘制界面与动画，未使用 Pro 源码。逐项来源、数据计算和时间码见 [treatment.md](treatment.md)。

## 制作提示词

> 从 BoardUI 中选择五种好看的统计 UI，避开前作已经展示的柱状、折线、环形占比、雷达和热力。制作 15 秒内的快节奏讲解视频。布局延续前作：左侧衬线英文大字与中文短句，右侧图表，顶部常驻系列标题。采用黑色毛玻璃卡片、近黑背景、柔和透光和细颗粒，文字清晰，图表使用薄荷、灰紫、冰蓝与浅金。每种图表只讲一个用途，并让动作解释用途。开场与片尾同时展示五种且标注名称，避免承诺五种却只展示三种。使用确定性 Canvas 时间函数逐帧生成，先查九张关键帧，至少两轮修改，再导出 1920×1080、60fps 的 H.264 + AAC MP4。Python 合成有节奏的配乐与 UI 音效，最后收束淡出。源码、分镜、提示词与制作步骤一并交付。

## 制作步骤

1. 阅读 BoardUI 的漏斗、桑基、径向、面积图公开预览，核实图形机制。写分镜与数据检查表。
2. 以卡片蒙太奇连接五种图形，继承前作的版式与字体。开头、结尾用五卡总览。
3. Canvas 绘制动态背景；每张玻璃卡片裁剪并模糊采样背景，再叠加深色透光层、边缘反光与固定种子微颗粒。图表和文字保持锐利。
4. 将所有场景写为 `window.draw(t)`，等待本地字体加载，确保任意时间跳转得到同一帧。
5. 导出九张关键帧。第一轮缩短仪表指针，避免穿过百分比；第二轮调整颗粒、透光与多环高亮时点。检查开场和片尾的五种图形。
6. Python 合成 128 BPM、8 小节配乐与提示音。最后主和弦留出释放时间；混音控制峰值，编码时做 -16 LUFS / -1.5 dBTP 目标响度处理。
7. Playwright 导出 900 张 JPEG；FFmpeg 把 JPEG full range 转换成 TV range，输出 H.264 Main、yuv420p、AAC-LC，加入 faststart。
8. 抽取最终 MP4 九帧总览，检查浏览器播放、跳转、时长和帧数。

## 本地复现

安装 Node.js、Python 3、FFmpeg、Google Chrome。

```sh
npm install
python3 -m venv .venv
. .venv/bin/activate
pip install numpy
python3 make_audio.py
node render.mjs keys
node render.mjs full
bash encode.sh
```

默认 Chrome 路径为 macOS `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`。其他环境设置 `CHROME_PATH` 为实际浏览器路径。输出 MP4 为 `charts-glass-15s.mp4`；关键帧在 `previews/`；完整 JPEG 在 `frames/`。

如安装 huashu-motion，可用 `om studio . --no-open` 打开可拖动时间轴的预览。本项目配乐由 `make_audio.py` 生成，按上述流程渲染可复现交付版本。

## 文件说明与授权

- `index.html`：背景、磨砂玻璃、五种图表、时间函数、OM 标记与场景标签。
- `render.mjs`：Playwright 逐帧导出。
- `make_audio.py`：固定随机种子的配乐与音效。
- `encode.sh`：兼容浏览器的 MP4 编码。
- `treatment.md`：来源、数据核对、分镜与节拍。
- `assets/fonts`：Noto Sans SC 及 OFL 授权；英文使用系统 Georgia。
- `vendor`：GSAP 与 huashu-motion 运行时，保留其第三方声明。

未分发 BoardUI 的付费组件源码。
