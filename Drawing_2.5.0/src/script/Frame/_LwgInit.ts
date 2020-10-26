import { Admin, DateAdmin, EventAdmin, _Init, _SceneName } from "./Lwg";
import GameScene, { _Game } from "./_Game";
import UIGuide from "./_Guide";
import UIPreLoadSceneBefore from "./_PreLoadSceneBefore";
import UIStart, { _Start } from "./_Start";
import UITask, { _Task } from "./_Task";
export default class LwgInit extends _Init._InitScene {
    lwgOnAwake(): void {
        _Init._pkgInfo = [
            { name: "sp1", root: "res" },
            { name: "sp2", root: "3DScene" },
            { name: "sp3", root: "3DPrefab" },
        ];
        Admin._platform.name = Admin._platform.tpye.General;
    }
    lwgEventRegister(): void {
        EventAdmin._register(_SceneName.UIInit, this, () => {
            (function admin() {
                Admin._sceneScript = {
                    UIStart: UIStart,
                    GameScene: GameScene,
                    UIGuide: UIGuide,
                    UITask: UITask,
                    UIPreLoadSceneBefore: UIPreLoadSceneBefore,
                    UIAds: '',
                };
                Admin._evaluating = false;
                Admin._platform.name = Admin._platform.tpye.Web;
                Admin._game.loopLevel = 12;
            }());
            (function date() {
                DateAdmin._loginNumber.value++;
            });
            (function d2() {

            }());
            (function d3() {

            }());
            (function other() {
                // new ZJADMgr();.
            }());
            (function module() {
                _Start._init();
                _Game._init();
                _Task._init();
                _Game._init();//引导初始化必须放在最后
            }());
            console.log('初始化完毕！');
        })
    }
}