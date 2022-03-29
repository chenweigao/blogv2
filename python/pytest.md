# Pytest

总结一下 Pytest 和 Python Unitest 相关的基础用法和学习心得。

Pytest 的[官方文档](https://learning-pytest.readthedocs.io/zh/latest/)

## Pytest 入门

### 捕获异常

使用 `pytest.raise()` 来捕获异常。

```python
# 官方示例
# test_raises.py

def test_raises():
    with pytest.raises(TypeError) as e:
        connect('localhost', '6379')
    exec_msg = e.value.args[0]
    assert exec_msg == 'port type must be int'
```

### 标记函数 pytest.mark

> 默认情况下，pytest 会递归查找当前目录下所有以 `test` 开始或结尾的 Python 脚本，并执行文件内的所有以 `test` 开始或结束的函数和方法。

标记函数的作用是在某些情况下，我们只想执行指定的测试函数，所以可以使用 `ptest.mark` 进行标记。

```python
# 官方示例
# test_with_mark.py

@pytest.mark.finished
def test_func1():
    assert 1 == 1

@pytest.mark.unfinished
def test_func2():
    assert 1 != 1
```

然后在命令行中使用 `-m` 选择标记的函数：

```bash
pytest -m finished test_with_mark.py

pytest -m "finished and commit"
```

一个函数可以打多个标记，多个函数也可以打相同的标记；具体多个标记的执行如上代码所示。


:::tip
除此之外，pytest 还有一些其他的方法可以指定要测试的具体函数，如 `:::` 标记和 `-k` 模糊匹配等，不太常用，具体用法可以参考官方文档。
:::

### 跳过测试 pytest.mark.skip

可以使用标记 `pytest.mark.skip` 来指定要跳过的测试，具体用法如下：

1. 标记要跳过的函数

```python
# test_skip.py

@pytest.mark.skip(reason='out-of-date api')
def test_connect():
    pass

# test_skip.py s                                       [100%]
```

执行后命令行显示 `s` 就表示测试被跳过(SKIPPED)。

2. 指定被忽略的条件

```python
@pytest.mark.skipif(conn.__version__ < '0.2.0',
                    reason='not supported until v0.2.0')
def test_api():
    pass
```

### 预见的错误 pytest.mark.xfail

> 如果我们事先知道测试函数会执行失败，但又不想直接跳过，而是希望显式地提示。

此时可以使用 `pytest.mark.xfail` 实现预见错误功能：

```python
# test_xfail.py

@pytest.mark.xfail(gen.__version__ < '0.2.0',
                   reason='not supported until v0.2.0')
def test_api():
    id_1 = gen.unique_id()
    id_2 = gen.unique_id()
    assert id_1 != id_2

# pytest test_xfail.py
# test_xfail.py x                                      [100%]
```

执行后命令行显示 `x` 就表示预见的失败(XFAIL)。

需要注意，如果提示大写的 `X`, 则说明预见的是失败，但实际运行测试却成功通过(XPASS)。

### 参数化 pytest.mark.parametrize
  
参数化测试可以保证每组参数都独立进行一次测试，比如关于不同密码返回不同结果要如何测试，示例代码如下：

```python
# test_parametrize.py

@pytest.mark.parametrize('passwd',
                      ['123456',
                       'abcdefdfs',
                       'as52345fasdf4'])
def test_passwd_length(passwd):
    assert len(passwd) >= 8
```

这段代码总共可以进三次测试，如返回 `F..`。

除此之外，还可以传入多组参数进行参数化校验，并且使用 `pytest.param` 的 `id` 参数进行自定义，这样就能很方便地查看是哪个参数通过，哪个没通过。

```python
# test_parametrize.py

@pytest.mark.parametrize('user, passwd',
                         [pytest.param('jack', 'abcdefgh', id='User<Jack>'),
                          pytest.param('tom', 'a123456a', id='User<Tom>')])
def test_passwd_md5_id(user, passwd):
    db = {
        'jack': 'e8dc4081b13434b45189a720b77b6818',
        'tom': '1702a132e769a623c1adb78353fc9503'
    }

    import hashlib

    # abcdefgh = e8dc4081b13434b45189a720b77b6818
    assert hashlib.md5(passwd.encode()).hexdigest() == db[user]
```


## fixture 固件

主要为 `fixture` 固件相关的操作。

### fixture 定义

fixture 在 pytest 中表现为一个装饰器，在 JAVA 中，fixture 是这么定义的：

> JUnit 提供了编写测试前准备、测试后清理的固定代码，我们称之为 Fixture。

在 pytest 中，固件的作用是在执行测试函数之前（或之后）加载运行的函数；我们可以使用固件做任何事情。

```python
# test_postcode.py

@pytest.fixture()
def postcode():
    return '010'

def test_postcode(postcode):
    assert postcode == '010
```

这种是在测试脚本中直接使用固件的例子，一般而言，如果我们希望固件可以在更大程度上服用，可以对固件进行集中管理。

pytest 使用 `conftest.py` 集中管理固件。

:::tip pytest 官方提示
在复杂的项目中，可以在不同的目录层级定义 `conftest.py`，其作用域为其所在的目录和子目录。
:::

### 预处理和后处理

pytest 使用 `yield` 关键词将固件分为两个部分，其之前的代码属于预处理，之后的代码属于后处理。

可以使用 `-s` 参数阻止消息被吞，使用 `--setup-show` 选项跟踪更细额固件执行。

```bash
$ pytest -s test_demo.py
$ pytest --setup-show test_demo.py
```

### 作用域

作用域可以用来指定固件的作用范围，默认的作用域为 `function`。

```python
@pytest.fixture(scope='function')
def func_scope():
    pass


@pytest.fixture(scope='module')
def mod_scope():
    pass


@pytest.fixture(scope='session')
def sess_scope():
    pass


@pytest.fixture(scope='class')
def class_scope():
    pass
```

可以看出，上面的作用域作用于函数，要是想对类使用作用域，如下：

```python
# test_scope.py

@pytest.mark.usefixtures('class_scope')
class TestClassScope:
    def test_1(self):
        pass

    def test_2(self):
        pass
```

:::tip pytest 作用域，官方文档
在定义固件时，通过 `scope` 参数声明作用域，可选项有：

- `function`: 函数级，每个测试函数都会执行一次固件；
- `class`: 类级别，每个测试类执行一次，所有方法都可以使用；
- `module`: 模块级，每个模块执行一次，模块内函数和方法都可使用；
- `session`: 会话级，一次测试只执行一次，所有被找到的函数和方法都可用。
:::

### 自动执行

在定义固件时指定 `autouse` 参数，即可让固件自动执行。

如可以在测试时统计测试的耗时，下面是两个自动计时固件，一个用于统计每个函数运行时间（`function` 作用域），一个用于计算测试总耗时（`session` 作用域）：

  <<< @/docs/.vuepress/code/demo/pytest_autouse_demo.py

### 重命名

固件的默认名称为定义时的函数名，可以通过 `name` 选项指定名称：

```python
# test_rename.py

@pytest.fixture(name='age')
def calculate_average_age():
    return 28

def test_age(age):
    assert age == 28
```

### 参数化

固件参数化结合了前面 pytest 参数化的用法。

> 与函数参数化使用 `@pytest.mark.parametrize` 不同，固件在定义时使用 `params` 参数进行参数化。

固件参数化需要使用 pytest 内置的固件 `request`，并通过 `request.param` 获取参数。

使用 pytest 的固件参数化连接两个不同数据库的示例如下所示：

```python
@pytest.fixture(params=[
    ('redis', '6379'),
    ('elasticsearch', '9200')
])
def param(request):
    return request.param


@pytest.fixture(autouse=True)
def db(param):
    print('\nSucceed to connect %s:%s' % param)

    yield

    print('\nSucceed to close %s:%s' % param)


def test_api():
    assert 1 == 1

"""
tests\fixture\test_parametrize.py
Succeed to connect redis:6379
.
Succeed to close redis:6379

Succeed to connect elasticsearch:9200
.
Succeed to close elasticsearch:9200
"""
```

这边的操作使用固件抽离出数据库的通用操作，使得每个 API 都能复用这些数据库固件，同时也提高了可维护性。

:::warning TODO
这边可以考虑使用固件的参数化进行代码重构，精简代码
:::

### 内置固件

pytest 中有很多实用的内置固件，在这记录一下，具体可以查阅官方文档。

- tmpdir & tmpdir_factory：
    
    使用 `tmpdir.mkdir()` 创建目临时录，`tmpdir.join()` 创建临时文件（或者使用创建的目录）。

- pytestconfig
    
    使用 `pytestconfig`，可以很方便的读取命令行参数和配置文件。(`conftest.py` 中使用函数 `pytest_addoption`, 通过 `pytestconfig` 获取命令行参数)

- capsys
    
    `capsys` 用于捕获 `stdout` 和 `stderr` 的内容，并临时关闭系统输出。

- monkeypatch

   ` monkeypath` 用于运行时动态修改类或模块。
   :::warning TODO
   这个很重要，需要好好理解，看以后是否有用：[https://learning-pytest.readthedocs.io/zh/latest/doc/fixture/builtin-fixture.html](https://learning-pytest.readthedocs.io/zh/latest/doc/fixture/builtin-fixture.html)
   :::

- recwarn

    `recwarn` 用于捕获程序中 warnings 产生的警告。

## 单元测试

### 基本例子

举个基本的用例：

```python
import unittest

class WidgetTestCase(unittest.TestCase):
    def setUp(self):
        self.widget = Widget('The widget')

    def test_default_widget_size(self):
        self.assertEqual(self.widget.size(), (50,50),
                         'incorrect default size')

    def test_widget_resize(self):
        self.widget.resize(100,150)
        self.assertEqual(self.widget.size(), (100,150),
                         'wrong size after resize')
    
    def tearDown(self):
        self.widget.dispose()
        
if __name__ == '__main__':
    unittest.main()
```

### skip 测试用例

以下内容均可以跳过：

```python
class Test(unittest.TestCase):

    @unittest.skip("skip it")
    def test_1(self):
        print('1')

    @unittest.skipIf(1 < 2, '前面条件成立，跳过')
    def test_2(self):
        print('2')

    @unittest.skipUnless(1 > 2, '前面条件为 False 跳过')
    def test_3(self):
        print('3')
```

### DDT 数据驱动

> DDT: Data Drive Test

```python
import unittest
from ddt import ddt
from ddt import data


@ddt
class DdtTest(unittest.TestCase):
    def setUp(self) -> None:
        print('start...')

    def tearDown(self) -> None:
        print('end!')

    @data('a', 'b', 'c')
    def test_1(self, txt):
        print(txt)


if __name__ == '__main__':
    unittest.main(verbosity=2)
    """
    start...
    a
    end!
    start...
    b
    end!
    start...
    c
    end!
    """
```

从上面的例子中，有几点需要注意的：

1. `setUp` 和 `tesrDown` 这两个在每一次测试用例执行的时候都会执行一遍。所以可以看到，我们使用数据驱动了 3 个测试用例，这两个也被执行了三次。

2. 也可以将测试的数据用在文件中，然后使用文件读取的方式进行读取，而后 unpack，其使用的方式类似于：

    ```python
    @file_data('ddt.xml')
    def test_xx(self, txt):
        print(txt)
    ```

3. 如果需要 unpack 的话，就如下所示：

    ```python
    # coding=UTF-8
    import unittest

    import ddt


    def read_file():
        params = []
        file = open('test.txt', 'r', encoding='gbk')
        for line in file.readlines():
            params.append(line.strip('\n').split(','))
        return params


    @ddt.ddt()
    class Test(unittest.TestCase):
        def setUp(self) -> None:
            print('start...')

        def tearDown(self) -> None:
            print('end!')

        @ddt.data(*read_file())
        @ddt.unpack
        def test_1(self, id, name):
            print(id, name)


    if __name__ == '__main__':
        unittest.main()
    ```

    给出要读取文件的内容：
    
    `test.txt`
    ```txt
    1,name1
    2,zhanshen
    3,wait
    ```
### DDT + YML

:::tip Python 安装 yml 扩展
`pip install PyYaml`
:::


可以配合 DDT 和 YML 文件来实现数据驱动：

YML 的文件定义不同，在 Python 中解析出来的结果也不同：

- 嵌套的字典
- 列表

分别进行说明：

1.  字典

`dicts.yml` 的格式如下所示：


  <<< @/docs/.vuepress/code/python/dicts.yml

如果使用 Python 进行解析的话，代码可以如下所示：

```python
# coding=UTF-8
import yaml


def read_file():
    file = open('dicts.yml', 'r', encoding='utf-8')
    dic = yaml.load(file, Loader=yaml.FullLoader)
    print(dic)
```

会输出一个字典：`{'name': 'weigao', 'age': 24, 'data': {'a': 1, 'b': 2, 'c': 3, 'd': 4}, 'list': ['a', 'b', 'c', 'd']}`

方便观看，转换成 JSON：

  <<< @/docs/.vuepress/code/python/dicts.json


2. 列表

其解析如下所示：

```python
import unittest

import ddt


@ddt.ddt
class Test(unittest.TestCase):
    def setUp(self) -> None:
        print('start...')

    def tearDown(self) -> None:
        print('end!')

    @ddt.file_data('list.yml')
    def test_yml(self, **kwargs):
        print(kwargs['name'],  kwargs['age'])


if __name__ == '__main__':
    unittest.main()
```

`list.yml` 的文件内容为：

  <<< @/docs/.vuepress/code/python/list.yml

可以解析出来，输出如下：

```txt
start...
weigao 24
end!
start...
zhanshen 10089
end!
```
