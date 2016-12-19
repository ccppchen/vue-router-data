'use strict';

//获取历史状态的key值
var getHistoryStateKey = function () {
    return isObject(history.state) && typeof history.state.key == 'string' ? history.state.key : new Date().getTime()
};

//判断是否是对象
var isObject = function (obj) {
    return !!obj && Object.prototype.toString.call(obj) == '[object Object]'
};

var VueRouterData = function VueRouterData(options) {
    options.mode = 'data' + options.mode.replace(/\w/, function (v) { return v.toUpperCase(); });
    this.options = Object.assign({}, options);
    this.store = {}; //存储数据
};
/**
 * 初始化组件数据
 * component 组件实例对象
 */
VueRouterData.prototype.componentInitData = function componentInitData (component) {
    var $route = component.$route;
    var mode = this.options.mode;
    var modeData = component.$options[mode];
    if (typeof modeData !== 'function') { return {} }
    var ref = component.$options;
        var _scopeId = ref._scopeId;
    var key = _scopeId + '-' + this.options.getKey($route);
    var history = this.store[key];
    if (isObject(history)) { //数据已经存在，还原数据
        return history
    }
    var data = modeData.call(component);
    var keys = [];
    Object.keys(data).forEach(function (k) { return keys.push(k); });
    modeData.__key__ = key;
    modeData.__keys__ = keys;
    return data
};
/**
 * 组件保存数据
 * component 组件实例对象
 */
VueRouterData.prototype.componentSaveData = function componentSaveData (component) {
    var mode = this.options.mode;
    var modeData = component.$options[mode];
    if (typeof modeData !== 'function') { return false }
    var data = {};
    modeData.__keys__.forEach(function (k) {
        data[k] = component.$data[k];
    });
    this.store[modeData.__key__] = data;
};
VueRouterData.prototype.mixin = function mixin () {
    var self = this;
    return {
        data: function data() {
            return self.componentInitData(this)
        },
        destroyed: function destroyed() {
            self.componentSaveData(this);
        },
        watch: {
            $route: function $route() {
                self.componentSaveData(this);
                Object.assign(this.$data, self.componentInitData(this));
            }
        }
    }
};

var index = function (Vue, option) {
    // history mode
    var history = {
        mode: 'history',
        getKey: function getKey($route) {
            return getHistoryStateKey()
        }
    };
    Object.assign(history, option);
    Vue.mixin(new VueRouterData(history).mixin());

    // path mode
    var path = {
        mode: 'path',
        getKey: function getKey($route) {
            return $route.path
        }
    };
    Object.assign(path, option);
    Vue.mixin(new VueRouterData(path).mixin());
    // url mode
    var url = {
        mode: 'url',
        getKey: function getKey($route) {
            var query = $route.query;
            var getSearch = function () {
                var arr = [];
                Object.keys(query).forEach(function (k) { return arr.push((k + "=" + (query[k]))); });
                return arr.join('&')
            };
            return $route.path + '?' + getSearch()
        }
    };
    Object.assign(url, option);
    Vue.mixin(new VueRouterData(url).mixin());
};

module.exports = index;
