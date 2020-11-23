import ADManager, { TaT } from "../TJ/Admanager";
import { Admin, Animation2D, Click, EventAdmin, TimerAdmin, Tools, _SceneName } from "./Lwg";
import { _Compound } from "./_Compound";
import { _Game } from "./_Game";
import { _PropTry } from "./_PropTry";

export class _GameItem extends Admin._Object {
    lwgOnAwake(): void {
        this.Compound.Pencil = this.Owner.getChildByName('Pic') as Laya.Image;
    }
    lwgOnStart(): void {
        var caller = {};
        TimerAdmin._frameLoop(1, caller, () => {
            if (this.Owner['_dataSource']) {
                Laya.timer.clearAll(caller);
                Animation2D.bombs_Appear(this.Owner, 0, 1, 1.3, Tools.randomOneHalf() == 1 ? 10 : -10, 300, 150, Math.round(Math.random() * 500) + 800, () => {
                    if (!this.Owner.getComponents(_GameItem)) {
                        !this.Owner.addComponent(_GameItem)
                    }
                    if ((_Game._GeneralPencils._pitchName == this.Owner['_dataSource'][_Game._GeneralPencils._property.name])) {
                        Animation2D.rotate_Scale(this.Owner, 0, 1, 1, 180, 1.2, 1.2, 250, 0, () => {
                            Animation2D.rotate_Scale(this.Owner, 0, 1, 1, 360, 1, 1, 250, 0, () => {
                                this.Owner.rotation = 0;
                            });
                        });
                    }
                })
            }
        });
    }
    Compound = {
        Pencil: null as Laya.Image,
        time: 0,
        restrict: 1,
        DisImg: null as Laya.Image,
        firstPos: null as Laya.Point,
        PosArr: null,
        homing: () => {
            if (this.Compound.DisImg) {
                this.Compound.DisImg.destroy();
                this.Compound.DisImg = null;
                this.Compound.Pencil.visible = true;
            }
        },
        remake: () => {
            // console.log('重制')
            this.Compound.homing();
            this.Compound.time = 0;
            _Game._GeneralPencils._compoundName = null;
        },
        disImgState: (e: Laya.Event) => {
            this.Compound.DisImg.visible = true;
            this.Compound.Pencil.visible = false;
            this.Compound.DisImg.pos(e.stageX, e.stageY);
            let gOwnerP = this._Parent.localToGlobal(new Laya.Point(this.Owner.x, this.Owner.y));
            // let distance = gOwnerP.distance(this.Compound.DisImg.x, this.Compound.DisImg.y);
            if (gOwnerP.y - this.Compound.DisImg.y > 150) {
                this.Compound.DisImg.rotation = -45;
                Tools.Node.changePovit(this.Compound.DisImg, this.Compound.DisImg.width / 2, 0);
            } else {
                this.Compound.DisImg.rotation = 0;
                Tools.Node.changePovit(this.Compound.DisImg, this.Compound.DisImg.width / 2, this.Compound.DisImg.height / 2);
            }
        }
    }
    onStageMouseMove(e: Laya.Event): void {
        if (this.Owner['_dataSource'] && this.Compound.time > this.Compound.restrict && this.Compound.DisImg) {
            // _Game._activate = false;
            this.Compound.disImgState(e);
            _Game._GeneralPencils._compoundName = this.Owner['_dataSource']['name'];
        }
    }
    onStageMouseUp(e: Laya.Event): void {
        if (this.Owner['_dataSource']) {
            this.Compound.remake();
            // _Game._activate = true;
        }
    }

    lastName: string;
    lwgBtnClick(): void {
        Click._on(Click._Type.noEffect, this.Compound.Pencil, this,
            (e: Laya.Event) => {
                console.log("点击！")

                if (!this.Compound.DisImg && this.Owner['_dataSource']) {

                    this.Compound.firstPos = new Laya.Point(e.stageX, e.stageY);
                    this.Compound.DisImg = new Laya.Image;
                    this.OwnerScene.addChild(this.Compound.DisImg);
                    this.Compound.DisImg.zOrder = 300;
                    this.Compound.DisImg.width = this.Compound.Pencil.width;
                    this.Compound.DisImg.height = this.Compound.Pencil.height;
                    this.Compound.DisImg.scale(this.Compound.Pencil.scaleX, this.Compound.Pencil.scaleY);
                    Tools.Node.changePovit(this.Compound.DisImg, this.Compound.DisImg.width / 2, this.Compound.DisImg.height / 2);
                    this.Compound.DisImg.skin = this.Compound.Pencil.skin;
                    this.Compound.DisImg.visible = false;
                }
                this.lastName = _Game._GeneralPencils._pitchName;
                if (this.Owner['_dataSource']['name'] == 'colours' && !_Game._ColoursPencils._switch) {
                    e.stopPropagation();
                } else {
                    _Game._GeneralPencils._pitchName = this.Owner['_dataSource']['name'];
                    EventAdmin._notify(_Game._Event.generalRefresh);
                }
            },
            (e: Laya.Event) => {
                this.Compound.time++;
            },
            (e: Laya.Event) => {
                if (_Game._GeneralPencils._compoundName && _Game._GeneralPencils._compoundName !== this.Owner['_dataSource']['name']) {
                    _Compound.Skin1 = _Game._GeneralPencils._compoundName;
                    _Compound.Skin2 = this.Owner['_dataSource']['name'];
                    this.lwgOpenScene(_SceneName.Compound, false);
                    this.Compound.remake();
                    return;
                }
                // console.log(this.Owner);
                // e.stopPropagation();
                ADManager.TAPoint(TaT.BtnClick, `id_${this.Owner['_dataSource']['name']}`);
                if (this.Owner['_dataSource']['name'] == 'colours') {
                    // console.log(this.Owner['_dataSource']['name']);
                    if (!_Game._ColoursPencils._switch) {
                        _Game._GeneralPencils._pitchName = this.lastName;
                        _PropTry._comeFrom = _SceneName.Game;
                        this.lwgOpenScene(_SceneName.PropTry, false);
                        // _Game._activate = false;
                        return;
                    }
                    _Game._ColoursPencils._clickNum++;
                    if (_Game._ColoursPencils._clickNum == 1) {
                        EventAdmin._notify(_Game._Event.generalRefresh);
                        return;
                    }
                    for (let index = 0; index < _Game._ColoursPencils._data.length; index++) {
                        const element = _Game._ColoursPencils._data[index];
                        if (_Game._ColoursPencils._pitchName == element[_Game._GeneralPencils._property.name]) {
                            let nameIndex = Number(_Game._ColoursPencils._pitchName.substr(5));
                            // console.log(nameIndex);
                            if (_Game._ColoursPencils._switch) {
                                if (!nameIndex) {
                                    nameIndex = 1;
                                }
                                nameIndex++;
                                if (nameIndex > 7) {
                                    nameIndex = 1;
                                }
                                _Game._ColoursPencils._pitchName = `caise${nameIndex}`;
                                _Game._ColoursPencils._setPresentColorArr();
                            }
                            EventAdmin._notify(_Game._Event.generalRefresh);
                            return;
                        }
                    }
                } else {
                    _Game._ColoursPencils._clickNum = 0;
                }
            },
            (e: Laya.Event) => {
                e.stopPropagation();
            });
    }
}