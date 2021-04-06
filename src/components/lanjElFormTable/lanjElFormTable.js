class DebounceTime {
    constructor(time) {
        this.timer = null;
        this.time = time || 1000 * 0.5;
    }
    run(cb) {
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(cb, this.time);
    }
}
import lanjElForm from '../lanjElForm/lanjElForm.vue';
import lanjElTable from '../lanjElTable/lanjElTable.vue';
import functionRender from '../functionRender/functionRender';
export default {
    components:{
        lanjElForm,
        lanjElTable,
        functionRender
    },
    name: "lanjElFormTable",
    props: {
        formItemClassName:{ type: String, default: "" },
        initFormData: { type: Object },
        title: String,
        filterFormConfig: Array,
        topOperation: Object,
        topRightOperataurionLine: {
            type: Boolean,
            default: false
        },
        labelSuffix: { type: String, default: "" },
        showReset:{
            type:Boolean,
            default:true,
        },
        btnSize:{
            type:String,
            default:'medium'
        },
        showSearch: {
            // 是否展示查询和重置按钮
            type: Boolean,
            default: true
        },
        resetSearch:{
            type: Boolean,
            default: true
        },
        height: {
            //表格高度
            type: String
        },
        tableColumn: Array,
        queryHandle: Function,
        services: String,
        params: Object,
        postHandle:{
            type: Function
        },
        searchEmit:{
            type:Boolean,
            default:false
        },//默认查询按钮点击查询，特殊情况（比如附加查询条件不满足时，查询前逻辑由页面单独操作
        dataFormatHandle: Function,
        filterLabelWidth: { type: String | Number, default: "" },
        filterCol: Number,
        filterInline: {
            default: true,
            type: Boolean
        },
        labelPosition: String,
        pagination: {
            type: Boolean,
            default: true
        },
        showFormFilter: {
            type: Boolean,
            default: true
        },
        highlightCurrentRow: {
            type: Boolean,
            default: false
        },
        rowClassName: {
            type: Function
        },
        showRequestNum: {
            type: Boolean,
            default: true
        },
        spanMethod: {
            type: Function
        },
        importData: {
            type: Array // 使用外部tableData数据，
        },
        paramsHandle: {
            type: Function
        }, // 参数处理
        tableBorder: {
            type: Boolean,
            default: true
        },
        tableProps: {
            type: Object,
            default: () => ({})
        },
        autoLoad: {
            type: Boolean,
            default: true
        },
        queryDataHandle: Function
    },
    data() {
        return {
            debounce: new DebounceTime(), //查询按钮debounce
            onQueryFilterData: null,
            selectionList: [],
            filteData: { ...this.params },
            stringHandleMap: {
                resetFilterForm: () => {
                    this.resetFilterForm();
                },
                query: () => {
                    this.filterFormQueryHandle();
                },
                querys: () => {//和searchEmit查询区分
                    this.filterFormQueryHandle();
                }
            },
            handleArgumentMap: {
                batchSelected: () => {
                    return this.selectionList;
                },
                filterForm: () => {
                    return this.filteData;
                }
            },
            tableData: {}
        };
    },
    computed: {
        hasSelection() {
            return Boolean(
                (this.tableColumn || []).filter(v => v.type === "select").length
            );
        },
        hasTopOperationLeft() {
            return (
                this.topOperation &&
                this.topOperation.left &&
                this.topOperation.left.length
            );
        }
    },
    methods: {
        operationHandle(operation = {}) {
            let handleArguments = [];

            if (
                operation.requireArguments &&
                operation.requireArguments.length
            ) {
                (operation.requireArguments || []).map(argumentItem => {
                    handleArguments.push(
                        this.handleArgumentMap[argumentItem]()
                    );
                });
            }

            if (operation.handle) {
                if (typeof operation.handle === "string") {
                    if(operation.handle === 'query' && this.searchEmit){
                        return this.$emit('searchEmit');
                    }
                    return this.stringHandleMap[operation.handle](
                        ...handleArguments
                    );
                } else if (typeof operation.handle === "function") {
                    return operation.handle(...handleArguments);
                }
            }
        },
        setFormData(data){
            let ref = this.$refs.filterForm;
            ref && ref.setFormData(data);
        },
        resetFilterForm() {
            this.$refs.filterForm.resetFields();
            if(this.resetSearch){
                this.filterFormQueryHandle();
            }
        },
        getFormData(){
            let ref = this.$refs.filterForm;
            return ref && ref.getHandleFormData();
        },
        async filterFormQueryHandle() {
            let success = await new Promise(resovle =>{
                let ref = this.$refs.filterForm;
                ref && ref.validate(success => {
                    if (success) {
                        resovle(true);
                    } else {
                        resovle(false);
                    }
                });
            });

            if (!success) {
                return;
            }
            var formData = {
                ...this.$refs.filterForm.formData,
                ...this.params
            };

            (this.$refs.filterForm.configData || []).map(item => {
                const key = item.key;

                if (!formData[key] && formData[key] !== 0) {
                    delete formData[key];
                }

                if (typeof formData[key] === "string") {
                    formData[key] = formData[key].trim();
                }

                if (
                    formData[key] &&
                    (item.type === "daterange" ||
                        item.type === "datetimerange") &&
                    item.keyRange
                ) {
                    let timeFormat =
                        item.timeFormat ||
                        (item.type === "datetimerange"
                            ? "yyyy-MM-dd hh:mm:ss"
                            : "yyyy-MM-dd");
                    formData[item.keyRange[0]] = formData[key][0].currentFormat(
                        timeFormat
                    );
                    formData[item.keyRange[1]] = formData[key][1].currentFormat(
                        timeFormat
                    );
                    delete formData[key];
                }
            });

            if (this.queryDataHandle) {
                formData = this.queryDataHandle(formData);
            }

            this.filteData = formData;

            this.$nextTick(() => {
                this.refetch();
            });
        },
        refetch() {
            this.debounce.run(() => this.$refs.table&&this.$refs.table.request());
            // this.$refs.table.request();
        },
        tableSelectionChangeHandle(list) {
            this.selectionList = list;
        },
        tableDataChange(data) {
            this.tableData = data;
        },
        tableCurrentChangeHandle(currentRow, oldCurrentRow) {
            this.$emit("current-change", currentRow, oldCurrentRow);
        },
        getLastQueryParams() {
            return this.$refs.table.lastQueryParams;
        },
        getRadioSelect() {
            return this.$refs.table.radioSelect;
        }
    }
};
