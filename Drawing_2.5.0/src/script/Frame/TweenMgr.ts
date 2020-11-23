

export default class TweenMgr {
    static sg: TweenMgr;


    pause: boolean;
    clearCounter = 0;


    gamePause(state){
        this.pause = state;
    }


    static clamp(v: number, min: number, max: number): number {
        let rs;
        if (v < min) {
            rs = min;
        } else if (v > max) {
            rs = max;
        } else {
            rs = v;
        }
        return rs;
    }

    static randomInRange_iWithOutY(x: number, y: number, s = null): number {
        let rs;
        y = y-1;
        return this.randomInRange_i(x,y,s);
    }

    static lim = 1e-5;
    static randomInRange_f(x: number, y: number, s = null): number {
        let rs;
        let g = y - x;
        if (g < 0) {
            throw `x > y`;
        } else {
            if (g < TweenMgr.lim) {
                rs = x;
            } else {
                rs = g * (s == null ? Math.random() : s) + x;
            }
        }
        return Number(rs);
    }

    static randomInRange_i(x: number, y: number, s = null): number {
        let rs;
        if (x == y) {
            rs = x;
        } else if (y > x) {
            let v = (y - x) * (s == null ? Math.random() : s) + x;
            rs = v.toFixed();
        } else {
            throw `x > y`;
        }
        return Number(rs);
    }
}
