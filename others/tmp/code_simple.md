# 如何让业务代码有扩展性

## Demo 实现

### 1. 定义 handler

```java
package cc.weigao.test01.handler;

import org.aopalliance.intercept.Invocation;
import org.springframework.core.Ordered;

public interface AbstractHandler extends Ordered {

    default boolean preHandler(Invocation invocation) {
        return true;
    }

    default void afterHandler(Invocation invocation) {
    }
}
```

该步骤相当于创建了处理器接口。

注意这个 `Ordered` 是 spring 中的。

@todo 分析 Ordered

### 2. 创建处理器 chain

```java
package cc.weigao.test01.chain;

public class MethodInterceptorChain {

    private final List<AbstractHandler> abstractHandlerList = new ArrayList<>();

    public void addHandler(AbstractHandler handler) {
        abstractHandlerList.add(handler);
    }

    public List<AbstractHandler> getAbstractHandlerList() {
        if (abstractHandlerList.isEmpty()) {
            return Collections.emptyList();
        }

        AnnotationAwareOrderComparator.sort(abstractHandlerList);
        return Collections.unmodifiableList(abstractHandlerList);
    }
}
```

#### AnnotationAwareOrderComparator

@TODO

### 3. 定义 Invocation 类

```java
package cc.weigao.test01.model;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Invocation {

    private Method method;

    private Object target;

    private Object[] args;

    public Object invoke() throws InvocationTargetException, IllegalAccessException {
        return method.invoke(target, args);
    }
}
```

### 4. 业务逻辑和责任链整合

