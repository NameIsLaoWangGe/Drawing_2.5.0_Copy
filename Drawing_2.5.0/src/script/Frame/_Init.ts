import GameScene, { _Game } from "./_Game";
import UIGuide, { _Guide } from "./_Guide";
import UIExample from "./_Example";
// import ZJADMgr from "../../TJ/ZJADMgr";
import UITask, { _Task } from "./_Task";
import UIStart, { _Start } from "./_Start";
import UIPreLoadSceneBefore from "./_PreLoadSceneBefore";
import { Admin, DateAdmin, EventAdmin, _SceneName } from "./Lwg";
export default class UIInit extends Admin._Scene {
    lwgEventRegister(): void {
        EventAdmin._register(_SceneName.UIInit, this, () => {
            (function admin() {
                Admin._sceneScript = {
                    UIStart: UIStart,
                    GameScene: GameScene,
                    UIGuide: UIGuide,
                    UITask: UITask,
                    UIPreLoadSceneBefore: UIPreLoadSceneBefore,
                };
                Admin._evaluating = false;
                Admin._platform = Admin._platformTpye.Bytedance;
            }());

            (function date() {
                DateAdmin._loginNumber.value++;
            });
            (function d2() {


            }());
            (function d3() {


            }());
            (function other() {
                // new ZJADMgr();
            }());
            (function module() {
                _Start._init();
                _Game._init();
                _Task._init();
                _Guide._init();//引导初始化必须放在最后
            }());
            console.log('初始化完毕！');
        })
    }
}