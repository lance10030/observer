function Observer() {
    this.cache = {}  //用于存储订阅的事件名称以及回调函数列表的键值对
}

Observer.prototype.on = function (key,fn) {//key:订阅消息的类型的标识（名称），fn收到消息之后执行的回调函数
    if(!this.cache[key]){
        this.cache[key]=[]
    }
    this.cache[key].push(fn)
}

Observer.prototype.emit = function (key) { //arguments 是发布消息时候携带的参数数组
    if(this.cache[key]&&this.cache[key].length>0){
        var fns = this.cache[key]
    }
    for(let i=0;i<fns.length;i++){
        Array.prototype.shift.call(arguments)
        fns[i].apply(this,arguments)
    }
}
// remove 的时候比较有意思，如果你直接传入一个匿名函数fn，那么你在remove的时候是无法找到这个函数并且把它移除的，变通方式是传入一个
//指向该函数的指针，而 订阅的时候存入的也是这个指针
Observer.prototype.remove = function (key,fn) {
    let fns = this.cache[key]
    if(!fns||fns.length===0){
        return
    }
    //如果没有传入fn，那么就是取消所有该事件的订阅
    if(!fn){
        fns=[]
    }else {
        fns.forEach((item,index)=>{
            if(item===fn){
                fns.splice(index,1)
            }
        })
    }
}


//example


var obj = new Observer()
obj.on('hello',function (a,b) {
    console.log(a,b)
})
obj.emit('hello',1,2)
//取消订阅事件的回调必须是具名函数
obj.on('test',fn1 =function () {
    console.log('fn1')
})
obj.on('test',fn2 = function () {
    console.log('fn2')
})
obj.remove('test',fn1)
obj.emit('test')

/*在wepy中利用该模式定制了一个组件之间通信的总线
* wepy.$bus = new Observer
* 然后就可以在wepy.$bus上订阅和发布消息了
* */