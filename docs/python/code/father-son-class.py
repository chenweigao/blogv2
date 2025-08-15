class Father(object):
    def __init__(self, name):
        self.name = name
        self.age = 10
        print("name: %s" % (self.name))

    def getName(self):
        return 'Father ' + self.name


class Son(Father):
    def __init__(self, name):
        super(Son, self).__init__(name)
        print("hi")
        self.name = name

    def getName(self):
        return 'Son ' + self.name + str(self.age)


if __name__ == '__main__':
    son = Son('runoob')
    print(son.getName())


"""
name: runoob
hi
Son runoob10
"""