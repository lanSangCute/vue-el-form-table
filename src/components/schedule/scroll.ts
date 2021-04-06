export class Scroll{
    private containerEl:HTMLElement;
    private wrapperEl:HTMLElement;
    private listener:any;
    constructor(containerEl:HTMLElement,wrapperEl:HTMLElement) {
        this.containerEl=containerEl;
        this.wrapperEl=wrapperEl;
    }
    public handleScroll():void{
        let wrapperWidth:number=0;
        const containerWidth:number=this.containerEl.clientWidth;
        Array.prototype.map.call(this.wrapperEl.children,(i:HTMLElement)=>{
                wrapperWidth+=i.offsetWidth;
        });
        const scrollWidth:number=wrapperWidth-containerWidth;
        this.unListen();
        if(scrollWidth>0){
            this.listenScroll(scrollWidth)
        }
    }
    private unListen(){
        if(this.listener){
            this.containerEl.removeEventListener("mousewheel",this.listener);
            this.listener=undefined;
        }
    }
    private listenScroll(scrollWidth:number){
        let preScrollPosition:number;
        this.listener=(e:any)=>{
            e.stopPropagation();
            e.preventDefault();
            const scrollDis:number=0-e.wheelDelta;
            const scrollLeft:number=this.containerEl.scrollLeft;
            let targetLeft:number=scrollLeft+scrollDis;
            if(targetLeft>scrollWidth){
                targetLeft=scrollWidth;
            }else if(targetLeft<0){
                targetLeft=0;
            }
            if(targetLeft!==preScrollPosition){
                this.containerEl.scrollTo(targetLeft,0);
                preScrollPosition=targetLeft;
            }
        };
        this.containerEl.addEventListener("mousewheel",this.listener);
    }
}