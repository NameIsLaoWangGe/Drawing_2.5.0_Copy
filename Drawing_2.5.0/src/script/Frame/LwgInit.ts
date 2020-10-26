import { Admin, DateAdmin, EventAdmin, _LwgInit, _LwgInitScene, _SceneName } from "./Lwg";
import { _Game } from "./_Game";
import { _Guide } from "./_Guide";
import { _PreLoad } from "./_PreLoad";
import { _PreLoadStep } from "./_PreLoadStep";
import { _Start } from "./_Start";
import { _Task } from "./_Task";

export enum SceneName {
}
export default class LwgInit extends _LwgInitScene {
    lwgOnAwake(): void {
        _LwgInit._pkgInfo = [
            // { name: "sp1", root: "res" },
            // { name: "sp2", root: "3DScene" },
            // { name: "sp3", root: "3DPrefab" },
        ];
        Admin._platform.name = Admin._platform.tpye.General;
        Admin._evaluating = false;
        Admin._moudel = {
            _PreLoad: _PreLoad,
            _Guide: _Guide,
            _Start: _Start,
            _Game: _Game,
            _Task: _Task,
            _PreLoadStep: _PreLoadStep,
        };
    }
}