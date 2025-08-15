---
title: MySql 基础总结
date: 2019-09-14
category:
 - Database
tag:
 - database
---

本文主要介绍了 MySql 中涉及到的工具软件，以及 MySql 的查找、插入和删除操作；除此之外还介绍了简单的索引知识和存储引擎；还列举了 DAG 图的设计代码。

<!-- more -->

## Tools: MySql 工具软件

1. 客户端数据库可视化查询软件 SQLyog
2. SQL Server 启动程序 XAMPP

## MySQL Command

### Login

```sql
mysql -uroot

use soc;
show tables;

show columns in table_name;
select * from table_name limit 1 \G;
```

### DROP

删除：

```sql
DROP DATABASE db_name

DROP TABLE table_name

ALTER TABLE table_name DROP INDEX index_name
```

如果想删除表中所有的数据但是不影响到表的结构：

```sql
TRUNCATE TABLE table_name
```

### ALTER

在数据库中插入新的 table 或者说新的列：

```sql
ALTER TABLE table_name
ADD column_name datatype

ALTER TABLE edge
ADD ancestor VARCHAR(256)
```

删除同理：

```sql
ALTER TABLE edge 
DROP COLUMN ancestor
```

### JOIN

在 MySQL 中，主要是 `INNER JOIN`, 表示内连接，可以同时连接两个表进行组合查询：

```sql
SELECT column_name(s)
FROM table_name1
INNER JOIN table_name2 
ON table_name1.column_name=table_name2.column_name
```

## MySql vs DAG

[可以参考这一篇博客，讲述了如何使用 MySql + 邻接表存储一个 DAG](https://www.codeproject.com/Articles/22824/A-Model-to-Represent-Directed-Acyclic-Graphs-DAG-o)，代码如下所示：

```sql
-- DAG (Directed Acyclic Graph) 示例 SQL
-- 创建节点表
CREATE TABLE nodes (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- 创建边表（邻接表）
CREATE TABLE edges (
    from_node INT,
    to_node INT,
    PRIMARY KEY (from_node, to_node),
    FOREIGN KEY (from_node) REFERENCES nodes(id),
    FOREIGN KEY (to_node) REFERENCES nodes(id)
);

-- 插入示例数据
INSERT INTO nodes (id, name) VALUES 
(1, 'Start'),
(2, 'Process A'),
(3, 'Process B'),
(4, 'End');

INSERT INTO edges (from_node, to_node) VALUES
(1, 2),
(1, 3),
(2, 4),
(3, 4);

-- 查询从起始节点到所有可达节点的路径
WITH RECURSIVE path_finder AS (
    SELECT from_node, to_node, 1 as depth, 
           CAST(from_node AS CHAR(1000)) as path
    FROM edges
    WHERE from_node = 1
    
    UNION ALL
    
    SELECT e.from_node, e.to_node, pf.depth + 1,
           CONCAT(pf.path, ' -> ', e.to_node)
    FROM edges e
    JOIN path_finder pf ON e.from_node = pf.to_node
    WHERE pf.depth < 10  -- 防止无限递归
)
SELECT * FROM path_finder;
```

## Index 索引

### explain

对于建立的索引，想查看其性能如何：

```sql
explain select * from tables where c1='a1'and c2='c2';
```

使用 explain 命令即可。

### 索引类型

1. 唯一索引 -- UNIQUE

此索引的每一个索引值只对应唯一的数据记录；索引的值必须唯一，但是允许有空值（注意和主键不同）。

2. 主键索引

3. 组合索引

4. 全文索引

非常消耗磁盘空间

### 索引内部数据结构

MySQL 数据库可以分为三种类型，分别为：

1. BTree B+Tree

B 树，即平衡二叉树，是一个二叉树，查找的时候使用二分查找。  
B+ 树，Mysql 的索引主要实现结构。

2. 散列索引

通过 hash 函数来定位的一种索引。

3. 位图索引

位图索引是一个针对多个字段的简单查询设计一种特殊的索引，适用范围比较小，只适用于字段值固定并且值的种类很少的情况。比如说性别，只有男和女，或者状态等等。

## 存储引擎

### InnoDB

InnoDB 默认是事务存储引擎，默认。

使用 InnoDB 的时候，会将数据表分为 .frm 和 ibd 两个文件进行存储。

**行锁**设计、支持外检，默认读取操作不会产生锁。

存储引擎采用聚集(clustered)的方式，每张表都是按照主键的形式进行存储的。

### MyISAM

不支持事务，**表锁**设计，支持全文索引，不支持事务。

索引文件 .MYI(MyIndex) 和 数据文件 .MYD(MyData)分离

缓冲池值缓存索引文件，而不缓存数据文件。