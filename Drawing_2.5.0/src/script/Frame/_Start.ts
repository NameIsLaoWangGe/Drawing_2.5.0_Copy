import { Admin, Click, _SceneName } from "./Lwg";
import GameScene, { _Game } from "./_Game";

/**测试模块,每个模块分开，默认导出一个类，这个类是默认挂载的脚本类，如果有多个脚本，
 * 那么在这个默认类中进行添加，或者在其他地方动态添加*/
export module _Start {
    export function _init(): void {
    }
    /**通用类，进行通用初始化，可在每个游戏中重复使用重复*/
    export class _StartScene extends Admin._Scene {
        moduleOnAwake(): void {
        }
        moduleOnEnable(): void {
        }
        moduleEventRegister(): void {
        }
        moduleOnStart(): void {
        }
    }
}
export default class UIStart extends _Start._StartScene {
    lwgOnAwake(): void {
    }
    lwgBtnClick(): void {
        Click._on(Click._Type.largen, this.btnVar('BtnStart'), this, null, null, () => {
            if (Admin._game.level > 4) {
                Admin._game.level = 1;
                console.log(Admin._game.level);
            }
            Admin._openScene(_SceneName.GameScene + Admin._game.level, _SceneName.UIStart, () => {
                if (!Admin._sceneControl[_SceneName.GameScene + Admin._game.level].getComponent(GameScene)) {
                    Admin._sceneControl[_SceneName.GameScene + Admin._game.level].addComponent(GameScene);
                }
            });
        })
    }
}
export class UIStartItem extends Admin._Object {

}

