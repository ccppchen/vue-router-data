import Store from './store'
const store = new Store()

let _key = String(Date.now())

//判断是否是Object对象
const isObject = (obj) => {
    return Object.prototype.toString.call(obj) == '[object Object]'
}
//获取key值
const getKey = function () {
    return isObject(history.state) && typeof history.state.key == 'string' ? history.state.key : _key
}

//获取数据
const getData = function () {
    var key = getKey()
    var data = {}
    //从历史中取出一个key值，如果没有，则取默认的
    var { _scopeId } = this.$options
    if (_scopeId) {

        let keepAlive = store.getItem(key, _scopeId)
        if (isObject(keepAlive)) { // 有历史数据，则返回历史数据
            data = keepAlive
        } else if (typeof this.$options.historyData == 'function') {
            if (process.env.NODE_ENV !== 'production') {
                if (!isObject(this.$options.historyData())) { //验证返回值必须是Object类型
                    throw new Error('[vue-router-data] historyData return Object')
                }
            }
            this.$options.historyData._key = key //存储key值
            data = this.$options.historyData() //重置数据
        }

    }
    return data
}

//保存数据
const saveData = function () {
    var { _scopeId } = this.$options
    if (_scopeId && typeof this.$options.historyData == 'function') {
        var key = this.$options.historyData._key
        var data = this.$options.historyData()
        var newData = {}
        Object.keys(data).forEach((k) => newData[k] = this.$data[k])
        store.setItem(key, _scopeId, newData)
    }

}

export default {
    data() {
        return getData.call(this)
    },
    destroyed() { //组件卸载
        saveData.call(this) //存储数据
    },
    watch: {
        $route(to, from) { //当前组件路由发生改变
            saveData.call(this) //存储数据
            Object.assign(this.$data, getData.call(this)) //重置路由数据
        }
    }
}