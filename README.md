
# 俄罗斯大楼


## 开发环境

- `Python 2.7`
- `Cocos2d-x-3.17.2`
- `Cocos Console 2.3`
- `Apache Ant 1.9.16`
### 环境依赖

- `nodejs: v14.17.0`
- `serve: 12.0.1`



### 部署步骤

#### 0. 打包项目
项目打包在`publish`文件夹下
```bash
cocos compile -p web -m release
```

#### 1. 安装`serve`提供简易的http服务

```bash
npm install serve -g
```

#### 2. 进入项目目录
```bash
cd ./publish/html5
```

#### 3. 运行项目，在浏览器打开
```bash
serve
```

### 文件结构

```
├── README.md                   // ReadMe文档
├── frameworks                  // Cocos2d.js 框架
├── publish                     // 项目打包位置
├── res                         // 资源
│   ├── *.png                   // 图片资源
│   ├── fonts                   // 图片资源
│   │   ├── *.ttf               // 字体资源
│   ├── blocks.js               // 方块相关
│   └── loading.js              // 载入资源 & 载入动画
├── src                         // 源代码
│   ├── app.js                  // 游戏界面
│   ├── Home.js                 // 主界面 
│   ├── Login.js                // 游戏界面
│   ├── Model.js                // 菜单界面
│   ├── resource.js             // 资源载入
│   ├── matter.js               // Matter.js 物理引擎
│   └── decomp.js               // 多边形划分库
├── .cocos-project.json         // Cocos项目配置
├── project.json                // 前端项目配置
├── index.html                  // 入口网页
```



### 常见问题

#### 跨域问题

由于开发时前后端通信跨域了（前端用cocos run或serve运行，后端用nginx，端口不同），被chrome系浏览器阻止，需要配置一个开发用浏览器：

新建edge（chrome）快捷方式，右键属性，在目标一栏尾部加上`--disable-web-security --user-data-dir=[自定义数据路径]`

<img src="https://images.gitee.com/uploads/images/2022/0311/163505_845b765c_9692178.png" style="zoom:75%;" />

示例：

```
"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"  --disable-web-security --user-data-dir=D:\User\EdgeDevUserData
```



## 生产环境

### 环境依赖

原LNMP服务器配置：

- `ubuntu 18.04.1`
- `nginx 1.14.0`
- `mysql 5.7.36`
- `php 7.2`

因为服务器平台不靠谱，没发通知就迁移和回收资源，所以后端改为本地运行。

现本地WNMP配置：

- `windows10 21H1`
- `nginx 1.18.0`
- `mariaDB 10.5.10`
- `php 7.4.9`



### 部署步骤

- cocos项目需要调用后端api，注意修改要访问的ip、目录名

#### 0. 放置项目文件

- 将打包好的cocos项目放到nginx根目录（game）
- 设置nginx对php的代理，将php文件放到nginx下php对应目录（tetris）



#### 1. 数据库初始化

- 使用mysql建立数据库`tetris`，执行` sources db/*.sql`建立数据表
- 修改php文件中`db-begin.php`中的账户名、密码



#### 2. 启动服务器

使用下列代码开、关nginx及fastcgi-php（这里设置了fastcgi端口为8001）：

`php-start.bat`如下：

```bat
:set php and nginx path
set php_home=.\php-7.4.9-Win32-vc15-x64\
set nginx_home=.\nginx-1.18.0\
:启动php和nginx
RunHiddenConsole %nginx_home%\nginx.exe -p %nginx_home%
RunHiddenConsole %php_home%\php-cgi.exe -b 127.0.0.1:8001 -c %php_home%\php.ini
```

`php-stop.bat`如下：

```bat
taskkill /F /IM nginx.exe > nul 
taskkill /F /IM php-cgi.exe > nul  
```



#### 3. 运行项目

浏览器访问`localhost:[nginx端口]`



### 文件结构

```
├── db							// 数据库表文件
│   ├── auth.sql				// 身份鉴定表
│   ├── score.sql				// 分数表
│   └── user.sql				// 用户表
├── game						// 打包后游戏
├── nginx-1.18.0				// nginx环境，自行下载
├── php-7.4.9-Win32-vc15-x64	// php环境，自行下载
├── php-start.bat				// 启动脚本
├── php-stop.bat				// 关闭脚本
└── tetris						// 操作数据库，提供api
    ├── db_begin.php			// 连接数据库
    ├── login.php				// 登录
    ├── rank.php				// 获取排行榜
    ├── register.php			// 注册
    └── upload.php				// 上传分数
```



### 常见问题

#### 端口冲突问题

> 现在大家的nginx端口都是81，冲突问题应该很少了

描述：

    在window环境启动nginx时发生端口冲突，无法启动（后台看不到node进程，localhost不能正常访问）

解决：

    在`nginx/logs`查看日志，若报错：`bind() to 0.0.0.0:81 failed (10013: An attempt was made to access a socket in a way forbidden by its access permissions)`，可确定是81端口冲突问题。

    方法1：给nginx找一个未占用的端口；

    方法2：

    `netstat -aon|findstr "81"` 查询谁占了81端口

    `tasklist|findstr "XXX"` 查看81端口 pid=XXX对应的任务

    然后kill那个任务再重启nginx。



#### 跨域问题

描述：

    如果均用nginx代理已经不该有跨域发生了，除了localhost和127.0.0.1会被当成两个东西

解决：

    使用浏览器访问也是127.0.0.1:81，不要访问localhost:81。

