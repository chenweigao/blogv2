---
title: OO & Class
date: 2021-09-05
---

## Class

### 作用域和命名空间

首先来看一个例子，参考文献 P1.1:

```python
def scope_test():
    def do_local():
        spam = "local spam"

    def do_nonlocal():
        nonlocal spam
        spam = "nonlocal spam"

    def do_global():
        global spam
        spam = "global spam"

    spam = "test spam"
    do_local()
    print("After local assignment:", spam)
    # After local assignment: test spam
    do_nonlocal()
    print("After nonlocal assignment:", spam)
    # After nonlocal assignment: nonlocal spam
    do_global()
    print("After global assignment:", spam)
    # After global assignment: nonlocal spam
    # 这时候还未修改是因为还在执行 scope_test 内部

scope_test()
print("In global scope:", spam)
# In global scope: global spam
```

附上官方的解释：

> 请注意 局部 赋值（这是默认状态）不会改变 scope_test 对 spam 的绑定。 nonlocal 赋值会改变 scope_test 对 spam 的绑定，而 global 赋值会改变模块层级的绑定。
>
> 您还可以发现在 global 赋值之前没有 spam 的绑定。


上述代码的理解应该包括一下几点：

1. 当内部作用域想修改外部作用域的变量时，就要用到 **global** 和 **nonlocal** 关键字了。如 `do_local()` 中的 `nolocal` 关键字可以成功修改 *spam("test spam")*  的值。

    举例而言：

    ```python
    #!/usr/bin/python3

    def outer():
        num = 10
        def inner():
            nonlocal num   # nonlocal关键字声明
            num = 100
            print(num)     # 100, nonlocal 关键字修改了函数 outer 内部的 num 变量
        inner()
        print(num)         # 100
    outer()
    ```


2. `global` 关键字一般是用来修改函数外部的变量（全局变量）。

    举例而言：

    ```python
    #!/usr/bin/python3

    num = 1
    def fun1():
        global num  # 需要使用 global 关键字声明
        print(num)  # 取到全局变量 1
        num = 123
        print(num)  # 123 成功给全局变量赋值
    fun1()
    print(num)      # 123 全局变量值被修改
    ```

    上面的 `scope_test()` 执行后，才修改到了函数外部的全局变量。

::: tip LEGB

虽然作用域是静态地确定的，但它们会被动态地使用。 在执行期间的任何时刻，会有 3 或 4 个命名空间可被直接访问的嵌套作用域:

- Local: 最先搜索的最内部作用域包含局部名称
- Encrosing: 从最近的封闭作用域开始搜索的任何封闭函数的作用域包含非局部名称，也包括非全局名称
- Global: 倒数第二个作用域包含当前模块的全局名称
- Built-in: 最外面的作用域（最后搜索）是包含内置名称的命名空间

:::

### self

> 方法的特殊之处就在于实例对象会作为函数的第一个参数被传入。 在我们的示例中，调用 x.f() 其实就相当于 MyClass.f(x)。 总之，调用一个具有 n 个参数的方法就相当于调用再多一个参数的对应函数，这个参数值为方法所属实例对象，位置在其他参数之前。
>
> 方法的第一个参数常常被命名为 self。 这也不过就是一个约定: self 这一名称在 Python 中绝对没有特殊含义。

### 给类添加迭代器

定义一个 `__iter__()` 方法来返回一个带有 `__next__()` 方法的对象。 如果类已定义了 `__next__()`，则 `__iter__()` 可以简单地返回 `self`:

```python
class Reverse:
    """Iterator for looping over a sequence backwards."""
    def __init__(self, data):
        self.data = data
        self.index = len(data)

    def __iter__(self):
        return self

    def __next__(self):
        if self.index == 0:
            raise StopIteration
        self.index = self.index - 1
        return self.data[self.index]
```

更优雅的方式是定义一个生成器：

```python
def reverse(data):
    for index in range(len(data)-1, -1, -1):
        yield data[index]
```


### 类方法 classmethod

如果我们想通过类来调用方法，而不是通过实例，那应该怎么办呢？

Python 提供了 `classmethod` 装饰器让我们实现上述功能，看下面的例子：

```python
class A(object):
    bar = 1
    @classmethod
    def class_foo(cls):
        print 'Hello, ', cls
        print cls.bar

>>> A.class_foo()   # 直接通过类来调用方法
Hello,  <class '__main__.A'>
1
```

> 被 `classmethod` 装饰的方法由于持有 `cls` 参数，因此我们可以在方法里面调用类的属性、方法，比如 `cls.bar`。

如果在类中增加 `__init__` 方法，可以看到类直接是无法调用到 `__init__` 中的属性的：

```python
class A(object):
    bar = 1

    def __init__(self):
        self.lis = [1, 2, 3]

    @classmethod
    def class_foo(cls):
        print('Hello, ', cls)
        print(cls.bar)
        print(cla.lis)


if __name__ == '__main__':
    A.class_foo()

>>> AttributeError: type object 'A' has no attribute 'lis'
```

### 静态方法 staticmethod

在类中往往有一些方法跟类有关系，但是又不会改变类和实例状态的方法，这种方法是静态方法，我们使用 `staticmethod` 来装饰。

:::tip Why @staticmethod?
静态方法没有 `self` 和 `cls` 参数，可以把它看成是一个普通的函数，我们当然可以把它写到类外面，但这是不推荐的，因为这不利于代码的组织和命名空间的整洁。
:::

```python
class A(object):
    bar = 1

    @staticmethod
    def static_foo():
        print('Hello, ', A.bar)


if __name__ == '__main__':
    a = A()
    a.static_foo()
    A.static_foo()

>>> Hello,  1
>>> Hello,  1
```

---
举一反三，我们对 A 中的 `bar` 属性能否进行修改呢？从下面例子中可以看出**类属性被修改了**。

```python
if __name__ == '__main__':
    A.bar = 3
    a = A()
    a.static_foo()

    A.bar = 2
    A.static_foo()

>>> Hello,  3
>>> Hello,  2
```

## 3. 继承与多态

### 函数继承

1. 如果子类没有定义自己的初始化函数，那么父类的初始化函数会被默认调用；但是如果这种情况下实例化子类的对象，应该传入父类的初始化参数，否则会报错；

2. 如果子类定义了自己的初始化函数，并且没有显式调用父类的初始化函数，则父类的属性不会被初始化；

   如果子类定义了自己的初始化函数，并且显式调用了父类的初始化函数，则子类和父类的属性都会被初始化；

3. 如果在子类中需要父类的构造方法就需要显式地调用父类的构造方法，或者不重写父类的构造方法。

   子类不重写 **__init__**，实例化子类时，会自动调用父类定义的 **__init__**。

    ```python
    class Father(object):
        def __init__(self, name):
            self.name=name
            print ( "name: %s" %( self.name) )
        def getName(self):
            return 'Father ' + self.name

    class Son(Father):
        def getName(self):
            return 'Son '+self.name

    if __name__=='__main__':
        son=Son('runoob')
        print ( son.getName() )

    # name: runoob
    # Son runoob
    ```

4. 如果重写了**__init__** 时，实例化子类，就不会调用父类已经定义的 **__init__**，语法格式如下：

   ```python
   class Father(object):
       def __init__(self, name):
           self.name=name
           print ( "name: %s" %( self.name) )
       def getName(self):
           return 'Father ' + self.name
    
   class Son(Father):
       def __init__(self, name):
           print ( "hi" )
           self.name =  name
       def getName(self):
           return 'Son '+self.name
    
   if __name__=='__main__':
       son=Son('runoob')
       print ( son.getName() )
       
   # hi
   # Son runoob
   ```

5. 如果重写了**__init__** 时，要继承父类的构造方法，可以使用 **super** 关键字：`super(子类，self).__init__(参数1，参数2，....)` 或者 `父类名称.__init__(self,参数1，参数2，...)`

   ```python
   class Father(object):
       def __init__(self, name):
           self.name=name
           print ( "name: %s" %( self.name))
       def getName(self):
           return 'Father ' + self.name

   class Son(Father):
       def __init__(self, name):
           super(Son, self).__init__(name)
           print ("hi")
           self.name =  name
       def getName(self):
           return 'Son '+self.name

   if __name__=='__main__':
       son=Son('runoob')
       print ( son.getName() )

   # name: runoob
   # hi
   # Son runoob
   ```

   拓展：如下代码可以看出来，子类也通过 `super` 继承了父类的属性：

   @[code](./code/father-son-class.py)


   > 在super机制里，可以保证公共父类仅被执行一次，至于执行的顺序，是按照**[MRO（Method Resolution Order）](https://www.pynote.net/archives/3500)**方法解析顺序 进行的。
   >
   > 简单理解，MRO顺序就是**代码中的书写顺序**


### QA

&#x2753;&#x2753;&#x2753; 子类继承父类时，实例化子类，会调用父类的 __init__ 方法吗？

::: warning 子类与父类的init
这是我经常混淆的点，可以通过下述的例子来观察，最终的结论是：**不会**。

除非在子类中显式调用 `super().__init__`, 但是在这种情况下也需要注意 MRO 列表问题。

总结来说：如果子类和父类都有 `__init__` 初始化方法，子类其实是重写了父类的 `__init__` 方法，如果不显式调用父类的 `__init__` 方法，父类的 `__init__` 方法就不会被执行!
:::

@[code](./code/father-son-class2.py)

### 继承易错知识点

看以下代码：

```python
class A:
    def __init__(self):
        print('A')
        pass


class B(A):
    def __init__(self):
        print('B')
        A.__init__


class C(A):
    def __init__(self):
        print('C')
        A.__init__


if __name__ == '__main__':
    B()
    C()

# B
# C
```

我们可以看到，`A.__init__` 并没有达到调用 A 的效果。正常的调用如下所示：

```python
class A:
    def __init__(self):
        print('A')
        pass


class B(A):
    def __init__(self):
        print('B')
        A.__init__(self)


class C(A):
    def __init__(self):
        print('C')
        A.__init__(self)


if __name__ == '__main__':
    B()
    C()

# B
# A
# C
# A
```
 
如果使用 super 类的方式调用父类初始化方法，这种写法不与父类类名绑定，且可以保证菱形继承场景下，创建一个子类对象仅调用顶层父类初始化函数一次。

举例如下：

@[code](./code/test-class2.py)

### super()

在类的继承中，如果重定义某个方法，该方法会覆盖父类的同名方法，但有时，我们希望能同时实现父类的功能，这时，我们就需要调用父类的方法了，可通过使用 `super` 来实现，比如：

```python
class Animal(object):
    def __init__(self, name):
        self.name = name

    def greet(self):
        print('name is', self.name)


class Dog(Animal):
    def greet(self):
        super().greet()
        print('WangWang...')


if __name__ == '__main__':
    d = Dog("wang_cai")
    d.greet()

#>>> name is wang_cai
#>>> WangWang...
```

`super` 的一个最常见用法可以说是**在子类中调用父类的初始化方法**了，比如：

```python
class Base(object):
    def __init__(self, a, b):
        self.a = a
        self.b = b


class A(Base):
    def __init__(self, a, b, c):
        super(A, self).__init__(a, b)  # Python3 可使用 super().__init__(a, b)
        self.c = c


if __name__ == '__main__':
    test = A(1, 2, 3)
    print(test.a, test.b, test.c)

#>>> 1 2 3
```

&#x2757;&#x2757;&#x2757;
:::warning super 其实和父类没有实质性的关联，MRO 列表
在多重继承的场景下会这样。对于你定义的每一个类，Python 会计算出一个方法解析顺序（Method Resolution Order, **MRO**）列表，它代表了类继承的顺序。
可以使用 `C.mro()` 查看。
:::

```python
class Base(object):
    def __init__(self):
        print "enter Base"
        print "leave Base"

class A(Base):
    def __init__(self):
        print "enter A"
        super(A, self).__init__()
        print "leave A"

class B(Base):
    def __init__(self):
        print "enter B"
        super(B, self).__init__()
        print "leave B"

class C(A, B):
    def __init__(self):
        print "enter C"
        super(C, self).__init__()
        print "leave C"
```

其对应的输出是：

```txt
>>> c = C()
enter C
enter A
enter B
enter Base
leave Base
leave B
leave A
leave C
```

## 4. 魔法方法 magic method

> 在 Python 中，我们可以经常看到以双下划线 `__` 包裹起来的方法，比如最常见的 `__init__`，这些方法被称为**魔法方法（magic method）**或**特殊方法（special method）**。
> 简单地说，这些方法可以给 Python 的类提供特殊功能，方便我们定制一个类，比如 `__init__` 方法可以对实例属性进行初始化。

完整的特殊方法列表可在[这里](https://docs.python.org/2/reference/datamodel.html#special-method-names)查看。

## 5 `__new__`

### QA

&#x2753;&#x2753;&#x2753; 为什么 __new__ 的第一个参数是 cls 而不是 self?
:::warning 
因为调用 `__new__` 的时候，实例对象还没有被创建，`__new__` 是一个静态方法。第一个参数 `cls` 表示当前的 `class`
:::

&#x2753;&#x2753;&#x2753; 如何理解 object.__new__的 object?
:::warning
`__new__` 方法如果返回 `cls` 的对象(`return super().__new__(cls)`)，则对象的 `__init__` 方法将自动被调用。

只要调用父类的 `__new__` 方法，`__init__` 方法就默认被调用，`object` 类是最大的父类。
:::

&#x2753;&#x2753;&#x2753; 我们可以只使用 `__new___` 来实例化对象实例吗？
:::warning
可以，但是不建议！还是建议使用 `__init__`。
:::

### 5.1 `__new__`

在 Python 中，当我们创建一个类的实例时，类会先调用 `__new__(cls[, ...])` 来创建实例，然后 `__init__` 方法再对该实例（self）进行初始化。

关于 `__new__` 和 `__init__` 有几点需要注意：

- `__new__` 是在 `__init__` 之前被调用的；
- `__new__` 是类方法，`__init__` 是实例方法；
- 重载 `__new__` 方法，需要返回类的实例；

:::warning 为什么我们一般在创建类的时候没有重载 __new__ 呢？
一般情况下，我们不需要重载 `__new__` 方法。但在某些情况下，我们想**控制实例的创建过程**，这时可以通过重载 `__new__` 方法来实现。
:::

举例而言：

```python
class A(object):
    _dict = dict()

    def __new__(cls):
        if 'key' in A._dict:
            print("EXISTS")
            print("A._dict['key']", A._dict['key'])
            return A._dict['key']
        else:
            print("__NEW__")
            return object.__new__(cls)

    def __init__(self):
        print("__INIT__")
        A._dict['key'] = 'aaa'


if __name__ == '__main__':
    a1 = A()
    a2 = A()
    a3 = A()
```

其对应的输出如下所示：

```txt
__NEW__
__INIT__
EXISTS
A._dict['key'] aaa
EXISTS
A._dict['key'] aaa
```

我们可以观察到：

1. `__init__` 方法始终被调用了；
2. `object.__new__(cls)` 可以实例化对象。



:::tip 🍉🍉🍉 关于 `object.__new__(cls)`
可以使用 `object.__new__(cls)` 实现单例（即一个类只有一个实例，例子如上面例子）
:::

### 5.2 实例化的本质 __new__ 与 __init__

本小节通过分析 `__new__` 与 `__init__` 的关系总结实例化本质。

&#x1F498; &#x1F498; &#x1F498; 先看例子：**这是一个正确的示例**

```python
class Person():
    def __new__(cls, age):
        print('__new__, age:', age)
        # return super(Person, cls).__new__(cls) # ok
        # return object.__new__(cls) # ok
        return super().__new__(cls)

    def __init__(self, age):
        print('__init__, age:', age)
        self.age = age


if __name__ == '__main__':
    Person(100)

# >>> __new__, age: 100
# >>> __init__, age: 100
```

1. 我们可以使用多种方式来实现 `__new__`
2. `__new__` 和 `__init__` 方法共享同名的参数，除了第一个从 `cls` 变成了 `self`
3. 如果 `__new__` 没有返回实例对象，则 `__init__` 方法不会被调用

&#x274C;&#x274C;&#x274C; 如果 `__init__` 传入的参数比 `__new__` 多的话会发生什么呢？

```python
class Person():
    def __new__(cls, age, name):
        print('__new__, age:', age)
        return super().__new__(cls)

    def __init__(self, age):
        print('__init__, age:', age)
        self.age = age


if __name__ == '__main__':
    Person(100)

#>>> TypeError: __new__() missing 1 required positional argument: 'name'
```

&#x274C;&#x274C;&#x274C; 如果 `__init__` 传入的参数比 `__new__` 少的话会发生什么呢？

```python
class Person():
    def __new__(cls, age):
        print('__new__, age:', age)
        return super().__new__(cls)

    def __init__(self, age, name):
        print('__init__, age:', age)
        self.age = age


if __name__ == '__main__':
    Person(100)

#>>> TypeError: __init__() missing 1 required positional argument: 'name'
```

&#x2757;&#x2757;&#x2757; 实例化的本质
:::tip  &#x2728;&#x2728;&#x2728; 实例化的本质
实例初始化本质是向 `__new__` 中传参!
:::



&#x1F498; &#x1F498; &#x1F498; 我们常用的定义类的写法，最标准的写法参考如下：

```python
class Person():
    def __new__(cls, *args, **kwargs):
        return super().__new__(cls)

    def __init__(self, age, name):
        self.age = age
        self.name = name


if __name__ == '__main__':
    p = Person(100, "zhanshen")
```

我们如果在创建实例的时候加入判断，可以分别如下：

- 在 `__new__` 中判断参数。此时对象不会创建，即 `__init__` 不会被调用；
- 在 `___init__` 中判断参数。此时对象会创建。

举例如下：

```python
class Person():
    def __new__(cls, age):
        print('__new__')
        if age < 100:
            print('not created!')
            return cls
        return super().__new__(cls)

    def __init__(self, age):
        print('__init__')
        self.age = age


if __name__ == '__main__':
    p = Person(10)

#>>> __new__
#>>> not created!
```

可以看出，`__init__` 未被调用，对象也未创建。如果使用 `__init__` 判断的话，可以看到，对象被创建了。

```python
class Person():
    def __new__(cls, age):
        print('__new__')
        return super().__new__(cls)

    def __init__(self, age):
        if age < 100:
            print('__init__')
            print('wrong!')
        self.age = age


if __name__ == '__main__':
    p = Person(10)

#>>> __new__
#>>> __init__
#>>> wrong!
```

### 5.3 `__new__` 返回其他实例

我们还可以通过 `__new__` 返回其他类的实例：如 `return object.__new__(Person)`

```python
class Person(object):
    def __new__(cls, *args, **kwargs):
        return object.__new__(cls)

    def __init__(self, age):
        self.age = age


class Test(object):
    def __new__(cls, *args, **kwargs):
        return object.__new__(Person)


if __name__ == '__main__':
    p = Test(100)
    p.age = 10
    print(type(p), p.age)

#>>> <class '__main__.Person'> 10
```

## 6. `__str__`

重写 `__str__` 以达到打印的目的：

```python
class Foo(object):
    def __init__(self, name):
        self.name = name

    def __str__(self):
        print('__str__', self.name)
        return 'name is ' + self.name

    # def __repr__(self):
    #     print('__repr__', self.name)
    #     return 'name is ' + self.name
    __repr__ = __str__


if __name__ == '__main__':
    print(Foo('zhanshen'))

#>>> __str__ zhanshen
#>>> name is zhanshen
```

## 7. `__call__`

我们一般使用 `obj.method()` 来调用对象的方法，那能不能直接在实例本身上调用呢？在 Python 中，只要我们在类中定义 `__call__` 方法，就可以对实例进行调用，比如下面的例子：

```python
class Point(object):
    def __init__(self, x, y):
        self.x, self.y = x, y
    def __call__(self, z):
        return self.x + self.y + z
```

使用方法如下：

```python
>>> p = Point(3, 4)
>>> callable(p)     # 使用 callable 判断对象是否能被调用
True
>>> p(6)            # 传入参数，对实例进行调用，对应 p.__call__(6)
13                  # 3+4+6
```

## 8. `__slot__`

在 Python 中，我们在定义类的时候可以定义属性和方法。当我们创建了一个类的实例后，我们还可以给该实例绑定任意新的属性和方法。

```python
class Point(object):    
    def __init__(self, x=0, y=0):
        self.x = x
        self.y = y

>>> p = Point(3, 4)
>>> p.z = 5    # 绑定了一个新的属性
>>> p.z
5
>>> p.__dict__
{'x': 3, 'y': 4, 'z': 5}
```

因此，为了不浪费内存，可以使用 `__slots__` 来告诉 Python 只给一个固定集合的属性分配空间，对上面的代码做一点改进，如下：

```python
class Point(object):
    __slots__ = ('x', 'y')       # 只允许使用 x 和 y

    def __init__(self, x=0, y=0):
        self.x = x
        self.y = y

>>> p = Point(3, 4)
>>> p.z = 5
Traceback (most recent call last):
  File "<input>", line 1, in <module>
AttributeError: 'Point' object has no attribute 'z'
```

> 使用 `__slots__` 有一点需要注意的是，`__slots__` 设置的属性仅对当前类有效，对继承的子类不起效，除非子类也定义了 `__slots__`，这样，子类允许定义的属性就是自身的 `slots` 加上父类的 `slots。`

## 9. 元类 metaclass

### 9.1 什么是元类

```md
类是实例对象的模板，元类是类的模板

+----------+             +----------+             +----------+
|          |             |          |             |          |
|          | instance of |          | instance of |          |
| instance +------------>+  class   +------------>+ metaclass|
|          |             |          |             |          |
|          |             |          |             |          |
+----------+             +----------+             +----------+
```

## P. 参考文献

1. [Python 之旅](https://wiki.jikexueyuan.com/project/explore-python/)

2. [Pyton 作用域与命名空间，官方文档](https://docs.python.org/zh-cn/3/tutorial/classes.html)

