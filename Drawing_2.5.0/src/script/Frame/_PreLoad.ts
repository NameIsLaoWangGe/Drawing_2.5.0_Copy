import { EventAdmin, _PreLoad, _SceneName } from "./Lwg";
export module _PreloadUrl {
    export let _list = {
        // scene3D: {
        //     // "_Lwg3D/_Scene/LayaScene_GameMain/Conventional/GameMain.ls"
        // },
        // prefab3D: {
        //     // "_Lwg3D/_Prefab/LayaScene_GameMain/Conventional/CardContainer.lh"
        // },
        // pic2D: {
        //     // "res/atlas/Frame/Effects.png",
        //     // "res/atlas/Frame/UI.png",
        //     // "res/atlas/Game/UI/UISkinQualified.png",
        //     // "res/atlas/Game/UI/UIDrawCard/Card.png",
        // },
        // prefab2D: {},
        // mesh3D: {},
        // material: {},
        texture2D: {
            star1: 'Frame/Effects/hua4.png',
        },
        scene2D: {
            UIStart: "Scene/" + _SceneName.UIStart + '.json',
            GameScene: "Scene/" + _SceneName.GameScene + '.json',
            UIPreLoad: "Scene/" + _SceneName.UIPreLoad + '.json',
        },
        json: {
            SingleColor: "_LwgData" + "/_Game/SingleColor" + ".json",
            Colours: "_LwgData" + "/_Game/Colours" + ".json",
        },
        // skeleton: {
        //     test: {
        //         templet: new Laya.Templet(),
        //         url: 'Game/Skeleton/test.sk',
        //     },
        // }
    }
}
export default class UIPreLoad extends _PreLoad._PreLoadScene {
    lwgOnStart(): void {
        EventAdmin._notify(_PreLoad._Event.importList, ([_PreloadUrl._list]));
    }
    lwgOpenAni(): number { return 0; }
    lwgStepComplete(): void {
        // this.self['Progress'].mask.x = -425 + 425 * Lwg_Loding.currentProgress.value / Lwg_Loding.sumProgress;
    }
    lwgAllComplete(): number {
        // this.self['Progress'].mask.x = 0;
        return 200;
    }


}

