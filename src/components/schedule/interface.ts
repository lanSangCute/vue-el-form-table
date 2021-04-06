export interface titleItem{
  index:number; //坐标位置
  id:String;//id
  title:String; //坐标名
}
export interface Item{
  title?:String;  //标题
  titleItem?:titleItem[]; 
  content?:String; //内容
  template?:String; //模板
  ref?:any; //引用对象，注入item template
  positionIndex:number; //坐标位置
  startMinute?:number; //开始时间;
  endMinute?:number; //结束时间；
  totalMinute?:number; // 持续时间;
  startTuple:number[];  //[10,30]
  endTuple:number[];  //[11,30]
  startPixel?:number;
  endPixel?:number;
  color?:string; //颜色值
  colorDeep?:string; 
  colorLight?:string;
  colorDes?:string;
}


export interface x_list_item{
  index:number; //坐标位置
  title:String; //坐标名
}
