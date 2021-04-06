<template>
    <div id="app">
        <section
          v-for="item in spreadComponents"
          :key="item.name">
              <span>{{item.name}}</span>
              <button @click="click(item)">{{item.spreadYn?'收起':'展开'}}</button>
              <component v-if="item.spreadYn" :is="item.name"></component>
        </section>
    </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';
import schedule from "./test/schedule.vue";
import lanjElForm from "./test/lanjElForm.vue";
import lanjElTable from "./test/lanjElTable.vue";
import lanjElFormTable from "./test/lanjElFormTable.vue";
import lanjElDialog from "./test/lanjElDialog.vue";


interface spreadComponentItem{
  name:string;
  spreadYn:boolean;
}

@Component({
    components: {
        schedule,
        lanjElForm,
        lanjElTable,
        lanjElFormTable,
        lanjElDialog
    },
})

export default class App extends Vue {
    spreadComponents:spreadComponentItem[] = [
        {name:'schedule',spreadYn:true},
        {name:'lanjElForm',spreadYn:false},
        {name:'lanjElTable',spreadYn:false},
        {name:'lanjElFormTable',spreadYn:false},
        {name:'lanjElDialog',spreadYn:false},
    ]
    mounted() {
      
    }
    click(e:spreadComponentItem):void{
        this.spreadComponents.forEach(item=>{
            if( item.name !== e.name ){
                item.spreadYn = false
            }
        });

        e.spreadYn = !e.spreadYn;
    }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
