import { Admin, Animation2D, Click, Color, EventAdmin, Tools, _Gold, _SceneName } from "./Lwg";
import { _PreloadUrl } from "./_PreLoad";
import { _PropTry } from "./_PropTry";

/**游戏场景模块*/
export module _Game {
    export let _base64: string;
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
            }
        }
    }
    /**彩色画笔套装*/
    export class _ColoursPencils extends _SingleColorPencils {
        /**次数*/
        static _drawTime = 0;
        /**画多少次后，进入另外两个颜色区间*/
        static _drawInterval = 30;
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
                    _SingleColorPencils._setPitchByName(this.Owner['_dataSource'][_SingleColorPencils._property.name]);
                    if (this.Owner['_dataSource'][_SingleColorPencils._property.name] == 'colours') {
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
        }
        lwgOpenAni(): number {
            return 100;
        }
        /**阶段切换按钮*/
        StepSwitch: Laya.Image;
        BtnNextStep: Laya.Image;
        BtnLastStep: Laya.Image;
        /**返回按钮*/
        BtnCompelet: Laya.Image;
        lwgOnEnable(): void {
            this.StepSwitch = Tools.Node.prefabCreate(_PreloadUrl._list.prefab2D.StepSwitch.prefab) as Laya.Image;
            this.Owner.addChild(this.StepSwitch);
            this.StepSwitch.pos(Laya.stage.width / 2, Laya.stage.height * 0.641);
            this.BtnNextStep = this.StepSwitch.getChildByName('BtnNextStep') as Laya.Image;
            this.BtnLastStep = this.StepSwitch.getChildByName('BtnLastStep') as Laya.Image;
            this.BtnNextStep.visible = false;
            this.BtnLastStep.visible = false;

            this.BtnCompelet = Tools.Node.prefabCreate(_PreloadUrl._list.prefab2D.BtnCompelet.prefab) as Laya.Image;
            this.Owner.addChild(this.BtnCompelet);
            this.BtnCompelet.visible = false;
            this.BtnCompelet.pos(563, Laya.stage.height * 0.641);
        }
        lwgOnStart(): void {
            EventAdmin._notify(_Event.start);
        }
        lwgEventRegister(): void {
            EventAdmin._register(_Event.colseScene, this, () => {
                let NewDrawRoot = this.DrawControl.DrawRoot.addChild((new Laya.Sprite()).pos(0, 0)) as Laya.Sprite;
                NewDrawRoot.width = this.DrawControl.DrawRoot.width;
                NewDrawRoot.height = this.DrawControl.DrawRoot.height;
                NewDrawRoot.texture = this.ImgVar('DrawRoot').drawToTexture(this.ImgVar('DrawRoot').width, this.ImgVar('DrawRoot').height, this.ImgVar('DrawRoot').x, this.DrawControl.DrawBoard.y) as Laya.Texture;
                // NewDrawRoot.texture.b
                //  <p>绘制 当前<code>Sprite</code> 到 <code>Canvas</code> 上，并返回一个HtmlCanvas。</p>
                //   <p>绘制的结果可以当作图片源，再次绘制到其他Sprite里面，示例：</p>

                // var htmlCanvas: Laya.HTMLCanvas = NewDrawRoot.drawToCanvas(100, 100, 0, 0);//把精灵绘制到canvas上面
                // var texture: Laya.Texture = new Laya.Texture(htmlCanvas);//使用htmlCanvas创建Texture
                // var sp: Laya.Sprite = new Laya.Sprite().pos(0, 200);//创建精灵并把它放倒200位置
                // sp.graphics.drawTexture(texture);//把截图绘制到精灵上
                // Laya.stage.addChild(sp);//把精灵显示到舞台

                // <p>也可以获取原始图片数据，分享到网上，从而实现截图效果，示例：</p>
                var htmlCanvas: Laya.HTMLCanvas = NewDrawRoot.drawToCanvas(100, 100, 0, 0);//把精灵绘制到canvas上面
                _base64 = htmlCanvas.toBase64("image/png", 0.5);//获取原生的canvas对象
                // console.log(base64);
                // trace(canvas.toDataURL("image/png"));//打印图片base64信息，可以发给服务器或者保存为图片


                // let base64 = "你的base64字符串";
                // let image: HTMLImageElement = document.createElement("img");
                // let onImageLoaded: EventListenerOrEventListenerObject = () => {
                //     image.removeEventListener("load", onImageLoaded);
                //     let texture: Laya.Texture = new Laya.Texture();
                //     texture.load(image.src);
                //     //接下来就可以把贴图对象赋值给材质了
                // };
                // image.addEventListener("load", onImageLoaded);
                // image.src = base64;


                // let Sp: Laya.Sprite = new Laya.Sprite;
                this.lwgCloseScene();
            })
            EventAdmin._register(_Event.victory, this, () => {
                this.AniVar(_Animation.action1).stop();
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

            EventAdmin._register(_Event.playAni1, this, () => {
                this.AniVar(_Animation.action1).play(null, true);
            })

            EventAdmin._register(_Event.start, this, () => {
                this.DrawControl.switch = true;
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
            });

            EventAdmin._register(_Event.showStepBtn, this, () => {
                if (_stepIndex.present == 0) {
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

            EventAdmin._register(_Event.lastStep, this, () => {
                this.DrawControl.restoration();
                if (_stepIndex.present - 1 >= 0) {
                    let Img0 = _stepOrderImg[_stepIndex.present - 1];
                    let Img0Parent = Img0.parent as Laya.Image;
                    Animation2D.fadeOut(Img0.getChildByName('Pic'), 0, 1, 300, 0, () => {
                        let Img = _stepOrderImg[_stepIndex.present];
                        Animation2D.fadeOut(Img.getChildByName('Pic'), 1, 0, 300, 0, () => {
                            _stepIndex.present--;
                            if (_stepIndex.present < _stepIndex.max) {
                                this.BtnNextStep.visible = true;
                            }
                            if (_stepIndex.present == 0) {
                                this.BtnLastStep.visible = false;
                            }
                            // console.log(_stepIndex,_stepIndex.max);
                            EventAdmin._notify(_Event.restoreZOder);
                            if (Img0Parent != this.ImgVar('DrawRoot')) {
                                Img0Parent.zOrder = 200;
                            }
                            Img0.zOrder = 200;
                            this['BtnStepClose'] = false;
                            this.DrawControl.switch = true;
                        })
                    });
                }
            })

            EventAdmin._register(_Event.nextStep, this, () => {
                EventAdmin._notify(_Event.restoreZOder);
                this.DrawControl.restoration();
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
                            if (!_stepOrderImg[_stepIndex.present][_drawBoardProperty.whetherPass]) {
                                this.BtnNextStep.visible = false;
                            }
                            if (Img0Parent != this.ImgVar('DrawRoot')) {
                                Img0Parent.zOrder = 200;
                            }
                            // console.log(_stepIndex,_stepIndex.max);
                            Img0.zOrder = 200;
                            this['BtnStepClose'] = false;
                            this.DrawControl.switch = true;
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
                this.DrawControl.switch = false;
                this.BtnNextStep.visible = false;
                this.BtnLastStep.visible = false;
                this.BtnCompelet.visible = true;
                Animation2D.fadeOut(_PencilsList, 1, 0, 200);
            })
        }

        /**绘画状态控制*/
        DrawControl = {
            switch: false,
            DrawRoot: null as Laya.Image,
            DrawBoard: null as Laya.Image,
            EraserSp: null as Laya.Sprite,
            DrawSp: null as Laya.Sprite,
            frontPos: null as Laya.Point,
            endPos: null as Laya.Point,
            radius: {
                get value(): number {
                    return 50;
                }
            },
            restoration: () => {
                this.DrawControl.switch = false;
                this.DrawControl.frontPos = null;
                this.DrawControl.endPos = null;
                this.DrawControl.DrawSp = null;
                this.DrawControl.EraserSp = null;
            },
        }

        onStageMouseDown(e: Laya.Event): void {
            this.DrawControl.DrawRoot = _stepOrderImg[_stepIndex.present];
            this.DrawControl.DrawBoard = this.DrawControl.DrawRoot.getChildByName('DrawBoard') as Laya.Image;
            this.DrawControl.frontPos = this.DrawControl.DrawBoard.globalToLocal(new Laya.Point(e.stageX, e.stageY));
            let Sp: Laya.Sprite;
            if (this.DrawControl.switch) {
                let DrawBoard = this.DrawControl.DrawRoot.getChildByName('DrawBoard') as Laya.Sprite;
                this.DrawControl.frontPos = DrawBoard.globalToLocal(new Laya.Point(e.stageX, e.stageY));
                let color: string;
                switch (_SingleColorPencils._pitchName) {
                    case _Pencils.type.eraser:
                        Sp = this.DrawControl.EraserSp = new Laya.Sprite();
                        this.DrawControl.EraserSp.blendMode = "destination-out";
                        color = '#000000';
                        break;
                    case _Pencils.type.colours:
                        Sp = this.DrawControl.DrawSp = new Laya.Sprite();
                        this.DrawControl.DrawSp.blendMode = "none";
                        color = _ColoursPencils._outputColor;
                        break;
                    default:
                        Sp = this.DrawControl.DrawSp = new Laya.Sprite();
                        this.DrawControl.DrawSp.blendMode = "none";
                        color = _SingleColorPencils._pitchColor;
                        break;
                }
                DrawBoard.addChild(Sp)['pos'](0, 0);
                Sp.graphics.drawTexture(_PreloadUrl._list.texture.brushworkCommon.texture, this.DrawControl.frontPos.x - this.DrawControl.radius.value / 2, this.DrawControl.frontPos.y - this.DrawControl.radius.value / 2, this.DrawControl.radius.value, this.DrawControl.radius.value, null, 1, color, null);
            }
        }
        onStageMouseMove(e: Laya.Event): void {
            if (this.DrawControl.frontPos && this.DrawControl.switch) {
                let endPos = this.DrawControl.DrawBoard.globalToLocal(new Laya.Point(e.stageX, e.stageY));
                let Sp: Laya.Sprite;
                let color: string;
                switch (_SingleColorPencils._pitchName) {
                    case _Pencils.type.eraser:
                        Sp = this.DrawControl.EraserSp;
                        color = '#000000';
                        break;
                    case _Pencils.type.colours:
                        Sp = this.DrawControl.DrawSp;
                        color = _ColoursPencils._outputColor;
                        this._drawingLenth.value += (this.DrawControl.frontPos as Laya.Point).distance(endPos.x, endPos.y);
                        break;
                    default:
                        Sp = this.DrawControl.DrawSp;
                        color = _SingleColorPencils._pitchColor;
                        this._drawingLenth.value += (this.DrawControl.frontPos as Laya.Point).distance(endPos.x, endPos.y);
                        break;
                }
                if (!Sp) {
                    return;
                }
                Sp.graphics.drawTexture(_PreloadUrl._list.texture.brushworkCommon.texture, endPos.x - this.DrawControl.radius.value / 2, endPos.y - this.DrawControl.radius.value / 2, this.DrawControl.radius.value, this.DrawControl.radius.value, null, 1, color, null);
                let destance = this.DrawControl.frontPos.distance(endPos.x, endPos.y);
                if (destance > 15) {
                    let num = destance / 15;
                    let pointArr = Tools.Point.getPArrBetweenTwoP(this.DrawControl.frontPos, endPos, num);
                    for (let index = 0; index < pointArr.length; index++) {
                        Sp.graphics.drawTexture(_PreloadUrl._list.texture.brushworkCommon.texture, pointArr[index].x - this.DrawControl.radius.value / 2, pointArr[index].y - this.DrawControl.radius.value / 2, this.DrawControl.radius.value, this.DrawControl.radius.value, null, 1, color, null);
                    }
                }
                // Sp.graphics.drawLine(this.DrawControl.frontPos.x, this.DrawControl.frontPos.y, endPos.x, endPos.y, color, this.DrawControl.radius.value * 2);
                // Sp.graphics.drawCircle(endPos.x, endPos.y, this.DrawControl.radius.value, Color);
                this.DrawControl.frontPos = endPos;
            }
        }
        onStageMouseUp(): void {
            this.DrawControl.frontPos = null;
            // 画板内绘制节点过多时，则将图像绘制到新的画板上，删掉旧的画板
            if (this.DrawControl.DrawBoard && this.DrawControl.DrawBoard.numChildren > 3) {
                console.log('合并！')
                let NewBoard = this.DrawControl.DrawRoot.addChild((new Laya.Sprite()).pos(0, 0)) as Laya.Sprite;
                NewBoard.width = this.DrawControl.DrawRoot.width;
                NewBoard.height = this.DrawControl.DrawRoot.height;
                NewBoard.cacheAs = "bitmap";
                NewBoard.name = 'DrawBoard';
                NewBoard.texture = this.DrawControl.DrawBoard.drawToTexture(this.DrawControl.DrawBoard.width, this.DrawControl.DrawBoard.height, this.DrawControl.DrawBoard.x, this.DrawControl.DrawBoard.y) as Laya.Texture;
                this.DrawControl.DrawBoard.destroy();
            }
        }

        lwgBtnClick(): void {
            Click._on(Click._Type.largen, this.BtnLastStep, this, null, null, () => {
                if (this['BtnStepClose']) {
                    return;
                } else {
                    this['BtnStepClose'] = true;
                }
                EventAdmin._notify(_Event.lastStep);
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
                EventAdmin._notify(_Event.nextStep);
            });
            Click._on(Click._Type.largen, this.BtnCompelet, this, null, null, () => {
                Admin._game.level++;
                this.DrawControl.switch = false;
                this.lwgOpenScene(_SceneName.Settle, false, () => {
                    this.BtnCompelet.visible = false;
                });
            });
        }
        lwgOnDisable(): void {
            _Pencils.presentUse = _PropTry._beforeTry;
            // Laya.loader.clearRes(_PreloadUrl._list.texture.brushworkCommon.url);
        }
    }
}
export default _Game.Game;



