<template>
    <div class="component-configFilterTable h-100 w-100">
        <div v-if="title" class="text-20 title">{{ title }}</div>
        <lanj-el-form
            v-if="showFormFilter"
            ref="filterForm"
            :configs="filterFormConfig"
            :inline="filterInline"
            :label-width="filterLabelWidth"
            :label-suffix="labelSuffix"
            :col="filterCol"
            :label-position="labelPosition"
            :initFormData="initFormData"
            :form-item-class-name="formItemClassName"
            @changeOut="$emit('filter-changeOut', $event)"
            class="form-input-number"
        >
            <div
                v-if="showSearch && topRightOperationLine"
                slot="inline"
                class="d-inline-block line-height-40"
            >
                <el-button
                    type="primary"
                    :size="btnSize"
                    @click="operationHandle({ handle: 'query' })"
                >
                    {{ filterFormConfig ? "查询" : "刷新" }}
                </el-button>
                <el-button
                    v-if="filterFormConfig && showReset"
                    :size="btnSize"
                    @click="operationHandle({ handle: 'resetFilterForm' })"
                >
                    重置
                </el-button>
            </div>
        </lanj-el-form>
        <div
            v-if="
                showFormFilter &&
                    !(!hasTopOperationLeft && topRightOperationLine)
            "
            class="top-opertaions-container flex-ju-between mb-12"
        >
            <div class="left-operations-container d-block">
                <template v-if="hasTopOperationLeft">
                    <template v-for="operation in topOperation.left">
                        <el-button
                            v-if="operation.type !== 'render'"
                            :key="operation.key"
                            :type="operation.type || btnSize"
                            :icon="operation.icon"
                            :disabled="operation.disabled"
                            @click="operationHandle(operation)"
                        >
                            {{ operation.name }}
                        </el-button>
                        <function-render
                            v-else
                            :key="operation.key"
                            :render="operation.render"
                            :data="operation.data"
                        />
                    </template>
                </template>
                &nbsp;
            </div>
            <div
                v-if="showSearch && !topRightOperationLine"
                class="right-operations-container d-block"
            >
                <el-button
                    type="primary"
                    :size="btnSize"
                    @click="operationHandle({ handle: 'query' })"
                >
                    {{ filterFormConfig ? "查询" : "刷新" }}
                </el-button>
                <el-button
                    v-if="filterFormConfig && showReset"
                    :size="btnSize"
                    @click="operationHandle({ handle: 'resetFilterForm' })"
                >
                    重置
                </el-button>
            </div>
        </div>
        <!-- 需要添加的其他信息 比如tab -->
        <slot></slot>
        <div v-if="showRequestNum" class="tip-container radius-4 mb-12">
            <i class="el-icon-info tip-icon color-blue" />
            <span class="tip-text">
                共查询到 {{ tableData.total || "-" }} 条数据
                <span v-if="hasSelection">，已选择
                    <span class="color-blue">{{ selectionList.length }}</span>
                    条数据
                </span>
            </span>
        </div>
        <lanj-el-table
            ref="table"
            :table-column="tableColumn"
            :param="filteData"
            :services="services"
            :data-format-handle="dataFormatHandle"
            :pagination="pagination"
            :highlight-current-row="highlightCurrentRow"
            :row-class-name="rowClassName"
            :span-method="spanMethod"
            :border="tableBorder"
            :import-data="importData"
            :height="height"
            :auto-load="autoLoad"
            :postHandle="postHandle"
            :paramsHandle="paramsHandle"
            v-bind="tableProps"
            @selection-change="tableSelectionChangeHandle"
            @data-change="tableDataChange"
            @current-change="tableCurrentChangeHandle"
            v-on="$listeners"
        >
            <template #expand="{row}">
                <slot v-bind="{ row }" name="expand"></slot>
            </template>
        </lanj-el-table>
    </div>
</template>
<style scoped lang="scss" src="./lanjElFormTable.scss"></style>
<style scoped lang="scss" src="../../style/index.scss"></style>
<script src="./lanjElFormTable.js"></script>
<style lang="scss">
.component-configFilterTable {
    .el-table th.gutter {
        display: table-cell !important;
    }
}
</style>
