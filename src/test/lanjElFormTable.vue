<template>
    <div>
        <div class="flex-ju-between">eee</div>
        <lanj-el-form-table
            ref="filterTable"
            :show-request-num="false"
            :filter-form-config="formConfig"
            :table-column="tableColumn"
            :paramsHandle="paramsHandle"
            :params="{}"
            :filter-col="2"
            :filter-inline="false"
            :postHandle="postHandle"
            :tableProps="{
                align:'right'
            }"
            btn-size="small"
            :import-data="tableData"
            form-item-class-name="mb-12"
            filter-label-width="80px"
            label-position="left"
            @row-click="rowClick"
        />
    </div>
</template>

<script lang="ts">
import { CreateElement } from 'vue';
import { Component, Vue } from 'vue-property-decorator';
import lanjElFormTable from "../components/lanjElFormTable/lanjElFormTable.vue";
import { formItem } from "../components/lanjElForm/interface";

@Component({
    components: {
        lanjElFormTable,
    },
})
export default class App extends Vue {
    postHandle=(url:string,data:any)=>{
        console.log('ddddd');
        return new Promise((r,j)=>{
            let res:any = {data:[],total:3};
            r(res.data)
        })
    }
    paramsHandle=(params:any)=>{
        console.log(params,'lanjuan')
        return {
            
        }
    }
    tableData = [
        {ernestMoney:'2',restMoney:'2',expandMoney:'2',userLimitBuy:'2'},
        {ernestMoney:'3',restMoney:'3',expandMoney:'3',userLimitBuy:'3'},
        {ernestMoney:'4',restMoney:'4',expandMoney:'4',userLimitBuy:'4'},
        {ernestMoney:'5',restMoney:'5',expandMoney:'5',userLimitBuy:'5'},
    ]
    formConfig:formItem[] = [
        {
            key: "id2",
            label: "计划号",
            placeholder: "请输入计划号",
        },
        {
            key: "receivingPerson",
            label: "通话者",
            placeholder: "请选择通话者",
            type: "select",
            options:[
                {label:'通话者1',value:'通话者1'},
                {label:'通话者2',value:'通话者2'},
            ]
        },
        {
            key: "receivingPerson1",
            label: "test",
            placeholder: "请选择test",
            type: "select",
            options:[
                {label:'test1',value:'test1'},
                {label:'test2',value:'test2'},
            ]
        },
        {
            key: "handleResult",
            label: "处理结果",
            placeholder: "请选择处理结果",
            type: "select",
            options:[
                {label:'处理结果1',value:'处理结果1'},
                {label:'处理结果2',value:'处理结果2'},
            ]
        },
        {
            key: "remark",
            label: "记录内容",
            placeholder: "请输入记录内容",
            type: "textarea",
            attrs: {
                maxlength: "2000",
                showWordLimit: true,
            },
            row: 3,
            col: 2
        },
        {
                    key: "time",
                    label: "操作时间",
                    type:'datetimerange',
                    col: 2,
                    keyRange:['startDate','endDate'],
                }
    ]
    tableColumn = [
        { label: "定金(元)", value: "ernestMoney"},
        { label: "尾款(元)", value: "restMoney"},
        { label: "膨胀金额(元)原销售价-促销价", value: "expandMoney"},
        { label: "单品单用户限购(件)", value: "userLimitBuy"},
        // {
        //     label: "操作",
        //     type: "render",
        //     render:(h:CreateElement,{data}) => {
        //         let {row} = data;
        //         return h('el-button',{
        //             class:''
        //         },'删除')
        //     },
        // },

    ]
    rowClick(row:{}){
        console.log(row);
    }
}
</script>
