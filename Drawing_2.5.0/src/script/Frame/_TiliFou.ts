import ADManager, { TaT } from "../TJ/Admanager";
import { Admin, Click, Dialogue, Tools } from "./Lwg";
import { _Execution } from "./_Execution";
import { _TiliXT } from "./_TiliXT";

/**补充体力模块*/
export module _TiliFou {
    


    /**对补充体力进行初始化*/
    export class TiliFou extends Admin._SceneBase {

        lwgOnAwake(): void {
            this.ImgVar("guanbi").visible = false;
            Laya.timer.once(2000,this,()=>{
                this.ImgVar("guanbi").visible = true;
            });    

            ADManager.TAPoint(TaT.PageEnter, 'noticketpage');
            ADManager.TAPoint(TaT.BtnShow, 'ADrewardbt_noticket');
        }

        lwgBtnClick():void{
            Click._on(Click._Type.largen, this.btnVar('guanbi'), this, null, null, (e: Laya.Event) => {
                this.lwgCloseScene();
            });

            Click._on(Click._Type.largen, this.btnVar('ok'), this, null, null, (e: Laya.Event) => {
                ADManager.ShowReward(() => {
                    _TiliXT._execution.value +=5;
                    Dialogue.createHint_Middle(`已补充5点体力，继续游戏吧！`);
                    this.lwgCloseScene();
                    ADManager.TAPoint(TaT.BtnClick, 'ADrewardbt_noticket');
                });
            });
        }

        lwgOnDisable(): void {
            ADManager.TAPoint(TaT.PageLeave, 'noticketpage');
        }  
       
    }
   
}
export default _TiliFou.TiliFou