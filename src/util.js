//获取历史状态的key值
export const getHistoryStateKey = function () {
    return isObject(history.state) && typeof history.state.key == 'string' ? history.state.key : new Date().getTime()
}

//判断是否是对象
export const isObject = (obj) => {
    return !!obj && Object.prototype.toString.call(obj) == '[object Object]'
}