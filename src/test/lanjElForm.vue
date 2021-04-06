<template>
    <lanj-el-form
        ref="filterForm"
        :configs="formConfig"
        :inline="false"
        label-width="159px"
        :col="4"
        label-position="right"
        labelSuffix="："
    />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import lanjElForm from "../components/lanjElForm/lanjElForm.vue";
import { formItem } from "../components/lanjElForm/interface";
@Component({
    components: {
        lanjElForm,
    },
})
export default class App extends Vue {
    // mounted() {
    //     let ref = this.$refs.filterForm;
    //     console.log(ref && ref.getHandleFormData());
    // }
    formConfig:formItem[] = [
        {
            key: "receivingPerson",
            label: "通话者",
            placeholder: "请选择通话者",
            type: "select",
            options:[
                {label:'通话者1',value:""},
                {label:'通话者1',value:'0'},
                {label:'通话者2',value:'1'},
            ],
            default:""
        },
        {
            key: "handleResult1",
            label: "处理时间",
            placeholder: "请选择处理时间",
            type: "date",
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
    ]
}
</script>
