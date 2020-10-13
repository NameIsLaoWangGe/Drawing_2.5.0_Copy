// import { EventAdmin } from "./lwg";
/**管理3D的模块*/
export module lwg3D {
    /**3D场景通用父类*/
    export class Scene3D extends Laya.Script3D {
        /**挂载当前脚本的节点*/
        self: Laya.Scene3D;
        /**类名*/
        calssName: string;
        /**摄像机节点*/
        MainCamera: Laya.MeshSprite3D | Laya.Camera;
        /**摄像机的初始位置*/
        mainCameraFpos: Laya.Vector3 = new Laya.Vector3();
        constructor() {
            super();
        }
        onAwake(): void {
            this.self = this.owner as Laya.Scene3D;
            // 类名
            this.calssName = this['__proto__']['constructor'].name;
            this.MainCamera = this.self.getChildByName("Main Camera") as Laya.MeshSprite3D;
            if (this.MainCamera) {
                this.mainCameraFpos.x = this.MainCamera.transform.localPositionX;
                this.mainCameraFpos.y = this.MainCamera.transform.localPositionY;
                this.mainCameraFpos.z = this.MainCamera.transform.localPositionZ;
            }
            this.lwgOnAwake();
            this.lwgNodeDec();
            this.lwgAdaptive();
        }
        lwgOnAwake(): void {
        }
        onEnable() {
            // 组件变为的self属性
            this.self[this.calssName] = this;
            this.lwgEventReg();
            this.lwgOnEnable();
            this.lwgBtnClick();
            this.lwgAdaptive();
            this.lwgOpenAni();
        }
        /**场景内部全局变量*/
        lwgNodeDec(): void {
        }
        /**场景中的一些事件*/
        lwgEventReg(): void {
        }
        /**初始化，在onEnable中执行，重写即可覆盖*/
        lwgOnEnable(): void {
            // console.log('父类的初始化！');
        }
        /**点击事件注册*/
        lwgBtnClick(): void {
        }
        /**一些节点自适应*/
        lwgAdaptive(): void {
        }
        /**开场动画*/
        lwgOpenAni(): void {
        }
        /**离场动画*/
        lwgVanishAni(): void {
        }
        onUpdate(): void {
            this.lwgOnUpDate();
        }
        /**每帧更新时执行，尽量不要在这里写大循环逻辑或者使用*/
        lwgOnUpDate(): void {

        }
        onDisable(): void {
            this.lwgOnDisable();
            Laya.timer.clearAll(this);
            Laya.Tween.clearAll(this);
            // EventAdmin.offCaller(this);
        }
        /**离开时执行，子类不执行onDisable，只执行lwgDisable*/
        lwgOnDisable(): void {

        }
    }

    /**3D物件通用父类*/
    export class Object3D extends Laya.Script3D {
        /**挂载当前脚本的节点*/
        self: Laya.MeshSprite3D;
        /**所在的3D场景*/
        selfScene: Laya.Scene3D;
        /***/
        selfTransform: Laya.Transform3D;
        /**物理组件*/
        rig3D: Laya.Rigidbody3D;
        /**物理组件*/
        BoxCol3D: Laya.PhysicsCollider;
        constructor() {
            super();
        }
        onAwake(): void {
            this.self = this.owner as Laya.MeshSprite3D;
            this.selfTransform = this.self.transform;
            this.selfScene = this.self.scene;
            // 类名
            let calssName = this['__proto__']['constructor'].name;
            // 组件变为的self属性
            this.self[calssName] = this;
            this.rig3D = this.self.getComponent(Laya.Rigidbody3D);
            this.BoxCol3D = this.self.getComponent(Laya.PhysicsCollider) as Laya.PhysicsCollider;
            this.lwgNodeDec();
        }
        lwgNodeDec(): void { }
        onEnable() {
            this.lwgEventReg();
            this.lwgOnEnable();
        }
        /**初始化，在onEnable中执行，重写即可覆盖*/
        lwgOnEnable(): void { }
        /**点击事件注册*/
        lwgBtnClick(): void {
        }
        /**事件注册*/
        lwgEventReg(): void {
        }
        onUpdate(): void {
            this.lwgOnUpdate();
        }
        lwgOnUpdate(): void {

        }
        onDisable(): void {
            this.lwgOnDisable();
            Laya.Tween.clearAll(this);
            Laya.timer.clearAll(this);
            // EventAdmin.offCaller(this);
        }
        /**离开时执行，子类不执行onDisable，只执行lwgDisable*/
        lwgOnDisable(): void {

        }
    }
}