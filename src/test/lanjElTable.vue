<template>
    <lanj-el-table
        ref="configTable"
        class="px-8"
        :table-column="tableColumn"
        :import-data="tableData"
        :param="{activityId:''}"
        align="left"
    />
</template>

<script lang="ts">
import { CreateElement } from 'vue';
import { Component, Vue } from 'vue-property-decorator';
import lanjElTable from "../components/lanjElTable/lanjElTable.vue";
@Component({
    components: {
        lanjElTable,
    },
})
export default class App extends Vue {
    tableColumn = [
        { label: "需要", type: "index"},
        { label: "定金(元)", value: "ernestMoney"},
        { label: "尾款(元)", value: "restMoney"},
        { label: "膨胀金额(元)原销售价-促销价", value: "expandMoney",align:"right"},
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
    tableData = [
        {ernestMoney:'2',restMoney:'2',expandMoney:'2',userLimitBuy:'膨胀金额(元)原销售价-促销价膨胀金额(元)原销售价-促销价膨胀金额(元)原销售价-促销价膨胀金额(元)原销售价-促销价膨胀金额(元)原销售价-促销价膨胀金额(元)原销售价-促销价膨胀金额(元)原销售价-促销价膨胀金额(元)原销售价-促销价膨胀金额(元)原销售价-促销价'},
        {ernestMoney:'3',restMoney:'3',expandMoney:'3',userLimitBuy:'3'},
        {ernestMoney:'4',restMoney:'4',expandMoney:'4',userLimitBuy:'4'},
        {ernestMoney:'5',restMoney:'5',expandMoney:'5',userLimitBuy:'5'},
    ]
}
</script>
