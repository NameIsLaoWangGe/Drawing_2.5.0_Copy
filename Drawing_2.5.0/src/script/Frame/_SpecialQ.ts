import ADManager, { TaT } from "../TJ/Admanager";
import RecordManager from "../TJ/RecordManager";
import { Admin, Click, DateAdmin, EventAdmin, TimerAdmin, _Gold, _SceneName } from "./Lwg";
import TweenMgr from "./TweenMgr";
import { _Game } from "./_Game";

export module _SpecialQ {
    export class _data {
        /**本地存储变量格式*/
        static get _openNum(): number {
            return Laya.LocalStorage.getItem('_Special_OpenNum') ? Number(Laya.LocalStorage.getItem('_Special_OpenNum')) : 0;
        }
        static set _openNum(count: number) {
            Laya.LocalStorage.setItem('_Special_OpenNum', count.toString());
        }
        static get _lastDate(): number {
            return Laya.LocalStorage.getItem('_Special_lastDate') ? Number(Laya.LocalStorage.getItem('_Special_lastDate')) : DateAdmin._date.date - 1;
        }
        static set _lastDate(date: number) {
            Laya.LocalStorage.setItem('_Special_lastDate', date.toString());
        }
    }
    export enum _Event {
    }
    export function _init(): void {
    };
    export class SpecialBase extends Admin._SceneBase {
        moduleOnAwake(): void {
            ADManager.TAPoint(TaT.PageShow, '1000page');
            ADManager.TAPoint(TaT.BtnShow, 'ADrewardbt_1000');
        }
    }
    export class SpecialQ extends _SpecialQ.SpecialBase {
        lwgOnAwake(): void {
             
        }


        lwgBtnClick(): void {
            Click._on(Click._Type.largen, this.btnVar('BtnSale'), this, null, null, () => {
                ADManager.ShowReward(() => {
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
                            _Gold._addGold(1000);
                            this.lwgCloseScene(this.Owner.name, () => {
                                console.log(Laya.stage);
                            });
                        });
                    });

                })

            });
            Click._on(Click._Type.largen, this.btnVar('BtnClose'), this, null, null, () => {
                ADManager.TAPoint(TaT.BtnClick, 'ADrewardbt_1000');
                this.lwgCloseScene();
            });
        }
        lwgOnDisable(): void {
            ADManager.TAPoint(TaT.PageLeave, '1000page');
        }
    }
}
export default _SpecialQ.SpecialQ;