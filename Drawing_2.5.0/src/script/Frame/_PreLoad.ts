import { _PreLoad, _SceneName } from "./lwg";

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
            // "3DScene/LayaScene_GameMain/Conventional/GameMain.ls"
        ];
        _PreLoad.list_3DPrefab = [
            // "3DPrefab/LayaScene_GameMain/Conventional/CardContainer.lh"
        ];
        _PreLoad.list_JsonData = [
            // "GameData/Shop/Other.json",
            // "GameData/Shop/Props.json",
            // "GameData/Shop/Skin.json",
            // 'GameData/Task/everydayTask.json',
            // "GameData/VictoryBox/VictoryBox.json",
            // "GameData/CheckIn/CheckIn.json",
            // "GameData/Dialog/Dialog.json",
            // "GameData/Game/Feature.json",
            // "GameData/Game/Card.json",
            // "GameData/EasterEgg/EasterEgg.json",
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

