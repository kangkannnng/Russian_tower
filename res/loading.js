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



(function () {
    var createStyle = function () {
        return ".loader {background: #000;background: radial-gradient(#222, #000);bottom: 0;left: 0;overflow: hidden;position: fixed;right: 0;top: 0;z-index: 99999;}"+".loader-inner {bottom: 0;height: 60px;left: 0;margin: auto;position: absolute;right: 0;top: 0;width: 100px;}"+".loader-line-wrap {animation:spin 2000ms cubic-bezier(.175, .885, .32, 1.275) infinite;box-sizing: border-box;height: 50px;left: 0;overflow: hidden;position: absolute;top: 0;transform-origin: 50% 100%;width: 100px;}"+".loader-line {border: 4px solid transparent;border-radius: 100%;box-sizing: border-box;height: 100px;left: 0;margin: 0 auto;position: absolute;right: 0;top: 0;width: 100px;}"+".loader-line-wrap:nth-child(1) { animation-delay: -50ms; }"+".loader-line-wrap:nth-child(2) { animation-delay: -100ms; }"+".loader-line-wrap:nth-child(3) { animation-delay: -150ms; }"+".loader-line-wrap:nth-child(4) { animation-delay: -200ms; }"+".loader-line-wrap:nth-child(5) { animation-delay: -250ms; }"+".loader-line-wrap:nth-child(1) .loader-line {border-color: hsl(0, 80%, 60%);height: 90px;width: 90px;top: 7px;}"+".loader-line-wrap:nth-child(2) .loader-line {border-color: hsl(60, 80%, 60%);height: 76px;width: 76px;top: 14px;}"+".loader-line-wrap:nth-child(3) .loader-line {border-color: hsl(120, 80%, 60%);height: 62px;width: 62px;top: 21px;}"+".loader-line-wrap:nth-child(4) .loader-line {border-color: hsl(180, 80%, 60%);height: 48px;width: 48px;top: 28px;}"+".loader-line-wrap:nth-child(5) .loader-line {border-color: hsl(240, 80%, 60%);height: 34px;width: 34px;top: 35px;}"+ "@keyframes spin {0%, 15% {transform: rotate(0);}100% {transform: rotate(360deg);}}";
    };
    var createDom = function (id, num) {
        id = id || "cocosLoading";
        num = num || 5;
        var i, item, item_inner;
        var div = document.createElement("div");
        div.className = "loader";
        var div_inner = document.createElement("div")
        div_inner.className = "loader-inner";

        var list = [];
        for (i = 0; i < num; i++) {
            item = document.createElement("div");
            item.className = "loader-line-wrap";
            item_inner = document.createElement("div");
            item_inner.className = "loader-line";

            item.appendChild(item_inner);
            div_inner.appendChild(item)
        }
        div.appendChild(div_inner);
        document.body.appendChild(div);
        return div
    };
    // var createDom = function (id, num) {
    //     id = id || "cocosLoading";
    //     num = num || 5;
    //     var i, item;
    //     var div = document.createElement("div");
    //     div.className = "cocosLoading";
    //     div.id = id;
    //     var bar = document.createElement("ul");
    //     var list = [];
    //     for (i = 0; i < num; i++) {
    //         item = document.createElement("li");
    //         list.push({ball: document.createElement("div"), halo: null});
    //         item.appendChild(list[list.length - 1].ball);
    //         bar.appendChild(item)
    //     }
    //     var span = document.createElement("span");
    //     span.innerHTML = "Loading";
    //     div.appendChild(bar);
    //     div.appendChild(span);
    //     document.body.appendChild(div);
    //     return list
    // };
    var startAnimation = function (list, callback) {
        var index = 0;
        var direction = true;
        var time = 300;
        var animation = function () {
            setTimeout(function () {
                if (callback && !callback()) {
                    return
                }
                var item = list[index];
                if (direction) {
                    item.ball.className = "ball"
                } else {
                    item.ball.className = "unball"
                }
                index++;
                if (index >= list.length) {
                    direction = !direction;
                    index = 0;
                    time = 1000
                } else {
                    time = 300
                }
                animation()
            }, time)
        };
        animation()
    };
    (function () {
        var bgColor = document.body.style.background;
        document.body.style.background = "#000";
        var style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = createStyle();
        document.head.appendChild(style);
        var div = createDom();
        // setTimeout(function () {
        //         document.body.removeChild(div);
        //     },
        //     2500
        // );
        // startAnimation(list, function () {
        //     var div = document.getElementById("cocosLoading");
        //     if (!div) {
        //         document.body.style.background = bgColor
        //     }
        //     return !!div
        // })
    })()
})();