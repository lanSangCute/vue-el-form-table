<template>
    <el-pagination
        v-bind="$attrs"
        :current-page="pager.pageNo"
        :page-size="pager.pageSize"
        layout="total, prev, pager, next, sizes, jumper"
        class="flex-ju-end mt-20"
        @size-change="$onSizeChange"
        @current-change="$onCurrentChange"
        v-on="$listeners"
    >
    </el-pagination>
</template>
<script>
export default {
    name: 'lanjElPagination',
    props: {
        page: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            pager: {
                pageNo: 1,
                pageSize: 10
            }
        };
    },
    watch: {
        page(val) {
            this.pager = val;
        }
    },
    methods: {
        // 分页
        $onSizeChange(val) {
            this.pager.pageSize = val;
            this.pager.pageNo = 1;
            this.$emit('change', this.pager);
        },
        $onCurrentChange(val) {
            this.pager.pageNo = val;
            this.$emit('change', this.pager);
        }
    }
};
</script>
