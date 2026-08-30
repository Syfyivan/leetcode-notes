# this 指向

## 核心回答（面试口述版，1 分钟能讲完）

this 不看函数写在哪，看调用那一刻怎么调。
`obj.fn()` 指向 obj。把 fn 摘出来单独跑，严格模式是 `undefined`，非严格是 `window`。
`call` / `apply` / `bind` 能硬指定。`new` 的时候 this 指向新对象。
箭头函数没有自己的 this，定义时沿词法作用域往外找。
优先级：`new` > `bind/call/apply` > 对象点调用 > 裸调。
面试最爱考两件事：方法赋值给变量再执行，以及丢进 `setTimeout`。这两种都会变成裸调，this 就丢了。
class 里普通方法也一样，传给别人当回调会丢，写成类字段箭头函数或构造里 `bind` 才能钉死。

## 展开

1. 五种绑定规则（默认 / 隐式 / 显式 / new / 箭头函数），优先级从高到低

- **new**：`new Fn()`，this 是新对象。就算这个函数被 bind 过，`new` 仍然赢。
- **显式**：`fn.call(obj)` / `apply` / `bind`。bind 只生效第一次。
- **隐式**：`obj.fn()`，点前面是谁就指向谁。`obj.a.fn()` 指向 `a`，不是 `obj`。
- **默认**：裸调 `fn()`。严格模式 `undefined`，非严格 `window`（Node 里是 `global`）。
- **箭头函数**：不参与上面的竞争。没有 `[[ThisMode]]`，也没有 `prototype`，`new` 会报错。

2. 箭头函数的 this 是在哪确定的？和普通函数有什么本质区别？

定义时确定，跟着外层第一个非箭头函数（或全局）走。以后 `call/apply/bind` 都改不了。
普通函数每次调用重新绑。对象字面量不产生作用域，写在对象里的箭头函数，this 会继续往外找，落到全局或外层函数。

## 延伸

- 相关题：闭包、作用域链。箭头函数的 this 跟着词法作用域走，不跟调用点。
- 对比题：`obj.fn()`、`const f = obj.fn; f()`、`setTimeout(obj.fn, 0)` 三个调用点。
- 面试加码：手写 `bind`；`new boundFn()` 压过 bind；class 字段箭头 vs 原型方法丢 this。

## 代码 / 例子

```js
const obj = {
  name: 'obj',
  fn() {
    console.log(this.name);
  },
  arrow: () => console.log(this.name),
};

obj.fn();          // 'obj'
const f = obj.fn;
f();               // 严格模式 undefined，浏览器非严格是 window.name
setTimeout(obj.fn, 0); // 丢 this，等同裸调

obj.arrow();       // 箭头定义时外层是全局，不是 obj

function Foo(name) {
  this.name = name;
}
const bound = Foo.bind({ name: 'bind 到的' });
const a = new bound('new 出来的');
console.log(a.name); // 'new 出来的'，new 压过 bind
```

## 常见追问

- Q: call/apply/bind 的区别？bind 多次绑 this 以哪次为准？
  A: 三个都改 this。`call(thisArg, a, b)` 立刻执行，参数逐个传。`apply(thisArg, [a, b])` 立刻执行，参数是数组。`bind(thisArg, a)` 不执行，返回新函数，还能柯里化。多次 bind，以第一次为准：`f.bind({n:1}).bind({n:2})()` 拿到的是 `{n:1}`。第二次 bind 只拼参数，改不了 this。

- Q: new 的过程中 this 是怎么一步步变的？
  A: 四步。① 建一个空对象。② 把空对象的 `[[Prototype]]` 指到构造函数的 `prototype`。③ 用这个对象当 this 跑构造函数。④ 构造函数如果 return 了对象，就用那个；return 原始值或没 return，才用刚才那个新对象。所以 `new` 里 this 一开始就是新对象，中途不会再被 call 改掉。

## 自己的易错点 / 之前答崩过的地方

我以前会把对象里的箭头函数当成「指向这个对象」。对象字面量没有作用域，箭头只能再往外找。
还有 `obj.fn = other.method; obj.fn()` 会指向 obj，我老觉得「方法从哪来的就指向谁」。调用点才算数。
class 的普通方法抽出来给 `addEventListener`，this 是 `undefined`（class 体默认严格模式）。要绑就写成 `onClick = () => {}` 这种实例字段。
