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

var Engine=Matter.Engine,
    World=Matter.World,
    Bodies=Matter.Bodies,
    Body = Matter.Body,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint,
    Composites = Matter.Composites,
    Composite = Matter.Composite,
    Common = Matter.Common,
    Vertices = Matter.Vertices;



var GameLayer = cc.Layer.extend({
    _initMode: 1,
    _thisBlock: null,
    _nextBlock: null,
    _topBlock: null,
    _moveDirection: 1,
    _rotateSpeed: 3.14 / 100 * 30,
    _blockList: [],
    _maxHeight: 0,
    _maxScore: 0,
    timeCount: 0,
    _scoreLabel: null,
    _restBlockLabel: null,
    _restTimeLabel: null,
    _isRotating: false,
    _lastClick: 0,
    _startTime: 0,
    restBlock: 0,
    ispause: false,
    changeBlock: function() {
        this._thisBlock = this._nextBlock;
        this._nextBlock = blocks.choose();
        return this._thisBlock;
    },
    getScore: function() {
        return this._maxScore;
    },
    initData: function() {
        this.ispause = false;
        this._thisBlock = blocks.choose();
        this._nextBlock = blocks.choose();
        this.restBlock = config.maxBoxes;
        this._startTime = new Date();
    },
    initPhysics: function () {

        Common.setDecomp(decomp);

        var width = cc.winSize.width;
        var height = cc.winSize.height;

        this.engine=Engine.create({
            enableSleeping: true
        });
        this.world=this.engine.world;
        this.engine.gravity.y = -1;

        var ground=Bodies.rectangle(width/2,-30,width,60,{
            isStatic:true,
            friction:1,
            frictionStatic:1
        });

        World.add(this.world,ground);

    },
    initUI: function () {
        var size = cc.winSize;
        var bgSprite = new cc.Sprite(res.bg);
        bgSprite.attr({
            x:size.width/2,
            y:size.height/2,
            scale:0.5
        });
        this.addChild(bgSprite);

        var label = new cc.LabelTTF(
            "Score：   0",
            "HyFWoolBall",
            32,
            cc.size(200,500),
            cc.TEXT_ALIGNMENT_LEFT,
            cc.VERTICAL_TEXT_ALIGNMENT_CENTER
        );
        label.setPosition(cc.p(300, 730));
        label.setColor(cc.color(0, 0, 0, 255));
        this.addChild(label);
        this._scoreLabel = label;

        if(config.deadRule === 2)
        {
            var label2 = new cc.LabelTTF(
                "Rest：" + this.restBlock,
                "HyFWoolBall",
                32,
                cc.size(200,500),
                cc.TEXT_ALIGNMENT_LEFT,
                cc.VERTICAL_TEXT_ALIGNMENT_CENTER
            );
            label2.setPosition(cc.p(120, 730));
            label2.setColor(cc.color(0, 0, 0, 255));
            this.addChild(label2);
            this._restBlockLabel = label2;
        }

        if(config.deadRule === 3)
        {
            var label3 = new cc.LabelTTF(
                "RestTime：" + this.timeLimit,
                "HyFWoolBall",
                25,
                cc.size(200,500),
                cc.TEXT_ALIGNMENT_LEFT,
                cc.VERTICAL_TEXT_ALIGNMENT_CENTER
            );
            label3.setPosition(cc.p(120, 730));
            label3.setColor(cc.color(0, 0, 0, 255));
            this.addChild(label3);
            this._restTimeLabel = label3;
        }

    },
    initScroll: function () {
        var size = cc.winSize;
        this.listView = new ccui.ScrollView();
        this.listView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        this.listView.setTouchEnabled(true);
        this.listView.setSize(cc.size(size.width / 8 * 7, size.height/5*4));
        this.listView.x = size.width / 2;
        this.listView.y = size.height / 5 * 3 - 20 - 100;
        this.listView.setAnchorPoint(cc.p(0.5,0.5));

        this.listView.setInnerContainerSize(cc.size(size.width,size.height/5*4));

        this.addChild(this.listView);

        // this.listView.addClickEventListener(this.scrollTouchBegan);
        this.listView.addTouchEventListener(this.scrollTouch);
        this.listView.father = this;
        this.listView.createShap = this.createShap
        this.listView.world = this.world
        this.listView.getBlock = this.getBlock;
        this.listView.thisBlock = this._thisBlock;
        this.listView.topBlock = this._topBlock;
        this.listView.getInnerPosition = function(p){
            var x0 = this.x - this.anchorX * this.width;
            var y0 = this.y - this.anchorY * this.height;
            return {x: p.x - this.getInnerContainerPosition().x - x0,
                y: p.y - this.getInnerContainerPosition().y - y0};
        }
        this.listView.addBlock = this.addBlock;

        var gameBorder = new cc.Sprite(res.bk);
        gameBorder.attr({
            x: size.width / 2,
            y: size.height / 2 + 60 - 100,
            scaleX: 0.395,
            scaleY: 0.415
        });

        this.addChild(gameBorder);


    },
    updateScrollHeight: function() {
        var sz = this.listView.getInnerContainerSize();
        var p = this.listView.getInnerContainerPosition();
        this.listView.setInnerContainerSize(cc.size(sz.width, sz.height * 1.5));
        this.listView.setInnerContainerPosition(p);
    },
    initTopBlock: function() {
        this._topBlock = new cc.Sprite(this._thisBlock.imgPath);
        this.addChild(this._topBlock);

        var p = this.listView.getSize();
        this._topBlock.setScale(this._thisBlock.scale);
        this._topBlock.setPosition(cc.p(
            this.listView.x - p.width / 2 + this._topBlock.width * this._thisBlock.scale / 2,
            this.listView.y + p.height / 2 - 60)
        );
        this._topBlock.setAnchorPoint(this._thisBlock.offset[0], this._thisBlock.offset[1]);
    },
    createTopBlock: function(pos) {
        var block = this.changeBlock();
        this._topBlock = new cc.Sprite(block.imgPath);
        this.addChild(this._topBlock);

        var p = this.listView.getSize();
        this._topBlock.setScale(block.scale);
        this._topBlock.setPosition(pos);
        this._topBlock.setAnchorPoint(block.offset[0], block.offset[1]);
    },
    updateTopBlock: function() {
        var L = this.listView.x - this.listView.width / 2;
        var R = this.listView.x + this.listView.width / 2;
        this._topBlock.x += this._moveDirection;

        if(this._isRotating)
            this._topBlock.rotation +=  this._rotateSpeed;


        if(this._topBlock.x < L)
        {
            this._topBlock.x = L;
            this._moveDirection = -this._moveDirection;
        }
        if(this._topBlock.x > R)
        {
            this._topBlock.x = R;
            this._moveDirection = -this._moveDirection;
        }

    },
    addBlock: function (block, position) {
        var sprite = new cc.Sprite(block.imgPath);
        this.addChild(sprite);
        sprite.setAnchorPoint(block.offset[0], block.offset[1]);
        sprite.setPosition(position);
        sprite.setScale(block.scale);
        var body = this.createShap(position, 0, block.vertexSets, 0, 1, 1, 0.01, sprite);

    },

    gameOver: function() {
        this.ispause = true;
        this.listView.pause();
        this.gameOverCallBack();
    },
    scrollTouch: function(ref, type) {
        if(type == 1) {
            if(ref._touchMovePosition.x < this.x)
                this.father._rotateSpeed =
                    this.father._rotateSpeed > 0 ? -this.father._rotateSpeed : this.father._rotateSpeed;
            else
                this.father._rotateSpeed =
                    this.father._rotateSpeed > 0 ? this.father._rotateSpeed : -this.father._rotateSpeed;
        }
        if(type == 0) {
            this.father.timeCount += 1;

            if(ref._touchBeganPosition.x < this.x)
                this.father._rotateSpeed =
                    this.father._rotateSpeed > 0 ? -this.father._rotateSpeed : this.father._rotateSpeed;
            else
                this.father._rotateSpeed =
                    this.father._rotateSpeed > 0 ? this.father._rotateSpeed : -this.father._rotateSpeed;

        }else
        if(type >= 2) {
            if(this.father.timeCount < config.pressTime) {
                if(ref._touchBeganPosition.x === ref._touchEndPosition.x &&
                    ref._touchBeganPosition.y === ref._touchEndPosition.y)
                {
                    var timeValue = new Date();
                    if(timeValue.valueOf() - this.father._lastClick >= config.clickInterval)
                    {
                        this.father._lastClick = timeValue.valueOf();

                        if(config.deadRule === 2 && this.father.restBlock <= 0) {
                            this.father.gameOver();
                            return ;
                        }
                        this.father.restBlock -= 1;
                        if(config.deadRule === 2)
                            this.father._restBlockLabel.setString("Rest：" + this.father.restBlock);

                        if(config.deadRule === 3) {
                            if(timeValue - this.father._startTime > config.timeLimit * 1000) this.father.gameOver();
                        }

                        var p = cc.p(this.father._topBlock.x, this.father._topBlock.y);
                        var body = this.father.createShap(ref.getInnerPosition(p), this.father._topBlock.rotation,
                            this.father._thisBlock.vertexSets, 0, 1, 1, 0.01, this._topBlock);
                        this.father._topBlock.removeFromParent();
                        this.addChild(this.father._topBlock);

                        this.father.createTopBlock(p);

                    }
                }
            }
            this.father.timeCount = 0;
            this.father._isRotating = false;
        }
    },
    scrollTouchBegan: function(ref, type) {

        if(ref._touchBeganPosition.x === ref._touchEndPosition.x &&
            ref._touchBeganPosition.y === ref._touchEndPosition.y)
        {
            // p = ref.getInnerPosition(ref._touchBeganPosition);
            var p = cc.p(this.father._topBlock.x, this.father._topBlock.y);
            var body = this.father.createShap(ref.getInnerPosition(p),
                this.father._thisBlock.vertexSets, 0, 1, 1, 0.01, this._topBlock);
            this.father._topBlock.removeFromParent();
            this.addChild(this.father._topBlock);

            this.father.createTopBlock(p);
            // p = ref.getInnerPosition(cc.p(this._topBlock.x, this._topBlock.y));
            // ref.addBlock(block, p);
        }
    },
    updatePhysicsWorld: function() {


        Engine.update(this.engine, delta=16.6666);
        //枚举世界中的所有物体，找出有userdata的物体，强制转化为精灵
        var allBodies = this._blockList; //Composite.allBodies(this.world);
        var delList = [];
        for (var i = 0; i < allBodies.length; i += 1) {
            var body = allBodies[i];
            var spr = body.UserData;
            if (spr) { //获取物体的坐标并转换成cocos2d的坐标
                this.topHight = Math.max(this.topHight, body.position.y)
                var pos = cc.p(body.position.x, body.position.y);
                var rotation = -1 * 180 / 3.141 * (body.angle); //转换角度
                spr.setPosition(pos); //设置精灵坐标
                spr.setRotation(rotation); //设置精灵角度
                if(pos.y < 0 && (pos.x < 0 || pos.x > this.listView.x + this.listView.width / 2)) {
                    delList.push([body, i]);
                    if(config.deadRule == 1) {
                        this.gameOver();
                    }
                    // 这里是做了一个物体滚出屏幕后删除的操作，防止不在视觉内的物体 空占用内存。
                }
            }
        }


        for(var i = 0; i < delList.length; i += 1) {
            var body = delList[i][0];
            var spr = body.UserData;
            spr.removeFromParent();
            World.remove(this.world, body);
            allBodies.splice(delList[i][1], 1);
        }

        if(this.ispause) return ;


        this._blockList = allBodies;
        this._maxHeight = 0;

        for (var i = 0; i < allBodies.length; i += 1) {
            if(allBodies[i].isSleeping) {
                this._maxHeight = Math.max(this._maxHeight, allBodies[i].position.y);
            }
        }
        this._maxScore = Math.max(this._maxScore, this._maxHeight);
        if(this._maxScore > this.listView.getInnerContainerSize().height / 4 * 3)
            this.updateScrollHeight();
            this._scoreLabel.setString("Score：" + parseInt(this._maxScore));
        var now = new Date();
        if(config.deadRule === 3)
            this._restTimeLabel.setString("RestTime：" +
                Math.max(parseInt(config.timeLimit - (now - this._startTime)/1000), 0));
    },

    updateListView: function() {
        if(this._initMode) {
            this.listView.setInnerContainerPosition(cc.p(0, 0));
            this._initMode = 0;
        }
    },

    update: function (dt) {

        if(this.ispause) return ;
        if(this.isPause) return ;

        this.listView._topBlock = this._topBlock;
        if(this.timeCount >= 1) {
            this.timeCount += 1;
        }
        if(this.timeCount >= config.pressTime) {
            this._isRotating = true;
        }
        this.updatePhysicsWorld();
        this.updateListView();
        this.updateTopBlock();


    },
    showDebug: function () {
        // this._debugNode = new cc.PhysicsDebugNode(this.world);
        // this._debugNode.visible = true;
        // this.addChild(this._debugNode);
    },

    ctor: function () {
        this._super();
        this._maxScore = 0;
        this._maxHeight = 0;
        this._blockList = [];
        this.initData();
        this.initPhysics();
        this.initUI();
        this.initScroll();
        this.initTopBlock();
        this.scheduleUpdate();
        this.showDebug();
    },
    onEnter: function () {
        this._super();
    },
    onExit: function () {
        this._super();
    },
    createBox: function (position, width, height, isStatic, density, friction, restitution, userData) {

        var body = Bodies.rectangle(position.x, position.y, width, height, {
            isStatic:isStatic
        });
        Body.setDensity(body, density);
        body.friction = friction;
        body.restitution = restitution;
        body.frictionStatic = 1;
        World.add(this.world, body);
        if (userData) {
            body.UserData = userData;
        }
        return body;
    },
    createShap: function (position, angle, vertexSets, isStatic, density, friction, restitution, userData) {
        var body = Bodies.fromVertices(position.x, position.y, Vertices.fromPath(vertexSets), {
            isStatic:isStatic
        });
        Body.setDensity(body, density);
        body.friction = 1;
        body.restitution = restitution;
        Body.setAngle(body, -1 / 180 * 3.141 * angle);
        World.add(this.world, body);
        if (userData) {
            body.UserData = userData;
        }
        this._blockList.push(body);
        return body;
    },
    TouchBegan: function (touch, event) {

    }
});

var PauseBox = cc.LayerColor.extend({
    _maskListener: null,
    _continue: null,
    _backhome: null,
    score: 0,
    ctor: function(father) {
        this.father = father;
        this._super(cc.color.BLACK);
        this.setOpacity(128);
        this._initDialog();
        this._maskListener = new cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
        });

        this._maskListener.setSwallowTouches(false);
        cc.eventManager.addListener(this._maskListener, this);

    },
    _initDialog: function()
    {
        var size =  cc.winSize;
        var bgSprite = new cc.Sprite(res.bg);
        bgSprite.attr({
            x:size.width/2,
            y:size.height/2,
            scaleX:0.3,
            scaleY:0.05,
        });
        this.addChild(bgSprite);


        var restart = new RestartButton(res.spin);
        restart.attr({
            x:size.width/2 + 80,
            y:size.height/2,
            scale:0.5,
        });
        restart.onTouch = this.restart.bind(this);
        this.addChild(restart);


        var con = new RestartButton(res.continue);
        con.attr({
            x:size.width/2,
            y:size.height/2,
            scale:0.5,
        });
        con.onTouch = function() {
            if(this.isVisible()){
                this.father.playLayer.resume();
                this.father.playLayer.listView.resume();
                this.hidden();
            }
        }.bind(this);
        this.addChild(con);
        this._continue = con;

        this._backhome = new RestartButton(res.back);
        this._backhome.attr({
            x:size.width/2 - 80,
            y:size.height/2,
            scale:0.5,
        });
        this._backhome.onTouch = function() {
            if(this.isVisible()) {
                this.hidden();
                cc.director.runScene(new HomeScene());
            }
        }.bind(this);
        this.addChild(this._backhome);
        this.setVisible(false);

    },
    popup: function()
    {
        this._maskListener.setSwallowTouches(true);
        this._continue.touchListener.setSwallowTouches(true);
        this._backhome.touchListener.setSwallowTouches(true);
        this.setVisible(true);
    },
    restart: function()
    {
        if(this.isVisible())
            this.father.restart();
        this._maskListener.setSwallowTouches(false);

        this.setVisible(false);
    },
    hidden: function()
    {
        this._maskListener.setSwallowTouches(false);
        this._continue.touchListener.setSwallowTouches(false);
        this._backhome.touchListener.setSwallowTouches(false);
        this.setVisible(false);
    },
    onExit: function()
    {
        cc.eventManager.removeListeners(cc.EventListener.TOUCH_ONE_BY_ONE, false);
        this._super();
    }
});


var RestartBox = cc.LayerColor.extend({
    _maskListener: null,
    score: 0,
    _scoreLabel: null,
    ctor: function(score, father) {
        this.score = score;
        this.father = father;
        this._super(cc.color.BLACK);
        this.setOpacity(128);
        this._initDialog();
        this._maskListener = new cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
        });

        this._maskListener.setSwallowTouches(false);
        cc.eventManager.addListener(this._maskListener, this);

    },
    onEnter: function()
    {
        this._super();
    },
    _initDialog: function()
    {
        var size =  cc.winSize;
        var bgSprite = new cc.Sprite(res.bg);
        bgSprite.attr({
            x:size.width/2,
            y:size.height/2,
            scaleX:0.3,
            scaleY:0.1,
        });
        this.addChild(bgSprite);

        var title = new cc.LabelTTF(
            "Game Over",
            "HyFWoolBall",
            32,
            cc.size(200,500),
            cc.TEXT_ALIGNMENT_CENTER,
            cc.VERTICAL_TEXT_ALIGNMENT_CENTER
        );
        title.setPosition(cc.p(size.width/2, size.height/2 + 60));
        title.setColor(cc.color(0, 0, 0, 255));
        this.addChild(title);


        this._scoreLabel = new cc.LabelTTF(
            "Your score is " + parseInt(this.score),
            "HyFWoolBall",
            25,
            cc.size(200,500),
            cc.TEXT_ALIGNMENT_CENTER,
            cc.VERTICAL_TEXT_ALIGNMENT_CENTER
        );
        this._scoreLabel.setPosition(cc.p(size.width/2, size.height/2));
        this._scoreLabel.setColor(cc.color(0, 0, 0, 255));
        this.addChild(this._scoreLabel);

        var restart = new RestartButton(res.try_again);
        restart.attr({
            x:size.width/2 + 80,
            y:size.height/2 - 60,
            scale:0.5,
        });
        restart.onTouch = this.restart.bind(this);
        this.addChild(restart);


        var backHome = new RestartButton(res.back_home);
        backHome.attr({
            x:size.width/2 - 80,
            y:size.height/2 - 60,
            scale:0.5,
        });
        backHome.onTouch = function() {
            if(this.isVisible()){
                cc.director.runScene(new HomeScene());
                this.hidden();
            }

        }.bind(this);
        this.addChild(backHome);

        this.setVisible(false);

    },
    popup: function()
    {
        this._scoreLabel.setString("Your score is " + parseInt(this.score));
        this._maskListener.setSwallowTouches(true);
        this.setVisible(true);
    },
    restart: function()
    {
        if(this.isVisible())
            this.father.restart();
        this.hidden();
    },
    hidden: function()
    {
        this._maskListener.setSwallowTouches(false);
        this.setVisible(false);

    },
    onExit: function()
    {
        cc.eventManager.removeListeners(cc.EventListener.TOUCH_ONE_BY_ONE, false);
        this._super();
    }
});

var GameScene = cc.Scene.extend({
    playLayer: null,
    restartBox: null,
    pauseBox: null,
    restart: function() {
        this.restartBox.hidden();
        this.playLayer.removeFromParent();
        delete this.playLayer;

        var layer = new GameLayer();
        this.addChild(layer);
        this.playLayer = layer;
        this.playLayer.gameOverCallBack = this.gameOver.bind(this);
        this.playLayer.father = this;



    },
    gameOver: function () {
        cc.log("Game Over");
        this.restartBox.score = parseInt(this.playLayer._maxScore);
        this.restartBox.popup();
    },
    onEnter: function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer);
        this.playLayer = layer;
        this.playLayer.gameOverCallBack = this.gameOver.bind(this);
        this.playLayer.father = this;

        var size = cc.winSize;
        var restart = new RestartButton(res.restart);
        restart.attr({
            x:size.width - 30,
            y:size.height - 30,
            scale:0.5,
        });
        restart.onTouch = this.restart.bind(this);
        this.addChild(restart, 1);

        var pause = new RestartButton(res.stop);
        pause.attr({
            x: 30,
            y:size.height - 30,
            scale:0.5,
        });
        pause.onTouch = function() {
            this.playLayer.pause();
            this.playLayer.listView.pause();
            this.pauseBox.popup();
        }.bind(this);
        this.addChild(pause, 1);

        this.restartBox = new RestartBox(this.playLayer._maxScore, this);
        this.addChild(this.restartBox, 2);

        this.pauseBox = new PauseBox(this);
        this.addChild(this.pauseBox, 3);
    },
});

var RestartButton = cc.Sprite.extend({
    onEnter:function(){
        this._super();
        this.addTouchListener();
    },
    onTouch:function(){
    },
    addTouchListener:function(){
        this.touchListener = cc.EventListener.create({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: function(touch,event){
                var pos = touch.getLocation();
                var target = event.getCurrentTarget();
                if(cc.rectContainsPoint(target.getBoundingBox(),pos)){
                    target.onTouch();
                    return true;
                }
                return false;
            }
        });
        cc.eventManager.addListener(this.touchListener, this);
    },
    onExit: function() {
        cc.eventManager.removeListeners(cc.EventListener.TOUCH_ONE_BY_ONE, true);
        this._super();
    }
})

