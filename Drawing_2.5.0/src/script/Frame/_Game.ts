import { Admin, Animation2D, Click, EventAdmin, Tools } from "./Lwg";
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
    export let _stepOrder: Array<string> = [];
    export let _passLenghtArr: Array<number> = [];
    export let _stepIndex = 0;
    export let _stepMaskIndex = 0;
    export let _drawSwitch: boolean = false;

    export let _PencilsList: Laya.List;
    export let _coloursPencils = {
    };
    export let _singlePencils = {
        property: {
            number: 'number',
            name: 'name',
            color: 'color',
            pitch: 'pitch',
        },
        pitchName: {
            get value(): string {
                return this['name'] ? this['name'] : _singlePencils.data[0][_singlePencils.property.name];
            },
            set value(name: string) {
                this['name'] = name;
            }
        },
        pitchColor: {
            get value(): string {
                return this['color'] ? this['color'] : _singlePencils.data[0][_singlePencils.property.color];
            },
            set value(name: string) {
                this['color'] = name;
            }
        },
        get data(): Array<any> {
            return this['arr'] ? this['arr'] : Tools.objArray_Copy(Laya.loader.getRes(_PreloadUrl.list.json.SingleColor));
        },
        set data(array: Array<any>) {
            this['arr'] = array;
        },
        setPitchByName(name: string): void {
            for (let index = 0; index < this.data.length; index++) {
                if (name == this.data[index][this.property.name]) {
                    this.data[index][this.property.pitch] = true;
                    _singlePencils.pitchName.value = name;
                    _singlePencils.pitchColor.value = this.data[index][this.property.color];
                } else {
                    this.data[index][this.property.pitch] = false;
                }
            }
        }
    }
    export function _init(): void {
        _singlePencils.data = Tools.objArray_Copy(Laya.loader.getRes(_PreloadUrl.list.json.SingleColor)["RECORDS"]);
        _singlePencils.setPitchByName(_singlePencils.data[0][_singlePencils.property.name]);
        _stepOrder = ['Face', 'Petal1', 'Petal2', 'Petal3', 'Petal4', 'Stalk', 'Leaf1', 'Leaf2'];
        _passLenghtArr = [150, 150, 150, 150, 150, 150, 150, 150];
    }
    export class _GameGeneral extends Admin._Scene {
        moduleOnAwake(): void {
            _stepIndex = 0;
            _PencilsList = this.ListVar('PencilsList');
            _PencilsList.array = _singlePencils.data;
            _PencilsList.selectEnable = true;
            _PencilsList.vScrollBarSkin = "";
            // this._ShopList.scrollBar.elasticBackTime = 0;//设置橡皮筋回弹时间。单位为毫秒。
            // this._ShopList.scrollBar.elasticDistance = 500;//设置橡皮筋极限距离。
            _PencilsList.selectHandler = new Laya.Handler(this, this._pencilsListScelet);
            _PencilsList.renderHandler = new Laya.Handler(this, this._pencilsListUpdate);
            if (_PencilsList.cells.length !== 0) {
                for (let index = 0; index < _PencilsList.cells.length; index++) {
                    const element = _PencilsList.cells[index];
                    if (!element.getComponent(_PencilsListItem)) {
                        element.addComponent(_PencilsListItem);
                    }
                }
            }
        }
        /**list选中监听,重写覆盖*/
        _pencilsListScelet(index: number): void { }
        /**list列表刷新,重写覆盖*/
        _pencilsListUpdate(cell: Laya.Box, index: number): void {
            let _dataSource = cell.dataSource;
            let Pic = cell.getChildByName('Pic') as Laya.Image;
            Pic.skin = 'Game/UI/GameScene/SinglePencils/' + _dataSource['name'] + '.png';
            if (_dataSource[_singlePencils.property.pitch]) {
                Pic.scale(1.1, 1.1);
            } else {
                Pic.scale(1, 1);
            }
        }
    }

    export class _PencilsListItem extends Admin._Object {
        lwgBtnClick(): void {
            Click._on(Click._Type.largen, this.self, this, null, null, () => {
                _singlePencils.setPitchByName(this.self['_dataSource'][_singlePencils.property.name]);
                _PencilsList.refresh();
                console.log(_singlePencils.pitchColor.value);
            });
        }
    }
}
export default class GameScene extends _Game._GameGeneral {
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
                Animation2D.fadeOut(this.ImgVar('BtnNextStep'), 0, 1, 300, null, null, true);
            } else {
                if (!this.ImgVar('BtnNextStep').visible) {
                    this.ImgVar('BtnNextStep').visible = true;
                    Animation2D.fadeOut(this.ImgVar('BtnNextStep'), 0, 1, 300, null, null, true);
                }
                if (!this.ImgVar('BtnLastStep').visible) {
                    this.ImgVar('BtnLastStep').visible = true;
                    Animation2D.fadeOut(this.ImgVar('BtnLastStep'), 0, 1, 300, null, null, true);
                }
            }
            this._drawingLenth.switch = false;
        });

        EventAdmin._register(_Game._Event.lastStep, this, () => {
            if (_Game._stepIndex - 1 >= 0) {
                Admin._clickLock.switch = true;
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
                        Admin._clickLock.switch = false;
                    })
                });
            }
        })

        EventAdmin._register(_Game._Event.nextStep, this, () => {
            if (_Game._stepIndex >= _Game._stepOrder.length - 1) {
                EventAdmin._notify(_Game._Event.compelet);
                Animation2D.fadeOut(this.ImgVar(_Game._stepOrder[_Game._stepIndex]).getChildByName('Pic'), 1, 0, 300, 0);
            } else {
                Admin._clickLock.switch = true;
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
                        Admin._clickLock.switch = false;
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
            let Img = this.ImgVar(_Game._stepOrder[index]);
            Click._on(Click._Type.noEffect, Img.getChildByName('Pic'), this,
                // 按下
                (e: Laya.Event) => {
                    this['frontPos'] = null;
                    // 初始化一个绘制节点
                    if (!Img.getChildByName('DrawSp')) {
                        let DrawSp = new Laya.Sprite();
                        Img.addChild(DrawSp);
                        DrawSp.name = 'DrawSp';
                        DrawSp.pos(0, 0);
                    }
                    // 初始位置
                    this['frontPos'] = Img.globalToLocal(new Laya.Point(e.stageX, e.stageY));
                },
                // 移动
                (e: Laya.Event) => {
                    let DrawSp = Img.getChildByName('DrawSp') as Laya.Sprite;
                    if (!DrawSp) {
                        return;
                    }
                    // 画线
                    if (this['frontPos'] && index == _Game._stepIndex && _Game._drawSwitch) {
                        let endPos = Img.globalToLocal(new Laya.Point(e.stageX, e.stageY));
                        DrawSp.graphics.drawLine(this['frontPos'].x, this['frontPos'].y, endPos.x, endPos.y, _Game._singlePencils.pitchColor.value, 30);

                        DrawSp.graphics.drawCircle(endPos.x, endPos.y, 15, _Game._singlePencils.pitchColor.value);

                        this._drawingLenth.value += (this['frontPos'] as Laya.Point).distance(endPos.x, endPos.y);
                        this['frontPos'] = new Laya.Point(endPos.x, endPos.y);
                    }
                },
                (e: Laya.Event) => {
                    this['frontPos'] = null;
                }
            );
        }
        Click._on(Click._Type.largen, this.btnVar('PlayAni'), this, null, null, () => {
            this.AniVar(_Game._Animation.action1).play(null, true);
        });
        Click._on(Click._Type.largen, this.btnVar('BtnLastStep'), this, null, null, () => {
            this._drawingLenth.switch = false;
            EventAdmin._notify(_Game._Event.lastStep);
        });
        Click._on(Click._Type.largen, this.btnVar('BtnNextStep'), this, null, null, () => {
            if (!this.ImgVar('BtnLastStep').visible) {
                this.ImgVar('BtnLastStep').visible = true;
                Animation2D.fadeOut(this.ImgVar('BtnLastStep'), 0, 1, 300, null, null, true);
            }
            EventAdmin._notify(_Game._Event.nextStep);
        });
    }
}


