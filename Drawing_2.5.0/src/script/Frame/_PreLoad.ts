import { _PreLoad, _SceneName } from "./Lwg";

export default class UIPreLoad extends _PreLoad._PreLoadScene {

    lwgOnAwake(): void {
        _PreLoad.list_2DPic = [
            // "res/atlas/Frame/Effects.png",
            // "res/atlas/Frame/UI.png",
            // "res/atlas/Game/UI/UISkinQualified.png",
            // "res/atlas/Game/UI/UIDrawCard/Card.png",
        ];
        _PreLoad.list_2DScene = [
            "Scene/" + _SceneName.UIStart + '.json',
            "Scene/" + _SceneName.GameScene + '.json',
            "Scene/" + _SceneName.UIPreLoad + '.json',
        ];
        _PreLoad.list_2DPrefab = [
            // "Prefab/PreOption.json",
            // "Prefab/PreGuessCard.json",
        ];
        _PreLoad.list_3DScene = [
            // "_Lwg3D/_Scene/LayaScene_GameMain/Conventional/GameMain.ls"
        ];
        _PreLoad.list_3DPrefab = [
            // "_Lwg3D/_Prefab/LayaScene_GameMain/Conventional/CardContainer.lh"
        ];
        _PreLoad.list_JsonData = [
            "_LwgData" + "/_Game/SingleColor" + ".json",
            "_LwgData" + "/_Game/Colours" + ".json",
        ];
    }
    lwgAdaptive(): void {
    }
    lwgOnEnable(): void {
    }
    lwgOnStart(): void {
    }
    lwgOpenAni(): number { return 0; }
    lodingPhaseComplete(): void {
        // this.self['Progress'].mask.x = -425 + 425 * Lwg_Loding.currentProgress.value / Lwg_Loding.sumProgress;
    }
    lodingComplete(): number {
        // this.self['Progress'].mask.x = 0;
        return 200;
    }
}

