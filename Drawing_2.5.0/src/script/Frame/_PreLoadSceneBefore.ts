import { Admin, EventAdmin, _PreLoad, _SceneName } from "./Lwg";

/**每个页面前的加载页面，需要手动调出*/
export module _PreLoadSceneBefore {
    /**事件类型，必须枚举,因为有可能在全局使用,命名必须使用模块名称+事件名称*/
    export enum _Event {
        event1 = '_PreLoadPageBefore_Event1',
        event2 = '_PreLoadPageBefore_Event2',
    }
    export let _gameScene = {
        //     scene3D: {
        //         // "_Lwg3D/_Scene/LayaScene_GameMain/Conventional/GameMain.ls"
        //     },
        //     prefab3D: {
        //         // "_Lwg3D/_Prefab/LayaScene_GameMain/Conventional/CardContainer.lh"
        //     },
        //     pic2D: {
        //         // "res/atlas/Frame/Effects.png",
        //         // "res/atlas/Frame/UI.png",
        //         // "res/atlas/Game/UI/UISkinQualified.png",
        //         // "res/atlas/Game/UI/UIDrawCard/Card.png",
        //     },
        //     scene2D: {
        //         UIStart: "Scene/" + _SceneName.UIStart + '.json',
        //         GameScene: "Scene/" + _SceneName.GameScene + '.json',
        //         UIPreLoad: "Scene/" + _SceneName.UIPreLoad + '.json',
        //     },
        //     json: {
        //         SingleColor: "_LwgData" + "/_Game/SingleColor" + ".json",
        //         Colours: "_LwgData" + "/_Game/Colours" + ".json",
        //     },
        //     prefab2D: {},
        //     mesh3D: {},
        //     material: {},
        //     texture2D: {},
    }
}
/**可以手动挂在脚本中的类，全脚本唯一的默认导出，也可动态添加，动态添加写在模块内更方便*/
export default class UIPreLoadSceneBefore extends _PreLoad._PreLoadScene {
    lwgOnAwake(): void { };
    lwgOnStart(): void {
        EventAdmin._notify(_PreLoad._Event.importList, ([_PreLoadSceneBefore._gameScene]));
    }
}

