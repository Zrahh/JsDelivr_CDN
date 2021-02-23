if (window.UniJsBridge) {
    throw new Error('UniJsBridge已经存在了');
}
var uniqueId = 1; // 全局唯一标识,主要用来生产callbackId
var responseCallbacks = {}; // 给客户端发送消息后的回调函数集合
var messageHandlers = {}; // 在H5中注册的函数（就是等待客户端调用的函数）的集合
var receiveMessageQueue = []; // 消息队列，Native给H5发消息的队列，所有的消息都集中在此，依次调用
var UniJsBridge = {
    init: init,
    send: send,
    callHandler: callHandler,
    registerHandler: registerHandler,
    uni: uni,
    _handleMessageFromNative: _handleMessageFromNative,
};
// Native调用H5函数必须是要挂载到window下
window.UniJsBridge = UniJsBridge;
function init(messageHandler) {
    if (UniJsBridge._messageHandler) {
        throw new Error('UniJSBridge._messageHandler 被调用了两次');
    }
    UniJsBridge._messageHandler = messageHandler;
    var receiveMessage = receiveMessageQueue;
    receiveMessageQueue = null;
    for (var i = 0; i < receiveMessage.length; i++) {
        _dispatchMessageFromNative(receiveMessage[i]);
    }
}
/**
 * 发送消息给客户端
 * PS:主动发送
 * @param data 给客户端的数据
 * @param responseCallback 回调函数
 */
function send(data, responseCallback) {
    _doSend('send', data, responseCallback);
}
// 调用线程
function callHandler(handlerName, data, responseCallback) {
    _doSend(handlerName, data, responseCallback);
}
/**
 * 注册一个函数，待客户端调用
 * PS:被动等待调用
 * @param handlerName
 * @param handler: 接收两个参数，data(客户端回复给H5的数据)，responseCallback(一个回调函数：调用该函数，客户端才可以执行回调，且可以传参数给客户端)
 */
function registerHandler(handlerName, handler) {
    messageHandlers[handlerName] = handler;
}
/**
 * 发送给客户端的核心函数，依赖uni-app SDk
 * PS:主动发送
 * @param handlerName
 * @param message
 * @param responseCallback: 可接收String和Function,如果为String的话就是给客户端的一个回调ID，这个ID其实本来就是由客户端自己传过来的
 * 如果为Function的话就是H5的回调函数
 * @private
 */
function _doSend(handlerName, message, responseCallback) {
    var callbackId;
    if (typeof responseCallback === 'string') {
        callbackId = responseCallback;
    }
    else if (responseCallback) {
        /**
         * 把回调函数塞进集合中去，待客户端代码执行完毕就去找到对应的函数开始执行
         */
        callbackId = 'cb_' + (uniqueId++) + '_' + new Date().getTime();
        responseCallbacks[callbackId] = responseCallback;
    }
    else {
        callbackId = '';
    }
    if (!uni.postMessage) {
        return console.error('此接口依赖uni.webview,具体参考：https://uniapp.dcloud.io/component/web-view');
    }
    // 给客户端发送消息
    uni.postMessage({
        data: {
            data: message,
            callbackId: callbackId,
            handlerName: handlerName,
        },
    });
}
function _dispatchMessageFromNative(messageJSON) {
    if (!messageJSON) {
        return console.warn('客户端没有回复任何消息');
    }
    try {
        /**
         * responseId: 客户端回复前端的回调函数的ID
         * callbackId: 给客户端自己用的回调ID
         * handlerName: 前后端统一约定的一个名字[约定不同的名字对应不同的功能，需要后期加，这里只是封装的一个方法]
         * responseData: 客户端给前端的参数
         */
        var callbackId = messageJSON.callbackId, responseId = messageJSON.responseId, handlerName = messageJSON.handlerName, responseData = messageJSON.responseData;
        var responseCallback = void 0;
        if (responseId) {
            responseCallbacks[responseId] && responseCallbacks[responseId](responseData);
            delete responseCallbacks[responseId];
        }
        else {
            if (callbackId) {
                var callbackResponseId_1 = callbackId;
                responseCallback = function (responseData) {
                    _doSend('response', responseData, callbackResponseId_1);
                };
            }
            var handler = UniJsBridge._messageHandler;
            if (handlerName) {
                handler = messageHandlers[handlerName];
            }
            handler(responseData, responseCallback);
        }
    }
    catch (e) {
        console.log(e);
    }
}
/**
 * 提供给客户端调用的函数，
 * 约定客户端只能通过此函数发消息给H5
 * @param messageJSON
 * @private
 */
function _handleMessageFromNative(messageJSON) {
    if (receiveMessageQueue) {
        receiveMessageQueue.push(messageJSON);
    }
    _dispatchMessageFromNative(messageJSON);
}
//# sourceMappingURL=uni-js-bridge.es5.js.map
