<template>
    <div class="component-configTable">
        <slot name="head" v-bind="paginationInfo"> </slot>
        <el-table
            ref="refTable"
            v-loading="loading"
            v-bind="$attrs"
            :data="tableData"
            :border="border"
            size="small"
            style="width: 100%"
            :height="$attrs.height"
            highlight-current-row
            v-on="$listeners"
            @selection-change="selectionChange"
        >
            <template
                v-if="showEmptyImg"
                slot="empty"
                class="flex-ju-al-center"
            >
                <img class="my-24" src="./noContent.svg" alt />
            </template>
            <template v-for="(cln, index) in tableColumn">
                <template v-if="cln.type == 'select'">
                    <el-table-column
                        :key="index"
                        :prop="cln.value"
                        type="selection"
                        :width="cln.width || 36"
                        :selectable="cln.selectable"
                    ></el-table-column>
                </template>
                <template v-else-if="cln.type === 'radio'">
                    <el-table-column
                        :key="cln.id || cln.value || 'radio'"
                        :prop="cln.value"
                        :width="cln.width || 36"
                        :align="cln.align || align"
                    >
                        <template slot-scope="scope">
                            <el-radio v-model="radioSelect" :label="scope.row">
                                &nbsp;&nbsp;-
                            </el-radio>
                        </template>
                    </el-table-column>
                </template>
                <template v-else-if="cln.type == 'index'">
                    <el-table-column
                        :key="index"
                        :label="'序号'"
                        align="center"
                        type="index"
                        :prop="cln.value"
                        width="50"
                    ></el-table-column>
                </template>
                <template v-else-if="cln.type == 'operate'">
                    <el-table-column
                        :key="cln.id || ''"
                        :prop="cln.value"
                        fixed="right"
                        :label="cln.label"
                        :width="cln.width || autoWith(cln.buttons)"
                        :class-name="cln.className"
                         :align="cln.align || align"
                    >
                        <template slot-scope="scope">
                            <template v-for="btn in cln.buttons">
                                <el-button
                                    v-if="btnCondition(btn, scope)"
                                    :key="btn.click"
                                    size="small"
                                    :class="btn.className"
                                    type="text"
                                    @click="callBack(btn.click, scope.row)"
                                >
                                    {{ btn.label }}
                                </el-button>
                            </template>
                        </template>
                    </el-table-column>
                </template>
                <template v-else-if="cln.type === 'render' && cln.render">
                    <el-table-column
                        :key="cln.id || cln.value || ''"
                        :label="cln.label"
                        :prop="cln.value"
                        :sortable="cln.sortable"
                        :fixed="cln.fixed"
                        :width="cln.width || autoWith(cln.buttons)"
                        :class-name="cln.className"
                        :align="cln.align || align"
                        :show-overflow-tooltip="cln.label!=='操作'"
                    >
                        <template slot-scope="scope">
                            <function-render
                                :render="cln.render"
                                :data="{
                                    row: scope.row,
                                    column: cln,
                                    index: scope.$index
                                }"
                            />
                        </template>
                    </el-table-column>
                </template>
                <template v-else>
                    <el-table-column
                        :key="'otable' + index"
                        :prop="cln.value"
                        :label="cln.label"
                        :sortable="cln.sortable"
                        :type="cln.type === 'expand' ? 'expand' : ''"
                        :width="cln.width"
                        :align="cln.align || align"
                        :class-name="cln.className"
                        :formatter="formatFun"
                        show-overflow-tooltip
                    >
                        <template v-if="cln.header" #header="scope">
                            <slot v-bind="scope" :name="cln.header"></slot>
                        </template>
                        <template v-if="cln.slot" #default="scope">
                            <slot v-bind="scope" :name="cln.slot"></slot>
                        </template>
                    </el-table-column>
                </template>
            </template>
        </el-table>
        <!-- 加form表单disabled-false，保证在表单的列表不受表单的状态影响 -->
        <el-form :disabled="false">
            <lanj-el-pagination
                v-if="pagination"
                :page="pager"
                :total="total"
                @change="comSelectChange"
            />
            <slot name="foot" v-bind="paginationInfo"> </slot>
        </el-form>
    </div>
</template>
<script src="./lanjElTable.js"></script>
