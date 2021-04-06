<template>
    <div
        ref="scorllContainer"
        class="light-little-scroll"
        style="overflow: auto;"
    >
        <slot></slot>
    </div>
</template>
<script>
const getOffsetByEl = (el, parent, offsetName = "offsetTop") => {
    parent = parent || document.documentElement;

    if (el.parentElement) {
        return el[offsetName] + getOffsetByEl(el.parent, parent, offsetName);
    }

    return 0;
};

export default {
    name: "com-scrollbar",
    methods: {
        // 滚动方法 position: 'top' | 'bottom' | el
        scrollTo(position = "top") {
            const scorllContainer = this.$refs.scorllContainer;
            try {
                if (position === "top") {
                    scorllContainer.scrollTop = 0;
                } else if (position === "bottom") {
                    scorllContainer.scrollTop = scorllContainer.scrollHeight;
                } else {
                    scorllContainer.scrollTop = getOffsetByEl(
                        position,
                        scorllContainer
                    );
                }
            } catch (err) {
                console.error("scrollTo error", err);
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.light-little-scroll {
    &::-webkit-scrollbar {
        width: 10px;
        height: 10px;
        background-color: transparent;
    }
    &::-webkit-scrollbar-track {
        background-color: transparent;
    }

    &:hover {
        &::-webkit-scrollbar-thumb {
            border-radius: 10px;
            background-color: rgba(144, 147, 153, 0.3);
        }
    }

    &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background-color: transparent;
    }
}
</style>
