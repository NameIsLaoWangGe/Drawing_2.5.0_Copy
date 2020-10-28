import { Admin, Animation2D, Click, EventAdmin, Tools, _Gold, _SceneName } from "./Lwg";
import { _PreloadUrl } from "./_PreLoad";

/**游戏场景模块*/
export module _Game {
    export enum _Event {
        start = '_Game_start',
        showStepBtn = '_Game_showStepBtn',
        lastStep = '_Game_lastStep',
        nextStep = '_Game_nextStep',
        compelet = '_Game_compelet',
        playAni1 = '_Game_playAni1',
        playAni2 = '_Game_playAni2',
        restoreZOder = '_Game_restoreZoder',
        colseScene = '_Game_colseScene',
        victory = '_Game_victory',
    }
    /**动画名称*/
    export enum _Animation {
        action1 = 'action1',
        action2 = 'action2',
    }
    /**笔刷名称*/
    export enum _Brush {
        chalk = 'chalk',
        pencil = 'pencil',
    }
    /**需要绘画的名称顺序*/
    export let _stepOrderImg: Array<Laya.Image> = [];
    /**每个阶段需要过关的绘画长度*/
    export let _passLenght: number = 100;
    /**当前最高绘制到哪一步*/
    export let _stepMaskIndex: number = 0;

    export let _stepIndex = {
        get present(): number {
            return this['presentIndex'] ? this['presentIndex'] : 0;
        },
        set present(val: number) {
            this['presentIndex'] = val;
            if (this['presentIndex'] > _stepIndex.max) {
                _stepIndex.max = this['presentIndex'];
            }
        },
        get max(): number {
            return this['maxIndex'] ? this['maxIndex'] : 0;
        },
        set max(val: number) {
            this['maxIndex'] = val;
        },
    }
    /**铅笔种类*/
    export let _Pencils = {
        type: {
            SingleColor: 'SingleColor',
            Colours: 'Colours',
            Stars: 'Stars',
        },
        /**当前使用*/
        get presentUse(): string {
            return Laya.LocalStorage.getItem('_Pencils_presentUse') ? Laya.LocalStorage.getItem('_Pencils_presentUse') : null;
        },
        set presentUse(name: string) {
            Laya.LocalStorage.setItem('_Pencils_presentUse', name.toString());
        },
        allPencils: ['Colours', 'SingleColor', 'Stars'],
        get have(): Array<string> {
            try {
                let data = Laya.LocalStorage.getJSON('_Pencils_have')
                if (data) {
                    return JSON.parse(data);;
                } else {
                    return ['SingleColor'];
                }
            } catch (error) {
                return ['SingleColor'];
            }
        },
        set have(array: Array<string>) {
            Laya.LocalStorage.setJSON('_Pencils_have', JSON.stringify(array));
        },
        get nohave(): Array<string> {
            return Tools.array1ExcludeArray2(_Pencils.allPencils, _Pencils.have);
        },
        add(str: string): void {
            let arr = Tools.array_Copy(_Pencils.have);
            arr.push(str);
            Laya.LocalStorage.setJSON('_Pencils_have', JSON.stringify(arr));
        }
    }
    /**单色画笔套装*/
    export class _SingleColorPencils {
        static _property = {
            index: 'index',
            name: 'name',
            color: 'color',
            pitch: 'pitch',
        };
        static _init(): void {
            this._data = Tools.objArray_Copy(_PreloadUrl._list.json.SingleColor.data);
            this._setPitchByName(this._data[0][this._property.name]);
        }
        /**当前选中画笔*/
        static _pitchName: string = '';
        /**当前选中画笔的颜色*/
        static _pitchColor: string = '';
        /**数据表*/
        static _data: Array<any> = [];
        /**设置选中*/
        static _setPitchByName(name: string): void {
            for (let index = 0; index < this._data.length; index++) {
                if (name == this._data[index][this._property.name]) {
                    this._data[index][this._property.pitch] = true;
                    this._pitchName = name;
                    this._pitchColor = this._data[index][this._property.color];
                } else {
                    this._data[index][this._property.pitch] = false;
                }
            }
        }
    }
    /**彩色画笔套装*/
    export class _ColoursPencils extends _SingleColorPencils {
        static _init(): void {
            this._data = Tools.objArray_Copy(_PreloadUrl._list.json.Colours.data);
            this._setPitchByName(this._data[0][this._property.name]);
        }
    };
    /**星星画笔套装*/
    export class _StarsPencils extends _SingleColorPencils {
        static _init(): void {
            this._data = Tools.objArray_Copy(_PreloadUrl._list.json.Colours.data);
            this._setPitchByName(this._data[0][this._property.name]);
        }
    };

    /**画板属性*/
    export enum _drawBoardProperty {
        originalZOder = 'originalZOder',
        whetherPass = 'whetherPass',
    }
    export function _init(): void {
        Admin._game.loopLevel = 12;
        _SingleColorPencils._init();
        _StarsPencils._init();
        _ColoursPencils._init();
    }
    /**画笔列表*/
    export let _PencilsList: Laya.List;
    /**画笔脚本*/
    export class _PencilsListItem extends Admin._Object {
        lwgBtnClick(): void {
            Click._on(Click._Type.largen, this.Owner, this, null, null, () => {
                _SingleColorPencils._setPitchByName(this.Owner['_dataSource'][_SingleColorPencils._property.name]);
                _PencilsList.refresh();
            });
        }
    }

    export class Game extends Admin._SceneBase {
        /**每个步骤需要绘制的长度监听*/
        _drawingLenth = {
            get value(): number {
                return this['len'] ? this['len'] : 0;
            },
            set value(val: number) {
                if (_Game._stepIndex.present == _Game._stepIndex.max) {
                    this['len'] = val;
                    if (this['len'] >= _Game._passLenght && !_Game._stepOrderImg[_Game._stepIndex.present][_Game._drawBoardProperty.whetherPass]) {
                        EventAdmin._notify(_Game._Event.showStepBtn);
                        _Game._stepOrderImg[_Game._stepIndex.present][_Game._drawBoardProperty.whetherPass] = true;
                        this['len'] = 0;
                    }
                }
            },
        }

        lwgOnAwake(): void {
            _Gold.goldVinish(100);
            _Game._passLenght = 50;
            _Game._stepIndex.present = 0;
            _Game._stepIndex.present = 0;
            _Game._stepIndex.max = 0;
            _Game._PencilsList = Laya.Pool.getItemByCreateFun('_prefab2D', _PreloadUrl._list.prefab2D.PencilsList.prefab.create, _PreloadUrl._list.prefab2D.PencilsList.prefab);
            this.Owner.addChild(_Game._PencilsList)['pos'](108, 1085);
            _Game._PencilsList.array = _Game._SingleColorPencils._data;
            _Game._PencilsList.selectEnable = true;
            _Game._PencilsList.vScrollBarSkin = "";
            // this._ShopList.scrollBar.elasticBackTime = 0;//设置橡皮筋回弹时间。单位为毫秒。
            // this._ShopList.scrollBar.elasticDistance = 500;//设置橡皮筋极限距离。
            _Game._PencilsList.selectHandler = new Laya.Handler(this, (index: number) => { });
            _Game._PencilsList.renderHandler = new Laya.Handler(this, (cell: Laya.Box, index: number) => {
                let _dataSource = cell.dataSource;
                let Pic = cell.getChildByName('Pic') as Laya.Image;
                Pic.skin = 'Game/UI/GameScene/SinglePencils/' + _dataSource['name'] + '.png';
                if (_dataSource[_Game._SingleColorPencils._property.pitch]) {
                    Pic.scale(1.1, 1.1);
                } else {
                    Pic.scale(1, 1);
                }
            });
            if (_Game._PencilsList.cells.length !== 0) {
                for (let index = 0; index < _Game._PencilsList.cells.length; index++) {
                    const element = _Game._PencilsList.cells[index];
                    if (!element.getComponent(_Game._PencilsListItem)) {
                        element.addComponent(_Game._PencilsListItem);
                    }
                }
            }
            _Game._stepOrderImg = [];
            let index = 1;
            while (this.Owner['Draw' + index]) {
                let Img = this.Owner['Draw' + index] as Laya.Image;
                _Game._stepOrderImg.push(Img);
                Img[_Game._drawBoardProperty.originalZOder] = Img.zOrder;
                let parent = Img.parent as Laya.Image;
                if (parent != this.ImgVar('DrawRoot')) {
                    parent[_Game._drawBoardProperty.originalZOder] = parent.zOrder;
                    parent[_Game._drawBoardProperty.whetherPass] = false;
                }
                this.Owner['Draw' + index].skin = null;
                index++;
            }
            // console.log(_Game._stepOrderImg);
        }
        lwgOpenAni(): number {
            return 100;
        }
        /**阶段切换按钮*/
        StepSwitch: Laya.Image;
        BtnNextStep: Laya.Image;
        BtnLastStep: Laya.Image;
        /**播放动画按钮*/
        // BtnPlayAni: Laya.Image;
        /**返回按钮*/
        BtnCompelet: Laya.Image;
        lwgOnEnable(): void {
            this.StepSwitch = Tools.Node.prefabCreate(_PreloadUrl._list.prefab2D.StepSwitch.prefab) as Laya.Image;
            this.Owner.addChild(this.StepSwitch);
            this.StepSwitch.pos(194.5, 900);
            this.BtnNextStep = this.StepSwitch.getChildByName('BtnNextStep') as Laya.Image;
            this.BtnLastStep = this.StepSwitch.getChildByName('BtnLastStep') as Laya.Image;
            this.BtnNextStep.visible = false;
            this.BtnLastStep.visible = false;

            this.BtnCompelet = Tools.Node.prefabCreate(_PreloadUrl._list.prefab2D.BtnCompelet.prefab) as Laya.Image;
            this.Owner.addChild(this.BtnCompelet);
            this.BtnCompelet.visible = false;
            this.BtnCompelet.pos(360, 930);
        }
        lwgOnStart(): void {
            EventAdmin._notify(_Game._Event.start);
        }
        lwgEventRegister(): void {

            EventAdmin._register(_Game._Event.colseScene, this, () => {
                this.lwgCloseScene();
            })
            EventAdmin._register(_Game._Event.victory, this, () => {
                this.AniVar(_Game._Animation.action1).stop();
                Tools.Node.changePovit(this.ImgVar('DrawRoot'), this.ImgVar('DrawRoot').width / 2, this.ImgVar('DrawRoot').height / 2);
                Animation2D.move_Scale(this.ImgVar('DrawRoot'), this.ImgVar('DrawRoot').scaleX, this.ImgVar('DrawRoot').x, this.ImgVar('DrawRoot').y, this.ImgVar('DrawRoot').x, this.ImgVar('DrawRoot').y, this.ImgVar('DrawRoot').scaleX / 2, 500, 500);
                let Img = new Laya.Image();
                Img.skin = `Game/UI/Common/bj.png`;
                Img.alpha = 0;
                Img.width = Laya.stage.width;
                Img.height = Laya.stage.height;
                this.ImgVar('Background').addChild(Img);
                Animation2D.fadeOut(Img, 0, 1, 500);
                _Gold.goldAppear(100);
            })

            EventAdmin._register(_Game._Event.playAni1, this, () => {
                this.AniVar(_Game._Animation.action1).play(null, true);
            })

            EventAdmin._register(_Game._Event.start, this, () => {
                this.drawState.switch = true;
                for (let index = 0; index < _Game._stepOrderImg.length; index++) {
                    if (_Game._stepIndex.present >= index) {
                        _Game._stepOrderImg[index].visible = true;
                    } else {
                        _Game._stepOrderImg[index].visible = false;
                    }
                }
                let Img = _Game._stepOrderImg[_Game._stepIndex.present];
                let ImgParent = Img.parent as Laya.Image;
                if (ImgParent != this.ImgVar('DrawRoot')) {
                    ImgParent.zOrder = 200;
                }
                Img.zOrder = 200;
            });

            EventAdmin._register(_Game._Event.showStepBtn, this, () => {
                if (_Game._stepIndex.present == 0) {
                    this.BtnNextStep.visible = true;
                    Animation2D.fadeOut(this.BtnNextStep, 0, 1, 300);
                } else {
                    if (!this.BtnNextStep.visible) {
                        this.BtnNextStep.visible = true;
                        Animation2D.fadeOut(this.BtnNextStep, 0, 1, 300);
                    }
                    if (!this.BtnLastStep.visible) {
                        this.BtnLastStep.visible = true;
                        Animation2D.fadeOut(this.BtnLastStep, 0, 1, 300);
                    }
                }
            });

            EventAdmin._register(_Game._Event.lastStep, this, () => {
                this.drawState.restoration();
                if (_Game._stepIndex.present - 1 >= 0) {
                    let Img0 = _Game._stepOrderImg[_Game._stepIndex.present - 1];
                    let Img0Parent = Img0.parent as Laya.Image;
                    Animation2D.fadeOut(Img0.getChildByName('Pic'), 0, 1, 300, 0, () => {
                        let Img = _Game._stepOrderImg[_Game._stepIndex.present];
                        Animation2D.fadeOut(Img.getChildByName('Pic'), 1, 0, 300, 0, () => {
                            _Game._stepIndex.present--;
                            if (_Game._stepIndex.present < _Game._stepIndex.max) {
                                this.BtnNextStep.visible = true;
                            }
                            if (_Game._stepIndex.present == 0) {
                                this.BtnLastStep.visible = false;
                            }
                            // console.log(_Game._stepIndex, _Game._stepIndex.max);
                            EventAdmin._notify(_Game._Event.restoreZOder);
                            if (Img0Parent != this.ImgVar('DrawRoot')) {
                                Img0Parent.zOrder = 200;
                            }
                            Img0.zOrder = 200;
                            this['BtnStepClose'] = false;
                            this.drawState.switch = true;
                        })
                    });
                }
            })

            EventAdmin._register(_Game._Event.nextStep, this, () => {
                EventAdmin._notify(_Game._Event.restoreZOder);
                this.drawState.restoration();
                if (_Game._stepIndex.present >= _Game._stepOrderImg.length - 1) {
                    EventAdmin._notify(_Game._Event.compelet);
                    Animation2D.fadeOut(_Game._stepOrderImg[_Game._stepIndex.present].getChildByName('Pic'), 1, 0, 300, 0);
                } else {
                    let Img = _Game._stepOrderImg[_Game._stepIndex.present];
                    Img.zOrder = Img[_Game._drawBoardProperty.originalZOder];
                    Animation2D.fadeOut(Img.getChildByName('Pic'), 1, 0, 300, 0, () => {
                        let Img0 = _Game._stepOrderImg[_Game._stepIndex.present + 1];
                        Img0.visible = true;
                        Animation2D.fadeOut(Img0.getChildByName('Pic'), 0, 1, 300, 0, () => {
                            let Img0Parent = Img0.parent as Laya.Image;
                            _Game._stepIndex.present++;
                            if (!_Game._stepOrderImg[_Game._stepIndex.present][_Game._drawBoardProperty.whetherPass]) {
                                this.BtnNextStep.visible = false;
                            }
                            if (Img0Parent != this.ImgVar('DrawRoot')) {
                                Img0Parent.zOrder = 200;
                            }
                            // console.log(_Game._stepIndex, _Game._stepIndex.max);
                            Img0.zOrder = 200;
                            this['BtnStepClose'] = false;
                            this.drawState.switch = true;
                        })
                    });
                }
            })

            EventAdmin._register(_Game._Event.restoreZOder, this, () => {
                for (let index = 0; index < _Game._stepOrderImg.length; index++) {
                    const element = _Game._stepOrderImg[index] as Laya.Image;
                    if (element) {
                        element.zOrder = _Game._stepOrderImg[index][_Game._drawBoardProperty.originalZOder];
                        let parent = element.parent as Laya.Image;
                        if (parent != this.ImgVar('DrawRoot')) {
                            parent.zOrder = parent[_Game._drawBoardProperty.originalZOder];
                        }
                    }
                }
            });

            EventAdmin._register(_Game._Event.compelet, this, () => {
                EventAdmin._notify(_Game._Event.restoreZOder);
                this.drawState.switch = false;
                this.BtnNextStep.visible = false;
                this.BtnLastStep.visible = false;
                this.BtnCompelet.visible = true;
                Animation2D.fadeOut(_PencilsList, 1, 0, 200);
            })
        }

        /**绘画状态控制*/
        drawState = {
            switch: false,
            EraserSp: null,
            DrawSp: null,
            frontPos: null,
            endPos: null,
            radius: {
                get value(): number {
                    return Admin._game.level >= 10 ? 8 : 12;
                }
            },
            restoration: () => {
                this.drawState.switch = false;
                this.drawState.frontPos = null;
                this.drawState.endPos = null;
                this.drawState.DrawSp = null;
                this.drawState.EraserSp = null;
            },
        }
        lwgBtnClick(): void {

            for (let index = 0; index < _Game._stepOrderImg.length; index++) {
                let DrawRoot = _Game._stepOrderImg[index];
                let DrawBoard = DrawRoot.addChild((new Laya.Sprite()).pos(0, 0)) as Laya.Sprite;
                DrawBoard.cacheAs = "bitmap";
                DrawBoard.name = 'DrawBoard';
                DrawBoard.width = DrawRoot.width;
                DrawBoard.height = DrawRoot.height;

                Click._on(Click._Type.noEffect, DrawRoot.getChildByName('Pic'), this,
                    // 按下
                    (e: Laya.Event) => {
                        // 初始化一个绘制节点
                        let Sp: Laya.Sprite;
                        if (index == _Game._stepIndex.present && this.drawState.switch) {
                            let DrawBoard = DrawRoot.getChildByName('DrawBoard') as Laya.Sprite;
                            this.drawState.frontPos = DrawBoard.globalToLocal(new Laya.Point(e.stageX, e.stageY));
                            if (_Game._SingleColorPencils._pitchName == 'eraser') {
                                Sp = this.drawState.EraserSp = new Laya.Sprite();
                                this.drawState.EraserSp.blendMode = "destination-out";
                            } else {
                                Sp = this.drawState.DrawSp = new Laya.Sprite();
                                this.drawState.DrawSp.blendMode = "none";
                            }
                            DrawBoard.addChild(Sp)['pos'](0, 0);
                            Sp.graphics.drawCircle(this.drawState.frontPos.x, this.drawState.frontPos.y, this.drawState.radius.value, _Game._SingleColorPencils._pitchColor);
                        }
                    },
                    // 移动
                    (e: Laya.Event) => {
                        if (this.drawState.frontPos && index == _Game._stepIndex.present && this.drawState.switch) {
                            let DrawBoard = DrawRoot.getChildByName('DrawBoard') as Laya.Sprite;
                            let endPos = DrawBoard.globalToLocal(new Laya.Point(e.stageX, e.stageY));
                            if (_Game._SingleColorPencils._pitchName == 'eraser') {
                                if (this.drawState.EraserSp) {
                                    this.drawState.EraserSp.graphics.drawLine(this.drawState.frontPos.x, this.drawState.frontPos.y, endPos.x, endPos.y, '#000000', this.drawState.radius.value * 2);
                                    this.drawState.EraserSp.graphics.drawCircle(endPos.x, endPos.y, this.drawState.radius.value, '#000000');
                                    // this._drawingLenth.value -= (this.drawState.frontPos as Laya.Point).distance(endPos.x, endPos.y);
                                }
                            } else {
                                if (this.drawState.DrawSp) {
                                    // let tex = Laya.Loader.getRes(_PreloadUrl._list.texture2D.star1);
                                    // DrawSp.graphics.drawTexture(tex, endPos.x, endPos.y, 50, 50);
                                    this.drawState.DrawSp.graphics.drawLine(this.drawState.frontPos.x, this.drawState.frontPos.y, endPos.x, endPos.y, _Game._SingleColorPencils._pitchColor, this.drawState.radius.value * 2);
                                    this.drawState.DrawSp.graphics.drawCircle(endPos.x, endPos.y, this.drawState.radius.value, _Game._SingleColorPencils._pitchColor);
                                    this._drawingLenth.value += (this.drawState.frontPos as Laya.Point).distance(endPos.x, endPos.y);
                                }
                            }
                            this.drawState.frontPos = new Laya.Point(endPos.x, endPos.y);
                        }
                    },
                    (e: Laya.Event) => {
                        this.drawState.frontPos = null;
                        // 画板内绘制节点过多时，则将图像绘制到新的画板上，删掉旧的画板
                        let DrawBoard = DrawRoot.getChildByName('DrawBoard') as Laya.Sprite;
                        if (DrawBoard && DrawBoard.numChildren > 3) {
                            let NewBoard = DrawRoot.addChild((new Laya.Sprite()).pos(0, 0)) as Laya.Sprite;
                            NewBoard.cacheAs = "bitmap";
                            NewBoard.name = 'DrawBoard';
                            NewBoard.width = DrawRoot.width;
                            NewBoard.height = DrawRoot.height;
                            NewBoard.texture = DrawBoard.drawToTexture(DrawBoard.width, DrawBoard.height, DrawBoard.x, DrawBoard.y) as Laya.Texture;
                            DrawBoard.destroy();
                        }
                    }
                );
            }
            Click._on(Click._Type.largen, this.BtnLastStep, this, null, null, () => {
                if (this['BtnStepClose']) {
                    return;
                } else {
                    this['BtnStepClose'] = true;
                }
                EventAdmin._notify(_Game._Event.lastStep);
            });
            Click._on(Click._Type.largen, this.BtnNextStep, this, null, null, () => {
                if (this['BtnStepClose']) {
                    return;
                } else {
                    this['BtnStepClose'] = true;
                }
                if (!this.BtnLastStep.visible) {
                    Animation2D.fadeOut(this.BtnLastStep, 0, 1, 300, null, () => {
                        this.BtnLastStep.visible = true;
                    });
                }
                EventAdmin._notify(_Game._Event.nextStep);
            });
            Click._on(Click._Type.largen, this.BtnCompelet, this, null, null, () => {
                Admin._game.level++;
                this.lwgOpenScene(_SceneName.Settle, false, () => {
                    this.BtnCompelet.visible = false;
                });

            });
        }
    }
}
export default _Game.Game;



