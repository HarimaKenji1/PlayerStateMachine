//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.call(this);
        this.EventPoint = new egret.Point();
        this.IdlePictures = [
            this.createBitmapByName("0008_png"), this.createBitmapByName("0009_png"), this.createBitmapByName("0010_png"),
            this.createBitmapByName("0011_png"), this.createBitmapByName("0012_png"), this.createBitmapByName("0013_png"),
            this.createBitmapByName("0014_png"), this.createBitmapByName("0015_png"), this.createBitmapByName("0016_png"),
            this.createBitmapByName("0017_png"), this.createBitmapByName("0018_png"), this.createBitmapByName("0019_png")];
        this.WalkingRightPictures = [
            this.createBitmapByName("0024_png"), this.createBitmapByName("0025_png"), this.createBitmapByName("0026_png"),
            this.createBitmapByName("0027_png"), this.createBitmapByName("0028_png"), this.createBitmapByName("0029_png"),
            this.createBitmapByName("0030_png"), this.createBitmapByName("0031_png"), this.createBitmapByName("0032_png"),
            this.createBitmapByName("0033_png"), this.createBitmapByName("0034_png")];
        this.WalkingLeftPictures = [
            this.createBitmapByName("0024_2_png"), this.createBitmapByName("0025_2_png"), this.createBitmapByName("0026_2_png"),
            this.createBitmapByName("0027_2_png"), this.createBitmapByName("0028_2_png"), this.createBitmapByName("0029_2_png"),
            this.createBitmapByName("0030_2_png"), this.createBitmapByName("0031_2_png"), this.createBitmapByName("0032_2_png"),
            this.createBitmapByName("0033_2_png"), this.createBitmapByName("0034_2_png")];
        this.Player = new Person();
        this.GoalPoint = new egret.Point();
        this.DistancePoint = new egret.Point();
        this.MoveTime = 0;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var d = __define,c=Main,p=c.prototype;
    p.onAddToStage = function (event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    p.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    };
    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    p.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    p.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    /**
     * 创建游戏场景
     * Create a game scene
     */
    p.createGameScene = function () {
        var _this = this;
        this.Stage01Background = this.createBitmapByName("BackGround_jpg");
        this.addChild(this.Stage01Background);
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        this.Stage01Background.width = stageH * 3.1;
        this.Stage01Background.height = stageH;
        this.Stage01Background.x = -stageH * 3.1 / 2;
        this.Stage01Background.y = 0;
        // var PlayerContaner : egret.DisplayObjectContainer;
        // PlayerContaner = new egret.DisplayObjectContainer();
        // PlayerContaner.width = 216;
        // PlayerContaner.height = 278;
        // PlayerContaner.addChild(this.Player.PersonBitmap);
        // PlayerContaner.anchorOffsetX = 216 * 2 / 3;
        // PlayerContaner.anchorOffsetY = 278;
        // PlayerContaner.x = stageW / 2;
        // PlayerContaner.y = 3 * stageH / 4;
        // for(let n = 0;n < this.IdlePictures.length;n++){
        //     this.IdlePictures[n].anchorOffsetX = 2*this.IdlePictures[n].width / 3;
        //     this.IdlePictures[n].anchorOffsetY = this.IdlePictures[n].height;
        // }
        // for(let n = 0;n < this.WalkingRightPictures.length;n++){
        //     this.WalkingRightPictures[n].anchorOffsetX = this.WalkingRightPictures[n].width / 2;
        //     this.WalkingRightPictures[n].anchorOffsetY = this.WalkingRightPictures[n].height;
        // }
        // for(let n = 0;n < this.WalkingLeftPictures.length;n++){
        //     this.WalkingLeftPictures[n].anchorOffsetX = this.WalkingLeftPictures[n].width / 2;
        //     this.WalkingLeftPictures[n].anchorOffsetY = this.WalkingLeftPictures[n].height;
        // }
        this.addChild(this.Player.PersonBitmap);
        this.Player.PersonBitmap.x = stageW / 2;
        this.Player.PersonBitmap.y = 3 * stageH / 4;
        // this.Player.PersonBitmap.anchorOffsetX =  2 * this.Player.PersonBitmap.width / 3;
        // this.Player.PersonBitmap.anchorOffsetY = this.Player.PersonBitmap.height;
        //根据name关键字，异步获取一个json配置文件，name属性请参考resources/resource.json配置文件的内容。
        // Get asynchronously a json configuration file according to name keyword. As for the property of name please refer to the configuration file of resources/resource.json.
        //RES.getResAsync("description_json", this.startAnimation, this)
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function (e) {
            egret.Tween.removeTweens(_this.Player.PersonBitmap);
            _this.Player.SetState(new WalkingState(), _this);
            _this.EventPoint.x = e.stageX;
            _this.EventPoint.y = e.stageY;
            var distanceX = _this.Player.PersonBitmap.x - e.stageX;
            var distanceY = _this.Player.PersonBitmap.y - e.stageY;
            if (distanceX < 0) {
                _this.Player.SetRightOrLeftState(new GoRightState(), _this);
            }
            if (distanceX >= 0) {
                _this.Player.SetRightOrLeftState(new GoLeftState(), _this);
            }
            egret.Tween.get(_this.Player.PersonBitmap).to({ x: e.stageX, y: e.stageY }, Math.abs(distanceX) * 3 + Math.abs(distanceY) * 3);
            _this.MoveTime = Math.abs(distanceX) * 3 + Math.abs(distanceY) * 3;
            // while(this.Player.PersonBitmap.x != this.GoalPoint.x || this.Player.PersonBitmap.y != this.GoalPoint.y){
            //     egret.Ticker.getInstance().register(()=>{
            //        this.Player.PersonBitmap.x += 1;
            //         this.Player.PersonBitmap.y += 1;
            //     },this)
            // }
            _this.PictureMove(_this.Stage01Background);
        }, this);
        this.PlayerAnimation();
    };
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    p.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    // private startAnimation(result:Array<any>):void {
    //     var self:any = this;
    //     var parser = new egret.HtmlTextParser();
    //     var textflowArr:Array<Array<egret.ITextElement>> = [];
    //     for (var i:number = 0; i < result.length; i++) {
    //         textflowArr.push(parser.parser(result[i]));
    //     }
    //     var textfield = self.textfield;
    //     var count = -1;
    //     var change:Function = function () {
    //         count++;
    //         if (count >= textflowArr.length) {
    //             count = 0;
    //         }
    //         var lineArr = textflowArr[count];
    //         self.changeDescription(textfield, lineArr);
    //         var tw = egret.Tween.get(textfield);
    //         tw.to({"alpha": 1}, 200);
    //         tw.wait(2000);
    //         tw.to({"alpha": 0}, 200);
    //         tw.call(change, self);
    //     };
    // }
    p.PictureMove = function (pic) {
        var self = this;
        var MapMove = function () {
            egret.Tween.removeTweens(pic);
            var dis = self.Player.PersonBitmap.x - self.EventPoint.x;
            if (self.Player.GetIfGoRight() && pic.x >= -(pic.width - self.stage.stageWidth)) {
                egret.Tween.get(pic).to({ x: pic.x - Math.abs(dis) }, self.MoveTime);
            }
            if (self.Player.GetIfGoLeft() && pic.x <= 0) {
                egret.Tween.get(pic).to({ x: pic.x + Math.abs(dis) }, self.MoveTime);
            }
            //egret.Tween.get(pic).call(MapMove,self);
        };
        MapMove();
    };
    p.PlayerAnimation = function () {
        var self = this;
        var n = 0;
        var GOR = 0;
        var GOL = 0;
        var zhen = 0;
        var zhen2 = 0;
        var zhen3 = 0;
        var standArr = ["08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19"];
        var walkRightArr = ["24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34",];
        var MoveAnimation = function () {
            //var playerBitmap = egret.Tween.get(self.Player.PersonBitmap);
            egret.Ticker.getInstance().register(function () {
                if (zhen % 4 == 0) {
                    if (self.Player.GetIfIdle() && !self.Player.GetIfWalk()) {
                        GOR = 0;
                        GOL = 0;
                        var textureName = "00" + standArr[n] + "_png";
                        var texture = RES.getRes(textureName);
                        self.Player.PersonBitmap.texture = texture;
                        n++;
                        if (n >= standArr.length) {
                            n = 0;
                        }
                    }
                    if (self.Player.GetIfWalk() && self.Player.GetIfGoRight() && !self.Player.GetIfIdle()) {
                        n = 0;
                        GOL = 0;
                        var textureName = "00" + walkRightArr[GOR] + "_png";
                        var texture = RES.getRes(textureName);
                        self.Player.PersonBitmap.texture = texture;
                        GOR++;
                        if (GOR >= walkRightArr.length) {
                            GOR = 0;
                        }
                    }
                    if (self.Player.GetIfWalk() && self.Player.GetIfGoLeft() && !self.Player.GetIfIdle()) {
                        n = 0;
                        GOR = 0;
                        var textureName = "00" + walkRightArr[GOL] + "_2_png";
                        var texture = RES.getRes(textureName);
                        self.Player.PersonBitmap.texture = texture;
                        GOL++;
                        if (GOL >= walkRightArr.length) {
                            GOL = 0;
                        }
                    }
                }
                if (self.Player.PersonBitmap.x == self.EventPoint.x && self.Player.PersonBitmap.y == self.EventPoint.y) {
                    self.Player.SetState(new IdleState(), self);
                }
            }, self);
            // var texture : egret.Texture = self.IdlePictures[n];
            // self.PlayerPic.texture = texture;
            //        egret.Tween.get(self.PlayerPic).to(self.IdlePictures[n],0);
            //        egret.Tween.get(self.PlayerPic).wait(42);
            //        n++;
            //        if(n >= self.IdlePictures.length){
            //           n=0;
            //           }
            //egret.Tween.get(self.Player.PersonBitmap).call(IdleAnimation,self);
        };
        var FramePlus = function () {
            egret.Ticker.getInstance().register(function () {
                zhen++;
                if (zhen == 400)
                    zhen = 0;
            }, self);
        };
        MoveAnimation();
        FramePlus();
    };
    return Main;
}(egret.DisplayObjectContainer));
egret.registerClass(Main,'Main');
var Person = (function () {
    function Person() {
        this.GoRight = false;
        this.GoLeft = false;
        this.PersonBitmap = new egret.Bitmap();
        this.PersonBitmap.width = 216;
        this.PersonBitmap.height = 278;
        this.PersonBitmap.anchorOffsetX = 2 * this.PersonBitmap.width / 3;
        this.PersonBitmap.anchorOffsetY = this.PersonBitmap.height;
        this.IsIdle = true;
        this.IsWalking = false;
        this.IdleOrWalkStateMachine = new StateMachine();
        this.LeftOrRightStateMachine = new StateMachine();
    }
    var d = __define,c=Person,p=c.prototype;
    p.SetPersonBitmap = function (picture) {
        this.PersonBitmap = picture;
    };
    p.SetIdle = function (set) {
        this.IsIdle = set;
    };
    p.GetIfIdle = function () {
        return this.IsIdle;
    };
    p.SetWalk = function (set) {
        this.IsWalking = set;
    };
    p.GetIfWalk = function () {
        return this.IsWalking;
    };
    p.SetGoRight = function () {
        this.GoRight = true;
        this.GoLeft = false;
    };
    p.GetIfGoRight = function () {
        return this.GoRight;
    };
    p.SetGoLeft = function () {
        this.GoLeft = true;
        this.GoRight = false;
    };
    p.GetIfGoLeft = function () {
        return this.GoLeft;
    };
    p.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    p.SetState = function (e, _tmain) {
        this.IdleOrWalkStateMachine.setState(e, _tmain);
    };
    p.SetRightOrLeftState = function (e, _tmain) {
        this.LeftOrRightStateMachine.setState(e, _tmain);
    };
    return Person;
}());
egret.registerClass(Person,'Person');
var PeopleState = (function () {
    function PeopleState() {
    }
    var d = __define,c=PeopleState,p=c.prototype;
    p.OnState = function (_tmain) { };
    ;
    p.ExitState = function (_tmain) { };
    ;
    return PeopleState;
}());
egret.registerClass(PeopleState,'PeopleState',["State"]);
var StateMachine = (function () {
    function StateMachine() {
    }
    var d = __define,c=StateMachine,p=c.prototype;
    p.setState = function (e, _tmain) {
        if (this.CurrentState != null) {
            this.CurrentState.ExitState(_tmain);
        }
        this.CurrentState = e;
        this.CurrentState.OnState(_tmain);
    };
    return StateMachine;
}());
egret.registerClass(StateMachine,'StateMachine');
var IdleState = (function () {
    function IdleState() {
    }
    var d = __define,c=IdleState,p=c.prototype;
    p.OnState = function (_tmain) {
        _tmain.Player.SetIdle(true);
        _tmain.Player.SetWalk(false);
    };
    ;
    p.ExitState = function (_tmain) {
        _tmain.Player.SetIdle(false);
    };
    ;
    return IdleState;
}());
egret.registerClass(IdleState,'IdleState');
var WalkingState = (function () {
    function WalkingState() {
    }
    var d = __define,c=WalkingState,p=c.prototype;
    p.OnState = function (_tmain) {
        _tmain.Player.SetIdle(false);
        _tmain.Player.SetWalk(true);
    };
    ;
    p.ExitState = function (_tmain) {
        _tmain.Player.SetWalk(false);
    };
    ;
    return WalkingState;
}());
egret.registerClass(WalkingState,'WalkingState');
var GoRightState = (function () {
    function GoRightState() {
    }
    var d = __define,c=GoRightState,p=c.prototype;
    p.OnState = function (_tmain) {
        _tmain.Player.SetGoRight();
    };
    ;
    p.ExitState = function (_tmain) { };
    ;
    return GoRightState;
}());
egret.registerClass(GoRightState,'GoRightState');
var GoLeftState = (function () {
    function GoLeftState() {
    }
    var d = __define,c=GoLeftState,p=c.prototype;
    p.OnState = function (_tmain) {
        _tmain.Player.SetGoLeft();
    };
    ;
    p.ExitState = function (_tmain) { };
    ;
    return GoLeftState;
}());
egret.registerClass(GoLeftState,'GoLeftState');
//# sourceMappingURL=Main.js.map