EXPLAIN SELECT * FROM node
WHERE id IN (
	SELECT child FROM edge
	WHERE parent = 3 )

CREATE TABLE edge
(
    id INT(11) UNIQUE COMMENT '节点id',
    state VARCHAR(25),
    PRIMARY KEY(id)
)

CREATE TABLE child_parent_relation 
(
	id INT(11) COMMENT '标识符id，作为主键',
	child INT(11) COMMENT '子节点的id',
	parent INT(11) COMMENT '子节点对应的父节点id',
	FOREIGN KEY(child) REFERENCES soc_nodedgee_config(id),
	FOREIGN KEY(parent) REFERENCES edge(id),
	PRIMARY KEY(id),
	KEY parent(parent) USING BTREE,
	KEY child(child) USING BTREE,
	KEY child_to_parent(child, parent) USING BTREE
)

SHOW INDEX FROM child_parent_relation