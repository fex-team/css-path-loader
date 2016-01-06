var path = require('path')

function removeComments(css) {
    return css.replace(/\/\*(\r|\n|.)*\*\//g,"")
}

function removeSpace (css) {
    return css.replace(/\s+/g, '')
}


function parseCss(css) {
    var rules = {}
    var index = css.indexOf('._global')
    var globalIndex
    var globalEnd
    var needClose = false

    if (index === -1) return

    for (var i in css) {
        if (i < index) continue

        if (globalIndex && globalEnd) break

        var pol = css[i]

        if (pol === '{' && !globalIndex) {
            globalIndex = parseInt(i, 10) + 1
        }
        else if (pol === '}' && !needClose && !globalEnd) {
            globalEnd = parseInt(i, 10)
        }
        else if (pol === '{' && globalIndex && !needClose) {
            needClose = true
        }
        else if (pol === '}' && needClose) {
            needClose = false
        }
    }

    if (!globalIndex || !globalEnd) {
        return null
    }
    else {
        return {
            content: css.substring(globalIndex, globalEnd),
            _index: index,
            index: globalIndex,
            end: globalEnd
        }
    }
}


module.exports = function (source, map) {
    this.cacheable && this.cacheable()

    var global = parseCss(source)
    var hasGlobal = !!global

    // 对于 node_modules 里面的文件不能做处理
    if (/node_modules/.test(this.resourcePath)) {
        this.callback(null, source, map)
        return false
    }

    // 找到入口文件绝对位置
    if (Object.prototype.toString.call(this.options.entry) === '[object Array]') {
        for (var value of this.options.entry) {
            if (/[a-zA-Z-\.\/]+(js|jsx)$/.test(value)) {
                var entryPath = path.resolve(this.options.context + '/' + value).split('/')
                var resourcePath = this.resourcePath.split('/')

                entryPath.pop()
                resourcePath.pop()

                if (entryPath.join('/') === resourcePath.join('/')) {
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

    if (nameStr && hasGlobal) {
        source = global.content + '\n .' + nameStr + '{' + source.substring(0, global._index) + source.substring(global.end + 1) + '}'
    }
    else if (nameStr && !hasGlobal) {
        source = '.' + nameStr + '{' + source + '}'
    }

    this.callback(null, source, map)
}
