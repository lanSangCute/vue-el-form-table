<template src="./schedule.html">


</template>

<script lang="ts">
import Vue from "vue";
import {Component,Prop,Watch} from "vue-property-decorator";
import {Item,x_list_item} from "./interface";
import {body_height} from "./setting";
import DataHandler,{SignalItem,PaletteItem} from "./lib";
import {Scroll} from "./scroll";

@Component({})
export default class extends Vue{
    dataHandler:DataHandler|any;
    bodyHeight:number=body_height;
    showRemind:boolean=false; //显示提醒条
    remindStartY:number=0; //上提醒条Y
    remindEndY:number=0; //下提醒条Y
    remindStartValue:string=""; //上值
    remindEndValue:string=""; //下值

    
    // @Prop({})converseTuple:any;//红色刻度
    converseTuple:any;//红色刻度
    remindConverseY:number=0; //红色刻度Y
    remindConverseValue:string=""; //红色刻度值

    otherXlistItem:any= {
      items:[],
      xList:[]
    }

    scroll:any=null;
    @Prop({default:null})xList:any;
    @Prop({default:null})items:any;
    // @Watch("items")
    // watchItems(items:Item[]){
    //   if(!items)return;
    //   this.otherXlistItem.items = items;
    //   this.run()
    // }

    @Prop({})switchColor:any;

    // created(){
    //   console.info("created");
    // }
    mounted(){
        //设置鼠标横向滚动
      this.scroll=new Scroll(
          (this.$refs as any)["palette_wrapper"],
          (this.$refs as any)["palette"]
      );
      // this.run();
    }

    

    drawLines:number[]=[];
    signalList:SignalItem[]=[];
    paletteItemList:PaletteItem[]=[];

    run(){
      if(!this.otherXlistItem.xList || !this.otherXlistItem.xList.length){
        return console.warn("xList required: x_list_item[]")
      }
      this.dataHandler=new DataHandler(this.otherXlistItem.items,this.otherXlistItem.xList,
        (this.$refs as any)["signal"],
        (this.$refs as any)["palette"],
        this.switchColor&&(this.switchColor instanceof Function)?this.switchColor:this.colorController  
      );
      this.dataHandler.coordinateCal();

      let converseMinute = this.dataHandler.getYItemPos(this.converseTuple);
      const per=body_height/this.dataHandler.yTotal;

      this.remindConverseValue=this.convert(converseMinute||0,false);
      this.remindConverseY =converseMinute&&(converseMinute-this.dataHandler.yStart)*per;

      this.drawLines=this.dataHandler.paletteLines;
      this.signalList=this.dataHandler.signalList;
      this.paletteItemList=this.dataHandler.paletteItems;
      setTimeout(()=>this.scroll.handleScroll());
    }

    /**
     *  minutes转 HH:MM
     */
    convert(m:number,append:boolean=true):string{
      const ms= append?m+this.dataHandler.yStart:m;
      return `${this.ploystr(Math.floor(ms/60))} : ${this.ploystr(ms%60)}`;
    }
    ploystr(s:string|number):string{
      s=s.toString();
      return s.length<2?'0'+s:s;
    }

    /**
     * 颜色控制 
     * @return 颜色值
     */
    colorController(costMinutes:number):string{
      if(costMinutes<30){
        return "EF476F"
      }else if(costMinutes>=30 &&costMinutes<60){
        return '06D6A0'
      }else if(costMinutes>=60 && costMinutes<240){
        return 'FFD166'
      }else{
        return '06D6A0';
      }
    }

    cardEnter(i:Item,e:Event){
        const targetEl:HTMLElement|any=e.currentTarget;
        this.showRemind=true;
        this.remindStartY=i.startPixel||0;
        this.remindEndY=i.endPixel||0;
        this.remindStartValue=this.convert(i.startMinute||0,false);
        this.remindEndValue=this.convert(i.endMinute||0,false);
        // targetEl.style.boxShadow=
    }
    cardLeave(i:Item,e:Event){
        this.showRemind=false;
    }
    cardClick(i:Item,e:Event){
      this.$emit("cardClick",{item:i,event:e});
    }
    cardItemClick(i:Item,e:Event){
        this.$emit("cardItemClick",{item:i,event:e});
    }
    setInitCard(xList:any,items:any,converseTuple:any){
      this.otherXlistItem.xList = [...xList];
      this.otherXlistItem.items = [...items];
      this.converseTuple = [...converseTuple];
      this.run();
    }
}
</script>

<style scoped src="./schedule.scss" lang="scss"></style>