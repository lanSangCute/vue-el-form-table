import { countY, body_height } from "./setting";
import { Draw } from "./draw";
export default class dataHandler extends Draw {
    constructor(items, xList, signalEl, paletteEl, colorController) {
        super();
        this.allMinutes = 0; //Y轴总时长
        this.yStart = 0;
        this.yEnd = 0;
        this.yTotal = 0;
        this.yCoorList = []; //Y轴 坐标轴刻度 list
        this.paletteLines = []; //画板线 list
        this.signalList = [];
        this.paletteItems = [];
        this.items = items;
        this.xList = xList;
        this.signalEl = signalEl;
        this.paletteEl = paletteEl;
        this.colorController = colorController;
    }
    /**
     * 获得单位y轴值
     * @param pos
     */
    getYItemPos(pos) {
        const [m, s = 0] = pos;
        return m * 60 + s;
    }
    /**
     * 设置Y轴开始值，结束值，总值
     * 设置各分断值
     *
     * Item startMinute endMinute 赋值
     */
    setYTotal() {
        let vStart = 0;
        let vEnd = 0;
        let start = 0, end = 0;
        for (let i of this.items) {
            vStart = this.getYItemPos(i.startTuple);
            vEnd = this.getYItemPos(i.endTuple);
            if (start == 0 || vStart < start)
                start = vStart;
            if (vEnd > end)
                end = vEnd;
            // item 新增属性
            i["startMinute"] = vStart;
            i["endMinute"] = vEnd;
            i["totalMinute"] = vEnd - vStart;
        }
        this.yStart = start;
        this.yEnd = end;
        this.yTotal = end - start;
        const per = Math.round(this.yTotal / countY);
        const corYCount = countY;
        for (let i = 0; i < corYCount; i++) {
            this.yCoorList.push(per * i);
        }
    }
    /**
     * 画板计算
     */
    paletteCal() {
        /**
         *  paletteItems
         */
        this.paletteItems = this.xList.map((i) => ({
            index: i.index,
            items: [],
            title: i.title
        }));
        const per = body_height / this.yTotal; //每分钟占据像素值
        let v;
        //计算线标
        for (let lineY of this.yCoorList) {
            v = lineY * per;
            this.paletteLines.push(v);
            this.signalList.push({
                top: v,
                value: lineY
            });
        }
        //计算card
        for (let i of this.items) {
            i['startPixel'] = i['startMinute'] && (i['startMinute'] - this.yStart) * per;
            i['endPixel'] = i['endMinute'] && (i['endMinute'] - this.yStart) * per;
            const paletteItem = this.paletteItems.find((p) => p.index == i.positionIndex);
            if (paletteItem) {
                paletteItem.items.push(i);
            }
            //颜色控制
            const iRGB = this.getRGBFromHex(this.colorController(i.totalMinute));
            i['color'] = this.getColor(iRGB);
            i['colorDeep'] = this.deepColor(iRGB, 0.4);
            i['colorLight'] = this.lightColor(iRGB, 0.1);
            i['colorDes'] = this.deepColor(iRGB, .2);
        }
    }
    coordinateCal() {
        this.setYTotal();
        this.paletteCal();
    }
}
//# sourceMappingURL=lib.js.map