# wx-manage
微信公众号后台[wx-api](https://github.com/niefy/wx-api)项目管理系统界面，提供公众号菜单、自动回复、公众号素材、简易CMS、等管理功能，请注意本项目仅为管理后台界面，需配合后端程序[wx-api](https://github.com/niefy/wx-api)一起使用

### [☁项目后端](https://github.com/niefy/wx-api) | [📖使用文档](https://github.com/niefy/wx-manage/wiki) | [📊功能投票](https://wj.qq.com/s2/5896407/a381) | [🕓版本更新记录](https://github.com/niefy/wx-manage/wiki/更新记录-versions)

## 开发环境
- node.js

## 开发环境启动步骤
1. 启动[wx-api](https://github.com/niefy/wx-api)项目,具体流程参考对应项目介绍
2. 安装依赖

``` bash
npm install
```
2. 编译构建
``` bash
# 开发环境
npm run serve

# 生产环境
npm run build
```
3. 浏览器打开如下地址：
    - 首页：http://localhost:8001
    - 登录账号：admin / 123456

## [生产环境部署步骤](https://github.com/niefy/wx-manage/wiki/生产环境部署文档)

## 技术选型：
- 核心框架：Spring Boot 2.1
- 安全框架：Apache Shiro 1.4
- 持久层框架：MyBatis-Plus
- 公众号开发框架：[WxJava](https://github.com/Wechat-Group/WxJava)
- 后端脚手架：[renren-fast](https://gitee.com/renrenio/renren-fast)
- 页面交互：[Vue2.x](https://cn.vuejs.org/v2/guide/)
- UI框架：[ElementUI](https://element.eleme.cn/#/zh-CN/component/quickstart)
- 管理后台界面模板：[renren-fast-vue](https://gitee.com/renrenio/renren-fast-vue)
- 富文本编辑器：[tinymce5](https://www.tiny.cloud/docs/quick-start/)



## 截图
![公众号菜单](https://s1.ax1x.com/2020/04/10/GTq6sI.png)
![自动回复](https://s1.ax1x.com/2020/04/10/GTqyQA.png)
![模板消息配置](https://s1.ax1x.com/2020/04/18/JnKZhF.jpg)
![模板消息发送](https://s1.ax1x.com/2020/04/18/JnKEkT.jpg)
![粉丝管理](https://s1.ax1x.com/2020/04/18/JnKVtU.jpg)
![带参二维码](https://s1.ax1x.com/2020/04/18/JnKF00.jpg)
![媒体素材](https://s1.ax1x.com/2020/04/18/JnKmp4.jpg)
![文章编辑](https://s1.ax1x.com/2020/04/10/GTqrzd.png)
![系统菜单管理](https://s1.ax1x.com/2020/04/18/JnKk7V.jpg)
![管理员列表](https://s1.ax1x.com/2020/04/18/JnKimq.jpg)


## 开发进度
- [x] 公众号菜单管理
    - [x] 与微信端公众号一致的可视化界面
    - [x] 支持配置链接、点击事件、小程序等多种菜单
- [x] 公众号自动回复（使用更灵活的客服消息接口做自动回复）
    - [x] 支持配置关注事件、扫描带参二维码、接受消息等场景自动回复
    - [x] 支持一个事件或一条消息进行多次回复
    - [x] 精确匹配、模糊匹配、多关键词、可配置时段
    - [x] 文字回复
    - [x] 图片、语音、视频、图文素材等媒体形式回复
    - [x] 回复小程序卡片、回复菜单消息
- [x] 公众号带参二维码管理
    - [x] 可配置临时带参二维码、永久带参二维码
- [x] 公众号素材管理
    - [x] 图片、语音、视频、图文素材管理
    - [x] 支持需要素材ID时从素材库选择
- [X] 公众号粉丝管理
    - [x] 同步粉丝列表
    - [x] 关注/取关信息更新
    - [x] 标签管理
    - [x] 用户标签调整
- [X] 模板消息
    - [x] 提供demo（正常需根据业务场景去实现）
    - [x] 按用户标签推送自定义模板消息
- [x] 后台权限管理
    - [x] 可配置权限
    - [x] 动态后台菜单
    - [x] 数据字典
    - [x] 腾讯云、阿里云、七牛云对象存储
- [x] CMS文章
    - [x] 后台富文本文章编辑
    - [x] 微信端文章展示
- [x] 微信端
    - [x] 微信授权登录
    - [x] 微信分享
- [ ] 消息管理
    - [ ] 消息、事件列表
    - [ ] 消息回复
- [ ] 微信卡券
- [ ] 客服管理

## 开发交流
QQ群：1023785886 
