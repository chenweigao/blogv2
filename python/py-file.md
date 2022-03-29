# Python File

## Q&A

1. `a` 是可访问可修改的吗？
   不是。`a`表示在文件后追加写，append。`a+` 既可以追加到文件中，也可以读取文件中的内容，而 `a` 是不可以读操作的。

## Summary

| 模式 | 操作              | 文件不存在 | 是否覆盖 |
| ---- | ----------------- | ---------- | -------- |
| r    | read 只读         | 报错       | -        |
| w    | write 可写        | 创建       | 是       |
| a    | append 文件后追加 | 创建       | 否 追加  |
| r+   | 可读 可写         | 报错       | 是       |
| w+   | 可读 可写         | 创建       | 是       |
| a+   | 可读 可写         | 创建       | 否 追加  |

## BCD `fopen()` 手册

> The argument mode points to a string beginning with one of the following sequences (Additional characters may follow these sequences.):

- `r`   Open text file for **reading**.  The stream is positioned at the
         **beginning** of the file.

- `r+`  Open for **reading and writing**.  The stream is positioned at the
         **beginning** of the file.

- `w`   Truncate file to **zero length** or create text file for **writing**.
         The stream is positioned at the **beginning** of the file.

- `w+`  Open for **reading and writing**.  The file is created if it does not
         exist, otherwise it is **truncated**.  The stream is positioned at
         the **beginning** of the file.

- `a` Open for **writing**.  The file is created if it does not exist.  The
         stream is positioned at the **end** of the file.  Subsequent writes
         to the file will always end up at the then current end of file,
         irrespective of any intervening fseek(3) or similar.

- `a+`  Open for **reading and writing**.  The file is created if it does not
         exist.  The stream is positioned at the **end** of the file.  Subse-
         quent writes to the file will always end up at the then current
         end of file, irrespective of any intervening fseek(3) or similar.
