/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
//更新resource.js，清除了无用图片
var res = {
    //原始加载图标已改为网站图标favicon.ico
    //横幅广告，对应链接为"https://www.nudt.edu.cn/"
    ad: "res/ad.png",

    //七种方块
    block1: "res/1.1.png",
    block2: "res/2.1.png",
    block3: "res/3.1.png",
    block4: "res/4.1.png",
    block5: "res/5.1.png",
    block6: "res/6.1.png",
    block7: "res/7.1.png",
    //返回按钮
    back: "res/back.png",
    //返回图标
    backHome: "res/home.png",
    back_home: "res/back_home.png",
    //背景
    bg: "res/bg.png",
    //界面边框
    bk: "res/bk.png",
    //界面边框
    border: "res/border.jpeg",
    //暂停/游戏结束 背景
    boxBg: "res/boxBg.png",
    //BGM
    bgm: "res/bgm.m4a",

    //继续按钮
    continue: "res/continue.png",
    //复制按钮
    copy: "res/copy.png",
    //三种模式，challenge为挑战模式
    challenge: "res/challenge.png",

    //退出按钮
    exit: "res/exit.png",
    //三种模式，endless为无尽模式
    endless:"res/endless.png",

    //登录图标，已小幅度更改以适应字体
    login: "res/log_in.png",
    //三种模式，limited为限时模式
    limited: "res/limited.png",

    //模式选择
    mode_select: "res/mode_selection.png",
    //登录注册用边框
    modelwin: "res/model_win.png",

    //排名图标
    rank: "res/rank.png",
    //标题
    russiantower: "res/russian_tower.png",
    //重新开始图标
    restart: "res/spin.png",

    //注册图标，已小幅度更改以适应字体
    signup: "res/sign_up.png",
    //分享按钮
    share: "res/share.png",
    //旋转图标
    spin: "res/spin.png",
    //开始文字
    start: "res/start.png",
    //暂停按钮
    stop: "res/stop.png",

    //登录注册用边框
    textwin: "res/text_win.png",
    //重新开始文字
    try_again: "res/try_again.png",

    //边框UI，但似乎没有用到
    ui: "res/ui.png",

    //正确按钮，已修改尺寸
    v: "res/v.png",
    //音量开
    voice_on: "res/voice_on.png",
    //音量关
    voice_off: "res/voice_off.png",

    //错误按钮，已修改尺寸
    x: "res/x.png"
};

var g_resources = [
    {
        type: "font",
        name: "HyFWoolBall",
        srcs: ["res/fonts/HyFWoolBall.ttf"]
    }
];
for (var i in res) {
    g_resources.push(res[i]);
}
