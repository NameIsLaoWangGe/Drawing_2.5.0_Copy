import ADManager from "../TJ/Admanager";
import { Admin, Click, _Gold, Tools, Dialogue, _SceneName, EventAdmin } from "./Lwg";
import { _Game } from "./_Game";
import { _PreloadUrl } from "./_PreLoad";
export module _Victory {
    export class _data {
    }
    export enum _Event {
        _Settle_CloseScene = '_Settle_CloseScene',
    }
    export function _init(): void {
    }
    export class VictoryBase extends Admin._SceneBase {
    }
    export class Victory extends _Victory.VictoryBase {
        lwgBtnClick(): void {
            let num = 25;
            Click._on(Click._Type.largen, this.btnVar('BtnNext'), this, null, null, () => {
                _Gold._getGoldAni_Heap(Laya.stage, 15, 55, 51, `Game/UI/Victory/jb.png`, null, null, null, () => {
                    _Gold._addGold(num);
                    EventAdmin._notify(_Game._Event.colseScene);
                    this.lwgOpenScene(_SceneName.Start);
                });
            });
            Click._on(Click._Type.largen, this.btnVar('BtnThreeGet'), this, null, null, () => {
                ADManager.ShowReward(() => {
                    _Gold._getGoldAni_Heap(Laya.stage, 15, 55, 51, `Game/UI/Victory/jb.png`, null, null, null, () => {
                        _Gold._addGold(num * 3);
                        EventAdmin._notify(_Game._Event.colseScene);
                        this.lwgOpenScene(_SceneName.Start);
                    });
                });
            });
        }
    }
}
export default _Victory.Victory;

