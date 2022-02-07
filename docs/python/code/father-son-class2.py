class Animal(object):
    def __init__(self, name):
        print('__init__Animal')
        self.name = name

    def greet(self):
        print('Hello, I am %s.' % self.name)


class Dog(Animal):
    def __init__(self, name):
        print('__init__Dog')
        self.name = name

    def greet(self):
        print('WangWang.., I am %s. ' % self.name)


if __name__ == '__main__':
    dog = Dog('dog')
    dog.greet()


""""
>>> __init__Dog
>>> WangWang.., I am dog. 
"""
