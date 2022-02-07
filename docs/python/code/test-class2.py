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


class D(B, C):
    def __init__(self):
        print('D')
        B.__init__(self)
        C.__init__(self)


"""
以下是正确示例
"""


class A1:
    def __init__(self):
        print('A')
        pass


class B1(A1):
    def __init__(self):
        print('B')
        super(B1, self).__init__()


class C1(A1):
    def __init__(self):
        print('C')
        super(C1, self).__init__()


class D1(B1, C1):
    def __init__(self):
        print('D')
        super(D1, self).__init__()


if __name__ == '__main__':
    print('---D---')
    D()
    print('---D1---')
    D1()

"""
---D---
D
B
A
C
A
---D1---
D
B
C
A
"""
