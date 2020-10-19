import { Admin, Animation2D, Click, EventAdmin, Tools, _PreLoad } from "./Lwg";
import { _PreloadUrl } from "./_PreLoad";

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
    // // /**当前正在哪一步绘画*/
    // export let _stepIndex: number = 0;
    /**当前最高绘制到哪一步*/
    export let _stepMaskIndex: number = 0;

    export let _stepIndex = {
        get present(): number {
            return this['presentIndex'] ? this['presentIndex'] : 0;
        },
        set present(val: number) {
            this['presentIndex'] = val;
            if (this['presentIndex'] > _stepIndex.mask) {
                _stepIndex.mask = this['presentIndex'];
            }
        },
        get mask(): number {
            return this['maskIndex'] ? this['maskIndex'] : 0;
        },
        set mask(val: number) {
            this['maskIndex'] = val;
        },
    }
    /**绘画开关*/
    export let _drawSwitch: boolean = false;
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
        _SingleColorPencils._init();
        _StarsPencils._init();
        _ColoursPencils._init();
    }
    /**画笔列表*/
    export let _PencilsList: Laya.List;
    /**画笔脚本*/
    export class _PencilsListItem extends Admin._Object {
        lwgBtnClick(): void {
            Click._on(Click._Type.largen, this.self, this, null, null, () => {
                _SingleColorPencils._setPitchByName(this.self['_dataSource'][_SingleColorPencils._property.name]);
                _PencilsList.refresh();
            });
        }
    }
}
export default class GameScene extends Admin._Scene {
    /**每个步骤需要绘制的长度监听*/
    _drawingLenth = {
        get value(): number {
            return this['len'] ? this['len'] : 0;
        },
        set value(val: number) {
            if (_Game._stepIndex.present == _Game._stepIndex.mask) {
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
        _Game._passLenght = 100;
        _Game._stepIndex.present = 0;
        _Game._drawSwitch = false;
        _Game._stepIndex.present = 0;
        _Game._stepIndex.mask = 0;
        _Game._PencilsList = Laya.Pool.getItemByCreateFun('_prefab2D', _PreloadUrl._list.prefab2D.PencilsList.prefab.create, _PreloadUrl._list.prefab2D.PencilsList.prefab);
        this.self.addChild(_Game._PencilsList)['pos'](108, 1085);
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
        while (this.self['Draw' + index]) {
            let Img = this.self['Draw' + index] as Laya.Image;
            _Game._stepOrderImg.push(Img);
            Img[_Game._drawBoardProperty.originalZOder] = Img.zOrder;
            let parent = Img.parent as Laya.Image;
            if (parent != this.ImgVar('DrawRoot')) {
                parent[_Game._drawBoardProperty.originalZOder] = parent.zOrder;
                parent[_Game._drawBoardProperty.whetherPass] = false;
            }
            this.self['Draw' + index].skin = null;
            index++;
        }
    }

    /**按钮管理*/
    // PrefabAdmin = {
    //     StepSwitch: null,
    //     BtnNextStep: null,
    //     BtnLastStep: null,
    //     BtnPlayAni: null,
    //     BtnBack: null,
    //     btnSwitch: true,
    //     setUnique(btn: Laya.Image): void {
    //         switch (btn) {
    //             case this.BtnNextStep:
    //                 break;
    //             case this.BtnLastStep:
    //                 break;
    //             case this.BtnNextStep:
    //                 break;
    //             default:
    //                 break;
    //         }
    //     }
    // }

    /**阶段切换按钮*/
    StepSwitch: Laya.Image;
    BtnNextStep: Laya.Image;
    BtnLastStep: Laya.Image;
    /**播放动画按钮*/
    BtnPlayAni: Laya.Image;
    /**返回按钮*/
    BtnBack: Laya.Image;
    lwgOnEnable(): void {
        this.StepSwitch = Tools.node_PrefabCreate(_PreloadUrl._list.prefab2D.StepSwitch.prefab) as Laya.Image;
        this.self.addChild(this.StepSwitch);
        this.StepSwitch.pos(194.5, 900);
        this.BtnNextStep = this.StepSwitch.getChildByName('BtnNextStep') as Laya.Image;
        this.BtnLastStep = this.StepSwitch.getChildByName('BtnLastStep') as Laya.Image;
        this.BtnNextStep.visible = false;
        this.BtnLastStep.visible = false;

        this.BtnPlayAni = Tools.node_PrefabCreate(_PreloadUrl._list.prefab2D.BtnPlayAni.prefab) as Laya.Image;
        this.self.addChild(this.BtnPlayAni);
        this.BtnPlayAni.visible = false;
        this.BtnPlayAni.pos(361, 920);

        this.BtnBack = Tools.node_PrefabCreate(_PreloadUrl._list.prefab2D.BtnBack.prefab) as Laya.Image;
        this.self.addChild(this.BtnBack);
        this.BtnBack.visible = false;
        this.BtnBack.pos(96, 97);

        // this.ImgVar('DrawRoot').pivotX = this.ImgVar('DrawRoot').width / 2;
        // this.ImgVar('DrawRoot').pivotY = this.ImgVar('DrawRoot').height / 2;
    }
    lwgOnStart(): void {
        EventAdmin._notify(_Game._Event.start);
    }
    lwgEventRegister(): void {
        EventAdmin._register(_Game._Event.start, this, () => {
            _Game._drawSwitch = true;
            for (let index = 0; index < _Game._stepOrderImg.length; index++) {
                if (_Game._stepIndex.present >= index) {
                    _Game._stepOrderImg[index].visible = true;
                } else {
                    _Game._stepOrderImg[index].visible = false;
                }
            }
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
            if (_Game._stepIndex.present - 1 >= 0) {
                let Img0 = _Game._stepOrderImg[_Game._stepIndex.present - 1];
                let parent0 = Img0.parent as Laya.Image;
                Animation2D.fadeOut(Img0.getChildByName('Pic'), 0, 1, 300, 0, () => {
                    let Img = _Game._stepOrderImg[_Game._stepIndex.present];
                    Animation2D.fadeOut(Img.getChildByName('Pic'), 1, 0, 300, 0, () => {
                        _Game._stepIndex.present--;
                        if (_Game._stepIndex.present < _Game._stepIndex.mask) {
                            this.BtnNextStep.visible = true;
                        }
                        if (_Game._stepIndex.present == 0) {
                            this.BtnLastStep.visible = false;
                        }
                        // console.log(_Game._stepIndex, _Game._stepIndex.mask);
                        this['BtnStepClose'] = false;
                        this.drawState.frontPos = null;
                        EventAdmin._notify(_Game._Event.restoreZOder);
                        if (parent0 != this.ImgVar('DrawRoot')) {
                            parent0.zOrder = 200;
                        }
                        Img0.zOrder = 200;
                    })
                });
            }
        })

        EventAdmin._register(_Game._Event.nextStep, this, () => {
            EventAdmin._notify(_Game._Event.restoreZOder);
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
                        let parent0 = Img0.parent as Laya.Image;
                        _Game._stepIndex.present++;
                        if (!_Game._stepOrderImg[_Game._stepIndex.present][_Game._drawBoardProperty.whetherPass]) {
                            this.BtnNextStep.visible = false;
                        }
                        if (parent0 != this.ImgVar('DrawRoot')) {
                            parent0.zOrder = 200;
                        }
                        // console.log(_Game._stepIndex, _Game._stepIndex.mask);
                        Img0.zOrder = 200;
                        this['BtnStepClose'] = false;
                        this.drawState.frontPos = null;
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
            _Game._drawSwitch = false;
            // Animation2D.move_Scale(this.ImgVar('DrawRoot'), 1, this.ImgVar('DrawRoot').x, this.ImgVar('DrawRoot').y, this.ImgVar('DrawRoot').x, this.ImgVar('DrawRoot').y - 200, 0.7, 500, null, null, () => {
            this.BtnNextStep.visible = false;
            this.BtnLastStep.visible = false;
            this.BtnPlayAni.visible = true;
            this.BtnPlayAni.zOrder = 10;
            this.BtnBack.visible = true;
            // });
        })
    }

    /**绘画状态控制*/
    drawState = {
        frontPos: null,
        endPos: null,
        EraserSp: null,
        DrawSp: null,
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
                    if (index == _Game._stepIndex.present && _Game._drawSwitch) {
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
                        Sp.graphics.drawCircle(this.drawState.frontPos.x, this.drawState.frontPos.y, 15, _Game._SingleColorPencils._pitchColor);
                    }
                },
                // 移动
                (e: Laya.Event) => {
                    if (this.drawState.frontPos && index == _Game._stepIndex.present && _Game._drawSwitch) {
                        let DrawBoard = DrawRoot.getChildByName('DrawBoard') as Laya.Sprite;
                        let endPos = DrawBoard.globalToLocal(new Laya.Point(e.stageX, e.stageY));
                        if (_Game._SingleColorPencils._pitchName == 'eraser') {
                            if (this.drawState.EraserSp) {
                                let radius = 25;
                                this.drawState.EraserSp.graphics.drawLine(this.drawState.frontPos.x, this.drawState.frontPos.y, endPos.x, endPos.y, '#000000', radius * 2);
                                this.drawState.EraserSp.graphics.drawCircle(endPos.x, endPos.y, radius, '#000000');
                                // this._drawingLenth.value -= (this.drawState.frontPos as Laya.Point).distance(endPos.x, endPos.y);
                            }
                        } else {
                            if (this.drawState.DrawSp) {
                                // let tex = Laya.Loader.getRes(_PreloadUrl._list.texture2D.star1);
                                // DrawSp.graphics.drawTexture(tex, endPos.x, endPos.y, 50, 50);
                                let radius = 15;
                                this.drawState.DrawSp.graphics.drawLine(this.drawState.frontPos.x, this.drawState.frontPos.y, endPos.x, endPos.y, _Game._SingleColorPencils._pitchColor, radius * 2);
                                this.drawState.DrawSp.graphics.drawCircle(endPos.x, endPos.y, radius, _Game._SingleColorPencils._pitchColor);
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
        Click._on(Click._Type.largen, this.BtnPlayAni, this, null, null, () => {
            this.AniVar(_Game._Animation.action1).play(null, true);
        });
        Click._on(Click._Type.largen, this.BtnBack, this, null, null, () => {
            Admin._game.level++;
            Admin._openScene(Admin._SceneName.UIStart, this.calssName);
        });
    }
}


