 <div align="center">

<div style="padding:8px;border-radius:100%;background:white;width:124px;height:124px">
<img src="docs/logo.png" width="124" height="124">
</div>

# OCS 网课助手

> OCS (Online Course Script) 网课刷课脚本，帮助大学生解决网课难题

![GitHub Repo stars](https://img.shields.io/github/stars/ocsjs/ocsjs)
![npm](https://img.shields.io/npm/v/ocsjs?color=red)
![NPM](https://img.shields.io/npm/l/ocsjs)
![今日安装](https://img.shields.io/badge/dynamic/json?color=orange&label=今日安装&query=$.data.today_install&url=https://scriptcat.org/api/v2/scripts/367)
![总共安装](https://img.shields.io/badge/dynamic/json?color=red&label=总共安装&query=$.data.total_install&url=https://scriptcat.org/api/v2/scripts/367)

</div>

<div align="center">

## 官网及教程 [https://docs.ocsjs.com](https://docs.ocsjs.com)

</div>

---

# OCS-DeepSeek AI 增强版

> 本仓库是基于 OCS 网课助手开源项目进行的个人二次开发版本，在原有功能基础上增加 DeepSeek AI 答题能力。

## 🚀 快速下载与安装

**不需要下载源码，也不需要自行编译！**

[![下载最新版 OCS-DeepSeek](https://img.shields.io/badge/下载最新版-OCS.user.js-blue?style=for-the-badge&logo=github)](https://github.com/YumeOfHer/ocsjs-deepseek/releases/latest)

1. 点击上方按钮，进入 GitHub Releases。
2. 在 Assets 中下载 `ocs.user.js`。
3. 使用浏览器脚本管理器（如 ScriptCat 脚本猫）安装。
4. 在 OCS 设置中填写自己的 DeepSeek API Key。
5. 启用 DeepSeek AI，即可开始使用。

**源码开发者：** 请通过本仓库获取完整源码，自行构建。

## 项目说明

本项目基于原作者的 OCS 网课助手进行修改开发，保留原项目主体结构及原有功能，并新增 DeepSeek AI 接口支持。

当传统题库无法提供答案时，可以调用 DeepSeek AI，根据题目内容生成答案，减少对已有题库的依赖。

**本项目为个人维护的二次开发分支，不代表 OCS 官方版本。**

## 新增功能

- **DeepSeek AI 接入**：支持调用 DeepSeek API 获取题目答案。
- **独立配置**：可以自行启用或关闭 DeepSeek AI。
- **自定义 API Key**：使用者填写自己的 DeepSeek API Key。
- **模型配置**：支持配置 DeepSeek 模型名称，默认使用 `deepseek-chat`。
- **严格 JSON 输出**：通过结构化输出约束 AI 返回格式，方便 OCS 识别答案。
- **纯答案返回**：答案字段仅保留最终答案，避免解析文字干扰 OCS 答案识别。
- **题库与 AI 结合**：保留原有题库查询逻辑，并增加 AI 答题能力。

## 使用方法

1. 安装浏览器用户脚本管理器，例如 [脚本猫 ScriptCat](https://scriptcat.org/)。
2. 安装本项目发布的 OCS 用户脚本。
3. 打开 OCS 设置界面。
4. 找到 DeepSeek AI 设置区域。
5. 启用 DeepSeek AI。
6. 填写自己的 DeepSeek API Key。
7. 根据需要设置模型名称，默认使用 `deepseek-chat`。
8. 保存配置后进入课程进行测试。

**注意：** 请使用者自行申请和配置 DeepSeek API Key。API 调用产生的费用由使用者自己的 DeepSeek 账户承担。不要将个人 API Key 分享给他人。

## 当前功能限制

- 当前 AI 答题主要面向文本题目。
- 图片题暂未接入完整的图像识别处理流程。
- AI 生成的答案可能存在错误，建议自行核对。
- 不同课程平台、题型和页面结构可能影响实际识别效果。

## 项目来源与版权说明

本项目基于以下开源项目进行二次开发：

- 原项目： [ocsjs/ocsjs](https://github.com/ocsjs/ocsjs)
- 原项目官网： [https://docs.ocsjs.com](https://docs.ocsjs.com)
- 原项目许可证：MIT License

原项目的代码、版权声明及许可证文件予以保留。

本仓库新增的 DeepSeek AI 相关代码及修改由本仓库维护者完成。原项目作者及官方团队不对本二次开发版本提供背书或承担维护责任。

本项目遵循原项目适用的许可证要求。使用、修改和再分发时，请保留相应版权声明及许可证文件。

## 免责声明

本项目仅用于技术研究、软件开发和学习辅助。

AI 生成内容不保证准确性。使用者应遵守所在平台的用户协议及相关规定，并对自己的使用行为负责。

## 原项目致谢

感谢 [ocsjs/ocsjs](https://github.com/ocsjs/ocsjs) 原作者及贡献者提供优秀的开源项目。

本项目是在原项目基础上进行的功能扩展，感谢原作者的开源贡献。
