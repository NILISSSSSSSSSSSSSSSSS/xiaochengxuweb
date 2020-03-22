### 说明文档

    基于开发框架开发的微信小程序

### 文档结构

    config 乃taro 配置文件夹
    dist 乃 src目录经过编译后生成的 小程序 代码文档

    src -
        assets 静态资源文件夹 - 图片，通用样式等等
        components 组件 -
            tabBarPages 存放首页所在的所有tab页面
        config 配置文件 存放页面索引之类的
        http 封装的http 请求库 基于 rxjs
        metrics 静态尺寸库
        pages 页面组件
        plugins 引入外部插件，例如 im sdk
        service 具体的http服务
        static 存放大文件，不需要编译的js文件
        store reduce文件夹
            - actions 动作
            - constants 常量
            - reduces reduces对象
        types ts类型文件 集中管理
        utils 工具库
        app.scss 全局样式
        app.tsx 小程序入口文件
        index.html html模版