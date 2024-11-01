---
date: 2024-11-01
title: tensorflow 踩坑记录
---

**Pytorch 用于快速原型验证（学术研究）， TensorFlow 用于工业生产部署**
<!-- more -->
近日使用 TensorFlow 完成图像去噪任务，然而速度太慢，于是寻求 GPU 资源进行加速。本以为 TensorFlow 2 能轻松使用 GPU（当然需要配置相关驱动），谁知 TensorFlow 高版本（>=2.10.0）不再支持 Windows，而 Pytorch 仍然支持。最终 ~~选择了 Pytorch 进行实验~~ 寻得了Linux GPU 环境（感谢lucky&agicy）。

此外，Pytorch 的动态计算图机制使得调试和开发更加灵活，适合快速迭代和原型验证。而 TensorFlow 虽然在工业部署中表现出色，但其静态计算图机制在开发过程中略显繁琐。综合考虑，决定以后在学术研究和快速原型验证阶段使用 Pytorch，而在工业生产部署阶段方才使用 TensorFlow（当然得是Linux环境）。
