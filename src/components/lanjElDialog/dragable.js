const getElementPosition = el => {
    let offset = {
        top: el.offsetTop,
        left: el.offsetLeft,
        width: el.offsetWidth,
        height: el.offsetHeight
    };
    while (el && el.offsetParent) {
        el = el.offsetParent;
        offset.top = offset.top + el.offsetTop;
        offset.left = offset.left + el.offsetLeft;
    }

    return offset;
};

export class Dragable {
    constructor() {
        this.drawSet = {};
    }

    mousedownHandle = e => {
        this.drawSet.startX = e.pageX;
        this.drawSet.startY = e.pageY;
        this.drawSet.initOffsetX = this.drawSet.offsetX || 0;
        this.drawSet.initOffsetY = this.drawSet.offsetY || 0;
        this.drawSet.onMove = true;
        this.drawSet.tempStyleUserSelect =
            document.documentElement.style.userSelect;
        document.documentElement.style.userSelect = "none";
    };
    mousemoveHandle = e => {
        if (!this.drawSet.onMove) {
            return;
        }

        this.drawSet.offsetX =
            e.pageX - this.drawSet.startX + this.drawSet.initOffsetX;
        this.drawSet.offsetY =
            e.pageY - this.drawSet.startY + this.drawSet.initOffsetY;

        this.emitOffset();
    };
    mouseupHandle = e => {
        this.drawSet.onMove = false;
        document.documentElement.style.userSelect =
            this.drawSet.tempStyleUserSelect || "auto";
    };

    init({ dragElement, onUpdate, initPosition }) {
        this.onUpdate = onUpdate;
        this.dragElement = dragElement;

        if (initPosition) {
            this.drawSet.offsetX = initPosition.offsetX;
            this.drawSet.offsetY = initPosition.offsetY;
        } else {
            this.drawSet.offsetX = 0;
            this.drawSet.offsetY = 0;
        }

        this.drawSet.unbindHandle && this.drawSet.unbindHandle();

        dragElement.addEventListener("mousedown", this.mousedownHandle);
        document.documentElement.addEventListener(
            "mousemove",
            this.mousemoveHandle
        );
        document.documentElement.addEventListener(
            "mouseup",
            this.mouseupHandle
        );
        this.drawSet.unbindHandle = () => {
            dragElement.removeEventListener("mousedown", this.mousedownHandle);
            document.documentElement.removeEventListener(
                "mousemove",
                this.mousemoveHandle
            );
            document.documentElement.removeEventListener(
                "mouseup",
                this.mouseupHandle
            );
            document.documentElement.style.userSelect =
                this.drawSet.tempStyleUserSelect || "auto";
        };
    }

    destroy() {
        this.drawSet.unbindHandle && this.drawSet.unbindHandle();
    }

    getOffset() {
        const borderOffset = 15;
        let offsetX = this.drawSet.offsetX;
        let offsetY = this.drawSet.offsetY;

        let elementOffset = getElementPosition(this.dragElement);

        if (
            offsetX + elementOffset.left + elementOffset.width >
            document.documentElement.clientWidth - borderOffset
        ) {
            offsetX =
                document.documentElement.clientWidth -
                borderOffset -
                elementOffset.left -
                elementOffset.width;
        }
        if (offsetX + elementOffset.left < borderOffset) {
            offsetX = borderOffset - elementOffset.left;
        }

        if (
            offsetY + elementOffset.top + elementOffset.height >
            document.documentElement.clientHeight - borderOffset
        ) {
            offsetY =
                document.documentElement.clientHeight -
                borderOffset -
                elementOffset.top -
                elementOffset.height;
        }
        if (offsetY + elementOffset.top < borderOffset) {
            offsetY = borderOffset - elementOffset.top;
        }

        this.drawSet.offsetX = offsetX;
        this.drawSet.offsetY = offsetY;

        return {
            offsetX,
            offsetY
        };
    }

    emitOffset() {
        this.onUpdate(
            this.getOffsetHandle
                ? this.getOffsetHandle(this.drawSet)
                : this.getOffset()
        );
    }
}
