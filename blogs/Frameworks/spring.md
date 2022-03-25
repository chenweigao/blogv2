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