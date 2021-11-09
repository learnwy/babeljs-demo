# 关于 babel 做 代码扫描和分析的demo

## scan-chinese

* 扫描代码中出现的中文, 替换或聚合成一个文件
* 该demo实现了扫描出中文并将中文替换成对应的语句

### 示例

**原始代码**

```tsx
import React, { FC } from "react";

const a = "1;";

const A: FC = () => {
  return (
    <div about="你好" title={ `这是一个${ a }` }>
      <a>this is 中文</a>
    </div>
  );
};
export { A };
```

**提取中文后**

```tsx
import React, { FC } from "react";

const a = "1;";

const A: FC = () => {
  return <div
    about={ intl.get("this is code").d("\u4F60\u597D") }
    title={ `${ intl.get("this is code").d("\u8FD9\u662F\u4E00\u4E2A") }${ a }` }
  >
    <a>{ intl.get("this is code").d("this is \u4E2D\u6587") }</a>
  </div>;
};
export { A };
```

## export-aggregate

> 将所有 export 聚合到一起

### 示例

**聚合之前**

```typescript
type A = number;
const a = 1;

export interface AA {
  a: A;
}

export type CC = AA;

export const aa: CC = { a: 1 };

export { a };
export type { A };
```

**聚合之后**

```typescript
type A = number;
const a = 1;

interface AA {
  a: A;
}

type CC = AA;
const aa: CC = {
  a: 1,
};
export { a, A, AA, CC, aa };
```
