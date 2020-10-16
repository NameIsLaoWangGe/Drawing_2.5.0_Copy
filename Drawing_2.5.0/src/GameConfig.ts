/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import _PreLoad from "./script/Frame/_PreLoad"
import _Init from "./script/Frame/_Init"
/*
* 游戏初始化配置;
*/
export default class GameConfig{
    static width:number=720;
    static height:number=1280;
    static scaleMode:string="fixedwidth";
    static screenMode:string="none";
    static alignV:string="top";
    static alignH:string="left";
    static startScene:any="Scene/UIPreLoad.scene";
    static sceneRoot:string="";
    static debug:boolean=false;
    static stat:boolean=false;
    static physicsDebug:boolean=false;
    static exportSceneToJson:boolean=true;
    constructor(){}
    static init(){
        var reg: Function = Laya.ClassUtils.regClass;
        reg("script/Frame/_PreLoad.ts",_PreLoad);
        reg("script/Frame/_Init.ts",_Init);
    }
}
GameConfig.init();