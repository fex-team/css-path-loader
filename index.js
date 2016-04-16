var path = require('path')

function parseCss(css) {
  var start = 0;
  var cssFragment = [];
  var atFragment = [];

  for (var i in css) {
    i = parseInt(i);

    var rawName = css.substring(start, i);
    var leftScore = rawName.match(/\{/g);
    var rightScore = rawName.match(/\}/g);

    // 对于带有@的字符串, 匹配闭合, 修正起点
    if (leftScore && rightScore && leftScore.length === rightScore.length) {
      atFragment.push(rawName);
      start = i + 1;
    }

    if (leftScore && leftScore.length > 1) {
      continue;
    }

    if (css[i] === '}') {
      var rawFragment = css.substring(start, i + 1);

      if (rawFragment.indexOf('@') < 0) {
        cssFragment.push(rawFragment);
      }
      start = i + 1;
    }
  }

  return {
    css: cssFragment,
    at: atFragment
  }
}


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
        var entryPath = path.resolve(this.options.context + path.sep + value).split(path.sep)
        var resourcePath = this.resourcePath.split(path.sep)

        entryPath.pop()
        resourcePath.pop()

        if (entryPath.join(path.sep) === resourcePath.join(path.sep)) {
          this.callback(null, source, map)
          return false;
        }
      }
    }
  }

  // // 得到了入口文件的绝对位置
  var entryAbsolutePath = this.options.context + path.sep

  // // 得到入口文件文件夹路径
  var entryAbsoluteFolderPathArray = entryAbsolutePath.split(path.sep)
  entryAbsoluteFolderPathArray.pop()

  var namespace = this.resourcePath.replace(entryAbsoluteFolderPathArray.join(path.sep) + path.sep, '').replace(/\.(less|scss)/, '')

  var nameArray = namespace.split(path.sep);
  nameArray.pop()
  for (var i = 0; i < nameArray.length; i++) {
    nameArray[i] = nameArray[i].replace('-', '_');
  }
  var nameSpace = nameArray.join('-');
  var nameStr = '.' + nameSpace;

  var rawObj = parseCss(source);
  var cssFragment = rawObj.css;
  var atFragment = rawObj.at;
  var content;

  cssFragment = cssFragment.map(function (css) {
    var globalReg = /body|html/.exec(css);

    if (css.indexOf('_namespace') >= 0) {
      css = css.replace('_namespace', nameSpace);
    }
    else if (globalReg) {
      // 取到body 后面的地方
      var bodyIndex = globalReg.index + 4;
      var rightScoreIndex = css.indexOf('{', globalReg.index);
      var testStr = css.substring(bodyIndex, rightScoreIndex);

      // 只处理 body .container 这样的情况
      if (!/^(body|html|(\s+)|,)+$/.test(testStr)) {
        css = css.substring(0, bodyIndex) + ' ' + nameStr + ' ' + css.substring(bodyIndex);
      }
    }
    else {
      css = nameStr + ' ' + css;
    }

    return css;
  });

  content = atFragment.join('\n') + '\n' + cssFragment.join('\n');

  this.callback(null, content, map)
}
