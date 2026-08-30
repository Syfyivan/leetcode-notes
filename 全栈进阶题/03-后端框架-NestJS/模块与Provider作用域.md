# 模块与Provider作用域

## 核心回答（面试口述版，1 分钟能讲完）

Nest 用 `@Module({ imports, controllers, providers, exports })` 划边界。provider 默认单例：整个应用一份实例。`Scope.REQUEST` 每个 HTTP 请求 new 一次，能注入 `REQUEST` 对象；`Scope.TRANSIENT` 每次注入都 new。要给别的模块用，必须 `exports`，对方 `imports` 你的模块，光在对方 `providers` 里再写一遍会变成两个单例。跨全应用的工具模块加 `@Global()`，仍然建议显式 import，避免隐藏依赖。

## 展开

1. Module 的组织、imports/exports/providers

   `imports`：把其他模块 export 出来的 provider 引进来。
   `providers`：本模块可注入的 token。
   `controllers`：路由只在本模块生效，不能 export。
   `exports`：把本模块的 provider 或整个模块再转发出去。
   动态模块 `forRoot` / `forRootAsync` 用来传配置，`ConfigModule.forRoot()` 就是。`forFeature` 注册局部实体，TypeORM 的 `TypeOrmModule.forFeature([User])`。

2. Provider 的三种作用域（默认单例/request/transient）

   ```ts
   @Injectable({ scope: Scope.REQUEST })
   ```

   或 `useClass` 时写 `scope`。单例可注入单例。request 作用域一旦出现，依赖它的上层也会被迫变成 request 作用域，这叫作用域冒泡，内存和耗时都会涨。transient 适合纯工具对象。WebSocket / 微服务里 REQUEST 作用域语义要单独查适配器。

3. 全局模块 @Global

   `@Global()` 加在模块上，export 的 provider 到处能注入，不必每个模块 import。适合 `ConfigModule`、`LoggerModule`。滥用会让依赖关系在图上看不见。`APP_GUARD` 这类全局 token 用 `provide: APP_GUARD, useClass: RolesGuard` 注册，不必 Global 模块。

## 代码 / 例子

```ts
@Global()
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}

@Module({
  imports: [UsersModule],          // 才能注入 UsersService
  providers: [
    OrdersService,
    { provide: OrdersService, useClass: OrdersService, scope: Scope.DEFAULT },
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
```

## 常见追问

- Q: 为什么默认是单例？request 作用域有什么代价？
  A: HTTP API 大部分 service 无请求级状态，单例省内存、省初始化，连接池也自然共享。request 作用域每次请求建一棵对象树，还要 `ModuleRef` 做 per-request 子容器，延迟明显，内存曲线随 QPS 走。只有真正要绑 `req.user`、事务连接时才用，能把 request 当参数往下传就别改 scope。
- Q: 共享一个 service 要怎么跨模块 export？
  A: 定义方 `providers: [UsersService], exports: [UsersService]`，使用方 `imports: [UsersModule]`。不要在两个模块的 providers 里都写 `UsersService`，容器会造两份。转发再 export 整个 `UsersModule` 也可以。

## 自己的易错点 / 之前答崩过的地方

- 在 `AppModule` 把所有 service 一股脑 providers，模块边界名存实亡。
- request 作用域的 service 注入到单例的拦截器里，Nest 抛 scope 不兼容，要用 `ContextIdFactory` + `moduleRef.resolve`。
- `exports` 漏了，报 `Nest can't resolve XxxService`。依赖图没连上，不是没写 `@Injectable`。
