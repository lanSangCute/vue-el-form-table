<template>
    <lanj-el-dialog
        ref="dialog"
        width="34%"
        title="预约外呼"
        :append-to-body="true"
        :close-on-click-modal="false"
    >
        <el-button>点击</el-button>
        <template slot="body">
            body
        </template>
        <template slot="footer">
            <el-button @click.native="dialogShowOrHide">取消</el-button>
            <el-button type="primary" @click="confirm">
                确定
            </el-button>
        </template>
    </lanj-el-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import lanjElDialog from "../components/lanjElDialog/lanjElDialog.vue";
@Component({
    components: {
        lanjElDialog,
    },
})
export default class App extends Vue {
    confirm(){

    }
    dialogShowOrHide(){

    }
}
</script>
