# Disallow Unused Variables (no-unused-vars)

文件夹外部从非入口文件引入, 文件夹内部从入口文件引入

## Rule Details

这个规则目标是限制`import`文件, 文件夹(模块)外部只能从入口(index)文件`import`内容, 文件夹(模块)内部不能`import`入口(index)文件

目标 utils 存在 foo.js, bar.js, index.js 文件

* 非 utils 文件夹 只能从 utils/index.js 文件`import`
* foo.js, bar.js 只能各自引入各自的内容

```js
```

Examples of **correct** code for this rule:

```js
```

## Options

配置接收一个数组, dir 必须指定目录, index 默认会查找目录下的 index.ts, index.tsx, index.js, index.jsx 文件, innerNoImportIndex 默认为 true

```json
{
  "rules": {
    "@learnwy/import-no-index": [
      "error",
      [
        {
          "dir": "@/components/input",
          "innerNoImportIndex": true
        }
      ]
    ]
  }
}
```

### dir

需要 lint 的目录

### index

当前目录的入口文件, 默认会按照以下优先级查找

* index.ts
* index.tsx
* index.js
* index.jsx

### innerNoImportIndex

文件夹下的非入口文件不能`import`入口文件
