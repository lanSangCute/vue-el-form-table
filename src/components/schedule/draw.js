/**
 * 图形绘制
 */
export class Draw {
    drawLine(x, y, containerDom) {
        const spanLine = document.createElement("span");
        spanLine.style.left = `${x}px`;
        spanLine.style.top = `${y}px`;
        spanLine.classList.add("draw-line");
        containerDom.appendChild(spanLine);
    }
    getRGBFromHex(hashValue) {
        let p;
        let rgb = [];
        if (hashValue.startsWith("#"))
            hashValue = hashValue.slice(1);
        for (let i = 0; i < 3; i++) {
            p = hashValue.slice(i * 2, i * 2 + 2);
            rgb.push(parseInt(p, 16));
        }
        return rgb;
    }
    getColor([r, g, b]) {
        return `rgb(${r},${g},${b})`;
    }
    deepColor([r, g, b], percent) {
        return this.getColor([this.deep(r, percent), this.deep(g, percent), this.deep(b, percent)]);
    }
    lightColor([r, g, b], percent) {
        return this.getColor([this.light(r, percent), this.light(g, percent), this.light(b, percent)]);
    }
    deep(v, percent) {
        const value = (1 - percent) * v;
        return Math.round(value < 0 ? 0 : value);
    }
    light(v, percent) {
        const value = (1 + percent) * v;
        return Math.round(value > 255 ? 255 : value);
    }
}
//# sourceMappingURL=draw.js.map