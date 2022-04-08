---
date: 2018-08-10
tag:
 - spring 
category:
 - Frameworks
---
# Spring

## 什么是 spring？

1. Spring 在创立之初是一个轻量级的 java 开源开发框架（轻量相对于J2EE EJB而言，其实 spring 也是比较大了），其提出是为了解决企业应用开发的复杂性而创建的，spring 可以更加快速、简单的构建应用，在目前是最受欢迎的 java 框架。
2. 其设计理念在于分层架构思想，分层架构使得开发者可以自由选择要使用的组件。
3. Spring 的核心优势在于其可以无缝集成主流开发框架，只需通过配置和简单的对象注入。

Spring 的两个核心特性：IoC 和 AOP（控制反转和面向切面编程）

## IoC

### 什么是 IoC?

IoC 指的是控制反转，有些时候可以理解和依赖注入一个关系, IOC 是一种设计思想，将原本程序手中控制对象创建的权力，交给框架来管理；IOC 容器是实现 IOC 的载体，实际上底层就是一个 Map, 其中存放着各种对象。

- 容器概念：IOC 容器中存放着各种对象。在项目启动的时候，根据配置文件读取 beans, 然后通过反射放到容器里面，此时容器中就有各种对象了，后面会在需要的时候进行依赖注入。
- 控制反转：没有引入 IOC 容器的时候，对象的创建存在依赖；引入以后，对象之间失去了联系，而是在需要使用某对象的时候，由 IOC 主动创建并注入。

### bean 的注册

```java
// 返回 IOC 容器，基于 XML配置，传入配置文件的位置
ApplicationContext applicationContext = new ClassPathXmlApplicationContext("xxx.xml");
User user = (User) applicationContext.getBean("user");
```

### ApplicationContext 和 BeanFactory

通过上面的代码，问问题：ApplicationContext 和 BeanFactory 的区别是什么？

回答：

1. ApplicationContext 是 BeanFactory 的子接口；
2. BeanFactory 通过延迟加载的方式来注入 bean, ApplicationContext 是在容器启动时就一次性创建了所有的 bean；
3. ApplicationContext 提供了更完整的功能，如统一的资源文件访问方式、支持国际化、同时加载多个配置文件等。

### bean 的生命周期

@todo

### Spring bean 的作用域

- singleton 单例
- prototype
- request
- session
- global-session(Spring 5 以后废弃)

#### Spring singleton 是线程安全吗？

不是。bean 可以分为有状态对象 stateful bean 和无状态对象 stateless bean, 有状态对象保存有实例变量，有数据，不是线程安全的；

对于单例 bean, 存在多个线程共享这个 bean 的实例，如果是一个无状态 bean, 那么各个线程不会对这个 bean 进行查询以外的操作，这时候是线程安全的。如果是有状态 bean, 这时候存在资源的竞争。

如何避免？

1. 可以通过 `ThreadLocal` 来解决线程安全的问题，因为 `ThreadLocal` 为每个线程保存线程私有的数据。
2. 定义无状态 bean(实际生产中较难)。

## AOP

### 什么是 AOP?

AOP 是面向切面编程的意思。其思想在于把与业务无关的，各个业务模块可以公用的模块（如日志、事务、异步调用等）封装起来，减少重复代码、降低耦合，其相关的设计模式为代理模式。

Spring AOP 基于动态代理实现。对于已经实现的接口，JDK 可以动态代理去创建代理对象；如果该对象没有实现接口，那么会使用 CGlib 动态代理生成一个代理的子类来作为代理。

### @EnableAspectJAutoProxy

`@Enable` 模块：`@Enable` 模块驱动注解 `EnableAspectJAutoProxy` 用于开启 AspectJ 自动代理。

```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import({AspectJAutoProxyRegistrar.class})
public @interface EnableAspectJAutoProxy {
    boolean proxyTargetClass() default false;

    boolean exposeProxy() default false;
}
```

`AspectJAutoProxyRegistrar` 为一个 `AspectJ` 自动代理注册器，通过 `@import` 注解导入。

## 如何解决循环依赖？

### 循环依赖与 IoC

> 类与类之间的依赖关系形成了闭环，就会导致循环依赖问题的产生。

通过 Spring IOC 流程的源码分析循环依赖问题：

1. 先从缓存中获取，获取不到则继续往下走
2. 实例化 Class A
3. 依赖注入 Class A 对象的成员变量（setter） -- 注意到此时辉产生循环依赖
4. 初始化 Class A（初始化方法）
5. 将 Class A 的引用放入一级缓存

循环依赖的三种情况：

1. 通过构造方法进行依赖注入的时候产生的循环依赖
2. 通过 setter 方法进行依赖注入的时候产生的循环依赖（多例模式下）
3. **通过 setter 方法进行依赖注入的时候产生的循环依赖（单例模式下）-- Spring 解决了这种场景下循环依赖的问题**

构造方法进行依赖主语的时候，new 对象的时候就阻塞住了。而多例的循环依赖每次 `getBean()` 时，都会产生一个新的 bean, 最终导致 OOM 发生。

### Spring 三大缓存

:::tip
Spring 解决循环依赖主要是通过两个缓存。总的来说，Spring 有三大缓存：一级缓存 singletonObjects, 二级缓存 earlySingletonObjects 和三级缓存 singletonFactories.
:::

#### 一级缓存 singletonObjects

1. 对容器外提供单例 bean 的存储功能
2. 非创建中的 bean 才会被存储在该缓存

#### 二级缓存 earlySingletonObjects

主要是存储原生的早期 bean.

1. 用于存储单例模式下创建的 bean 实例（该 bean 还在创建中）
2. 该缓存对内使用，Spring 内部的框架裸机使用该缓存

#### 三级缓存 singletonFactories

主要是存储代理的 bean.


参考：https://juejin.cn/post/6895753832815394824 继续书写。
