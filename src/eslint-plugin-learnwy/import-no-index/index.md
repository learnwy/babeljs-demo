# import-no-index

> 其他文件夹不能引入文件夹下非文件夹/index.*的内容
>> 本文件夹内的文件不能直接 import index 文件 

## config

```typescript
interface ConfigItem {
  /** 相对于项目根目录或绝对路径 */
  dir: string;
  /** 默认 index.* */
  index?: string;
  /** 该文件夹下其他文件不能引入  */
  notImportIndex?: boolean;
}

type Config = ConfigItem[];
```
