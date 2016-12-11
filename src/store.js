export default class Store {
    constructor() {
        this.store = [] //存储数据
        //存储格式，大概如下
        // this.store = [{
        //     __key: '12343875487',
        //     'data-v-0edfe1d7': { name: 'ok' }
        // }]
    }
    getIndex(key) { //获取key对应的索引值
        var { store } = this
        //对key进行验证
        if (process.env.NODE_ENV !== 'production') {
            if (!/^\d+$/.test(key)) {
                throw new Error('[vue-router-data] key Number type')
            }
        }
        for (let i = 0; i < store.length; i++) {
            let item = store[i]
            if (item.__key == key) { //判断对象是否拥有对应的属性
                return i
            }
        }
        return -1
    }
    setItem(key, scopedId, data) {
        var { store } = this
        var index = this.getIndex(key)
        if (index > -1) {
            //历史记录已经存在，则往历史中存储
            store[index][scopedId] = data
        } else {
            //历史记录不存在，创建一条新的历史记录
            store.unshift({
                __key: key,
                [scopedId]: data
            })
        }
    }
    getItem(key, scopedId) {
        var { store } = this
        var index = this.getIndex(key)
        if (index > -1) {
            //返回仓库中的数据
            if (store[index][scopedId]) {
                return store[index][scopedId]
            }
        }

        return null
    }
}