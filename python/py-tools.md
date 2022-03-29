# Python Tools

## IPython

```bash
pip install jupyter
jupyter notebook
```

## %timeit

In `IPython`, we could use `%timeit` to calculate the time consume of a command:

```py
In [1]: %timeit [1, 2, 3, 4, 5]

In [2]: %timeit (1, 2, 3, 4, 5)
```

## Personalized

```py
import sys
sys.ps1
'>>>'

sys.ps1 = 'cwg-python>>'
```

这样就可以改变解释器前面的那个外观了，注意修改后退出不会保存修改的结果。

### File Server

```py
python -m http.server
#default port: 8000

python -m http.server 80
#in port 80
```