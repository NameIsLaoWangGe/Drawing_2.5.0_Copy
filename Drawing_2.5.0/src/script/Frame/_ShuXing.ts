import ADManager, { TaT } from "../TJ/Admanager";
import { Admin, Animation2D, Click, Dialogue, EventAdmin, TimerAdmin, Tools, _Gold, _SceneName } from "./Lwg";
import { _Game } from "./_Game";
import { _SelectLevel } from "./_SelectLevel";
import { _TiliXT } from "./_TiliXT";

/**属性模块*/
export module _ShuXing {
  
    export let SKJ:number ;
    export let SKJT:number = 0;
    export let Scncount:number = 0;
    export let WKJ:number = 5;
    export let WKJT:number = 0;
    export let Wcncount:number = 0;
    export let XKJ:number = 5;
    export let XKJT:number = 0;
    export let Xcncount:number = 0;
    export let cncounts:number = 0;
    export let cncountz:number = 0;
    export let cncounx:number = 0;


    /**对属性场景进行初始化*/
    export class ShuXing extends Admin._SceneBase {


        lwgOnAwake(): void {

            SKJ = Number(Laya.LocalStorage.getItem("SKJ"));
            SKJT = Number(Laya.LocalStorage.getItem("SKJT"));
            WKJ = Number(Laya.LocalStorage.getItem("WKJ"));
            WKJT = Number(Laya.LocalStorage.getItem("WKJT"));
            XKJ = Number(Laya.LocalStorage.getItem("XKJ"));
            XKJT = Number(Laya.LocalStorage.getItem("XKJT"));
            cncounx = Number(Laya.LocalStorage.getItem("cncounx"));
            cncountz = Number(Laya.LocalStorage.getItem("cncountz"));
            cncounts = Number(Laya.LocalStorage.getItem("cncounts"));
            //首次登陆的初始值
            let FnumYao=Number(Laya.LocalStorage.getItem("FnumYao"));
            if(FnumYao==0){
                this.TexVar('Stext').text=SKJT+" / 50";
                SKJ=20;
                Laya.LocalStorage.setItem("SKJ",SKJ.toString());
                this.TexVar('Wtext').text=WKJT+" / 50";
                WKJ=5;
                Laya.LocalStorage.setItem("WKJ",WKJ.toString());
                this.TexVar('Xtext').text=XKJT+" / 50";
                XKJ=5;
                Laya.LocalStorage.setItem("XKJ",XKJ.toString());
            }else{
                this.TexVar('Stext').text=SKJT+" / 1000";
                this.TexVar('Wtext').text=WKJT+" / 1000";
                this.TexVar('Xtext').text=XKJT+" / 1000";
            }
            
            this.TexVar('stest').text="(+"+SKJ+")";  
            this.ImgVar('SSlide').width+=0.43*Number(Laya.LocalStorage.getItem("Scncount")); 
            this.TexVar('wtest').text="(+"+SKJ+")";  
            this.ImgVar('ZSlide').width+=0.43*Number(Laya.LocalStorage.getItem("Wcncount")); 
            this.TexVar('xtest').text="(+"+SKJ+")";  
            this.ImgVar('XSlide').width+=0.43*Number(Laya.LocalStorage.getItem("Xcncount")); 
            this.ImgVar('ZheZ').height-=3.8*(Number(Laya.LocalStorage.getItem("cncounx"))+Number(Laya.LocalStorage.getItem("cncountz"))+Number(Laya.LocalStorage.getItem("cncounts")));

            ADManager.TAPoint(TaT.PageEnter, "shuxingpage");

        }

        lwgOnUpdate(){
            if(SKJ>0){
                this.ImgVar('SWAD').visible=true;
                this.ImgVar('SAD').visible=false;
            }else{
                this.ImgVar('SWAD').visible=false;
                this.ImgVar('SAD').visible=true;
            }

            if(SKJ>0){
                this.ImgVar('ZWAD').visible=true;
                this.ImgVar('ZAD').visible=false;
            }else{
                this.ImgVar('ZWAD').visible=false;
                this.ImgVar('ZAD').visible=true;
            }

            if(SKJ>0){
                this.ImgVar('XWAD').visible=true;
                this.ImgVar('XAD').visible=false;
            }else{
                this.ImgVar('XWAD').visible=false;
                this.ImgVar('XAD').visible=true;
            }


        }
        lwgOpenAni(): number { return 0 };

        lwgOpenAniAfter(): void {
            TimerAdmin._loop(2000, this, () => {
                Animation2D.bomb_LeftRight(this.ImgVar('Box'), 1.20, 250);
                Animation2D.simple_Rotate(this.ImgVar('LiahtGX'), 0,360,3000);
            }, true);
        }

        XYTianjia(){
            XKJT+=1;
            this.ImgVar('ZheZ').height-=3.8;
            if(this.ImgVar('ZheZ').height<=1){
                this.ImgVar('ZheZ').height=0;
                this.ImgVar('box').visible=false;
                this.ImgVar('Box').visible=true;
                Laya.timer.once(2000,this,()=>{
                    this.tanJL();
                }); 
                
            }else{
                cncounx++;
                Laya.LocalStorage.setItem("cncounx",cncounx.toString());
            }
            if(Number(Laya.LocalStorage.getItem("FnumYao"))==0){
                this.TexVar('Xtext').text=XKJT+" / 50";
                this.ImgVar('XSlide').width+=8.6;
            }else{
                this.TexVar('Xtext').text=XKJT+" / 1000";
                this.ImgVar('XSlide').width+=0.43;
            }
            
            this.TexVar('stest').text="(+"+SKJ+")";  
            this.TexVar('wtest').text="(+"+SKJ+")";  
            this.TexVar('xtest').text="(+"+SKJ+")"; 
            if(SKJ==0){
                this.ImgVar('SWAD').visible=false;
                this.ImgVar('SAD').visible=true;
            }
            if(SKJ==0){
                this.ImgVar('ZWAD').visible=false;
                this.ImgVar('ZAD').visible=true;
            }
            if(SKJ==0){
                this.ImgVar('XWAD').visible=false;
                this.ImgVar('XAD').visible=true;   
            }
            Laya.LocalStorage.setItem("SKJ",SKJ.toString());
            Laya.LocalStorage.setItem("XKJT",XKJT.toString());
        }

        ZLTianjia(){
            WKJT+=1;
            this.ImgVar('ZheZ').height-=3.8;
            if(this.ImgVar('ZheZ').height<=1){
                this.ImgVar('ZheZ').height=0;
                this.ImgVar('box').visible=false;
                this.ImgVar('Box').visible=true;
                Laya.timer.once(2000,this,()=>{
                    this.tanJL();
                }); 
                
            }else{
                cncountz++;
                Laya.LocalStorage.setItem("cncountz",cncountz.toString());
            }
            if(Number(Laya.LocalStorage.getItem("FnumYao"))==0){
                this.TexVar('Wtext').text=WKJT+" / 50";
                this.ImgVar('ZSlide').width+=8.6;
            }else{
                this.TexVar('Wtext').text=WKJT+" / 1000";
                this.ImgVar('ZSlide').width+=0.43;
            }
            
            this.TexVar('stest').text="(+"+SKJ+")";  
            this.TexVar('wtest').text="(+"+SKJ+")";  
            this.TexVar('xtest').text="(+"+SKJ+")"; 
            if(SKJ==0){
                this.ImgVar('SWAD').visible=false;
                this.ImgVar('SAD').visible=true;
            }
            if(SKJ==0){
                this.ImgVar('ZWAD').visible=false;
                this.ImgVar('ZAD').visible=true;
            }
            if(SKJ==0 ){
                this.ImgVar('XWAD').visible=false;
                this.ImgVar('XAD').visible=true;   
            }
            Laya.LocalStorage.setItem("SKJ",SKJ.toString());
            Laya.LocalStorage.setItem("WKJT",WKJT.toString());
        }

        SMTianjia(){
            SKJT+=1;
            this.ImgVar('ZheZ').height-=3.8;
            if(this.ImgVar('ZheZ').height<=1){
                this.ImgVar('ZheZ').height=0;
                this.ImgVar('box').visible=false;
                this.ImgVar('Box').visible=true;
                Laya.timer.once(2000,this,()=>{
                    this.tanJL();
                });        
                
                
            }else{
                cncounts++;
                Laya.LocalStorage.setItem("cncounts",cncounts.toString());
            }
            if(Number(Laya.LocalStorage.getItem("FnumYao"))==0){
                this.TexVar('Stext').text=SKJT+" / 50";
                this.ImgVar('SSlide').width+=8.6;
            }else{
                this.TexVar('Stext').text=SKJT+" / 1000";
                this.ImgVar('SSlide').width+=0.43;
            }
            
            this.TexVar('stest').text="(+"+SKJ+")";  
            this.TexVar('wtest').text="(+"+SKJ+")";  
            this.TexVar('xtest').text="(+"+SKJ+")"; 
            if(SKJ==0){
                this.ImgVar('SWAD').visible=false;
                this.ImgVar('SAD').visible=true;
            }
            if(SKJ==0 ){
                this.ImgVar('ZWAD').visible=false;
                this.ImgVar('ZAD').visible=true;
            }
            if(SKJ==0 ){
                this.ImgVar('XWAD').visible=false;
                this.ImgVar('XAD').visible=true;   
            }
            Laya.LocalStorage.setItem("SKJ",SKJ.toString());
            Laya.LocalStorage.setItem("SKJT",SKJT.toString());
        }

        tanJL(){
            console.log("获得奖励")
            ADManager.TAPoint(TaT.BtnShow, 'BXshuxing');
            
            this.ImgVar('box').visible=true;
            this.ImgVar('Box').visible=false;
            this.ImgVar('ZheZ').height = 114;
            this.ImgVar('JLBG').visible=true;
            if(Number(Laya.LocalStorage.getItem("cncounts"))>Number(Laya.LocalStorage.getItem("cncountz")) && Number(Laya.LocalStorage.getItem("cncounts"))>Number(Laya.LocalStorage.getItem("cncounx"))){
                this.ImgVar('TiliJL').visible=true;
                this.ImgVar('JINbiJL').visible=false;
                this.ImgVar('caibiJL').visible=false;
                _TiliXT._execution.value +=3;
            }else if(Number(Laya.LocalStorage.getItem("cncountz"))>Number(Laya.LocalStorage.getItem("cncounts")) && Number(Laya.LocalStorage.getItem("cncountz"))>Number(Laya.LocalStorage.getItem("cncounx"))){
                this.ImgVar('TiliJL').visible=false;
                this.ImgVar('JINbiJL').visible=true;
                this.ImgVar('caibiJL').visible=false;
                _Gold._addGold(300);
            }else if(Number(Laya.LocalStorage.getItem("cncounx"))>Number(Laya.LocalStorage.getItem("cncounts")) && Number(Laya.LocalStorage.getItem("cncounx"))>Number(Laya.LocalStorage.getItem("cncountz"))){
                this.ImgVar('TiliJL').visible=false;
                this.ImgVar('JINbiJL').visible=false;
                this.ImgVar('caibiJL').visible=true;
                _Game._BlinkPencils._pitchName = _Game._BlinkPencils._randomNoHaveOne();
                _Game._BlinkPencils._addPencil(_Game._BlinkPencils._randomNoHaveOne());
            }else{
                this.ImgVar('TiliJL').visible=true;
                this.ImgVar('JINbiJL').visible=false;
                this.ImgVar('caibiJL').visible=false;
                _TiliXT._execution.value +=3;
            }
            cncounx=0;
            Laya.LocalStorage.setItem("cncounx",cncounx.toString());
            cncountz=0;
            Laya.LocalStorage.setItem("cncountz",cncountz.toString());
            cncounts=0;
            Laya.LocalStorage.setItem("cncounts",cncounts.toString());
        }

        lwgBtnClick(): void {
            Click._on(Click._Type.largen, this.btnVar('Huode'), this, null, null, () => {
                this.ImgVar('JLBG').visible=false;
                ADManager.TAPoint(TaT.BtnClick, 'BXshuxing');
            })

            

            Click._on(Click._Type.noEffect, this.btnVar('KaiYX'), this, null, null, () => {
                _SelectLevel._Data._pich.classify = _SelectLevel._Data._classify.animal;
                this.lwgOpenScene(_SceneName.SelectLevel);
            })

            Click._on(Click._Type.largen, this.btnVar('CheHui'), this, null, null, () => {
                this.lwgCloseScene();
                Laya.LocalStorage.setItem("FnumYao","1");
            });

            Click._on(Click._Type.largen, this.btnVar('XWAD'), this, null, null, () => {
                if(Number(Laya.LocalStorage.getItem("FnumYao"))==0){
                    if(XKJT>=50){
                        Dialogue.createHint_Middle(`该属性已满`);
                        return;
                    }
                }else{
                    if(XKJT>=10000){
                        Dialogue.createHint_Middle(`该属性已满`);
                        return;
                    }
                }
                
                Xcncount = Number(Laya.LocalStorage.getItem("Xcncount"));
                if(SKJ>0){
                    switch(Xcncount){
                        default:
                            SKJ-=1;

                            this.XYTianjia();
                            break;
                    }
                        
                    Xcncount++;
                    Laya.LocalStorage.setItem("Xcncount",Xcncount.toString());
                }
                // else if(_TiliXT._execution.value > 0){
                //     switch(Xcncount){
                //         default:
                //             _TiliXT._execution.value -=1;

                //             this.XYTianjia();
                //             break;
                //     }
                //     Xcncount++;
                //     Laya.LocalStorage.setItem("Xcncount",Xcncount.toString());
                // }
            });

            Click._on(Click._Type.largen, this.btnVar('XAD'), this, null, null, () => {
                this.ImgVar('TanShu').visible=true;
            });

            Click._on(Click._Type.largen, this.btnVar('SWAD'), this, null, null, () => {
                if(Number(Laya.LocalStorage.getItem("FnumYao"))==0){
                    if(SKJT>=50){
                        Dialogue.createHint_Middle(`该属性已满`);
                        return;
                    }
                }else{
                    if(SKJT>=10000){
                        Dialogue.createHint_Middle(`该属性已满`);
                        return;
                    }
                }
                Scncount = Number(Laya.LocalStorage.getItem("Scncount"));
                if(SKJ>0){
                    switch(Scncount){
                        default:
                            SKJ-=1;
                            this.SMTianjia();
                            break;
                    }
                    Scncount++;
                    Laya.LocalStorage.setItem("Scncount",Scncount.toString());
                }
                // else if(_TiliXT._execution.value > 0){
                //     switch(Xcncount){
                //         default:
                //             _TiliXT._execution.value -=1;

                //             this.SMTianjia();
                //             break;
                //     }
                //     Scncount++;
                //     Laya.LocalStorage.setItem("Scncount",Scncount.toString());
                // }
            });

            Click._on(Click._Type.largen, this.btnVar('SAD'), this, null, null, () => {
                this.ImgVar('TanShu').visible=true;
            });

            Click._on(Click._Type.largen, this.btnVar('ZWAD'), this, null, null, () => {
                if(Number(Laya.LocalStorage.getItem("FnumYao"))==0){
                    if(WKJT>=50){
                        Dialogue.createHint_Middle(`该属性已满`);
                        return;
                    }
                }else{
                    if(WKJT>=10000){
                        Dialogue.createHint_Middle(`该属性已满`);
                        return;
                    }
                }
                Wcncount = Number(Laya.LocalStorage.getItem("Wcncount"));
                if(SKJ>0){
                    switch(Wcncount){
                        default:
                            SKJ-=1;
                            this.ZLTianjia();
                            break;
                    }
                    Wcncount++;
                    Laya.LocalStorage.setItem("Wcncount",Wcncount.toString());
                }
                // else if(_TiliXT._execution.value > 0){
                //     switch(Xcncount){
                //         default:
                //             _TiliXT._execution.value -=1;

                //             this.ZLTianjia();
                //             break;
                //     }
                //     Wcncount++;
                //     Laya.LocalStorage.setItem("Wcncount",Wcncount.toString());
                // }
            });

            Click._on(Click._Type.largen, this.btnVar('ZAD'), this, null, null, () => {
                this.ImgVar('TanShu').visible=true;
            });

            Click._on(Click._Type.largen, this.btnVar('BtnClose'), this, null, null, () => {
                this.ImgVar('TanShu').visible=false;
            });

            Click._on(Click._Type.largen, this.btnVar('BtnConfirm'), this, null, null, () => {
                ADManager.ShowReward(() => {
                    SKJ+=10;
                    Laya.LocalStorage.setItem("SKJ",SKJ.toString());
                    this.TexVar('stest').text="(+"+SKJ+")";  
                    this.TexVar('wtest').text="(+"+SKJ+")";  
                    this.TexVar('xtest').text="(+"+SKJ+")"; 
                    this.ImgVar('ZWAD').visible=true;
                    this.ImgVar('ZAD').visible=false;
                    ADManager.TAPoint(TaT.BtnClick, 'ADshuxing');
                    this.ImgVar('TanShu').visible=false;
                });
            });
        }

        lwgOnDisable(): void {
            ADManager.TAPoint(TaT.PageLeave, 'shuxingpage');
            Laya.LocalStorage.setItem("FnumYao","1");
        }  
    }
}
export default _ShuXing.ShuXing

