# 依赖注入与IoC

## 核心回答（面试口述版，1 分钟能讲完）

IoC 是控制权交给容器：谁 new、活多久，不由业务类自己决定。DI 是 IoC 的一种手段，构造函数声明依赖，容器注入实例。Nest 用 `@Injectable()` 标记 provider，模块的 `providers` 里注册，构造函数参数靠 `emitDecoratorMetadata` 拿到类型，再从容器解析。默认单例，整个进程一份 `UsersService`。循环依赖用 `forwardRef(() => OtherModule)` 或 `@Inject(forwardRef(() => OtherService))`。

## 展开

1. 控制反转 IoC 和依赖注入 DI 的关系

   不用 DI 时，`new OrderService(new UserRepo(new Db()))`，上层知道下层怎么建。IoC 把「建对象」翻给容器。DI 是注入方式：构造函数注入（Nest 主推）、属性注入、setter 注入。Nest 的容器是 `NestContainer`，模块初始化时扫描 provider，做成 `InstanceWrapper`。

2. @Injectable / 构造函数注入

   `@Injectable()` 让 `tsyringe` 那套 reflect 能记下类的设计：可被注入，也可以再注入别人。写法：

   ```ts
   @Injectable()
   export class OrderService {
     constructor(private readonly users: UsersService) {}
   }
   ```

   构造函数参数类型 `UsersService` 在编译后变成 `design:paramtypes` 元数据。运行时 `Injector` 按 token 取实例塞进去。token 默认是类本身，也可用字符串 / `Symbol` + `@Inject('CACHE')`。

3. Provider 的注册与解析

   四种写法：`ClassProvider`（`useClass`）、`ValueProvider`（`useValue`）、`FactoryProvider`（`useFactory` 可 async）、`ExistingProvider`（`useExisting` 别名）。自定义 token 用 `provide: 'PG_POOL'`。解析发生在模块初始化，`onModuleInit` 时实例已经有了（request 作用域除外）。测试里 `Test.createTestingModule({ providers: [...] }).compile()` 换 mock。

## 延伸

- 相关题：模块与 Provider 作用域。token 对上了但模块没 `imports`，报的仍是 resolve 失败。
- 对比：Spring 要显式标注注入点；Nest 靠 `design:paramtypes` 推断。关掉 `emitDecoratorMetadata` 类型全变成 `Object`。
- 加码：单测用 `Test.createTestingModule` 换 mock，别为了测一个 service 去 `new` 整棵 `AppModule`。

## 代码 / 例子

```ts
const CACHE = Symbol('CACHE');

@Module({
  providers: [
    UsersService,
    { provide: CACHE, useFactory: () => new Redis() },
  ],
  exports: [UsersService],
})
export class UsersModule {}

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    @Inject(CACHE) private readonly cache: Redis,
  ) {}
}
```

## 常见追问

- Q: DI 解决了什么问题？不用 DI 手动 new 有什么坏处？
  A: 解耦构造和使用。手动 new 让业务类绑死具体实现，单测要连真实 Redis；生命周期（单例 / 每请求）也散落各处。DI 之后测 `OrderService` 只要给个 fake `UsersService`。坏处是调试要跳进容器，循环依赖要额外处理。
- Q: 循环依赖怎么处理（forwardRef）？
  A: A 模块 import B，B 又 import A 时，两边 `imports: [forwardRef(() => OtherModule)]`。两个 service 互相构造注入：`@Inject(forwardRef(() => BService))`。原理是先放一个延迟 thunk，实例化完成再填。能拆模块就拆，`forwardRef` 是补丁。也可改成事件或抽第三模块。

## 自己的易错点 / 之前答崩过的地方

- 忘了 `@Injectable()`，报 `Nest can't resolve dependencies`。有时是参数类型被编译成 `Object`，因为 `tsconfig` 没开 `emitDecoratorMetadata`。
- 用接口当注入类型。TS 接口编译后消失，token 变成 `Object`。要改成抽象类或字符串 token。
- 在 `useFactory` 里 `new XxxService()`，等于绕过容器，Xxx 的依赖不会被注入。
