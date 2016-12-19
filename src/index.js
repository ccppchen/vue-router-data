import * as util from './util'
import VueRouterData from './vue-router-data'

export default function (Vue, option) {
    // history mode
    var history = {
        mode: 'history',
        getKey($route) {
            return util.getHistoryStateKey()
        }
    }
    Object.assign(history, option)
    Vue.mixin(new VueRouterData(history).mixin())

    // path mode
    var path = {
        mode: 'path',
        getKey($route) {
            return $route.path
        }
    }
    Object.assign(path, option)
    Vue.mixin(new VueRouterData(path).mixin())
    // url mode
    var url = {
        mode: 'url',
        getKey($route) {
            var { query } = $route
            const getSearch = () => {
                let arr = []
                Object.keys(query).forEach((k) => arr.push(`${k}=${query[k]}`))
                return arr.join('&')
            }
            return $route.path + '?' + getSearch()
        }
    }
    Object.assign(url, option)
    Vue.mixin(new VueRouterData(url).mixin())
}