const { rollup } = require('rollup')
const babel = require('rollup-plugin-babel')


rollup({
    entry: 'src/index.js',
    plugins: [babel()]
}).then((function (bundle) {
    bundle.write({
        format: 'cjs',
        dest: 'dist/vue-router-data.js'
    })
}))