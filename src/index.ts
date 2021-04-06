import lanjElFormTable from "./components/lanjElFormTable/lanjElFormTable.vue"
import lanjElForm from "./components/lanjElForm/lanjElForm.vue"
import lanjElTable from "./components/lanjElTable/lanjElTable.vue"
import lanjElPagination from "./components/lanjElPagination/lanjElPagination.vue"
import lanjElDialog from "./components/lanjElDialog/lanjElDialog.vue"
import lanjElPopover from "./components/lanjElPopover/lanjElPopover.vue"
import lanjScrollbar from "./components/lanjScrollbar/lanjScrollbar.vue"

export const lanjElModule:any={
  install:function(vue:any){
    const v:any=(window as any).Vue||vue;
    (v as any).component("lanj-el-form",lanjElForm);
    (v as any).component("lanj-el-table",lanjElTable);
    (v as any).component("lanj-el-pagination",lanjElPagination);
    (v as any).component("lanj-el-form-table",lanjElFormTable);
    (v as any).component("lanj-el-dialog",lanjElDialog);
    (v as any).component("lanj-el-popover",lanjElPopover);
    (v as any).component("lanj-scroll-bar",lanjScrollbar);
  }
};

