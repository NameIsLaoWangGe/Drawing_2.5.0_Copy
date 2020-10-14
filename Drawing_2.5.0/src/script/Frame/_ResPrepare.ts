import { Admin, EventAdmin, _ResPrepare } from "./Lwg";

export default class UIResPrepare extends _ResPrepare._ResPrepareScene {
    lwgOnAwake(): void {
        _ResPrepare._pkgInfo = [
            { name: "sp1", root: "res" },
            { name: "sp2", root: "3DScene" },
            { name: "sp3", root: "3DPrefab" },
        ];
        Admin._platform = null;
    }
}