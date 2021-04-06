<template>
    <el-popover
        :placement="placement"
        :width="computedWidth"
        :trigger="trigger"
        :disabled="disabled"
        :transition="transition"
        :visible-arrow="visibleArrow"
        :popper-options="popperOptions"
        popper-class="popover"
        :open-delay="openDelay"
        :tabindex="tabindex"
        v-model="popoverVisible"
        @show="$comShow"
        @after-enter="$comAfterEnter"
        @hide="$comHide"
        @after-leave="$comAfterLeave"
    >
        <div v-if="title" class="flex-al-center text-16 text-weight-bold color-dark mb-8">
            <i v-if="showIcon" class="o-icon mr-8" :class="icon.iconClass" v-html="icon.iconHtml"></i>
            <span>{{ title }}</span>
        </div>
        <slot name="content">
            <div class="text-14">
                {{ content }}
            </div>
        </slot>
        <div class="popover-footer text-right mt-16" v-if="showFooter">
            <el-button v-if="showCancelBtn" class="border-outline bg-white" size="mini" @click="$onCancel">取消</el-button>
            <el-button type="primary" size="mini" :class="typeClass" @click="$onOk">确定</el-button>
        </div>
        <span class="d-inline-block" slot="reference">
            <slot></slot>
        </span>
    </el-popover>
</template>
<script>
export default {
    name: 'lanjElPopover',
    props: {
        // 触发方式
        trigger: {
            type: String,
            default: 'click',
            validator: value => ['click', 'focus', 'hover'].indexOf(value) > -1
        },
        // 内容
        content: String,
        // 宽度
        width: {
            type: [String, Number],
            default: 249
        },
        // 标题
        title: String,
        // 定位
        placement: {
            type: String,
            default: 'bottom'
        },
        // 是否禁用
        disabled: {
            type: Boolean,
            default: false
        },
        // 偏移
        offset: {
            type: Number,
            default: 0
        },
        // 动画
        transition: {
            type: String,
            default: 'fade-in-linear'
        },
        visibleArrow: {
            type: Boolean,
            default: true
        },
        popperOptions: {
            type: Object,
            default: () => {
                return {
                    boundariesElement: 'body',
                    gpuAcceleration: false
                };
            }
        },
        popperClass: String,
        openDelay: Number,
        tabindex: {
            type: Number,
            default: 0
        },
        // 新增属性
        // 展示底部按钮
        showFooter: {
            type: Boolean,
            default: true
        },
        // 是否展示取消按钮
        showCancelBtn: {
            type: Boolean,
            default: true
        },
        // 对应icon类型
        type: {
            type: String,
            default: 'primary',
            validator: value => ['primary', 'success', 'error', 'warning'].indexOf(value) > -1
        },
        // 是否展示icon
        showIcon: {
            type: Boolean,
            default: true
        },
        value: {
            type: Boolean,
            default: null
        },
        beforeOk: {
            type: Function,
            default: null
        }
    },
    data() {
        return {
            ocjVisible: false
        };
    },
    computed: {
        // 计算宽度
        computedWidth() {
            if (this.width > 150) {
                return this.width;
            }
            return 150;
        },
        popoverVisible: {
            get() {
                return this.ocjVisible;
            },
            set(val) {
                if (this.value !== null) {
                    this.ocjVisible = this.value;
                } else {
                    this.ocjVisible = val;
                }
            }
        },
        // 根据所传type显示icon
        icon() {
            let obj = {};
            if (this.showIcon) {
                if (this.type === 'primary') {
                    obj = {
                        iconClass: 'color-primary',
                        iconHtml: '&#xe718;'
                    };
                } else if (this.type === 'error') {
                    obj = {
                        iconClass: 'color-danger',
                        iconHtml: '&#xe714;'
                    };
                } else if (this.type === 'warning') {
                    obj = {
                        iconClass: 'color-warning',
                        iconHtml: '&#xe710;'
                    };
                } else if (this.type === 'success') {
                    obj = {
                        iconClass: 'color-success',
                        iconHtml: '&#xe720;'
                    };
                }
            }
            return obj;
        },
        // 根据所传type给予popover一个class名
        typeClass() {
            return [`popover-${this.type}`];
        }
    },
    watch: {
        value(val) {
            this.popoverVisible = val;
        }
    },
    created() {},
    mounted() {},
    methods: {
        // 取消事件
        $onCancel() {
            this.ocjVisible = false;
            this.$emit('cancel');
        },
        // 确认事件
        $onOk() {
            if (typeof this.beforeOk === 'function') {
                if (this.beforeOk() === false) {
                    return false;
                }
            }
            this.ocjVisible = false;
            this.$emit('ok');
        },
        // popover组件显示事件回传
        $comShow() {
            this.ocjVisible = true;
            this.$emit('show');
        },
        $comAfterEnter() {
            this.$emit('after-enter');
        },
        // popover组件隐藏事件回传
        $comHide() {
            this.ocjVisible = false;
            this.$emit('hide');
        },
        $comAfterLeave() {
            this.$emit('after-leave');
        }
    }
};
</script>
