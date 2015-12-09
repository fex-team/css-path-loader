var path = require('path')

module.exports = function (source, map) {
    this.cacheable && this.cacheable()

    // 对于 node_modules 里面的文件不能做处理
    if (/node_modules/.test(this.resourcePath)) {
        this.callback(null, source, map)
        return false
    }

    // 找到入口文件绝对位置
    if (Object.prototype.toString.call(this.options.entry) === '[object Array]') {
        for (var value of this.options.entry) {
            if (/[a-zA-Z-\.\/]+(js|jsx)$/.test(value)) {
                var entryPath = path.resolve(this.options.context + '/' + value)
                if (entryPath.replace(/\.(js|jsx)/, '') === this.resourcePath.replace(/\.(less|scss)/, '')) {
                    this.callback(null, source, map)
                    return false;
                }
            }
        }
    }

    // 得到了入口文件的绝对位置
    var entryAbsolutePath = this.options.context + '/'

    // 得到入口文件文件夹路径
    var entryAbsoluteFolderPathArray = entryAbsolutePath.split('/')
    entryAbsoluteFolderPathArray.pop()

    var namespace = this.resourcePath.replace(entryAbsoluteFolderPathArray.join('/') + '/', '').replace(/\.(less|scss)/, '')

    var nameArray = namespace.split('/')
    nameArray.pop()
    var nameStr = nameArray.join('-')

    if (nameStr) {
        source = '.' + nameStr + '{' + source + '}'
    }

    this.callback(null, source, map)
}