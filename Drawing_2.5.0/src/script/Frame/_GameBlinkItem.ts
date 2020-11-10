import ADManager, { TaT } from "../TJ/Admanager";
import { Admin, Animation2D, Click, Dialogue, TimerAdmin, Tools, _SceneName } from "./Lwg";
import { _Game } from "./_Game";
import { _PropTry } from "./_PropTry";

/**画笔脚本*/
export default class _GameBlinkItem extends Admin._Object {
    lwgBtnClick(): void {
        var func = (e: Laya.Event) => {
            e.stopPropagation();
        }
        Click._on(Click._Type.noEffect, this.Owner, this,
            func,
            func,
            (e: Laya.Event) => {
                console.log(this.Owner['_dataSource']);
                e.stopPropagation();
                // ADManager.TAPoint(TaT.BtnClick, `id_${this.Owner['_dataSource']['name']}`);
                if (this.Owner['_dataSource']['have']) {
                    _Game._BlinkPencils._pitchName = this.Owner['_dataSource']['name'];
                    // if (this.Owner['_dataSource']['name'] == 'colours') {
                    //     for (let index = 0; index < _Game._ColoursPencils._data.length; index++) {
                    //         const element = _Game._ColoursPencils._data[index];
                    //         if (_Game._ColoursPencils._pitchName == element[_Game._BlinkPencils._property.name]) {
                    //             let nameIndex = Number(_Game._ColoursPencils._pitchName.substr(5));
                    //             // console.log(nameIndex);
                    //             if (_Game._ColoursPencils._switch) {
                    //                 if (!nameIndex) {
                    //                     nameIndex = 1;
                    //                 }
                    //                 nameIndex++;
                    //                 if (nameIndex > 7) {
                    //                     nameIndex = 1;
                    //                 }
                    //                 _Game._ColoursPencils._pitchName = `caise${nameIndex}`;
                    //                 _Game._ColoursPencils._setPresentColorArr();
                    //             }
                    //             _Game._BlinkList.refresh();
                    //             return;
                    //         }
                    //     }
                    // }
                } else {
                    Dialogue.createHint_Middle('尚未获得！');
                }
            },
            func
        );
    }
}
