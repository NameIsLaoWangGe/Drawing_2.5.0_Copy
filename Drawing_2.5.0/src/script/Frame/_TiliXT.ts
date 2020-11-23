import ADManager from "../TJ/Admanager";
import { Admin, Click, Dialogue, Tools } from "./Lwg";

/**补充体力模块*/
export module _TiliXT {
    /**当前剩余行动力的数量*/
    export let _execution = {
        get value(): number {
            if (!this['_TiliXT_executionNum']) {
                return Laya.LocalStorage.getItem('_TiliXT_executionNum') ? Number(Laya.LocalStorage.getItem('_TiliXT_executionNum')) : 5;
            }
            return this['_TiliXT_executionNum'];
        },
        set value(val: number) {
            console.log(val);
            this['_TiliXT_executionNum'] = val;
         
            // let num = _ExecutionNode.getChildByName('Num') as Laya.FontClip;
            Num.value =val.toString();

            Laya.LocalStorage.setItem('_TiliXT_executionNum', val.toString());
            
        }
    };
    export let _addExDate = {
        get value(): number {
            if (!this['_TiliXT_addExDate']) {
                return Laya.LocalStorage.getItem('_TiliXT_addExDate') ? Number(Laya.LocalStorage.getItem('_TiliXT_addExDate')) : (new Date()).getDay();
            }
            return this['_TiliXT_addExDate'];
        },
        set value(val: number) {
            this['_TiliXT_addExDate'] = val;
            Laya.LocalStorage.setItem('_TiliXT_addExDate', val.toString());
        }
    }
    export let _addExHours = {
        get value(): number {
            if (!this['_TiliXT_addExHours']) {
                return Laya.LocalStorage.getItem('_TiliXT_addExHours') ? Number(Laya.LocalStorage.getItem('_TiliXT_addExHours')) : (new Date()).getHours();
            }
            return this['_TiliXT_addExHours'];
        },
        set value(val: number) {
            this['_TiliXT_addExHours'] = val;
            Laya.LocalStorage.setItem('_TiliXT_addExHours', val.toString());
        }
    };
    export let _addMinutes = {
        get value(): number {
            if (!this['_TiliXT_addMinutes']) {
                return Laya.LocalStorage.getItem('_TiliXT_addMinutes') ? Number(Laya.LocalStorage.getItem('_TiliXT_addMinutes')) : (new Date()).getMinutes();
            }
            return this['_TiliXT_addMinutes'];
        },
        set value(val: number) {
            this['_TiliXT_addMinutes'] = val;
            Laya.LocalStorage.setItem('_TiliXT_addMinutes', val.toString());
        }
    };

    export let Num: Laya.FontClip;
    export class TiliXT extends Admin._SceneBase {
        
        CountDown: Laya.Label;
        CountDown_board: Laya.Label;

        lwgOnAwake(): void {
            Num = this.ImgVar("ExecutionNum").getChildByName('Num') as Laya.FontClip;
            this.CountDown = this.ImgVar("ExecutionNum").getChildByName('CountDown') as Laya.Label;
            this.CountDown_board = this.ImgVar("ExecutionNum").getChildByName('CountDown_board') as Laya.Label;
            this.countNum = 59;
            this.CountDown.text = '00:' + this.countNum;
            this.CountDown_board.text = this.CountDown.text;

    

        // 获取上次的体力
        let d = new Date;
        if (d.getDate() !== _TiliXT._addExDate.value) {
            _TiliXT._execution.value = 5;
        } else {
            if (d.getHours() == _TiliXT._addExHours.value) {
                console.log(d.getMinutes(), _TiliXT._addMinutes.value);
                _TiliXT._execution.value += (d.getMinutes() - _TiliXT._addMinutes.value);
                if (_TiliXT._execution.value > 5) {
                    _TiliXT._execution.value = 5;
                }
            } else {
                _TiliXT._execution.value = 5;
            }
        }
    

        Num.value = _TiliXT._execution.value.toString();
    
    
        _TiliXT._addExDate.value = d.getDate();
        _TiliXT._addExHours.value = d.getHours();
        _TiliXT._addMinutes.value = d.getMinutes();
    }

    /**计时器*/
    time: number = 0;
    /**时钟当前秒数*/
    countNum: number = 59;
    /**倒计时，一分钟一点体力*/
    countDownAddEx(): void {
        this.time++;
        if (this.time % 60 == 0) {
            this.countNum--;
            if (this.countNum < 0) {
                this.countNum = 59;
                _TiliXT._execution.value += 1;
                Num.value = _TiliXT._execution.value.toString();
                let d = new Date;
                _TiliXT._addExHours.value = d.getHours();
                _TiliXT._addMinutes.value = d.getMinutes();
            }
            if (this.countNum >= 10 && this.countNum <= 59) {
                this.CountDown.text = '00:' + this.countNum;
                this.CountDown_board.text = this.CountDown.text;
    
            } else if (this.countNum >= 0 && this.countNum < 10) {
                this.CountDown.text = '00:0' + this.countNum;
                this.CountDown_board.text = this.CountDown.text;
            }
        }
    }
    
    timeSwitch: boolean = true;
    lwgOnUpdate(): void {
        if (Number(Num.value) >= 5) {
            if (this.timeSwitch) {
                _TiliXT._execution.value = 5;
                Num.value = _TiliXT._execution.value.toString();
                this.CountDown.text = '00:00';
                this.CountDown_board.text = this.CountDown.text;
                this.countNum = 60;
                this.timeSwitch = false;
            }
    
        } else {
            this.timeSwitch = true;
            this.countDownAddEx();
        }
    }
    }
}
export default _TiliXT.TiliXT