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
    export let _stepOrder: Array<string> = [];
    export let _passLenghtArr: Array<number> = [];
    export let _stepIndex = 0;
    export let _stepMaskIndex = 0;
    export let _drawSwitch: boolean = false;
    
    export let _PencilsList: Laya.List;
    export class _coloursPencils {
        static _property = {
            number: 'number',
            name: 'name',
            color: 'color',
            pitch: 'pitch',
        };
        /**当前选中画笔*/
        protected static pitchName: string;
        static get _pitchName(): string {
            return this.pitchName ? this.pitchName : this._data[0][this._property.name];
        };
        static set _pitchName(name: string) { this.pitchName = name };

        /**当前选中画笔的颜色*/
        protected static pitchColor: string;
        static get _pitchColor(): string {
            return this['color'] ? this['color'] : this._data[0][this._property.color];
        };
        static set _pitchColor(name: string) { this['color'] = name };
        /**列表*/
        protected static data: Array<any>;
        static get _data(): Array<any> {
            return this.data ? this.data : Tools.objArray_Copy(Laya.loader.getRes(_PreloadUrl._list.json.SingleColor)["RECORDS"]);
        };
        static set _data(array: Array<any>) {
            this.data = array;
        };
        /**设置选中*/
        static setPitchByName(name: string): void {
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
    export class _starsPencils extends _coloursPencils {
        static get _data(): Array<any> {
            return this.data ? this.data : Tools.objArray_Copy(Laya.loader.getRes(_PreloadUrl._list.json.Colours)["RECORDS"]);
        };
        static set _data(array: Array<any>) {
            this.data = array;
        };
    }
    export function _init(): void {
        _coloursPencils._data = Tools.objArray_Copy(Laya.loader.getRes(_PreloadUrl._list.json.SingleColor)["RECORDS"]);
        _coloursPencils.setPitchByName(_coloursPencils._data[0][_coloursPencils._property.name]);
        _stepOrder = ['Face', 'Petal1', 'Petal2', 'Petal3', 'Petal4', 'Stalk', 'Leaf1', 'Leaf2'];
        _passLenghtArr = [150, 150, 150, 150, 150, 150, 150, 150];
    }
    export class _PencilsListItem extends Admin._Object {
        lwgBtnClick(): void {
            Click._on(Click._Type.largen, this.self, this, null, null, () => {
                _coloursPencils.setPitchByName(this.self['_dataSource'][_coloursPencils._property.name]);
                _PencilsList.refresh();
            });
        }
    }
}
export default class GameScene extends Admin._Scene {
    /**每个步骤需要绘制的长度监听*/
    _drawingLenth = {
        switch: true,
        get value(): number {
            return this['len'] ? this['len'] : 0;
        },
        set value(v: number) {
            if (this.switch) {
                this['len'] = v;
                if (this['len'] >= _Game._passLenghtArr[_Game._stepIndex]) {
                    EventAdmin._notify(_Game._Event.showStepBtn);
                    this['len'] = 0;
                }
            }
        },
    }
    lwgOnAwake(): void {
        _Game._stepIndex = 0;
        _Game._drawSwitch = false;
        _Game._stepIndex = 0;

        _Game._PencilsList = this.ListVar('PencilsList');
        _Game._PencilsList.array = _Game._coloursPencils._data;
        _Game._PencilsList.selectEnable = true;
        _Game._PencilsList.vScrollBarSkin = "";
        // this._ShopList.scrollBar.elasticBackTime = 0;//设置橡皮筋回弹时间。单位为毫秒。
        // this._ShopList.scrollBar.elasticDistance = 500;//设置橡皮筋极限距离。
        _Game._PencilsList.selectHandler = new Laya.Handler(this, (index: number) => { });
        _Game._PencilsList.renderHandler = new Laya.Handler(this, (cell: Laya.Box, index: number) => {
            let _dataSource = cell.dataSource;
            let Pic = cell.getChildByName('Pic') as Laya.Image;
            Pic.skin = 'Game/UI/GameScene/SinglePencils/' + _dataSource['name'] + '.png';
            if (_dataSource[_Game._coloursPencils._property.pitch]) {
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
    }
    lwgOnEnable(): void {
        // this.ImgVar('DrawRoot').pivotX = this.ImgVar('DrawRoot').width / 2;
        // this.ImgVar('DrawRoot').pivotY = this.ImgVar('DrawRoot').height / 2;
    }
    lwgEventRegister(): void {

        EventAdmin._register(_Game._Event.start, this, () => {
            _Game._drawSwitch = true;
            for (let index = 0; index < _Game._stepOrder.length; index++) {
                if (_Game._stepIndex >= index) {
                    this.ImgVar(_Game._stepOrder[index]).visible = true;
                } else {
                    this.ImgVar(_Game._stepOrder[index]).visible = false;
                }
            }
        });

        EventAdmin._register(_Game._Event.showStepBtn, this, () => {
            if (_Game._stepIndex == 0) {
                this.ImgVar('BtnNextStep').visible = true;
                Animation2D.fadeOut(this.ImgVar('BtnNextStep'), 0, 1, 300);
            } else {
                if (!this.ImgVar('BtnNextStep').visible) {
                    this.ImgVar('BtnNextStep').visible = true;
                    Animation2D.fadeOut(this.ImgVar('BtnNextStep'), 0, 1, 300);
                }
                if (!this.ImgVar('BtnLastStep').visible) {
                    this.ImgVar('BtnLastStep').visible = true;
                    Animation2D.fadeOut(this.ImgVar('BtnLastStep'), 0, 1, 300);
                }
            }
            this._drawingLenth.switch = false;
        });

        EventAdmin._register(_Game._Event.lastStep, this, () => {
            if (_Game._stepIndex - 1 >= 0) {
                let Img0 = this.ImgVar(_Game._stepOrder[_Game._stepIndex - 1]);
                let parent0 = Img0.parent as Laya.Image;
                Animation2D.fadeOut(Img0.getChildByName('Pic'), 0, 1, 300, 0, () => {
                    if (parent0 != this.ImgVar('DrawRoot')) {
                        parent0.zOrder = (_Game._stepIndex + 1) * 10;
                    }
                    Img0.zOrder = (_Game._stepIndex + 1) * 10;

                    let Img = this.ImgVar(_Game._stepOrder[_Game._stepIndex]);
                    let parent = Img.parent as Laya.Image;
                    Animation2D.fadeOut(Img.getChildByName('Pic'), 1, 0, 300, 0, () => {
                        if (parent != this.ImgVar('DrawRoot')) {
                            parent.zOrder = -1;
                        }
                        Img.zOrder = -1;
                        _Game._stepIndex--;
                        console.log(_Game._stepIndex, _Game._stepMaskIndex);
                        if (_Game._stepIndex < _Game._stepMaskIndex) {
                            this.ImgVar('BtnNextStep').visible = true;
                        }
                        if (_Game._stepIndex == 0) {
                            this.ImgVar('BtnLastStep').visible = false;
                        }
                        this['BtnLastStepClose'] = false;
                    })
                });
            }
        })

        EventAdmin._register(_Game._Event.nextStep, this, () => {
            if (_Game._stepIndex >= _Game._stepOrder.length - 1) {
                EventAdmin._notify(_Game._Event.compelet);
                Animation2D.fadeOut(this.ImgVar(_Game._stepOrder[_Game._stepIndex]).getChildByName('Pic'), 1, 0, 300, 0);
            } else {
                let Img = this.ImgVar(_Game._stepOrder[_Game._stepIndex]);
                let parent = Img.parent as Laya.Image;
                if (parent != this.ImgVar('DrawRoot')) {
                    parent.zOrder = -1;
                }
                Img.zOrder = -1;
                Animation2D.fadeOut(Img.getChildByName('Pic'), 1, 0, 300, 0, () => {
                    let Img0 = this.ImgVar(_Game._stepOrder[_Game._stepIndex + 1]);
                    Img0.visible = true;
                    Animation2D.fadeOut(Img0.getChildByName('Pic'), 0, 1, 300, 0, () => {
                        let parent0 = Img0.parent as Laya.Image;
                        _Game._stepIndex++;
                        if (_Game._stepIndex == _Game._stepMaskIndex + 1) {
                            _Game._stepMaskIndex++;
                            this.ImgVar('BtnNextStep').visible = false;
                            this._drawingLenth.switch = true;
                        }
                        if (parent0 != this.ImgVar('DrawRoot')) {
                            parent0.zOrder = _Game._stepIndex * 10;
                        }
                        console.log(_Game._stepIndex, _Game._stepMaskIndex);
                        Img0.zOrder = _Game._stepIndex * 10;
                        this['BtnNextStepClose'] = false;
                    })
                });
            }
        })

        EventAdmin._register(_Game._Event.compelet, this, () => {
            _Game._drawSwitch = false;
            // Animation2D.move_Scale(this.ImgVar('DrawRoot'), 1, this.ImgVar('DrawRoot').x, this.ImgVar('DrawRoot').y, this.ImgVar('DrawRoot').x, this.ImgVar('DrawRoot').y - 200, 0.7, 500, null, null, () => {
            this.ImgVar('BtnNextStep').visible = false;
            this.ImgVar('BtnLastStep').visible = false;
            this.ImgVar('PlayAni').visible = true;
            this.ImgVar('PlayAni').zOrder = 10;
            this.ImgVar('BtnBack').visible = true;
            // });
        })
    }
    lwgOnStart(): void {
        EventAdmin._notify(_Game._Event.start);
    }
    lwgBtnClick(): void {
        Click._on(Click._Type.largen, this.btnVar('BtnBack'), this, null, null, () => {
            Admin._openScene(Admin._SceneName.UIStart, this.calssName);
        });
        for (let index = 0; index < _Game._stepOrder.length; index++) {
            let DrawRoot = this.ImgVar(_Game._stepOrder[index]);
            let Board = DrawRoot.addChild((new Laya.Sprite()).pos(0, 0)) as Laya.Sprite;
            Board.cacheAs = "bitmap";
            Board.name = 'Board';
            Board.width = DrawRoot.width;
            Board.height = DrawRoot.height;

            Click._on(Click._Type.noEffect, DrawRoot.getChildByName('Pic'), this,
                // 按下
                (e: Laya.Event) => {
                    // 初始化一个绘制节点
                    let Sp: Laya.Sprite;
                    let Board = DrawRoot.getChildByName('Board') as Laya.Sprite;
                    this['frontPos'] = Board.globalToLocal(new Laya.Point(e.stageX, e.stageY));
                    if (_Game._coloursPencils._pitchName == 'eraser') {
                        Sp = this['EraserSp'] = new Laya.Sprite();
                        this['EraserSp'].blendMode = "destination-out";
                    } else {
                        Sp = this['DrawSp'] = new Laya.Sprite();
                        this['DrawSp'].blendMode = "none";
                    }
                    Board.addChild(Sp)['pos'](0, 0);
                    Sp.graphics.drawCircle(this['frontPos'].x, this['frontPos'].y, 15, _Game._coloursPencils._pitchColor);
                },
                // 移动
                (e: Laya.Event) => {
                    let Board = DrawRoot.getChildByName('Board') as Laya.Sprite;
                    let endPos = Board.globalToLocal(new Laya.Point(e.stageX, e.stageY));
                    if (this['frontPos'] && index == _Game._stepIndex && _Game._drawSwitch) {
                        if (_Game._coloursPencils._pitchName == 'eraser') {
                            if (this['EraserSp']) {
                                let radius = 25;
                                this['EraserSp'].graphics.drawLine(this['frontPos'].x, this['frontPos'].y, endPos.x, endPos.y, '#000000', radius * 2);
                                this['EraserSp'].graphics.drawCircle(endPos.x, endPos.y, radius, '#000000');
                                // this._drawingLenth.value -= (this['frontPos'] as Laya.Point).distance(endPos.x, endPos.y);
                            }
                        } else {
                            if (this['DrawSp']) {
                                // let tex = Laya.Loader.getRes(_PreloadUrl._list.texture2D.star1);
                                // DrawSp.graphics.drawTexture(tex, endPos.x, endPos.y, 50, 50);
                                let radius = 15;
                                this['DrawSp'].graphics.drawLine(this['frontPos'].x, this['frontPos'].y, endPos.x, endPos.y, _Game._coloursPencils._pitchColor, radius * 2);
                                this['DrawSp'].graphics.drawCircle(endPos.x, endPos.y, radius, _Game._coloursPencils._pitchColor);
                                this._drawingLenth.value += (this['frontPos'] as Laya.Point).distance(endPos.x, endPos.y);
                            }
                        }
                        this['frontPos'] = new Laya.Point(endPos.x, endPos.y);
                    }
                },
                (e: Laya.Event) => {
                    this['frontPos'] = null;
                    let Board = DrawRoot.getChildByName('Board') as Laya.Sprite;
                    if (Board && Board.numChildren > 3) {
                        let NewBoard = DrawRoot.addChild((new Laya.Sprite()).pos(0, 0)) as Laya.Sprite;
                        NewBoard.cacheAs = "bitmap";
                        NewBoard.name = 'Board';
                        NewBoard.width = DrawRoot.width;
                        NewBoard.height = DrawRoot.height;
                        NewBoard.texture = Board.drawToTexture(Board.width, Board.height, Board.x, Board.y) as Laya.Texture;
                        Board.destroy();
                    }
                }
            );
        }
        Click._on(Click._Type.largen, this.btnVar('PlayAni'), this, null, null, () => {
            this.AniVar(_Game._Animation.action1).play(null, true);
        });
        Click._on(Click._Type.largen, this.btnVar('BtnLastStep'), this, null, null, () => {
            if (this['BtnLastStepClose']) {
                return;
            } else {
                this['BtnLastStepClose'] = true;
            }
            this._drawingLenth.switch = false;
            EventAdmin._notify(_Game._Event.lastStep);
        });
        Click._on(Click._Type.largen, this.btnVar('BtnNextStep'), this, null, null, () => {
            if (this['BtnNextStepClose']) {
                return;
            } else {
                this['BtnNextStepClose'] = true;
            }
            if (!this.ImgVar('BtnLastStep').visible) {
                this.ImgVar('BtnLastStep').visible = true;
                Animation2D.fadeOut(this.ImgVar('BtnLastStep'), 0, 1, 300, null, null, true);
            }
            EventAdmin._notify(_Game._Event.nextStep);
        });
    }
}


