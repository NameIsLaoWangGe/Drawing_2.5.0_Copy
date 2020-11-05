import ADManager from "../TJ/Admanager";
import lwg, { Admin, Click, _Gold, Tools, Dialogue, _SceneName, EventAdmin, DateAdmin, PalyAudio, Effects } from "./Lwg";
import OldEffects from "./OldEffects";
import { _Game } from "./_Game";
import { _PreloadUrl } from "./_PreLoad";
import { _Share } from "./_Share";
import { _Special } from "./_Special";
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

        lwgOnAwake(): void {
            // console.log(_Game._Pencils.presentUse, _Special._data._lastDate);
            // if (_Game._Pencils.presentUse == _Game._Pencils.type.singleColor && _Special._data._lastDate
            //     !== DateAdmin._date.date) {
            //     _Special._data._lastDate = DateAdmin._date.date;
            //     this.ImgVar('Evaluate').skin = 'Game/UI/Victory/sbml.png';
            //     this.lwgOpenScene(_SceneName.Special, false);

            // } else {
            //     if (_Game._SingleColorPencils._pitchName == 'colours') {
            //         this.ImgVar('Evaluate').skin = 'Game/UI/Victory/jmjl.png';
            //     } else {
            //         this.ImgVar('Evaluate').skin = 'Game/UI/Victory/pptt.png';
            //     }
            // }
        }
        lwgOpenAniAfter(): void {
            this.AniVar('NoAni_Remark').play(0, false);
            this.AniVar('NoAni_Remark').on(Laya.Event.LABEL, this, (e: Laya.Event) => {
                PalyAudio.playVictorySound();
                OldEffects.createFireworks(Laya.stage, 40, 430, 200);
                OldEffects.createFireworks(Laya.stage, 40, 109, 200);
                OldEffects.createLeftOrRightJet(Laya.stage, 'right', 40, 720, 300);
                OldEffects.createLeftOrRightJet(Laya.stage, 'left', 40, 0, 300);
                console.log(_Game._Pencils.presentUse, _Special._data._lastDate);
                if (_Game._Pencils.presentUse == _Game._Pencils.type.singleColor && _Special._data._lastDate
                    !== DateAdmin._date.date) {
                    _Special._data._lastDate = DateAdmin._date.date;
                    this.ImgVar('Evaluate').skin = 'Game/UI/Victory/sbml.png';
                    // this.lwgOpenScene(_SceneName.Special, false);
                } else {
                    if (_Game._SingleColorPencils._pitchName == 'colours') {
                        this.ImgVar('Evaluate').skin = 'Game/UI/Victory/jmjl.png';
                    } else {
                        this.ImgVar('Evaluate').skin = 'Game/UI/Victory/pptt.png';
                    }
                }
            })
        }
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


