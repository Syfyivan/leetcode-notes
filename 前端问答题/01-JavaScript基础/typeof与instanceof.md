# typeof 与 instanceof

## 核心回答（面试口述版，1 分钟能讲完）

`typeof` 返回一个字符串，用来分原始类型。一共 8 种：`undefined` / `boolean` / `number` / `string` / `symbol` / `bigint` / `function` / `object`。
坑是 `typeof null === 'object'`，历史遗留。数组、正则、日期也全是 `'object'`，分不开。
`instanceof` 沿原型链找，看右边的 `prototype` 在不在左边的链上。所以 `[] instanceof Array` 为 true，`[] instanceof Object` 也是 true。
左边是原始值直接 false，`1 instanceof Number` 是 false。
跨 iframe 的 Array 会失败，因为两边的 `Array.prototype` 不是同一个对象。
要精确判断用 `Object.prototype.toString.call(x)`，得到 `[object Array]` 这种。

## 展开

1. `typeof null` 为什么是 `'object'`？（历史遗留 bug）

第一版 JS 用低位做类型标签，对象是 `000`。`null` 是空指针，机器里是全 0，也被当成对象。后来改会炸全网，就留到现在。判断空值要写 `x === null`，别靠 typeof。

2. 完整列出 typeof 的所有可能返回值（8 个）

| 值 | 对应类型 |
| --- | --- |
| `'undefined'` | 未定义 |
| `'boolean'` | true / false |
| `'number'` | 含 NaN、Infinity |
| `'string'` | 字符串 |
| `'symbol'` | Symbol() |
| `'bigint'` | 10n |
| `'function'` | 函数（可调用对象的特例） |
| `'object'` | 对象、数组、null、正则、日期 |

没有 `'array'`，也没有 `'null'`。

3. instanceof 的原理（沿着原型链查 `prototype`），以及它为什么判断不了原始类型

规范走 `OrdinaryHasInstance`：左边不是对象立刻 false。然后 `obj = obj.[[Prototype]]` 一路往上，直到等于 `Ctor.prototype` 或碰到 null。
原始值没有 `[[Prototype]]`（装箱只发生在调方法时），所以 `1 instanceof Number` 是 false。`new Number(1) instanceof Number` 才是 true。

## 延伸

- 相关题：原型链。`instanceof` 就是沿 `[[Prototype]]` 找 `Ctor.prototype`。
- 对比题：`typeof [] === 'object'`，`Array.isArray([])` 才稳。跨 iframe 别用 `instanceof Array`。
- 面试加码：手写 `instanceof`；`Symbol.hasInstance` 能改 `instanceof` 结果。

## 代码 / 例子

```js
function myInstanceof(obj, Ctor) {
  if (obj === null || (typeof obj !== 'object' && typeof obj !== 'function')) {
    return false;
  }
  let proto = Object.getPrototypeOf(obj);
  const target = Ctor.prototype;
  while (proto) {
    if (proto === target) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}

myInstanceof([], Array);   // true
myInstanceof([], Object);  // true
myInstanceof(1, Number);   // false
```

## 常见追问

- Q: `Object.prototype.toString.call(x)` 为什么能准确判断类型？
  A: 每个对象内部有 `[[Class]]`（ES6 起是 `@@toStringTag`）。`toString` 被对象自己重写后就丢了，用 `Object.prototype.toString` 调回来，按内部标签拼出 `[object Xxx]`。`call` 是为了把 this 指到目标。null 是 `[object Null]`，array 是 `[object Array]`，这是目前最稳的内置类型判断。

- Q: 判断数组有哪几种方法？各有什么限制？
  A: ① `Array.isArray(x)`，最推荐，跨 iframe 也对。② `x instanceof Array`，跨窗口会 false。③ `Object.prototype.toString.call(x) === '[object Array]'`，稳但啰嗦。④ `Array.prototype.isPrototypeOf(x)`，跟 instanceof 同类问题。⑤ `x.constructor === Array`，constructor 能被改，别用。

## 自己的易错点 / 之前答崩过的地方

我以前说 typeof 有 7 种，漏了 `bigint`。2019 之后就是 8 个。
`typeof NaN === 'number'` 我答成了 `'NaN'`，当场愣住。NaN 是 number 里的坑，要用 `Number.isNaN`。
手写 instanceof 忘了原始值直接 false，对 `1` 去 `getPrototypeOf` 会抛 TypeError。
