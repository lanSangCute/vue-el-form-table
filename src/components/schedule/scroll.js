export class Scroll {
    constructor(containerEl, wrapperEl) {
        this.containerEl = containerEl;
        this.wrapperEl = wrapperEl;
    }
    handleScroll() {
        let wrapperWidth = 0;
        const containerWidth = this.containerEl.clientWidth;
        Array.prototype.forEach.call(this.wrapperEl.children, (i) => {
            wrapperWidth += i.offsetWidth;
        });
        const scrollWidth = wrapperWidth - containerWidth;
        this.unListen();
        if (scrollWidth > 0) {
            this.listenScroll(scrollWidth);
        }
    }
    unListen() {
        if (this.listener) {
            this.containerEl.removeEventListener("mousewheel", this.listener);
            this.listener = undefined;
        }
    }
    listenScroll(scrollWidth) {
        let preScrollPosition;
        this.listener = (e) => {
            e.stopPropagation();
            e.preventDefault();
            const scrollDis = 0 - e.wheelDelta;
            const scrollLeft = this.containerEl.scrollLeft;
            let targetLeft = scrollLeft + scrollDis;
            if (targetLeft > scrollWidth) {
                targetLeft = scrollWidth;
            }
            else if (targetLeft < 0) {
                targetLeft = 0;
            }
            if (targetLeft !== preScrollPosition) {
                this.containerEl.scrollTo(targetLeft, 0);
                preScrollPosition = targetLeft;
            }
        };
        this.containerEl.addEventListener("mousewheel", this.listener);
    }
}
//# sourceMappingURL=scroll.js.map