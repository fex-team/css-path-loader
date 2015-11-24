css-path-loader
====================
React 组件 css 命名空间生成器

注: 此插件需要 less 或者 scss 作为 css 预编译器
此插件需要和 [html-path-loader] 配合使用才能发挥作用


## Usage

假设一个 react 组件在项目的路径为 `src/components/test/index.js`
index.js的相同目录下还有个 `index.scss`

```javascript
// 在 index.js
require('./index.scss') // less 或者 scss

// webpack.config
         
{
    test: /\.(scss|less)/,
    exclude: /node_modules/,
    loaders: ['style', 'css', 'autoprefixer', 'sass', 'less', 'css-path-loader']
}


```
index.scss 里面的代码都会自动根据当前文件的父级文件夹路径生成一个唯一的命名空间(前提是保证一个文件夹一个组件)
会自动生成
.src-component-test {
    // code from index.scss
}

从而保证该组件所在文件夹内部引入的 css 代码都在其相应的命名空间内
