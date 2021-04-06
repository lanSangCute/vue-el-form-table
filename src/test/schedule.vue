<template>
    <schedule
      ref="schedules"
      :items=items
      :xList=x_list
      :switchColor=colorController
      :converseTuple="converseTuple"
      @cardClick="click"
    />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {Item,x_list_item} from "../components/schedule/interface";
import schedule from "../components/schedule/schedule.vue"

@Component({
    components: {
        schedule,
    },
})
export default class App extends Vue {
    converseTuple:number[] = [];
    items:Item[] = [];
    x_list:x_list_item[]=[];

    mounted() {
        setTimeout(()=>{
            let items =[
                {
                  title:'title1',
                  titleItem:[
                    {index:1,id:'1',title:'节目1'},
                    {index:2,id:'2',title:'节目2'}
                  ],
                  content:"content1",
                  positionIndex:1,
                  startTuple:[9,30],
                  endTuple:[9,50],
                },
                {
                  title:'标题一',
                  titleItem:[
                    {index:1,id:'1',title:'节目1'},
                    {index:2,id:'2',title:'节目2'}
                  ],
                  content:'content2',
                  positionIndex:1,
                  startTuple:[11,0],
                  endTuple:[13,0]
                },
                {
                  title:'记录二',
                  titleItem:[
                    {index:1,id:'1',title:'节目1'},
                    {index:2,id:'2',title:'节目2'}
                  ],
                  content:"content1",
                  positionIndex:2,
                  startTuple:[8,30],
                  endTuple:[9,20]
                },

                {
                  title:'事记3',
                  titleItem:[
                    {index:1,id:'1',title:'节目1'},
                    {index:2,id:'2',title:'节目2'}
                  ],
                  content:"content1",
                  positionIndex:3,
                  startTuple:[8,32],
                  endTuple:[11,50]
                },

                {
                  title:'title4',
                  titleItem:[
                    {index:1,id:'1',title:'节目1'},
                    {index:2,id:'2',title:'节目2'}
                  ],
                  content:"content1",
                  positionIndex:4,
                  startTuple:[10,30],
                  endTuple:[11,30]
                },
            ],
            x_list=[
              {index:1,title:"a"},
              {index:2,title:"b"},
              {index:3,title:"c"},
              {index:4,title:"d"},
              {index:5,title:"f"}
            ];
            this.items = items;
            this.x_list = x_list;
            this.converseTuple = [10,15];
            let ref = this.$refs.schedules;
            // ref && ref.setInitCard(x_list,items,this.converseTuple);
        },1000*0.5)
    };
    colorController=(costMinutes:number):string=>{
        if(costMinutes<30){
          return "EF476F"
        }else if(costMinutes>=30 &&costMinutes<60){
          return '06D6A0'
        }else if(costMinutes>=60 && costMinutes<180){
          return 'FFD166'
        }else{
          return '5193f7';
        }
    }
    click(e:Item){
      console.log(e)
    }
}
</script>
