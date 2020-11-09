import ADManager, { TaT } from "../TJ/Admanager";
import { Admin, Animation2D, Click, TimerAdmin, Tools, _SceneName } from "./Lwg";
import { _Game } from "./_Game";
import { _PropTry } from "./_PropTry";

/**画笔脚本*/
export default class _PencilsListItem extends Admin._Object {
    lwgOnStart(): void {
        // console.log(this.Owner);
        Animation2D.bombs_Appear(this.Owner, 0, 1, 1.3, Tools.randomOneHalf() == 1 ? 10 : -10, 300, 150, Math.round(Math.random() * 500) + 800, () => {
            var caller = {};
            TimerAdmin._frameLoop(1, caller, () => {
                if (this.Owner['_dataSource']) {
                    Laya.timer.clearAll(caller);
                    if ((_Game._GeneralPencils._pitchName == this.Owner['_dataSource'][_Game._GeneralPencils._property.name])) {
                        Animation2D.rotate_Scale(this.Owner, 0, 1, 1, 180, 1.2, 1.2, 250, 0, () => {
                            Animation2D.rotate_Scale(this.Owner, 0, 1, 1, 360, 1, 1, 250, 0, () => {
                                this.Owner.rotation = 0;
                            });
                        });
                    }
                }
            })
        });
    }
    lwgBtnClick(): void {
        var func = (e: Laya.Event) => {
            e.stopPropagation();
        }
        Click._on(Click._Type.largen, this.Owner, this,
            func,
            func,
            (e: Laya.Event) => {
                console.log(this.Owner);
                e.stopPropagation();
                ADManager.TAPoint(TaT.BtnClick, `id_${this.Owner['_dataSource']['name']}`);
                let lasName = _Game._GeneralPencils._pitchName;
                _Game._GeneralPencils._setPitchByName(this.Owner['_dataSource'][_Game._GeneralPencils._property.name]);
                if (this.Owner['_dataSource'][_Game._GeneralPencils._property.name] == 'colours') {
                    console.log(this.Owner['_dataSource']['name']);
                    if (!_Game._ColoursPencils._Switch) {
                        _Game._GeneralPencils._setPitchByName(lasName);
                        _PropTry._comeFrom = _SceneName.Game;
                        this.lwgOpenScene(_SceneName.PropTry, false);
                        _Game._activate = false;
                        return;
                    }
                    for (let index = 0; index < _Game._ColoursPencils._data.length; index++) {
                        const element = _Game._ColoursPencils._data[index];
                        if (_Game._ColoursPencils._pitchName == element[_Game._GeneralPencils._property.name]) {
                            let nameIndex = Number(_Game._ColoursPencils._pitchName.substr(5));
                            // console.log(nameIndex);
                            if (_Game._Pencils.presentUse == _Game._Pencils.type.colours) {
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
                            _Game._GeneralList.refresh();
                            return;
                        }
                    }
                } else {
                    _Game._Pencils.presentUse = _Game._Pencils.type.general;
                }
            },
            func);
    }
}
