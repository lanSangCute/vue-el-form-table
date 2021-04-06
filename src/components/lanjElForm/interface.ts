export interface formItem{
    key?:string;
    label?:string;
    placeholder?:string;
    type?:string,
    options?:Function|object;
    required?:boolean;
    col?:number;
    fullLine?:boolean;
    className?:string;
    render?:Function;
    noLabel?:boolean
    rules?:object;
    default?:any;
    row?:number;//textarea
    resize?:string;//textarea
    timeFormat?:string;//datetime
    keyRange?:object;//datetime
    attrs?:object;
    props?:object;
    domProps?:object;
    itemProps?:object;
    on?:object|any;
    directives?:object|any;
    scopedSlots?:object|any;
    slot?:object|any;
    class?:object|any;
    style?:object|any;
    nativeOn?:object|any;
}