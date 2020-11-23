import ADManager, { TaT } from "../TJ/Admanager";
import lwg, { Admin, Animation2D, Click, Dialogue, _Gold, _SceneName } from "./Lwg";
import TweenMgr from "./TweenMgr";
import { _Game } from "./_Game";

export module _Test {

    export  class TreasureItem{
        id: number;
        ui: Test;
        box: Laya.Image;
        frame: Laya.Sprite;
        num: Laya.FontClip;
        g1: Laya.Sprite;
        g2: Laya.Sprite;
        _close: boolean;
        _gold: number;
        isAD = false;
        baoshi: Laya.Sprite;
        constructor(id, obj, ui){
            this.id = id;
            this.ui = ui;
            let baoshi=obj.getChildByName("baoshi") as Laya.Sprite;
            this.baoshi = baoshi;
            let frame = obj.getChildByName("Frame") as Laya.Sprite;
            this.box = obj.getChildByName("Box");
            this.box.skin = "Game/UI/TreasureNew/baoxiang.png"
            this.frame = frame;
            this.num = frame.getChildByName("Num") as Laya.FontClip;
            this.g1 = frame.getChildByName("G1") as Laya.Sprite;
            this.g2 = frame.getChildByName("G2") as Laya.Sprite;
            this._close = true;
            this._gold = TweenMgr.randomInRange_i(5, 10);
            this.baoshi.visible = false;
            this.frame.visible = false;
            this.num.value = this._gold.toString();
            if(this._gold < 7){
                this.g2.visible = false;
                this.g1.x = 66;
            }
        
        }
    
         clickItem(){
            if(this._close){
    
                if(this.isAD)
                {
                    ADManager.ShowReward(()=>
                    {
                        this.ClickBox();
                        ADManager.TAPoint(TaT.BtnClick, 'ADrewardbox_box');
                    },null);
                }else
                {
                    if(leftTimes > 0){
                        leftTimes -= 1;
                        this.ClickBox();
                    }else{
                        Dialogue.createHint_Middle(`点击再开一次可获得机会继续！`);
                    }
                }
            }
        }
    
        ClickBox(){
            console.log("点击宝箱")
            boxOpenCount++;

            if(_Game._ColoursPencils._switch != true){
                if(boxOpenCount<3){
                    BS30.visible=true;
                }else if(boxOpenCount==4){
                    BS30.visible=false;
                    BS50.visible=true;
                }else if(boxOpenCount==8){
                    BS50.visible=false;
                    BS100.visible=true;
                }else if(boxOpenCount==9){
                    BSjihui.visible=false;
                }
            }
           
            if(boxOpenCount==9)
            {
                if(_Game._ColoursPencils._switch != true)
                {
                    _Game._DhadthCont = 1;
                    Laya.LocalStorage.setItem("_DhadthCont",_Game._DhadthCont.toString());
                    Dialogue.createHint_Middle(`恭喜获得彩色画笔！`);
                    this.openshow2();
                    return;
                } 
            }
    
            Animation2D.bomb_LeftRight(this.box, 1.20, 250,()=>{
                this._close = false;
                _Gold._getGoldAni_Heap(Laya.stage, 15, 55, 51, `Game/UI/Victory/jb.png`, null, null, null, () => {
                    _Gold._addGold(this._gold);
                });
                this.frame.visible = true;
                this.ui.checkTimes(0);
            });
        }
    
        openshow2()
        {
            Animation2D.bomb_LeftRight(this.box, 1.20, 250,()=>{
                this.g1.visible = false;
                this.g2.visible = false;
                this.num.visible = false;
                this.baoshi.visible = true;
                this.frame.visible = true;
                this.ui.checkTimes(0);
            });
        }
    
        setAD()
        {
            this.isAD = true;
            this.box.skin = "Game/UI/TreasureNew/baoxiang_shipin.png"
        }
    }

    

    export let boxOpenCount=0;
    export let leftTimes = 3;
    export let BSjihui: Laya.Image;
    export let BS30: Laya.Image;
    export let BS50: Laya.Image;
    export let BS100: Laya.Image;
    export let ADBntTime = 0;

    export class Test extends Admin._SceneBase {
      
        goldNum: number;
        itemList = [];
        getKeyValid: boolean;
        quitValid: boolean;
        settleFixY = 260;
        needShowAD :Array<Array<number>>=[[1,2,6],[2,6,7],[3,5,6],[2,4,7],[0,5,7]];
        static isFirst = true;
        showAD;
    
        lwgOnAwake(): void {
            _Gold.goldAppear(100);
            boxOpenCount=0;
            leftTimes = 3;
            ADBntTime = 0;
            this.getKeyValid = true;
            this.quitValid = true;
            this.showAD = [-1,-1,-1];
            // if(Test.isFirst)
            // {
            //     Test.isFirst = false;
            // }else
            // {
                this.showAD = this.needShowAD[TweenMgr.randomInRange_iWithOutY(0,this.needShowAD.length)];
            // }
        
            for (let i = 0; i < 9; i++) {
                let c = "Card" + i;
                let item = new TreasureItem(i, this.ImgVar(c), this);
                this.itemList.push(item);
                this.btnEv(c, () => {
                    item.clickItem();
                });

                if(this.showAD.indexOf(i)>=0)
                {
                    item.setAD();
                }
            }

            BSjihui = this.ImgVar("BSjihui");
            BS30 = this.ImgVar("30");
            BS50 = this.ImgVar("50");
            BS100 = this.ImgVar("100");
            if(_Game._ColoursPencils._switch != true){
                BSjihui.visible=true;
                BS30.visible=true;
            }

            this.ImgVar("BtnMoreKey").visible = false;
            this.ImgVar("BtnDirect").visible = false;

            ADManager.TAPoint(TaT.PageEnter, 'boxpage');
            ADManager.TAPoint(TaT.BtnShow, 'ADrewardbox_box');
        }

        lwgBtnClick():void{
            Click._on(Click._Type.largen, this.btnVar("BtnMoreKey"), this, null, null, (e: Laya.Event) => {
                if(ADBntTime>=1){
                    Dialogue.createHint_Middle(`普通宝箱已开完哦！`);
                }else{
                    ADManager.ShowReward(() => {
                        ADBntTime ++;
                        this.ImgVar("BtnMoreKey").visible = false;
                        this.ImgVar("BtnDirect").visible = false;
                        this.getKeyValid = false;
                        this.checkTimes(3);
                        ADManager.TAPoint(TaT.BtnClick, 'ADrewardbt_box');
                    });
                }
                
            });

            Click._on(Click._Type.largen, this.btnVar('BtnDirect'), this, null, null, (e: Laya.Event) => {
                this.lwgOpenScene(_SceneName.Share);           
            });
        }

        checkTimes(delta) {
            leftTimes += delta;
            if (leftTimes == 0) {
                if(boxOpenCount==9)
                {
                    this.ImgVar("BtnMoreKey").visible = false;    
                    this.ImgVar("BtnDirect").visible = true;
                }
                else
                {
                    this.ImgVar("BtnMoreKey").visible = true;
                    this.ImgVar("BtnDirect").visible = true;  
                    ADManager.TAPoint(TaT.BtnShow, 'ADrewardbt_box');          
                }
            }
        }

        bofang(){
            Animation2D.bomb_LeftRight(this.ImgVar('BtnStart'), 1.22, 250);
        }

        lwgOnDisable(): void {
            ADManager.TAPoint(TaT.PageLeave, 'boxpage');
        }  
    }
}
export default _Test.Test;
