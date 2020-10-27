import { Admin, Click, Tools } from "./Lwg";
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
        static get _getLimitArr(): Array<any> {
            let _arr = [];
            for (const key in this._arr) {
                if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                    const element = this._arr[key];
                    if (element[this._property.classify] == this._classify.limit) {
                        _arr.push(element);
                        break;
                    }
                }
            }
            return _arr;
        };
        static get _botanyArr(): Array<any> {
            let _arr = [];
            for (const key in this._arr) {
                if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                    const element = this._arr[key];
                    if (element[this._property.classify] == this._classify.botany) {
                        _arr.push(element);
                        break;
                    }
                }
            }
            return _arr;
        };
        static get _getAnimalArr(): Array<any> {
            let _arr = [];
            for (const key in this._arr) {
                if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                    const element = this._arr[key];
                    if (element[this._property.classify] == this._classify.animal) {
                        _arr.push(element);
                        break;
                    }
                }
            }
            return _arr;
        };
        static get _getOtherArr(): Array<any> {
            let _arr = [];
            for (const key in this._arr) {
                if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                    const element = this._arr[key];
                    if (element[this._property.classify] == this._classify.other) {
                        _arr.push(element);
                        break;
                    }
                }
            }
            return _arr;
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
        console.log(_data._arr);
    }

    export let _MyList: Laya.List;
    export let _MYTap: Laya.Tab;
    export class _SelectLevelItem extends Admin._Object {
        lwgBtnClick(): void {
            Click._on(Click._Type.largen, this.Owner, this, null, null, () => {
                // _SingleColorPencils._setPitchByName(this.Owner['_dataSource'][_SingleColorPencils._property.name]);
                // _PencilsList.refresh();
            });
        }
    }
    /**通用类，进行通用初始化，这里有两个作用，第一个是不同游戏通用，另一个是同一个游戏中拥有相同部分的基类*/
    export class SelectLevelBase extends Admin._SceneBase {
        moduleOnAwake(): void {
        }
        moduleOnEnable(): void {
        }
        moduleEventRegister(): void {
        }
        moduleOnStart(): void {
        }
    }
    /**可以手动挂在脚本中的类，全脚本唯一的默认导出，也可动态添加，动态添加写在模块内更方便*/
    export class SelectLevel extends _SelectLevel.SelectLevelBase {
        lwgOnAwake(): void {
        }
        lwgOnEnable(): void { }
        lwgEventRegister(): void { }
        lwgOnStart(): void { }
        lwgAdaptive(): void { }
        lwgOpenAni(): number { return 100; }
        lwgBtnClick(): void { }
        lwgVanishAni(): number { return 100; }
        lwgOnUpdate(): void { }
        lwgOnDisable(): void { }
    }
    export class UIExampleItem extends Admin._Object {

    }
}
export default _SelectLevel.SelectLevel;


