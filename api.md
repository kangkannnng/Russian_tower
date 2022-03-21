# Fetch说明

```js
// fetch封装，作用：前后端通信
// body是给服务器的json对象，服务器返回json
// 根据code码，如果为0（后端成功调用）调用fn，否则调用errorfn
// 最后的props不限个数，将传给被调用的函数处理
const Fetch = function(url, body, fn, errorfn, ...props) {
    fetch(`${url}?${body}`, {
        method: "get",
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => {
        let j = response.json();
        // console.log(j);
        return j;
    })
    .then(data => {
        console.log(data);
        if (data.code) {
            // 如果有报错，打印信息，终止调用
            errorfn(...props);
        } else {
            fn(data['data'], ...props);
        }
    });
}
```





# **返回的json字段说明**

```
code(int): 0代表成功，其他是报错码
msg(string): 错误信息
data: 数据
```

共4个接口，前端对应4个处理函数







# **分数排行榜接口**

**简要描述：**

- 后端根据参数的不同，可以返回总榜和各模式分榜
- 排行是长度小于等于10的数组，按照分数高低降序排列

**请求URL：**

- `http://127.0.0.1:81/rank.php`

**请求方式：**

- POST

**参数：**

| 参数名 | 必选 | 类型   | 说明                                      |
| :-----: | :---: | :-----: | :-------------------------------------:|
| mode   | 是   | string | 游戏模式（0代表总榜，其他数值代表各分榜） |

**处理函数示例**

```js
const rankUrl = "http://127.0.0.1:81/rank.php";

// 箭头函数的this取决于定义时的上下文，Bind()利用了这一点。
// 因为显示排行榜的Rank要在layer里用addChild，不绑定this就指向错的对象了
let Bind = (() => this);

// 给它data,显示排行榜信息
let Rank = function(data) {
    let text = "\n";

    for (let i in data) {
        text += `Player ${parseInt(i) + 1}: ${data[i]["玩家名"]}  Score: ${data[i]["分数"]}\n`
    }
    // console.log(text);
    let rankLabel = new cc.LabelTTF(text, "Arial", 48, cc.TEXT_ALIGNMENT_LEFT);
    rankLabel.x = size.width / 2;
    rankLabel.y = size.height / 2;
    rankLabel.setFontFillColor(cc.color(20, 100, 100, 50));
    rankLabel.enableStroke(cc.color(255, 255, 255, 20));

    Bind().addChild(rankLabel, 5);
}

// 调用Fetch示例
Fetch(rankUrl, "mode=0", Rank, errorfn);
```

**返回示例**

```json
{
	"code": 0,
	"msg": "",
    "data": 
    [
        {
        "玩家名": "mo",
        "分数": "300"
        },
        {
        "玩家名": "XXX",
        "分数": "200"
        },
        {
        "玩家名": "emu",
        "分数": "100"
        },
        {
        "玩家名": "test",
        "分数": "80"
        },
        {
        "玩家名": "oo",
        "分数": "20"
        }
    ]
}
```

**返回参数说明**

| 参数名 | 类型   | 说明                         |
| :-----: | :-----: | :--------------------------: |
| 玩家名 | string | -                            |
| 分数   | int    | 非负，玩家在该模式下的最高分 |





# **用户登录接口**

**请求URL：**

- `http://127.0.0.1:81/login.php`

**请求方式：**

- POST

**参数：**

| 参数名   | 必选 | 类型   | 说明   |
| :------: | :--: | :----: | :-----: |
| id | 是   | string | 用户名 |
| password | 是   | string | 密码   |

**处理函数示例**

```js
const loginUrl = "http://127.0.0.1:81/login.php";

let body1 = `id=${id}&password=${password}`,

// 调用Fetch示例，把token存到localStorage
Fetch(loginUrl, body1, (data) => { localStorage.token = data["token"]; }, errorfn);
```

**返回示例**

```json
{
	"code": 0,
    "msg": "",
    "data": [
      	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
    ]
}
```

**返回参数说明**

| 参数名 | 类型   | 说明                            |
| :----: | :----: | :-----------------------------: |
| token  | string | JWT(json web令牌，用于身份验证) |





# **用户注册接口**

**请求URL：**

- `http://127.0.0.1:81/register.php`

**请求方式：**

- POST

**参数：**

| 参数名   | 必选 | 类型   | 说明   |
| :------: | :--: | :----: | :-----: |
| id | 是   | string | 用户名 |
| password | 是   | string | 密码   |

**处理函数示例**

```js
const registUrl = "http://127.0.0.1:81/register.php";

// 检查合法性（表单准备提交时）
let Reg = /([-_a-zA-Z0-9])$/;
let id = "hoverload";
let password = "temp";

if (id === "") {
    alert("ID不能为空");
    // return false;
}
if (!Reg.test(password)) {
    alert("密码只能包含英文字母、数字和下划线");
    // return false;
}
if ((password.length > 20) || (id.length > 20)) {
    alert("密码长度不可超过20");
    // return false;
}

let body2 = `id=${id}&password=${password}`,

// 调用Fetch示例
// 后续处理：id冲突了应该显示报错(errorfn)
Fetch(registUrl, body2, fn, errorfn);
```

**返回示例**

```json
{
	"code": 0,
    "msg": "",
    "data":[]
}

{
	"code": 1,
    "msg": "用户名已被占用",
    "data":[]
}
```





# **分数上传接口**

**请求URL：**

- `http://127.0.0.1:81/upload.php`

**请求方式：**

- POST

**参数：**

| 参数名 | 必选 | 类型   | 说明     |
| :----: | :----: | :----: | :-------: |
| score  | 是   | int    | 本次分数 |
| mode   | 是   | string | 游戏模式 |
| token  | 是   | string | 身份令牌 |

**处理函数示例**

```js
const uploadUrl = "http://127.0.0.1:81/login.php";

//从变量获取！
let score = "66";
let mode = "1";
let token = "iamatoken";

let body3 = `score=${score}&mode=${mode}&token=${localStorage.token}`
}

// 调用Fetch示例
Fetch(uploadUrl, body3, fn, errorfn);
```

**返回示例**

```json
{
	"code": 0,
    "msg": "",
    "data":[]
}

{
	"code": 1,
    "msg": "身份验证失败",
    "data":[]
}
```

