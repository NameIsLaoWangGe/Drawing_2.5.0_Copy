import RecordManager from "../TJ/RecordManager";
import { Admin, Click, DateAdmin, EventAdmin, TimerAdmin, _Gold, _SceneName } from "./Lwg";
import { _Game } from "./_Game";

export module _Special {
    export class _data {
        /**本地存储变量格式*/
        static _openNum = {
            get count(): number {
                return Laya.LocalStorage.getItem('_Special_OpenNum') ? Number(Laya.LocalStorage.getItem('_Special_OpenNum')) : 0;
            },
            set count(count: number) {
                Laya.LocalStorage.setItem('_Special_OpenNum', count.toString());
            },
            get lastDate(): number {
                return Laya.LocalStorage.getItem('_Special_lastDate') ? Number(Laya.LocalStorage.getItem('_Special_lastDate')) : DateAdmin._date.date;
            },
            // set lastDate(date: number) {
            //     if (_openNum.lastDate) {

            //     }
            // },
        }
    }
    export enum _Event {
    }
    export class SpecialBase extends Admin._SceneBase {
    }
    export class Special extends _Special.SpecialBase {
        lwgBtnClick(): void {
            Click._on(Click._Type.largen, this.btnVar('BtnSale'), this, null, null, () => {
                _Gold._getGoldAni_Heap(Laya.stage, 15, 55, 51, `Game/UI/Victory/jb.png`);

                TimerAdmin._frameOnce(5, this, () => {
                    _Gold._getGoldAni_Heap(Laya.stage, 15, 55, 51, `Game/UI/Victory/jb.png`, new Laya.Point(Laya.stage.width / 2 - 200, Laya.stage.height / 2));
                });

                TimerAdmin._frameOnce(10, this, () => {
                    _Gold._getGoldAni_Heap(Laya.stage, 15, 55, 51, `Game/UI/Victory/jb.png`, new Laya.Point(Laya.stage.width / 2 + 200, Laya.stage.height / 2));
                });

                TimerAdmin._frameOnce(15, this, () => {
                    _Gold._getGoldAni_Heap(Laya.stage, 15, 55, 51, `Game/UI/Victory/jb.png`, new Laya.Point(Laya.stage.width / 2, Laya.stage.height / 2 - 200));
                });

                TimerAdmin._frameOnce(20, this, () => {
                    _Gold._getGoldAni_Heap(Laya.stage, 15, 55, 51, `Game/UI/Victory/jb.png`, new Laya.Point(Laya.stage.width / 2, Laya.stage.height / 2 + 200), null, null, () => {
                        _Gold._addGold(100000000000);
                        this.lwgCloseScene();
                    });
                });

            });
            Click._on(Click._Type.largen, this.btnVar('BtnClose'), this, null, null, () => {
                this.lwgCloseScene();
            });
        }
    }
}
export default _Special.Special;