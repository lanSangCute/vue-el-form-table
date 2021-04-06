<!-- eslint-disable max-lines -->
<template>
    <span class="component-customerDialog" @click="show">
        <slot></slot>
        <div
            v-if="minimizable"
            v-show="minimizeSign"
            ref="minimizeBlock"
            class="minimizeBlock"
            @click="stopPropagation($event)"
        >
            {{ title }}
            <div class="el-icon-copy-document minimize-button" style="right: 27px;" @click="resizeMinimize"></div>
            <div class="el-icon-close minimize-button" @click="closeMinimize"></div>
        </div>
        <!-- v-show="!minimizable || (minimizable && !minimizeSign)" -->
        <el-dialog
            v-if="visible || (minimizable && minimizeSign)"
            ref="dialog"
            class="m-dialog--comDialog"
            :custom-class="className"
            :title="title"
            :visible="!minimizable || (minimizable && !minimizeSign)"
            append-to-body
            :width="width"
            :before-close="willClose"
            :top="top"
            :close-on-click-modal="closeOnClickModal"
            :close-on-press-escape="closeOnPressEscape"
            :show-close="showClose"
            @close="close"
        >
            <div v-if="autoScroll">
                <component
                    :is="component"
                    v-if="showSelfComponent"
                    @closeDialog="close"
                ></component>
                <slot name="body" :close="close"></slot>
            </div>
            <!-- <com-scrollbar
                v-if="autoScroll"
                class="m-scroll--comDialog hiddenX"
                :style="scrollStyle"
            >
                <component
                    :is="component"
                    v-if="showSelfComponent"
                    @closeDialog="close"
                ></component>
                <slot name="body" :close="close"></slot>
            </com-scrollbar> -->
            <div v-else :style="scrollStyle">
                <slot name="body" :close="close"></slot>
            </div>
            <template slot="footer">
                <slot name="footer"></slot>
            </template>
        </el-dialog>
        <span v-show="false">{{ updateDrag() }}{{ updateMinimize() }}</span>
    </span>
</template>

<script>
import _ from "lodash";
import { Dragable } from "./dragable";
const isFunction = f => typeof f === "function";
export default {
    name: "lanjElDialog",
    props: {
        width: {
            type: String,
            default: "50%"
        },
        top: {
            type: String,
            default: "5vh"
        },
        height: {
            type: String // vh,px, 'auto' 1.不传默认75vh，2.传auto：自适，3.高度
        },
        className: {
            type: String
        },
        component: {
            // 加载哪个组件,可传全局组件或者通过slot
            type: String
        },
        title: {
            // 弹窗标题
            type: String,
            default: "详情"
        },
        beforeClose: {
            type: Function
        },
        beforeShow: {
            type: Function
        },
        scrollClassName: String,
        closeOnClickModal: { type: Boolean, default: false },
        closeOnPressEscape: { type: Boolean, default: true },
        showClose: { type: Boolean, default: true },
        autoScroll: { type: Boolean, default: true },
        autoShow: {
            type: Boolean,
            default: false
        },
        dragable: {
            type: Boolean,
            default: true
        },
        minimizable: Boolean
    },
    data() {
        return {
            visible: false,
            minimizeSign: false,
            showSelfComponent: false,
            // drawSet: {}
            windowDragable: new Dragable(),
            minimizeDragable: new Dragable(),
        };
    },
    computed: {
        scrollStyle() {
            let ret = {};
            if (this.height) {
                ret.height = this.height;
            }
            return ret;
        }
    },
    created() {
        if (this.component && !this.$slots.body) {
            this.showSelfComponent = true;
        }
    },
    mounted() {
        if (this.autoShow) {
            this.$nextTick(() => {
                this.show();
            });
        }
    },
    methods: {
        stopPropagation(e) {
            e.stopPropagation();
        },
        show() {
            if (isFunction(this.beforeShow) && !this.beforeShow()) {
                return;
            }
            this.minimizeSign = false,
            this.visible = true;
            this.$emit('show');
        },
        close() {
            this.visible = false;
            this.$emit("close");
            if(!this.minimizeSign) {
                this.lastWindowOffset = null;
            }
        },
        willClose(done) {
            if (isFunction(this.beforeClose) && !this.beforeClose()) {
                return;
            }
            done();
        },
        getDialogZIndex() {
            return parseInt(_.get(this, '$refs.dialog.$el.style.zIndex'), 10);
        },
        async updateDrag() {
            if (!this.dragable) {
                return;
            }
            let dialogElement = _.get(this, "$refs.dialog.$el");
            if (!dialogElement) {
                await new Promise(resolve => this.$nextTick(resolve));
                dialogElement = _.get(this, "$refs.dialog.$el");
                if (!dialogElement) {
                    this.windowDragable.destroy();
                    return;
                }
            }
            let containerElement = dialogElement.querySelector(".el-dialog");
            let headerElement = dialogElement.querySelector(
                ".el-dialog__header"
            );

            if (this.windowDragable.dragElement !== dialogElement) {
                this.windowDragable.init({
                    dragElement: headerElement,
                    onUpdate: ({
                        offsetX,
                        offsetY
                    }) => {
                        containerElement.style.transform = `translate(${
                            offsetX
                        }px, ${offsetY}px)`;
                        this.lastWindowOffset = {
                            offsetX,
                            offsetY
                        };
                    },
                    initPosition: this.lastWindowOffset
                });
            }
            headerElement.style.cursor = "move";
            if (dialogElement.clientWidth >= containerElement.clientWidth) {
                dialogElement.style.overflowX = "hidden";
            }
        },
        resizeMinimize() {
            this.visible = true;
            this.minimizeSign = false;
        },
        closeMinimize() {
            this.minimizeSign = false;
            this.close();
        },
        async updateMinimize() {
            if (!this.minimizable) {
                return;
            }

            let dialogElement = _.get(this, "$refs.dialog.$el");
            if (!dialogElement) {
                await new Promise(resolve => this.$nextTick(resolve));
                dialogElement = _.get(this, "$refs.dialog.$el");
                if (!dialogElement) {
                    this.minimizeDragable.destroy();
                    return;
                }
            }
            let containerElement = dialogElement.querySelector(".el-dialog");
            let headerElement = dialogElement.querySelector(
                ".el-dialog__header"
            );

            let minimizeButton = headerElement.querySelector(".minimizeButton");

            if(!minimizeButton) {
                minimizeButton = document.createElement('div');
                minimizeButton.className = 'minimizeButton el-icon-minus';
                headerElement.appendChild(minimizeButton);
                minimizeButton.onclick = () => {
                    this.minimizeSign = true;
                };
            }

            if(!this.minimizeSign) {
                return;
            }

            let minimizeBlockElement = this.$refs.minimizeBlock;
            if (!minimizeBlockElement) {
                await new Promise(resolve => this.$nextTick(resolve));
                minimizeBlockElement = _.get(this, "$refs.minimizeBlock");
                if (!minimizeBlockElement) {
                    this.minimizeDragable.destroy();
                    return;
                }
            }


            if (this.minimizeDragable.dragElement !== minimizeBlockElement) {
                this.minimizeDragable.init({
                    dragElement: minimizeBlockElement,
                    onUpdate: ({
                        offsetX,
                        offsetY
                    }) => {
                        minimizeBlockElement.style.transform = `translate(${
                            offsetX
                        }px, ${offsetY}px)`;
                        this.lastMinimizeOffset = {
                            offsetX,
                            offsetY
                        };
                    },
                    initPosition: this.lastMinimizeOffset
                });
            }

            // this.minimizeDragable.emitOffset();
        }
    }
};
</script>

<style scoped lang="scss">
.com-height {
    height: 75vh;
}
.minimizeBlock {
    position: fixed;
    left: 20px;
    bottom: 20px;
    background-color: #273a5b;
    padding: 10px;
    min-width: 100px;
    padding-right: 50px;
    border-radius: 4px;
    color: #fff;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    z-index: 1000;
    cursor: move;

    .minimize-button {
        position: absolute;
        top: 13px;
        right: 5px;
        cursor: pointer;
    }
}
</style>

<style lang="scss">
.el-dialog__header {
    .minimizeButton {
        position: absolute;
        top: 24px;
        right: 60px;
        padding: 0;
        background: transparent;
        border: none;
        outline: none;
        cursor: pointer;
        font-size: 16px;
        color: #fff;
    }
}
</style>