# Mermaid 图表测试

这是一个测试页面，用于验证 vitepress-plugin-mermaid 插件是否正常工作。

## 流程图示例

```mermaid
graph TD
    A[开始] --> B{是否登录?}
    B -->|是| C[显示主页]
    B -->|否| D[跳转登录页]
    D --> E[用户输入凭据]
    E --> F{验证成功?}
    F -->|是| C
    F -->|否| G[显示错误信息]
    G --> E
    C --> H[结束]
```

## 序列图示例

```mermaid
sequenceDiagram
    participant 用户
    participant 前端
    participant 后端
    participant 数据库

    用户->>前端: 发送登录请求
    前端->>后端: 转发登录信息
    后端->>数据库: 查询用户信息
    数据库-->>后端: 返回用户数据
    后端-->>前端: 返回验证结果
    前端-->>用户: 显示登录状态
```

## 类图示例

```mermaid
classDiagram
    class User {
        +String username
        +String email
        +String password
        +login()
        +logout()
        +updateProfile()
    }
    
    class Article {
        +String title
        +String content
        +Date createdAt
        +User author
        +publish()
        +edit()
        +delete()
    }
    
    class Comment {
        +String content
        +Date createdAt
        +User author
        +Article article
        +reply()
        +delete()
    }
    
    User ||--o{ Article : writes
    User ||--o{ Comment : writes
    Article ||--o{ Comment : has
```

## 状态图示例

```mermaid
stateDiagram-v2
    [*] --> 未登录
    未登录 --> 登录中 : 点击登录
    登录中 --> 已登录 : 登录成功
    登录中 --> 未登录 : 登录失败
    已登录 --> 未登录 : 退出登录
    已登录 --> 编辑中 : 创建文章
    编辑中 --> 已登录 : 保存文章
    编辑中 --> 已登录 : 取消编辑
```

## 甘特图示例

```mermaid
gantt
    title 项目开发计划
    dateFormat  YYYY-MM-DD
    section 设计阶段
    需求分析           :done,    des1, 2024-01-01,2024-01-05
    UI设计            :done,    des2, 2024-01-06,2024-01-12
    架构设计          :done,    des3, 2024-01-10,2024-01-15
    section 开发阶段
    前端开发          :active,  dev1, 2024-01-16,2024-02-15
    后端开发          :         dev2, 2024-01-20,2024-02-20
    数据库设计        :         dev3, 2024-01-16,2024-01-25
    section 测试阶段
    单元测试          :         test1, 2024-02-16,2024-02-25
    集成测试          :         test2, 2024-02-26,2024-03-05
    用户测试          :         test3, 2024-03-06,2024-03-12
```

## 饼图示例

```mermaid
pie title 技术栈使用比例
    "Vue.js" : 35
    "JavaScript" : 25
    "CSS" : 20
    "Node.js" : 15
    "其他" : 5
```

如果以上图表都能正常显示，说明 mermaid 插件集成成功！