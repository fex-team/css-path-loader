css-path-loader
====================
css 模块化工具

通过为每个 react 组件生成唯一的 className 值来实现 css 组件化

此loader需要和 [html-path-loader](https://github.com/andycall/html-path-loader.git) 配合使用才能发挥作用

scss 文件或者 less 文件必须和 react 组件文件必须放置在同一目录下, 样式和组件文档分开放置请不要使用这个 loader

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
{
    test: /\.(scss|less)/,
    exclude: /node_modules/,
    loaders: ['css-path-loader']
}

```
