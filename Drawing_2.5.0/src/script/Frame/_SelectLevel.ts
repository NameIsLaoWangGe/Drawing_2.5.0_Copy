import ADManager from "../TJ/Admanager";
import { Admin, Click, _Gold, Tools, Dialogue, _SceneName } from "./Lwg";
import { _Game } from "./_Game";
import { _PreloadUrl } from "./_PreLoad";
export module _SelectLevel {
    export class _data {
        static _property = {
            name: 'name',
            chName: 'chName',
            classify: 'classify',
            unlockWay: 'unlockWay',
            condition: 'condition',
            resCondition: 'resCondition',
            unlock: 'unlock',
        };
        static _classify = {
            limit: 'limit',
            animal: 'animal',
            botany: 'botany',
            other: 'other',
        };
        static _pich = {
            get classify(): string {
                return Laya.LocalStorage.getItem('_SelectLevel_pichclassify') ? Laya.LocalStorage.getItem('_SelectLevel_pichclassify') : 'other';
            },
            set classify(str: string) {
                _MyList.array = _data._getClassifyArr(str);
                _MyList.refresh();
                Laya.LocalStorage.setItem('_SelectLevel_pichclassify', str.toString());
            },
            get customs(): string {
                return Laya.LocalStorage.getItem('_SelectLevel_pichcustoms') ? Laya.LocalStorage.getItem('_SelectLevel_pichcustoms') : 'other';
            },
            set customs(str: string) {
                _MyList.array = _data._getClassifyArr(str);
                _MyList.refresh();
                Laya.LocalStorage.setItem('_SelectLevel_pichcustoms', str.toString());
            }
        };
        static _getClassifyArr(classify: string): Array<any> {
            let _arr = [];
            for (const key in this._arr) {
                if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                    const element = this._arr[key];
                    if (element[this._property.classify] == classify) {
                        _arr.push(element);
                    }
                }
            }
            return _arr;
        };
        static _unlockWay = {
            free: 'free',
            gold: 'gold',
            ads: 'ads',
        };
        static get _arr(): Array<string> {
            if (!this['_SelectLevel_Data']) {
                this['_SelectLevel_Data'] = Tools.jsonCompare(_PreloadUrl._list.json.SelectLevel.url, '_SelectLevel_Data', _data._property.name);
            }
            return this['_SelectLevel_Data'];
        };
        static set _arr(array: Array<string>) {
            this['_SelectLevel_Data'] = array;
        };
        // 查看当前名称的关卡是否解锁
        static getUnlockByName(name: string): any {
            let bool: boolean;
            for (const key in this._arr) {
                if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                    const element = this._arr[key];
                    if (element[this._property.name] == name) {
                        bool = element[this._property.unlock];
                        break;
                    }
                }
                return bool;
            }
        };
        // 获取一个属性值
        static getProperty(name: string, pro: string): any {
            let value: any;
            for (const key in this._arr) {
                if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                    const element = this._arr[key];
                    if (element[this._property.name] == name) {
                        value = element[pro];
                        break;
                    }
                }
            }
            return value;
        };
        // 获取一个属性值
        static setProperty(name: string, pro: string, value: any): any {
            for (const key in this._arr) {
                if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                    const element = this._arr[key];
                    if (element[this._property.name] == name) {
                        element[pro] = value;
                        _MyList.refresh();
                        Laya.LocalStorage.setJSON('_SelectLevel_Data', JSON.stringify(this._arr));
                        break;
                    }
                }
            }
            return value;
        };
    }
    export enum _Event {
        event1 = '_Example_Event1',
        event2 = '_Example_Event2',
    }
    export function _init(): void {

    }
    export let _MyList: Laya.List;
    export class _SelectLevelItem extends Admin._Object {
        lwgBtnClick(): void {
            let BtnContent = (this.Owner.getChildByName('Content') as Laya.Image).getChildByName('BtnContent');
            Click._on(Click._Type.largen, BtnContent, this, null, null, () => {
                if (!this.owner['_dataSource'][_data._property.unlock]) {
                    switch (this.owner['_dataSource'][_data._property.unlockWay]) {
                        case _data._unlockWay.ads:
                            ADManager.ShowReward(() => {
                                _data.setProperty(this.Owner['_dataSource'][_data._property.name], _data._property.unlock, true);
                            });
                            break;
                        case _data._unlockWay.gold:
                            let num = this.owner['_dataSource'][_data._property.resCondition]
                            if (_Gold._num >= num) {
                                _data.setProperty(this.Owner['_dataSource'][_data._property.name], _data._property.unlock, true);
                                _Gold._num.value -= num;
                            } else {
                                Dialogue.createHint_Middle(Dialogue.HintContent["金币不够了！"]);
                            }
                            break;
                        default:
                            break;
                    }
                } else {
                    _data._pich.customs = this.owner['_dataSource'][_data._property.name];
                    let levelName = _SceneName.Game + '_' + _data._pich.customs;
                    this.lwgOpenScene(levelName, true, () => {
                        if (!Admin._sceneControl[levelName].getComponent(_Game.Game)) {
                            Admin._sceneControl[levelName].addComponent(_Game.Game);
                        }
                    });
                }
                _MyList.refresh();
            });
        }
    }
    /**通用类，进行通用初始化，这里有两个作用，第一个是不同游戏通用，另一个是同一个游戏中拥有相同部分的基类*/
    export class SelectLevelBase extends Admin._SceneBase {
        moduleOnAwake(): void {
            _MyList = this.ListVar('MyList');
            _MyList.array = _data._getClassifyArr(_data._pich.classify);
            _MyList.selectEnable = true;
            _MyList.vScrollBarSkin = "";
            // this._ShopList.scrollBar.elasticBackTime = 0;//设置橡皮筋回弹时间。单位为毫秒。
            // this._ShopList.scrollBar.elasticDistance = 500;//设置橡皮筋极限距离。
            _MyList.selectHandler = new Laya.Handler(this, (index: number) => { });
            _MyList.renderHandler = new Laya.Handler(this, (cell: Laya.Box, index: number) => {
                let _dataSource = cell.dataSource;
                let Content = cell.getChildByName('Content') as Laya.Image;
                let BtnContent = Content.getChildByName('BtnContent') as Laya.Image;
                let Name = BtnContent.getChildByName('Name') as Laya.Image;
                Name.skin = `Game/UI/SelectLevel/Name/${_dataSource[_data._property.name]}.png`;
                let Xianlu = Content.getChildByName('Xianlu') as Laya.Image;
                let IconPen = Content.getChildByName('IconPen') as Laya.Image;
                if (index % 3 == 0) {
                    IconPen.skin = `Game/UI/SelectLevel/IconDress/bi.png`
                } else if (index % 2 == 0) {
                    IconPen.skin = `Game/UI/SelectLevel/IconDress/bz.png`
                } else {
                    IconPen.skin = `Game/UI/SelectLevel/IconDress/shu.png`
                }
                if (index % 2 !== 0) {
                    Content.pos(27, 8);
                    Xianlu.pos(104, 189);
                    Xianlu.skin = `Game/UI/SelectLevel/xianlu2.png`;
                    IconPen.scaleX = 1;
                    IconPen.pos(350, 180);
                } else {
                    Content.pos(363, 10);
                    Xianlu.pos(-140, 170);
                    Xianlu.skin = `Game/UI/SelectLevel/xianlu1.png`;
                    IconPen.scaleX = -1;
                    IconPen.pos(-31, 195);
                }
                let IconAds = BtnContent.getChildByName('IconAds') as Laya.Image;
                let IconLock = BtnContent.getChildByName('IconLock') as Laya.Image;
                let GoldNum = BtnContent.getChildByName('GoldNum') as Laya.Label;
                let GoldBoard = BtnContent.getChildByName('GoldBoard') as Laya.Image;

                if (!_dataSource[_data._property.unlock]) {
                    switch (_dataSource[_data._property.unlockWay]) {
                        case _data._unlockWay.ads:
                            GoldBoard.visible = GoldNum.visible = false;
                            IconLock.visible = IconAds.visible = true;
                            break;
                        case _data._unlockWay.free:
                            GoldBoard.visible = GoldNum.visible = false;
                            IconLock.visible = IconAds.visible = false;
                            break;
                        case _data._unlockWay.gold:
                            GoldNum.text = _dataSource[_data._property.condition];
                            IconLock.visible = GoldBoard.visible = GoldNum.visible = true;
                            IconAds.visible = false;
                            break;
                        default:
                            break;
                    }
                } else {
                    IconAds.visible = false;
                    IconLock.visible = false;
                    GoldNum.visible = false;
                    GoldBoard.visible = false;
                }
                if (index == _MyList.array.length - 1) {
                    IconPen.visible = Xianlu.visible = false;
                } else {
                    IconPen.visible = Xianlu.visible = true;
                }
                cell.zOrder = index;
            });
        }
    }
    /**可以手动挂在脚本中的类，全脚本唯一的默认导出，也可动态添加，动态添加写在模块内更方便*/
    export class SelectLevel extends _SelectLevel.SelectLevelBase {
        lwgOnAwake(): void {
            for (let index = 0; index < this.ImgVar('CutBtn').numChildren; index++) {
                const element = this.ImgVar('CutBtn').getChildAt(index) as Laya.Image;
                if (element.name == _data._pich.classify) {
                    element.y = 11;
                } else {
                    element.y = 69;
                }
            }
        }
        lwgAdaptive(): void {
            this.ImgVar('UiLand').y = Laya.stage.height - 74;
        }
        lwgBtnClick(): void {

            if (_MyList.cells.length !== 0) {
                for (let index = 0; index < _MyList.cells.length; index++) {
                    const element = _MyList.cells[index];
                    if (!element.getComponent(_SelectLevelItem)) {
                        element.addComponent(_SelectLevelItem);
                    }
                }
            }

            for (let index = 0; index < this.ImgVar('CutBtn').numChildren; index++) {
                const element = this.ImgVar('CutBtn').getChildAt(index) as Laya.Image;
                if (element.name == _data._pich.classify) {
                    element.y = 11;
                } else {
                    element.y = 69;
                }
                Click._on(Click._Type.largen, element, this, null, null, (e: Laya.Event) => {
                    for (let index = 0; index < this.ImgVar('CutBtn').numChildren; index++) {
                        const Btn = this.ImgVar('CutBtn').getChildAt(index) as Laya.Image;
                        if (Btn == e.currentTarget) {
                            Btn.y = 11;
                            _data._pich.classify = Btn.name;
                        } else {
                            Btn.y = 69;
                        }
                    }
                });
            }
        }
    }
}
export default _SelectLevel.SelectLevel;

