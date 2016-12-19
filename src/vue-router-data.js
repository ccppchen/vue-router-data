import * as util from './util'

export default class VueRouterData {
    constructor(options) {
        options.mode = 'data' + options.mode.replace(/\w/, (v) => v.toUpperCase())
        this.options = Object.assign({}, options)
        this.store = {} //存储数据
    }
    /**
     * 初始化组件数据
     * component 组件实例对象
     */
    componentInitData(component) {
        var { $route } = component
        var mode = this.options.mode
        var modeData = component.$options[mode]
        if (typeof modeData !== 'function') return {}
        const { _scopeId } = component.$options
        var key = _scopeId + '-' + this.options.getKey($route)
        var history = this.store[key]
        if (util.isObject(history)) { //数据已经存在，还原数据
            return history
        }
        var data = modeData.call(component)
        var keys = []
        Object.keys(data).forEach((k) => keys.push(k))
        modeData.__key__ = key
        modeData.__keys__ = keys
        return data
    }
    /**
     * 组件保存数据
     * component 组件实例对象
     */
    componentSaveData(component) {
        var mode = this.options.mode
        var modeData = component.$options[mode]
        if (typeof modeData !== 'function') return false
        var data = {}
        modeData.__keys__.forEach((k) => {
            data[k] = component.$data[k]
        })
        this.store[modeData.__key__] = data
    }
    mixin() {
        var self = this
        return {
            data() {
                return self.componentInitData(this)
            },
            destroyed() {
                self.componentSaveData(this)
            },
            watch: {
                $route() {
                    self.componentSaveData(this)
                    Object.assign(this.$data, self.componentInitData(this))
                }
            }
        }
    }
}