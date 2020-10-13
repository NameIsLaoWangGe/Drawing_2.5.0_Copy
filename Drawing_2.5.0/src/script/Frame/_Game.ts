import { Admin, Animation2D, Click, Effects, EventAdmin, TimerAdmin, Tools } from "./lwg";
export module _Game {
    /**事件类型*/
    export enum _Event {
        start = '_Game_start',
        onStep = '_Game_onStep',
        compelet = '_Game_compelet',
        playAni1 = '_Game_playAni1',
        playAni2 = '_Game_playAni2',
    }
    /**动画名称*/
    export enum _Animation {
        action1 = 'action1',
        action2 = 'action2',
    }
    // 此处考虑使用表格
    export let _stepOrder: Array<string> = [];
    export let _passLenghtArr: Array<number> = [];
    export let _stepIndex = 0;
    export let _drawSwitch: boolean = false;
    /**基类*/
    export class _GameGeneral extends Admin._Scene {
        moduleOnAwake(): void {
            _Game._stepOrder = ['Face', 'Petal1', 'Petal2', 'Petal3', 'Petal4', 'Stalk', 'Leaf1', 'Leaf2'];
            _Game._passLenghtArr = [600, 400, 400, 400, 400, 200, 300, 300];
            _Game._stepIndex = 0;
        }
    }
    // export let brushColor: Array<>=[];
}
/**场景类*/
export default class GameScene extends _Game._GameGeneral {
    /**每个步骤需要绘制的长度监听*/
    _drawingLenth = {
        get value(): number {
            return this['len'] ? this['len'] : 0;
        },
        set value(v: number) {
            this['len'] = v;
            if (this['len'] >= _Game._passLenghtArr[_Game._stepIndex]) {
                EventAdmin._notify(_Game._Event.onStep);
                this['len'] = 0;
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
        this.ImgVar('PlayAni').visible = false;
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
        })
        EventAdmin._register(_Game._Event.onStep, this, () => {
            if (_Game._stepIndex >= _Game._stepOrder.length - 1) {
                EventAdmin._notify(_Game._Event.compelet);
                Animation2D.fadeOut(this.ImgVar(_Game._stepOrder[_Game._stepIndex]).getChildByName('Pic'), 1, 0, 300, 0);
            } else {
                _Game._stepIndex++;
                this.ImgVar(_Game._stepOrder[_Game._stepIndex]).visible = true;
                Animation2D.fadeOut(this.ImgVar(_Game._stepOrder[_Game._stepIndex]).getChildByName('Pic'), 0, 1, 300, 0, () => {
                    let Img0 = this.ImgVar(_Game._stepOrder[_Game._stepIndex - 1])
                    if (Img0) {
                        Animation2D.fadeOut(Img0.getChildByName('Pic'), 1, 0, 300, 0, () => {
                            let parent = Img0.parent as Laya.Image;
                            if (parent != this.ImgVar('DrawRoot')) {
                                Img0.zOrder = -1;
                                parent.zOrder = -1;
                            }
                        })
                    }
                });
            }
        })

        EventAdmin._register(_Game._Event.compelet, this, () => {
            _Game._drawSwitch = false;
            // Animation2D.move_Scale(this.ImgVar('DrawRoot'), 1, this.ImgVar('DrawRoot').x, this.ImgVar('DrawRoot').y, this.ImgVar('DrawRoot').x, this.ImgVar('DrawRoot').y - 200, 0.7, 500, null, null, () => {
            this.ImgVar('PlayAni').visible = true;
            // });
        })
        EventAdmin._register(_Game._Event.playAni1, this, () => {
        })
        EventAdmin._register(_Game._Event.playAni2, this, () => {
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
                    // console.log('正在绘画', Img.name);
                    let DrawSp = Img.getChildByName('DrawSp') as Laya.Sprite;
                    // 画线
                    if (this['frontPos'] && index == _Game._stepIndex && _Game._drawSwitch) {
                        let endPos = Img.globalToLocal(new Laya.Point(e.stageX, e.stageY));
                        DrawSp.graphics.drawLine(this['frontPos'].x, this['frontPos'].y, endPos.x, endPos.y, "#000000", 30);

                        DrawSp.graphics.drawCircle(endPos.x, endPos.y, 15, "#000000");

                        this._drawingLenth.value += (this['frontPos'] as Laya.Point).distance(endPos.x, endPos.y);
                        this['frontPos'] = new Laya.Point(endPos.x, endPos.y);
                    }
                },
                (e: Laya.Event) => {
                    this['frontPos'] = null;
                },
                (e: Laya.Event) => {
                    this['frontPos'] = null;
                }
            );
        }
        Click._on(Click._Type.largen, this.btnVar('PlayAni'), this, null, null, () => {
            this.AniVar(_Game._Animation.action1).play(null, true);
        });
    }
}

