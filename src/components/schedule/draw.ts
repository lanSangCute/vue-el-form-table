/**
 * 图形绘制
 */
export class Draw{
  drawLine(x:number,y:number,containerDom:HTMLElement){
    const spanLine=document.createElement("span");
    spanLine.style.left=`${x}px`;
    spanLine.style.top=`${y}px`;
    spanLine.classList.add("draw-line");
    containerDom.appendChild(spanLine);
  }

  public getRGBFromHex(hashValue:string){
    let p;
    let rgb=[];
    if(hashValue.startsWith("#"))hashValue=hashValue.slice(1);
    for(let i =0;i<3;i++){
        p=hashValue.slice(i*2,i*2+2);
        rgb.push(parseInt(p,16))
    }
    return rgb;
  }
  public getColor([r,g,b]:number[]){
    return `rgb(${r},${g},${b})`
  }
  public deepColor([r,g,b]:number[],percent:number):string{
    return this.getColor([this.deep(r,percent),this.deep(g,percent),this.deep(b,percent)])
  }
  public lightColor([r,g,b]:number[],percent:number):string{
    return this.getColor([this.light(r,percent),this.light(g,percent),this.light(b,percent)])
    
  }

  private deep(v:number,percent:number):number{
    const value=(1-percent)*v;
    return Math.round(value<0?0:value);
  }

  private light(v:number,percent:number):number{
    const value=(1+percent)*v;
    return Math.round(value>255?255:value);
  }
}