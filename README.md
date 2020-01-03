# wx-manage
微信公众号后台[wx-api](https://github.com/niefy/wx-api)项目管理系统界面，提供公众号菜单、自动回复、公众号素材、简易CMS、等管理功能


## 开发环境
- node.js

## 启动步骤
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


## 技术选型：
- 页面交互：[Vue2.x](https://cn.vuejs.org/v2/guide/)
- UI框架：[ElementUI](https://element.eleme.cn/#/zh-CN/component/quickstart)
- 后台模板：[renren-fast-vue](https://gitee.com/renrenio/renren-fast-vue)
- 富文本编辑器：[tinymce5](https://www.tiny.cloud/docs/quick-start/)

## 截图
![公众号菜单](https://raw.githubusercontent.com/niefy/wx-manage/master/screenshoot/菜单管理.png)
![带参二维码](https://raw.githubusercontent.com/niefy/wx-manage/master/screenshoot/带参二维码.png)
![文章编辑](https://raw.githubusercontent.com/niefy/wx-manage/master/screenshoot/文章编辑.png)
![自动回复](https://raw.githubusercontent.com/niefy/wx-manage/master/screenshoot/自动回复.png)