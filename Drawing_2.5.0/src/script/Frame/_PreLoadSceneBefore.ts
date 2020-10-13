import { Admin, EventAdmin, _PreLoad, _SceneName } from "./lwg";

/**每个页面前的加载页面，需要手动调出*/
export module _PreLoadSceneBefore {
    /**事件类型，必须枚举,因为有可能在全局使用,命名必须使用模块名称+事件名称*/
    // export enum _EventType {
    //     event1 = '_PreLoadPageBefore_Event1',
    //     event2 = '_PreLoadPageBefore_Event2',
    // }
}
/**可以手动挂在脚本中的类，全脚本唯一的默认导出，也可动态添加，动态添加写在模块内更方便*/
export default class UIPreLoadSceneBefore extends _PreLoad._PreLoadScene {
    lwgOnAwake(): void {
        switch (Admin._preLoadOpenSceneLater.openSceneName) {
            case _SceneName.GameScene:
                _PreLoad.list_3DPrefab = [
                    // "3DPrefab/LayaScene_GameMain/Conventional/CardContainer.lh",
                ]
                break;
            case _SceneName.UIDefeated:

                break;
            default:
                break;
        }
    }
}

