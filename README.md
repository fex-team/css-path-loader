css-path-loader
====================
css 模块化工具

通过为每个 react 组件生成唯一的 className 值来实现 css 组件化

此loader需要和 [html-path-loader](https://github.com/andycall/html-path-loader.git) 配合使用才能发挥作用

scss 文件或者 less 文件必须和 react 组件文件必须放置在同一目录下,

如果项目中有通用样式文件, 请使用 `@import` 来引入而不是在 `js` 使用 `require` 

如果样式和组件是`完全分开`放置请不要使用这个 loader,  

## Usage

自动根据每一个 react 组件所在的路径, 在编译期间, 将该组件 require 的所有scss或者 less 代码代码包上一个


```css
    
    // 假设这个 react 组件根据当前项目所在的相对路径为`src/component/test/index.js`, 自动根据路径生成 class 名
    .src-component-test {
    
        // react 组件引入的样式文件源码
        ... 
    }
   
```

有了这个 loader 自动根据每个组件的文件所在路径生成 class 名称, 配合html-path-loader 会生成相同的 class 名称, 从而实现 css 模块化 

## Config

```javascript
 module: {
            loaders: [
                {
                    test: /\.(scss|less)/,
                    exclude: /node_modules/,
                    loaders: ['css-path-loader']
                }
            ]
        }
```

## Tips

+ 在js文件中通过 `require` 引入 `npm` 安装的 `css` 文件, 会直接加到全局域中, 和通常 `webpack` 引入没什么区别
+ 如果在 `scss` 或者 `less` 文件中通过 `@import` 引入 `node_modules` 里或者其他地方的 `scss` 或者 `less` 文件, 都只会作用于当前组件, 所有的样式的作用域也都属于当前组件
