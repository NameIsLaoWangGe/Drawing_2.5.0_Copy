import ADManager from "../TJ/Admanager";
import RecordManager from "../TJ/RecordManager";
import { Admin, Animation2D, Click, Color, EventAdmin, Share, Tools, _Gold, _SceneName } from "./Lwg";
import { _PreloadUrl } from "./_PreLoad";
import { _PropTry } from "./_PropTry";
import { _SelectLevel } from "./_SelectLevel";
import { _Share } from "./_Share";

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
        Photo = '_Game_Photo',
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
    export let _activate: boolean = true;
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
            singleColor: 'singleColor',
            colours: 'colours',
            stars: 'stars',
            eraser: 'eraser',
        },
        /**当前使用*/
        get presentUse(): string {
            return Laya.LocalStorage.getItem('_Pencils_presentUse') ? Laya.LocalStorage.getItem('_Pencils_presentUse') : 'singleColor';
        },
        set presentUse(name: string) {
            Laya.LocalStorage.setItem('_Pencils_presentUse', name.toString());
        },
        allPencils: ['colours', 'singleColor', 'stars'],
        get have(): Array<string> {
            try {
                let data = Laya.LocalStorage.getJSON('_Pencils_have')
                if (data) {
                    return JSON.parse(data);;
                } else {
                    return ['singleColor'];
                }
            } catch (error) {
                return ['singleColor'];
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
            _dataSource: '_dataSource',
            index: 'index',
            name: 'name',
            color: 'color',
            pitch: 'pitch',
            serial: 'serial',
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
                if (_PencilsList) {
                    _PencilsList.refresh();
                }
            }
        }
    }

    /**彩色画笔套装*/
    export class _ColoursPencils extends _SingleColorPencils {
        /**是否打开了彩色画笔*/
        static _Switch: boolean = false;
        /**次数*/
        static _drawTime: number = 0;
        /**画多少次后，进入另外两个颜色区间*/
        static _drawInterval: number = 30;
        /**当前输出颜色*/
        static get _outputColor(): string {
            let str: string;
            this._drawTime++;
            let R: number;
            let G: number;
            let B: number;
            if (1 <= this._drawTime && this._drawTime <= this._drawInterval) {
                R = this._presentColorArr[0][0] + (this._presentColorArr[1][0] - this._presentColorArr[0][0]) * this._drawTime / this._drawInterval;
                G = this._presentColorArr[0][1] + (this._presentColorArr[1][1] - this._presentColorArr[0][1]) * this._drawTime / this._drawInterval;
                B = this._presentColorArr[0][2] + (this._presentColorArr[1][2] - this._presentColorArr[0][2]) * this._drawTime / this._drawInterval;

            } else if (this._drawInterval < this._drawTime && this._drawTime <= this._drawInterval * 2) {
                R = this._presentColorArr[1][0] + (this._presentColorArr[2][0] - this._presentColorArr[1][0]) * (this._drawTime - this._drawInterval) / this._drawInterval;
                G = this._presentColorArr[1][1] + (this._presentColorArr[2][1] - this._presentColorArr[1][1]) * (this._drawTime - this._drawInterval) / this._drawInterval;
                B = this._presentColorArr[1][2] + (this._presentColorArr[2][2] - this._presentColorArr[1][2]) * (this._drawTime - this._drawInterval) / this._drawInterval;

            } else if (this._drawInterval * 2 < this._drawTime && this._drawTime < this._drawInterval * 3) {
                R = this._presentColorArr[2][0] + (this._presentColorArr[0][0] - this._presentColorArr[2][0]) * (this._drawTime - this._drawInterval * 2) / this._drawInterval;;
                G = this._presentColorArr[2][1] + (this._presentColorArr[0][1] - this._presentColorArr[2][1]) * (this._drawTime - this._drawInterval * 2) / this._drawInterval;
                B = this._presentColorArr[2][2] + (this._presentColorArr[0][2] - this._presentColorArr[2][2]) * (this._drawTime - this._drawInterval * 2) / this._drawInterval;
            } else if (this._drawInterval * 3 - 1 < this._drawTime) {
                this._drawTime = 0;
                R = this._presentColorArr[0][0];
                G = this._presentColorArr[0][1];
                B = this._presentColorArr[0][2];
            }
            R = Math.round(R), G = Math.round(G), B = Math.round(B);
            str = Color.RGBToHexString(R, G, B);
            return str;
        };

        static get _presentColorArr(): Array<number> {
            return this['_presentColorArr0'] ? this['_presentColorArr0'] : [this._data[0][this._property.color + 1], this._data[0][this._property.color + 2], this._data[0][this._property.color + 3]];
        }
        static _setPresentColorArr() {
            for (let index = 0; index < this._data.length; index++) {
                const element = this._data[index];
                if (element[this._property.name] == this._pitchName) {
                    this['_presentColorArr0'] = [];
                    this['_presentColorArr0'].push(element[this._property.color + 1]);
                    this['_presentColorArr0'].push(element[this._property.color + 2]);
                    this['_presentColorArr0'].push(element[this._property.color + 3]);
                    return;
                }
            }
        }
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
            var func = (e: Laya.Event) => {
                e.stopPropagation();
            }
            Click._on(Click._Type.largen, this.Owner, this,
                func,
                func,
                (e: Laya.Event) => {
                    e.stopPropagation();
                    let lasName = _SingleColorPencils._pitchName;
                    _SingleColorPencils._setPitchByName(this.Owner['_dataSource'][_SingleColorPencils._property.name]);
                    if (this.Owner['_dataSource'][_SingleColorPencils._property.name] == 'colours') {
                        if (!_ColoursPencils._Switch) {
                            _SingleColorPencils._setPitchByName(lasName);
                            this.lwgOpenScene(_SceneName.PropTry, false);
                            _PropTry._comeFrom = _SceneName.Game;
                            _activate = false;
                            return;
                        }
                        if (_Pencils.presentUse == _Pencils.type.singleColor) {
                            _Pencils.presentUse = _Pencils.type.colours;
                            _PencilsList.refresh();
                            return;
                        }
                        for (let index = 0; index < _ColoursPencils._data.length; index++) {
                            const element = _ColoursPencils._data[index];
                            if (_ColoursPencils._pitchName == element[_SingleColorPencils._property.name]) {
                                let nameIndex = Number(_ColoursPencils._pitchName.substr(5));
                                // console.log(nameIndex);
                                if (_Pencils.presentUse == _Pencils.type.colours) {
                                    if (!nameIndex) {
                                        nameIndex = 1;
                                    }
                                    nameIndex++;
                                    if (nameIndex > 7) {
                                        nameIndex = 1;
                                    }
                                    _ColoursPencils._pitchName = `caise${nameIndex}`;
                                    _ColoursPencils._setPresentColorArr();
                                }
                                _PencilsList.refresh();
                                return;
                            }
                        }
                    } else {
                        _Pencils.presentUse = _Pencils.type.singleColor;
                    }
                },
                func);
        }
    }

    export class Game extends Admin._SceneBase {
        /**每个步骤需要绘制的长度监听*/
        _drawingLenth = {
            get value(): number {
                return this['len'] ? this['len'] : 0;
            },
            set value(val: number) {
                if (_stepIndex.present == _stepIndex.max) {
                    this['len'] = val;
                    if (this['len'] >= _passLenght && !_stepOrderImg[_stepIndex.present][_drawBoardProperty.whetherPass]) {
                        EventAdmin._notify(_Event.showStepBtn);
                        _stepOrderImg[_stepIndex.present][_drawBoardProperty.whetherPass] = true;
                        this['len'] = 0;
                    }
                }
            },
        }

        lwgOnAwake(): void {
            _Gold.goldVinish(100);
            _passLenght = 50;
            _stepIndex.present = 0;
            _stepIndex.present = 0;
            _stepIndex.max = 0;
            _PencilsList = Laya.Pool.getItemByCreateFun('_prefab2D', _PreloadUrl._list.prefab2D.PencilsList.prefab.create, _PreloadUrl._list.prefab2D.PencilsList.prefab);
            this.Owner.addChild(_PencilsList)['pos'](Laya.stage.width / 2, Laya.stage.height * 0.824);
            _PencilsList.array = _SingleColorPencils._data;
            _PencilsList.selectEnable = true;
            //  _PencilsList.vScrollBarSkin = "";
            // this._ShopList.scrollBar.elasticBackTime = 0;//设置橡皮筋回弹时间。单位为毫秒。
            // this._ShopList.scrollBar.elasticDistance = 500;//设置橡皮筋极限距离。
            _PencilsList.selectHandler = new Laya.Handler(this, (index: number) => { });
            _PencilsList.renderHandler = new Laya.Handler(this, (cell: Laya.Box, index: number) => {
                let _dataSource = cell.dataSource;
                let Pic = cell.getChildByName('Pic') as Laya.Image;
                switch (_dataSource['name']) {
                    case 'colours':
                        Pic.skin = `Game/UI/GameScene/Pencils/ColoursPencils/${_ColoursPencils._pitchName}.png`;
                        break;
                    default:
                        Pic.skin = `Game/UI/GameScene/Pencils/Single/${_dataSource['name']}.png`;
                        break;
                }
                if (_dataSource[_SingleColorPencils._property.pitch]) {
                    Pic.scale(1.2, 1.2);
                } else {
                    Pic.scale(1, 1);
                }
            });
            if (_PencilsList.cells.length !== 0) {
                for (let index = 0; index < _PencilsList.cells.length; index++) {
                    const element = _PencilsList.cells[index];
                    if (!element.getComponent(_PencilsListItem)) {
                        element.addComponent(_PencilsListItem);
                    }
                }
            }
            _stepOrderImg = [];
            let index = 1;
            while (this.Owner['Draw' + index]) {
                let Img = this.Owner['Draw' + index] as Laya.Image;
                _stepOrderImg.push(Img);
                Img[_drawBoardProperty.originalZOder] = Img.zOrder;
                let parent = Img.parent as Laya.Image;
                if (parent != this.ImgVar('DrawRoot')) {
                    parent[_drawBoardProperty.originalZOder] = parent.zOrder;
                    parent[_drawBoardProperty.whetherPass] = false;
                }
                // 创建画板
                let DrawBoard = Img.addChild((new Laya.Sprite()).pos(0, 0)) as Laya.Sprite;
                DrawBoard.cacheAs = "bitmap";
                DrawBoard.name = 'DrawBoard';
                DrawBoard.width = Img.width;
                DrawBoard.height = Img.height;
                this.Owner['Draw' + index].skin = null;
                index++;
            }
            // console.log(_stepOrderImg);
            _Pencils.presentUse = _Pencils.type.singleColor;
            _SingleColorPencils._pitchName = _SingleColorPencils._data[0][_SingleColorPencils._property.name];
        }
        lwgOpenAni(): number {
            return 100;
        }

        /**步骤控制*/
        Step = {
            firstRootP: null as Laya.Point,
            firstRootScaleX: null as number,
            firstRootScaleY: null as number,
            /**当前焦点*/
            currentFocus: null as Laya.Image,
            BtnNext: null as Laya.Image,
            BtnLast: null as Laya.Image,
            btnSwitch: true,
            automaticNext: false,
            setAutomaticNext: () => {
                Laya.timer.frameOnce(120, this.Step, () => {
                    if (this.Step.automaticNext) {
                        EventAdmin._notify(_Event.nextStep);
                        this.Step.automaticNext = false;
                    }
                })
            },
            BtnCompelet: null as Laya.Image,
            /**按钮点击控制*/
            needCut: false as boolean,
            /**焦点切换*/
            cutFocus: (func?: Function) => {
                let Img = _stepOrderImg[_stepIndex.present];
                let Parent = Img.parent as Laya.Image;
                if (!this.Step.needCut) {
                    return;
                }
                if (Parent.name == 'Head' || Parent.name == 'Body') {
                    let oriPovitX = Parent.pivotX;
                    let oriPovitY = Parent.pivotY;
                    Tools.Node.changePovit(Parent, Parent.width / 2, Parent.height / 2, true);
                    let point = (Parent.parent as Laya.Image).localToGlobal(new Laya.Point(Parent.x, Parent.y));
                    let diffPoint = new Laya.Point(Laya.stage.width / 2 - point.x, Laya.stage.width * 3 / 5 - point.y);
                    // console.log(point);
                    Animation2D.move_Simple(this.ImgVar('DrawRoot'), this.ImgVar('DrawRoot').x, this.ImgVar('DrawRoot').y, this.ImgVar('DrawRoot').x + diffPoint.x, this.ImgVar('DrawRoot').y + diffPoint.y, 300, 0, () => {
                        Tools.Node.changePovit(Parent, oriPovitX, oriPovitY, true);
                        if (func) {
                            func();
                        }
                    });
                }
            },
            /**完成时候的焦点切换*/
            compeletCutFocus: () => {
                Animation2D.move_Simple(this.ImgVar('DrawRoot'), this.ImgVar('DrawRoot').x, this.ImgVar('DrawRoot').y, this.Step.firstRootP.x, this.Step.firstRootP.y, 300, 0, () => {
                });
            },
            init: () => {
                let Picture = this.ImgVar('DrawRoot').getChildAt(0) as Laya.Image;
                let num = 0;
                for (let index = 0; index < Picture.numChildren; index++) {
                    const element = Picture.getChildAt(index);
                    if (element.name == 'Head' || element.name == 'Body') {
                        num++;
                    }
                }
                if (num == 2) {
                    this.Step.needCut = true;
                } else {
                    this.Step.needCut = false;
                }
                this.Step.firstRootP = new Laya.Point(this.ImgVar('DrawRoot').x, this.ImgVar('DrawRoot').y);
                this.Step.firstRootScaleX = this.ImgVar('DrawRoot').scaleX;
                this.Step.firstRootScaleY = this.ImgVar('DrawRoot').scaleY;
                let StepSwitch = Tools.Node.prefabCreate(_PreloadUrl._list.prefab2D.StepSwitch.prefab) as Laya.Image;
                this.Owner.addChild(StepSwitch);
                StepSwitch.pos(Laya.stage.width / 2, Laya.stage.height * 0.641);
                this.Step.BtnNext = StepSwitch.getChildByName('BtnNextStep') as Laya.Image;
                this.Step.BtnLast = StepSwitch.getChildByName('BtnLastStep') as Laya.Image;
                this.Step.BtnNext.visible = false;
                this.Step.BtnLast.visible = false;
                this.Step.BtnCompelet = Tools.Node.prefabCreate(_PreloadUrl._list.prefab2D.BtnCompelet.prefab) as Laya.Image;
                this.Owner.addChild(this.Step.BtnCompelet);
                this.Step.BtnCompelet.visible = false;
                this.Step.BtnCompelet.pos(563, Laya.stage.height * 0.641);
            }
        }
        lwgOnEnable(): void {
            this.Step.init();
        }
        lwgOnStart(): void {
            RecordManager.startRecord();
            EventAdmin._notify(_Event.start);
        }
        lwgEventRegister(): void {
            EventAdmin._register(_Event.Photo, this, () => {
                this.AniVar(_Animation.action1).play();
                this.AniVar(_Animation.action1).stop();
                let Img = this.ImgVar('DrawRoot').getChildAt(0) as Laya.Image;
                // _Share._Data._photo._texture = Img.drawToTexture(Img.width, Img.height, 0, 0) as Laya.Texture;
                // _Share._Data._photo._width = Img.width;
                // _Share._Data._photo._height = Img.height;
                var htmlCanvas: Laya.HTMLCanvas = this.Owner.drawToCanvas(this.Owner.width, this.Owner.height, 0, 0);
                _Share._Data._base64 = htmlCanvas.toBase64("image/png", 1)
            })
1
            EventAdmin._register(_Event.colseScene, this, () => {
                Tools.Node.changePovit(this.ImgVar('DrawRoot'), 0, 0);
                this.ImgVar('DrawRoot').x = 0;
                this.ImgVar('DrawRoot').y = 0;
                let Image = this.ImgVar('DrawRoot').getChildAt(0) as Laya.Image;
                Tools.Node.changePovit(Image, 0, 0);
                Image.scale(Image.scaleX - 0.2, Image.scaleY - 0.2);
                Image.x = 100;
                Image.y = 100;
                var htmlCanvas: Laya.HTMLCanvas = this.Owner.drawToCanvas(this.Owner.width, this.Owner.height, 0, 0);
                _SelectLevel._Data._setHaveBeenDrawn(htmlCanvas.toBase64("image/png", 1));
                this.lwgCloseScene();
            })
            EventAdmin._register(_Event.victory, this, () => {
                this.AniVar(_Animation.action1).stop();
                Tools.Node.changePovit(this.ImgVar('DrawRoot'), this.ImgVar('DrawRoot').width / 2, this.ImgVar('DrawRoot').height / 2);
                Animation2D.move_Scale(this.ImgVar('DrawRoot'), this.ImgVar('DrawRoot').scaleX, this.ImgVar('DrawRoot').x, this.ImgVar('DrawRoot').y, this.ImgVar('DrawRoot').x, this.ImgVar('DrawRoot').y, this.ImgVar('DrawRoot').scaleX / 2, 500, 500);
                // let Img = new Laya.Image();
                // Img.skin = `Game/UI/Common/bj.png`;
                // Img.alpha = 0;
                // Img.width = Laya.stage.width;
                // Img.height = Laya.stage.height;
                // this.ImgVar('Background').addChild(Img);
                // Animation2D.fadeOut(Img, 0, 1, 500);
                _Gold.goldAppear(100);
            })

            EventAdmin._register(_Event.playAni1, this, () => {
                this.AniVar(_Animation.action1).play(null, true);
            })

            EventAdmin._register(_Event.start, this, () => {
                this.Draw.switch = true;
                for (let index = 0; index < _stepOrderImg.length; index++) {
                    if (_stepIndex.present >= index) {
                        _stepOrderImg[index].visible = true;
                    } else {
                        _stepOrderImg[index].visible = false;
                    }
                }
                let Img = _stepOrderImg[_stepIndex.present];
                let ImgParent = Img.parent as Laya.Image;
                if (ImgParent != this.ImgVar('DrawRoot')) {
                    ImgParent.zOrder = 200;
                }
                Img.zOrder = 200;
                this.Step.cutFocus();
            });

            EventAdmin._register(_Event.showStepBtn, this, () => {
                if (_stepIndex.present == 0) {
                    this.Step.BtnNext.visible = true;
                    Animation2D.fadeOut(this.Step.BtnNext, 0, 1, 300);
                } else {
                    if (!this.Step.BtnNext.visible) {
                        this.Step.BtnNext.visible = true;
                        Animation2D.fadeOut(this.Step.BtnNext, 0, 1, 300);
                    }
                    if (!this.Step.BtnLast.visible) {
                        this.Step.BtnLast.visible = true;
                        Animation2D.fadeOut(this.Step.BtnLast, 0, 1, 300);
                    }
                }
            });

            EventAdmin._register(_Event.lastStep, this, () => {
                if (!this.Step.btnSwitch) {
                    return;
                } else {
                    this.Step.btnSwitch = false;
                }
                this.Draw.restoration();
                if (_stepIndex.present - 1 >= 0) {
                    let Img0 = _stepOrderImg[_stepIndex.present - 1];
                    let Img0Parent = Img0.parent as Laya.Image;
                    Animation2D.fadeOut(Img0.getChildByName('Pic'), 0, 1, 300, 0, () => {
                        let Img = _stepOrderImg[_stepIndex.present];
                        Animation2D.fadeOut(Img.getChildByName('Pic'), 1, 0, 300, 0, () => {
                            _stepIndex.present--;
                            this.Step.cutFocus();
                            if (_stepIndex.present < _stepIndex.max) {
                                this.Step.BtnNext.visible = true;
                            }
                            if (_stepIndex.present == 0) {
                                this.Step.BtnLast.visible = false;
                            }
                            // console.log(_stepIndex,_stepIndex.max);
                            EventAdmin._notify(_Event.restoreZOder);
                            if (Img0Parent != this.ImgVar('DrawRoot')) {
                                Img0Parent.zOrder = 200;
                            }
                            Img0.zOrder = 200;
                            this.Step.btnSwitch = true;
                            this.Draw.switch = true;
                        })
                    });
                }
            })

            EventAdmin._register(_Event.nextStep, this, () => {
                if (!this.Step.btnSwitch) {
                    return;
                } else {
                    this.Step.btnSwitch = false;
                }
                if (!this.Step.BtnLast.visible) {
                    Animation2D.fadeOut(this.Step.BtnLast, 0, 1, 300, null, () => {
                        this.Step.BtnLast.visible = true;
                    });
                }
                EventAdmin._notify(_Event.restoreZOder);
                this.Draw.restoration();
                if (_stepIndex.present >= _stepOrderImg.length - 1) {
                    EventAdmin._notify(_Event.compelet);
                    Animation2D.fadeOut(_stepOrderImg[_stepIndex.present].getChildByName('Pic'), 1, 0, 300, 0);
                } else {
                    let Img = _stepOrderImg[_stepIndex.present];
                    Img.zOrder = Img[_drawBoardProperty.originalZOder];
                    Animation2D.fadeOut(Img.getChildByName('Pic'), 1, 0, 300, 0, () => {
                        let Img0 = _stepOrderImg[_stepIndex.present + 1];
                        Img0.visible = true;
                        Animation2D.fadeOut(Img0.getChildByName('Pic'), 0, 1, 300, 0, () => {
                            let Img0Parent = Img0.parent as Laya.Image;
                            _stepIndex.present++;
                            this.Step.cutFocus();
                            if (!_stepOrderImg[_stepIndex.present][_drawBoardProperty.whetherPass]) {
                                this.Step.BtnNext.visible = false;
                            }
                            if (Img0Parent != this.ImgVar('DrawRoot')) {
                                Img0Parent.zOrder = 200;
                            }
                            // console.log(_stepIndex,_stepIndex.max);
                            Img0.zOrder = 200;
                            this.Step.btnSwitch = true;
                            this.Draw.switch = true;
                        })
                    });
                }
            })

            EventAdmin._register(_Event.restoreZOder, this, () => {
                for (let index = 0; index < _stepOrderImg.length; index++) {
                    const element = _stepOrderImg[index] as Laya.Image;
                    if (element) {
                        element.zOrder = _stepOrderImg[index][_drawBoardProperty.originalZOder];
                        let parent = element.parent as Laya.Image;
                        if (parent != this.ImgVar('DrawRoot')) {
                            parent.zOrder = parent[_drawBoardProperty.originalZOder];
                        }
                    }
                }
            });

            EventAdmin._register(_Event.compelet, this, () => {
                EventAdmin._notify(_Event.restoreZOder);
                this.Draw.switch = false;
                this.Step.BtnNext.visible = false;
                this.Step.BtnLast.visible = false;
                this.Step.BtnCompelet.visible = true;
                Animation2D.fadeOut(_PencilsList, 1, 0, 200);
            })
        }

        /**绘画控制*/
        Draw = {
            switch: false,
            DrawRoot: null as Laya.Image,
            DrawBoard: null as Laya.Image,
            EraserSp: null as Laya.Sprite,
            DrawSp: null as Laya.Sprite,
            frontPos: null as Laya.Point,
            endPos: null as Laya.Point,
            space: 15,
            radius: {
                get value(): number {
                    return 50;
                }
            },
            restoration: () => {
                this.Draw.switch = false;
                this.Draw.frontPos = null;
                this.Draw.endPos = null;
                this.Draw.DrawSp = null;
                this.Draw.EraserSp = null;
            },
        }

        onStageMouseDown(e: Laya.Event): void {
            Laya.timer.clearAll(this.Step);
            this.Draw.DrawRoot = _stepOrderImg[_stepIndex.present];
            this.Draw.DrawBoard = this.Draw.DrawRoot.getChildByName('DrawBoard') as Laya.Image;
            this.Draw.frontPos = this.Draw.DrawBoard.globalToLocal(new Laya.Point(e.stageX, e.stageY));
            let Sp: Laya.Sprite;
            if (this.Draw.switch && _Game._activate) {
                let DrawBoard = this.Draw.DrawRoot.getChildByName('DrawBoard') as Laya.Sprite;
                this.Draw.frontPos = DrawBoard.globalToLocal(new Laya.Point(e.stageX, e.stageY));
                let color: string;
                switch (_SingleColorPencils._pitchName) {
                    case _Pencils.type.eraser:
                        Sp = this.Draw.EraserSp = new Laya.Sprite();
                        this.Draw.EraserSp.blendMode = "destination-out";
                        color = '#000000';
                        break;
                    case _Pencils.type.colours:
                        Sp = this.Draw.DrawSp = new Laya.Sprite();
                        this.Draw.DrawSp.blendMode = "none";
                        color = _ColoursPencils._outputColor;
                        break;
                    default:
                        Sp = this.Draw.DrawSp = new Laya.Sprite();
                        this.Draw.DrawSp.blendMode = "none";
                        color = _SingleColorPencils._pitchColor;
                        break;
                }
                DrawBoard.addChild(Sp)['pos'](0, 0);
                let tex = Laya.loader.getRes((_PreloadUrl._list.texture.bishua3.url));
                Sp.graphics.drawTexture(tex, this.Draw.frontPos.x - this.Draw.radius.value / 2, this.Draw.frontPos.y - this.Draw.radius.value / 2, this.Draw.radius.value, this.Draw.radius.value, null, 1, color, null);
            }
        }
        onStageMouseMove(e: Laya.Event): void {
            if (this.Draw.frontPos && this.Draw.switch && _Game._activate) {
                let endPos = this.Draw.DrawBoard.globalToLocal(new Laya.Point(e.stageX, e.stageY));
                let Sp: Laya.Sprite;
                let color: string;
                switch (_SingleColorPencils._pitchName) {
                    case _Pencils.type.eraser:
                        Sp = this.Draw.EraserSp;
                        color = '#000000';
                        break;
                    case _Pencils.type.colours:
                        Sp = this.Draw.DrawSp;
                        color = _ColoursPencils._outputColor;
                        this._drawingLenth.value += (this.Draw.frontPos as Laya.Point).distance(endPos.x, endPos.y);
                        break;
                    default:
                        Sp = this.Draw.DrawSp;
                        color = _SingleColorPencils._pitchColor;
                        this._drawingLenth.value += (this.Draw.frontPos as Laya.Point).distance(endPos.x, endPos.y);
                        break;
                }
                if (!Sp) {
                    return;
                }
                let tex = Laya.loader.getRes((_PreloadUrl._list.texture.bishua3.url));
                Sp.graphics.drawTexture(tex, endPos.x - this.Draw.radius.value / 2, endPos.y - this.Draw.radius.value / 2, this.Draw.radius.value, this.Draw.radius.value, null, 1, color, null);
                let destance = this.Draw.frontPos.distance(endPos.x, endPos.y);
                if (destance > this.Draw.space) {
                    let num = destance / this.Draw.space;
                    let pointArr = Tools.Point.getPArrBetweenTwoP(this.Draw.frontPos, endPos, num);
                    for (let index = 0; index < pointArr.length; index++) {
                        Sp.graphics.drawTexture(tex, pointArr[index].x - this.Draw.radius.value / 2, pointArr[index].y - this.Draw.radius.value / 2, this.Draw.radius.value, this.Draw.radius.value, null, 1, color, null);
                    }
                }
                // 消除颜色
                Sp.graphics.drawTexture(tex, endPos.x - this.Draw.radius.value / 2, endPos.y - this.Draw.radius.value / 2, this.Draw.radius.value, this.Draw.radius.value, null, 0, null, null);

                this.Draw.frontPos = endPos;
            }
        }
        onStageMouseUp(): void {
            this.Draw.frontPos = null;
            this.Step.setAutomaticNext();
            // 画板内绘制节点过多时，则将图像绘制到新的画板上，删掉旧的画板
            if (this.Draw.DrawBoard && this.Draw.DrawBoard.numChildren > 3) {
                console.log('合并！')
                let NewBoard = this.Draw.DrawRoot.addChild((new Laya.Sprite()).pos(0, 0)) as Laya.Sprite;
                NewBoard.width = this.Draw.DrawRoot.width;
                NewBoard.height = this.Draw.DrawRoot.height;
                NewBoard.cacheAs = "bitmap";
                NewBoard.name = 'DrawBoard';
                NewBoard.texture = this.Draw.DrawBoard.drawToTexture(this.Draw.DrawBoard.width, this.Draw.DrawBoard.height, this.Draw.DrawBoard.x, this.Draw.DrawBoard.y) as Laya.Texture;
                this.Draw.DrawBoard.destroy();
            }
        }

        lwgBtnClick(): void {
            for (let index = 0; index < _stepOrderImg.length; index++) {
                const element = _stepOrderImg[index];
                var func = () => {
                    if (index == _stepIndex.present) {
                        this.Step.automaticNext = true;
                    }
                }
                Click._on(Click._Type.noEffect, _stepOrderImg[index], this, func, func, func, func)
            }
            Click._on(Click._Type.largen, this.Step.BtnLast, this, null, null, () => {
                Laya.timer.clearAll(this.Step);
                EventAdmin._notify(_Event.lastStep);
            });
            Click._on(Click._Type.largen, this.Step.BtnNext, this, null, null, () => {
                Laya.timer.clearAll(this.Step);
                EventAdmin._notify(_Event.nextStep);
            });
            Click._on(Click._Type.largen, this.Step.BtnCompelet, this, null, null, () => {
                this.Step.compeletCutFocus();
                Admin._game.level++;
                this.Draw.switch = false;
                this.lwgOpenScene(_SceneName.Settle, false, () => {
                    this.Step.BtnCompelet.visible = false;
                });
            });
        }
        lwgOnDisable(): void {
            _ColoursPencils._Switch = false;
        }
    }
}
export default _Game.Game;



