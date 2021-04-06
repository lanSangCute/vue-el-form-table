import { isFilter, mergeJSON } from "./utils";
// import {getPermisions} from "@utils";
import {formatting} from "./dataFormatting";
import lanjElPagination from '../lanjElPagination/lanjElPagination';
import functionRender from '../functionRender/functionRender';
const minWidth = 60;
export default {
    name:'lanjElTable',
    components:{
        lanjElPagination,
        functionRender
    },
    props: {
        // 是否需要分页，默认是
        pagination: {
            type: Boolean,
            default: true
        },
        // border
        border: {
            type: Boolean,
            default: true
        },
        // 接口
        services: {
            type: String
        },
        exts: {
            type: Array,
            default: function() {
                return [];
            }
        },
        align:{
            type:String,
            default:'center'
        },
        /**
         * 配置列数组
         *  [{
         *      label: '操作', 必填    列名称
         *      value: 'key1', 必填    数据中对应key
         *      width: '60',   非必填   单位px
         *      slot: 'slot1', 非必填  可选自定义插槽
         *      valueFun: function(row){},  非必填   重写函数，参数为当前行数据
         *      type: 'date|operate|render',  非必填   可选值： 'date' 'operate'
         *      format: 'yyyy-MM-dd H:mm'  非必填 type === date 时重写时间格式，可通过format自定义格式
         *      buttons: [{
         *              label: '详情',  // 按钮文字
         *              click: 'detailCallback', // 回掉函数， 参数为当前行数据
         *              conditionFun: function(row) {}  // return true|false  该按钮显示与否
         *          }]  非必填， type === 'operate' 时必填
         *  }]
         */
        tableColumn: {
            type: Array,
            default: function() {
                return [];
            }
        },
        importData: {
            type: Array // 使用外部tableData数据，
        },
        param: {
            type: Object,
            default: function() {
                return {};
            }
        },
        showEmptyImg: {
            type: Boolean,
            default: true
        },
        paramsHandle: {
            type: Function
        }, // 参数处理
        postHandle:{
            type: Function
        },
        dataFormatHandle: {
            type: Function
        }, // 数据处理
        // 是否初始化加载
        autoLoad: {
            type: Boolean,
            default: true
        },
        url: String
    },
    watch: {
        param(val) {
            this.queryParams = { ...val };
        }
    },
    computed: {
        // permission() {
        //     return function (config,type) {

        //         let tip = type === 'column' ? '列：' : '按钮：';
        //         if(config["permission"]){
        //             return config.permission;
        //         }
        //         if(config["key"]){
        //             const code = this.$route.name + '_' +config.key;
        //             return code;
        //         }else if(config['value']) {
        //             const code = this.$route.name + '_' +config.value;
        //             return code;
        //         }
        //         if(config["click"]){
        //             const code = this.$route.name + '_' +config.click;
        //             return code;
        //         }
        //         return "";
        //     };
        // },
        paginationInfo() {
            return {
                total: this.total,
                pager: this.pager,
                selected: this.selectList.length
            };
        },
        // 操作项留出宽度
        autoWith() {
            return function(options) {
                let width = minWidth;
                if (options && options.length > 0) {
                    width = options.length * 50;
                    return minWidth > width ? minWidth : width;
                }
                return 0;
            };
        },
        tableData() {
            return this.importData ? this.importData : this.dataSet;
        },
        // 功能控制 是否展示列
        // computedShowColumn() {
        //     return (permission) => {
        //         const permisisions= getPermisions(this);
        //         if(!permisisions || !Array.isArray(permisisions)) {
        //             return true;
        //         }
        //         return !permisisions.includes(permission);
        //     };
        // }
    },
    data() {
        return {
            queryParams: null,
            loading: false,
            total: 0, // 总数据量
            pager: {
                pageNo: 1,
                pageSize: 10
            },
            dataSet: [],
            selectList: [],
            speciaVal: {},
            radioSelect: null,
            lastQueryParams: null
        };
    },
    created() {
        if (this.autoLoad) {
            this.onQuery();
        }
    },
    methods: {
        // 清空表格项选择
        clearSelection(){
            let ref = this.$refs.refTable;
            ref && ref.clearSelection();
        },
        /**
         * @method 操作项按钮点击处理函数
         * @param {String} event
         * @param {Object} rowData
         */
        callBack(event, rowData) {
            event && this.$emit(event, rowData);
        },
        /**
         * @method 多选触发事件
         * @param {Array} selectList
         */
        selectionChange(selectList) {
            this.selectList = selectList || [];
            this.$emit("selection-change", selectList);
        },
        /**
         * @method 分页变化
         * @param {Object} data
         */
        comSelectChange(data) {
            this.pager = Object.assign(this.pager, data);
            this.onQuery({ pageChange: true });
        },
        /**
         * @method 按钮显示条件
         */
        btnCondition(btn, scope) {
            if (btn.conditionFun) {
                return btn.conditionFun.call(this, scope.row);
            }
            return true;
        },
        /**
         * @method 格式化表格数据
         */
        formatFun(data, row) {
            try{
                const column = isFilter(this.tableColumn, item => {
                    return item.value === row.property;
                });
                if (column["valueFun"]) {
                    return column.valueFun.call(this, data);
                }
                if (column["rewrite"]) {
                    return column.rewrite[data[row.property]];
                }
                if (column["type"] === "date") {
                    if(!data[row.property]){
                        return '--';
                    }
                    let format = column["format"];
                    return formatting(
                        new Date(data[row.property]),
                        format || "yyyy-MM-dd H:mm"
                    );
                }
                return data[row.property];
            }catch(e){
                return data[row.property];
            }
        },
        /**
         * @returns {Object}
         */
        getParam() {
            let params = mergeJSON(this.queryParams || this.param, {
                // start: (this.pager.pageNo - 1) * this.pager.pageSize,
                // limit: this.pager.pageSize,
                ...(this.pagination ? { page: this.pager } : {})
            });
            if (this.paramsHandle) {
                return this.paramsHandle(params);
            }
            // Object.keys(params).map(key=>{
            //     // 空字符串,null,undefined不传
            //     if(!params[key] && params[key] !== 0){
            //         delete params[key];
            //     }
            // });
            return params;
        },
        /**
         * @method 获取数据
         */
        onQuery({ pageChange = false } = {}) {
            return this.request({ pageChange: true });
        },
        setParam(param) {
            this.queryParams = param;
        },
        clearParam() {
            this.queryParams = {};
        },
        setPagerNumber(pagerNumber) {
            let pager = { pageNo: pagerNumber };
            this.pager = Object.assign({}, this.pager, pager);
        },
        getSelectList() {
            return this.selectList;
        },
        getFullData() {
            return {
                total: this.total,
                pager: this.pager,
                dataSet: this.dataSet,
                selectList: this.selectList
            };
        },
        /**
         * @method 获取table数据
         */
        async request({ pageChange = false } = {}) {
            if (!this.services) {
                return;
            }
            if (!pageChange) {
                this.setPagerNumber(1);
            }
            this.loading = true;
            const url = this.services,
                params = this.getParam();
            if (this.dataFormatHandle) {
                result = this.dataFormatHandle(result);
            } //表格数据格式化
            let result = await this.postHandle({
                url,
                data:params
            }).catch(err=>{
                this.loading = false;
                throw err;
            });

            // let result = await ocj
            //     .post({
            //         url: url,
            //         data: params
            //     })
            //     .catch(err => {
            //         this.loading = false;
            //         throw err;
            //     });
            this.lastQueryParams = params;
            this.loading = false;
            if (this.dataFormatHandle) {
                result = this.dataFormatHandle(result);
            } //表格数据格式化
            if (result && Array.isArray(result)) {
                this.dataSet = result || [];
                this.total = result.length || 0;
            } else {
                this.dataSet =
                    (result && result["results"]) ||
                    (result && result["data"]) ||
                    (result && result["list"]) ||
                    [];
                this.total = (result && result["total"]) || 0;
            }
            // 默认选中第一行
            // if (
            //     this.dataSet &&
            //     Array.isArray(this.dataSet) &&
            //     this.dataSet.length
            // ) {
            //     let ref = this.$refs.refTable;
            //     ref && ref.setCurrentRow(this.dataSet[0]);
            // }
            //处理表格数据
            this.$emit("data-change", this.getFullData());
        }
    }
};
