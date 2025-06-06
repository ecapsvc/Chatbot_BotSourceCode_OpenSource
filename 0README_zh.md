<p align="center">  
<a href="https://botfront.io">  
    <img src="botfront_animation.gif" width="100%">  
</a>  
</p>  
  
<p align="center">  
<a href="https://github.com/botfront/botfront/actions">  
    <img src="https://github.com/botfront/botfront/workflows/build/badge.svg" />  
</a>  
<a href="https://www.npmjs.com/package/botfront">  
    <img alt="npm" src="https://img.shields.io/npm/v/botfront.svg">  
</a>  
<a href='https://github.com/botfront/botfront/blob/master/LICENSE'>  
    <img alt="License" src="https://img.shields.io/badge/license-AGPLv3-blue.svg">  
</a>  
<a href='https://spectrum.chat/botfront'>  
    <img alt="License" src="https://withspectrum.github.io/badge/badge.svg">  
</a>  
</p>  
  
<p align="center">  
  <a href="#highlights">亮点</a> •  
  <a href="#features">功能</a> •  
  <a href="#quick-start">快速开始</a> •  
  <a href="#documentation">文档</a> •  
  <a href="#development">开发</a>  
</p>  
<p align="center">  
  <a href="./CHANGELOG.md">发布说明</a> •  
  <a href="https://spectrum.chat/botfront">获取帮助</a> •  
  <a href="https://botfront.io">Botfront.io</a>  
</p>  
  
<br/>  
<h2 align="center">它是什么</h2>  
  
构建对话项目需要易于原型设计、快速实施和持续迭代。使用 **[Botfront](https://botfront.io)**，你可以在几分钟内构建出具有上下文意识的对话流程，并通过指数因子加速上市时间。  
<br/>  
<h2 name="highlights" align="center">亮点</h2>  
  
<center>  
<table>  
  <tr>  
    <th><h2>😎</h2><h3>易于使用</h3></th>  
    <th><h2>🎓</h2><h3>强大</h3></th>  
    <th><h2>💻️</h2><h3>对开发者友好</h3></th>  
  </tr>  
  <tr>  
    <td width="33%">我们的主要目标是降低进入对话式 AI 的技术门槛。实施具有上下文意识的对话应该像聊天一样简单。</td>  
    <td width="33%">Botfront 使用了 <strong><a href="https://github.com/rasaHQ/rasa" target="_blank">Rasa</a></strong>，这是一个强大且适用于生产的对话式 AI 库。Botfront 公开了所有 Rasa 的功能，并抽象了其复杂性。</td>  
    <td width="33%">Botfront 的直观 CLI 可以在你的开发机器上协调 Botfront 的所有服务。<br/>编写、训练、自动重新加载操作代码，一切都能正常工作！</td>  
  </tr>  
</table>  
</center>  
  
<br/>  
<h2 name="features" align="center">功能</h2>  
<table>  
<tr>  
    <td width="33%"><h4>构建对话，就像你在聊天</h4></td>  
    <td width="67%">Botfront 提供了<a href="https://botfront.io/docs/rasa/conversation-builder">独特且自然的对话创作体验</a>。你可以在几分钟内创建复杂的对话流程。</td>  
</tr>  
<tr>  
    <td width="33%"><h4>训练和评估 NLU 模型</h4></td>  
    <td width="67%">Botfront 提供了完整的 NLU 工具箱。你可以有效地标注大量数据，训练和评估模型。<a href="https://botfront.io/docs/rasa/nlu/evaluation/#evaluation-methods">根据模型的开发阶段，有多种评估方法可用。</a></td>  
</tr>  
<tr>  
    <td width="33%"><h4>注释传入数据</h4></td>  
    <td width="67%">Botfront 始终连接到你的代理，对话数据不断流入。你可以注释这些数据，甚至使用它作为评估集，检查这些新数据如何改进你的模型。</td>  
</tr>  
<tr>  
    <td width="33%"><h4>Rasa 集成</h4></td>  
    <td width="67%">Botfront 公开了所有 Rasa 功能和概念，并使它们能够在更高层次上访问，以加快开发速度。你可以随时<a href="https://botfront.io/docs/import-export/">导出 Botfront 项目并与 Rasa 一起使用</a>。</td>  
</tr>  
</table>  
<br/>  
<h2 name="quick-start" align="center">快速开始</h2>  
  
Botfront 只需要最新版本的 Docker。你可以使用以下命令安装 CLI：  
  
```bash  
npm install -g botfront  
```
```markdown  
然后只需运行 `botfront` 来开始。  
  
<!-- 损坏的图片。由于不确定是否应该删除，因此已注释掉 -->  
<!-- <img src="/botfront/docs/terminalizer/botfront-setup.gif?raw=true" width="100%"> -->  
  
<br/>  
<h2 name="documentation" align="center">文档</h2>  
  
Botfront 的[官方文档](https://botfront.io/docs/getting-started/setup)托管在 [botfront.io](https://botfront.io/docs/getting-started/setup) 上。每次发布新版本时，文档都会自动构建和更新。安装了 cli 之后，你也可以使用 `botfront docs` 来打开它。  
  
  
  
<h2 name="development" align="center">开发</h2>  
  
### 安装  
  
1. Botfront 是一个 Meteor 应用，所以第一步是[安装 Meteor](https://www.meteor.com/install)  
2. 然后克隆这个仓库并安装依赖：  
```bash  
git clone https://github.com/botfront/botfront  
cd botfront/botfront  
meteor npm install  
```  
3. 从源代码安装 CLI：  
```bash  
# 如果你从 npm 安装了 Botfront，请卸载它。  
npm uninstall -g botfront  
# 从源代码安装 cli  
cd cli && npm link  
```  
Botfront 需要连接到其他服务，特别是 Rasa。为此，你需要创建一个常规项目，并使用专用配置启动 Botfront：  
  
1. 用 `botfront init` 创建一个 Botfront 项目（在仓库外的其他地方）  
2. 使用 `botfront up -e botfront` 启动你的项目。这将运行除了 Botfront 应用之外的所有服务，因为你将使用 Meteor 在本地运行它  
3. 返回到 botfront 检出 `cd botfront/botfront` 并使用 `meteor npm run start:docker-compose.dev` 运行 Botfront。Botfront 将在 [http://localhost:3000](http://localhost:3000) 可用，所以打开你的浏览器，愉快地编辑 :smile_cat:  
  
### 故障排除  
  
如果遇到问题，以下一些 [botfront cli](https://github.com/botfront/botfront/blob/master/cli/src/cli.js) 命令可能会有帮助：  
  
```shell  
botfront init     # 创建一个新的 botfront 项目  
botfront logs     # 显示日志！  
botfront killall  # 停止所有 docker 服务  
botfront down     # 停止所有 botfront 服务  
botfront up       # 重启 botfront  
botfront docs     # 在你的浏览器中打开文档  
```  
  
请注意，这些应该在与你的 botfront 项目相同的目录中运行  
  
### 贡献  
  
我们 ❤️ 各种大小的贡献。如果你发现了一个错别字，如果你想改进文档的某个部分，或者你想帮助修复一个 bug 或一个功能，这里是步骤：  
  
1. Fork 仓库并创建一个新分支，比如 `fix-botfront-typo-1`  
2. 修复/改进代码库  
3. 提交更改。**提交信息必须遵循[命名规范](#commit-messages-naming-convention)**，比如 `fix(conversation builder): display story groups in alphabetical order`  
4. 发起一个拉取请求。**拉取请求名称必须遵循[命名规范](#commit-messages-naming-convention)**。它可以简单地是你的一个提交信息，只需复制粘贴它，例如 `fix(readme): improve the readability and move sections`  
5. 提交你的拉取请求并等待所有检查通过（最多一个小时）  
6. 请求来自我们核心团队的一位开发者的审查。  
7. 得到一个 👍 并且 PR 被合并。  
  
做得好！一旦 PR 被合并，接下来会发生以下事情：  
- 所有标记为 `branch-master` 的 Docker 镜像将在一小时内自动更新。你可以在 [Actions](https://github.com/botfront/botfront/actions) 标签页上检查状态。  
- 你的贡献和提交将被包含在[我们的发布说明](https://github.com/botfront/botfront/blob/master/CHANGELOG.md)中。  
  
### 测试  
  
端到端测试使用 Cypress 测试框架。  
  
要手动运行 Cypress 测试，你需要在开发模式下运行 Botfront。有些测试还需要 Rasa 可用。  
  
一旦你在仓库的根目录，你可以输入以下内容。  
  
```bash  
cd botfront  
# 如果你想打开 Cypress 的图形界面  
npx cypress open  
# 如果你想在无头模式下运行整个套件  
# 这可能需要长达一个小时，具体取决于你的电脑  
npx cypress run  
# 如果你想运行一个特定的测试  
npx cypress run --spec "cypress/integration/02_training/training.spec.js"  
```  
### git 提示   
  
```text  
配置你的 git 用户名  
$ git config --global user.name "username"  
```  
  
```text  
配置你的 git 邮箱  
$ git config --global user.email "email"  
```  
### 提交信息命名规范  
  
为了帮助每个人理解 Botfront 的提交历史，我们使用 [`commitlint`](https://commitlint.js.org/#/) 来强制提交样式：  
  
```text  
type(scope?): subject  
```  
  
其中 `type` 是以下之一：  
  
- build  
- ci  
- chore  
- docs  
- feat  
- fix  
- perf  
- refactor  
- revert  
- style  
- test  
  
`scope` 是可选的，表示你的提交正在处理的模块。  
  
`subject` 解释了提交。  
  
例如，一个改进文档的提交：  
```text  
docs(conversation builder): update slots manager screenshot.  
```  
<br/>  
<h2 align="center">许可证</h2>  
  
Botfront 是根据 [AGPLv3](https://github.com/botfront/botfront/blob/master/LICENSE) 许可证授权的。你可以在[这里](https://github.com/botfront/botfront/blob/master/LICENSE)阅读许可证。  
  
<sub>  
版权所有 (C) 2019 9300-2038 Quebec Inc. 保留所有权利。  
</sub>  
  
```
