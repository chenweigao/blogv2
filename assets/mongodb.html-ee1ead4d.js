import{_ as o}from"./plugin-vue_export-helper-c27b6911.js";import{r as p,o as c,c as l,a as n,b as a,d as t,f as e}from"./app-22cda79c.js";const u={},i=n("p",null,"Common RDB(Relational Database): PostgreSQL, MySQL, Orcal, MS SQL Server and SQLite.",-1),r=n("p",null,[n("code",null,"database"),a(" –"),n("code",null,"collection"),a(" – "),n("code",null,"document"),a("– "),n("code",null,"field"),a(" – "),n("code",null,"index"),a(".")],-1),d={href:"http://www.runoob.com/mongodb/mongodb-linux-install.html",target:"_blank",rel:"noopener noreferrer"},k=e(`<div class="hint-container tip"><p class="hint-container-title">mongoDB _id</p><p>_id 类型为 ObjectId, 是一个 <strong>12 字节</strong> 的 BSON 类型字符串，按照字节顺序，依次代表：</p><p>4字节：时间戳</p><p>3字节：机器 ID</p><p>2字节：进程 ID</p><p>3字节：计数器</p></div><h2 id="crud" tabindex="-1"><a class="header-anchor" href="#crud" aria-hidden="true">#</a> CRUD</h2><p>CRUD operations create, read, update, and create documents.</p><h3 id="cteate" tabindex="-1"><a class="header-anchor" href="#cteate" aria-hidden="true">#</a> Cteate</h3><ul><li><code>db.collection.insertOne()</code> New in version 3.2</li><li><code>db.collection.insertMany()</code> New in version 3.2</li></ul><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>db.collection.insertOne<span class="token punctuation">(</span>
	<span class="token punctuation">{</span>
		<span class="token string">&quot;name&quot;</span> <span class="token builtin class-name">:</span> <span class="token string">&quot;aaa&quot;</span>,
		&quot;age: <span class="token number">26</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">)</span>
</code></pre></div><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>db.collection.insertMany<span class="token punctuation">(</span>
	<span class="token punctuation">[</span>
		<span class="token punctuation">{</span> <span class="token punctuation">..</span>. <span class="token punctuation">}</span>,
		<span class="token punctuation">{</span> <span class="token punctuation">..</span>. <span class="token punctuation">}</span>
	<span class="token punctuation">]</span>
<span class="token punctuation">)</span>
</code></pre></div><h3 id="read" tabindex="-1"><a class="header-anchor" href="#read" aria-hidden="true">#</a> Read</h3><p>Query a collection for document</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>db.collections.find<span class="token punctuation">(</span>
	<span class="token punctuation">{</span> age: <span class="token punctuation">{</span> <span class="token variable">$gt</span><span class="token builtin class-name">:</span> <span class="token number">18</span> <span class="token punctuation">}</span> <span class="token punctuation">}</span>
<span class="token punctuation">)</span>.limit<span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span>
</code></pre></div><h3 id="update" tabindex="-1"><a class="header-anchor" href="#update" aria-hidden="true">#</a> Update</h3><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>db.inventory.updateOne<span class="token punctuation">(</span>
   <span class="token punctuation">{</span> item: <span class="token string">&quot;paper&quot;</span> <span class="token punctuation">}</span>,
   <span class="token punctuation">{</span>
     <span class="token variable">$set</span><span class="token builtin class-name">:</span> <span class="token punctuation">{</span> <span class="token string">&quot;size.uom&quot;</span><span class="token builtin class-name">:</span> <span class="token string">&quot;cm&quot;</span>, status: <span class="token string">&quot;P&quot;</span> <span class="token punctuation">}</span>,
     <span class="token variable">$currentdate</span><span class="token builtin class-name">:</span> <span class="token punctuation">{</span> lastModified: <span class="token boolean">true</span> <span class="token punctuation">}</span>
   <span class="token punctuation">}</span>
<span class="token punctuation">)</span>
<span class="token comment"># created filed: </span>
<span class="token comment"># &quot;lastModified&quot; : ISODate(&quot;2018-10-26T08:59:26.038+0000&quot;)</span>
</code></pre></div><ul><li><code>$set</code> to update the value</li><li><code>$currentDate</code> operator to update the value of the <code>lastModified</code> field to the current date, If lastModified field does not exist, <code>$currentDate </code> will create the field.</li></ul><p>Update many: to update document on inventory where <strong>qty</strong> is less than <strong>50</strong>:</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>db.inventory.updateMany<span class="token punctuation">(</span>
   <span class="token punctuation">{</span> <span class="token string">&quot;qty&quot;</span><span class="token builtin class-name">:</span> <span class="token punctuation">{</span> <span class="token variable">$lt</span><span class="token builtin class-name">:</span> <span class="token number">50</span> <span class="token punctuation">}</span> <span class="token punctuation">}</span>,
   <span class="token punctuation">{</span>
	   <span class="token comment">#same as updateOne()</span>
   <span class="token punctuation">}</span>
<span class="token punctuation">)</span>
</code></pre></div><p>Replace:</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>db.inventory.replaceOne<span class="token punctuation">(</span>
	<span class="token comment"># or updateOne() updateMany()</span>
   <span class="token punctuation">{</span> item: <span class="token string">&quot;paperpaper&quot;</span> <span class="token punctuation">}</span>,
   <span class="token punctuation">{</span> item: <span class="token string">&quot;paper&quot;</span>, instock: <span class="token punctuation">[</span> <span class="token punctuation">{</span> warehouse: <span class="token string">&quot;A&quot;</span>, qty: <span class="token number">60</span> <span class="token punctuation">}</span>, <span class="token punctuation">{</span> warehouse: <span class="token string">&quot;B&quot;</span>, qty: <span class="token number">40</span> <span class="token punctuation">}</span> <span class="token punctuation">]</span> <span class="token punctuation">}</span>,
   <span class="token punctuation">{</span> upsert: <span class="token boolean">true</span> <span class="token punctuation">}</span>
<span class="token punctuation">)</span>
</code></pre></div><p>If there are matching documents, then the <code>upsert</code> operation modifies or replaces the matching document or documents.</p><h3 id="delate" tabindex="-1"><a class="header-anchor" href="#delate" aria-hidden="true">#</a> Delate</h3><p>MongoDb provides the followinng methods to delete documents of a collection:</p><ul><li><code>db.collection.deleteOne()</code></li><li><code>db.collection.deleteMany()</code></li><li><code>db.collection.remove()</code></li></ul><p>Process in terminal:</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>./mongo.exe
<span class="token operator">&gt;</span> show dbs
<span class="token operator">&gt;</span> use <span class="token punctuation">[</span>db name<span class="token punctuation">]</span> <span class="token comment">#create db</span>
<span class="token operator">&gt;</span> db <span class="token comment">#see db</span>
<span class="token operator">&gt;</span> db.createCollection<span class="token punctuation">(</span>name, options<span class="token punctuation">)</span> <span class="token comment">#create collections</span>
<span class="token operator">&gt;</span> show collections
<span class="token operator">&gt;</span> db.colname.insert<span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token string">&quot;xx&quot;</span>, <span class="token string">&quot;xx&quot;</span><span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token operator">&gt;</span> db.collection_name.find<span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token operator">&gt;</span> db.collection_name.find<span class="token punctuation">(</span><span class="token punctuation">)</span>.pretty<span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token comment">#show in formatted</span>
</code></pre></div><p>batch import <code>.json</code> file:</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>mongoimport <span class="token parameter variable">--db</span> <span class="token function">users</span> <span class="token parameter variable">--collection</span> contacts <span class="token parameter variable">--file</span> xx.json
</code></pre></div><h3 id="restore" tabindex="-1"><a class="header-anchor" href="#restore" aria-hidden="true">#</a> Restore</h3><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>mongorestore <span class="token parameter variable">-h</span> <span class="token operator">&lt;</span>hostname<span class="token operator">&gt;</span><span class="token operator">&lt;</span>:port<span class="token operator">&gt;</span> <span class="token parameter variable">-d</span> dbname <span class="token operator">&lt;</span>path<span class="token operator">&gt;</span>
</code></pre></div>`,27),h={href:"http://www.runoob.com/mongodb/mongodb-mongodump-mongorestore.html",target:"_blank",rel:"noopener noreferrer"},g=e(`<h2 id="flask-pymongo" tabindex="-1"><a class="header-anchor" href="#flask-pymongo" aria-hidden="true">#</a> Flask-PyMongo</h2><p>Install: <code>pip install flask_pymongo</code></p><p>in <code>nginxig.py</code>:</p><div class="language-python" data-ext="py"><pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Config</span><span class="token punctuation">:</span>
    MONGO_URI <span class="token operator">=</span> <span class="token string">&quot;mongodb://localhost:27017/myDatabase&quot;</span>
</code></pre></div><p>in <code>app/___init__.py</code>:</p><div class="language-python" data-ext="py"><pre class="language-python"><code><span class="token keyword">from</span> flask_pymongo <span class="token keyword">import</span> PyMongo
<span class="token keyword">from</span> config <span class="token keyword">import</span> config
mongo <span class="token operator">=</span> PyMongo<span class="token punctuation">(</span><span class="token punctuation">)</span>
mono<span class="token punctuation">.</span>init_app<span class="token punctuation">(</span>app<span class="token punctuation">)</span>
</code></pre></div><p>in <code>views.py</code>:</p><div class="language-python" data-ext="py"><pre class="language-python"><code><span class="token keyword">from</span> app <span class="token keyword">import</span> mongo
<span class="token decorator annotation punctuation">@main<span class="token punctuation">.</span>route</span><span class="token punctuation">(</span><span class="token string">&#39;/&#39;</span><span class="token punctuation">,</span> methods<span class="token operator">=</span><span class="token punctuation">[</span><span class="token string">&#39;GET&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;POST&#39;</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
<span class="token keyword">def</span> <span class="token function">index</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
	data <span class="token operator">=</span> mongo<span class="token punctuation">.</span>db<span class="token punctuation">.</span>mycol<span class="token punctuation">.</span>find<span class="token punctuation">(</span><span class="token punctuation">)</span>
	<span class="token comment"># mycol is the name of collections</span>
</code></pre></div><h2 id="python-sql" tabindex="-1"><a class="header-anchor" href="#python-sql" aria-hidden="true">#</a> Python SQL</h2><p>Take <code>SQLite3</code> for example:</p>`,10),m=n("code",null,'cur.execute("CREATE TABLE demo(num int, str varchar(20));")',-1),b=n("code",null,"cur",-1),f={href:"https://github.com/chenweigao/python_web/blob/master/orm/db_test.py",target:"_blank",rel:"noopener noreferrer"},y=e(`<div class="language-python" data-ext="py"><pre class="language-python"><code>conn <span class="token operator">=</span> sqlite3<span class="token punctuation">.</span>connect<span class="token punctuation">(</span><span class="token string">&#39;test.db&#39;</span><span class="token punctuation">)</span>
cur <span class="token operator">=</span> conn<span class="token punctuation">.</span>cursor<span class="token punctuation">(</span><span class="token punctuation">)</span>
cur<span class="token punctuation">.</span>execute<span class="token punctuation">(</span><span class="token string">&quot;INSERT INTO demo VALUES (%d, &#39;%s&#39;)&quot;</span> <span class="token operator">%</span> <span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token string">&#39;aaa&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
</code></pre></div><h2 id="sqlite3" tabindex="-1"><a class="header-anchor" href="#sqlite3" aria-hidden="true">#</a> SQLite3</h2>`,2),v={href:"http://www.runoob.com/sqlite/sqlite-create-table.html",target:"_blank",rel:"noopener noreferrer"},_=e(`<p>format the table:</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>sqlite<span class="token operator">&gt;</span> .header on
sqlite<span class="token operator">&gt;</span> .mode <span class="token function">column</span>
sqlite<span class="token operator">&gt;</span> SELECT * FROM COMPANY<span class="token punctuation">;</span>
</code></pre></div><p>update:</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>sqlite<span class="token operator">&gt;</span> UPDATE COMPANY SET ADDRESS <span class="token operator">=</span> <span class="token string">&#39;Texas&#39;</span> WHERE ID <span class="token operator">=</span> <span class="token number">6</span><span class="token punctuation">;</span>
 update <span class="token function">users</span> <span class="token builtin class-name">set</span> confirmed <span class="token operator">=</span> <span class="token number">1</span> where <span class="token assign-left variable">id</span><span class="token operator">=</span><span class="token number">4</span><span class="token punctuation">;</span>
</code></pre></div><p>register:</p><div class="language-python" data-ext="py"><pre class="language-python"><code><span class="token keyword">from</span> flask_sqlalchemy <span class="token keyword">import</span> SQLAlchemy
db <span class="token operator">=</span> SQLAlchemy<span class="token punctuation">(</span><span class="token punctuation">)</span>
</code></pre></div>`,6);function q(x,w){const s=p("ExternalLinkIcon");return c(),l("div",null,[i,r,n("p",null,[n("a",d,[a("Install in LInux"),t(s)])]),k,n("p",null,[n("a",h,[a("mongodump and mongorestore"),t(s)])]),g,n("p",null,[m,a("，DB-API规范，创建"),b,a("游标对象用于执行SQL命令。"),n("a",f,[a("Source Code"),t(s)])]),y,n("p",null,[n("a",v,[a("Create table"),t(s)])]),_])}const D=o(u,[["render",q],["__file","mongodb.html.vue"]]);export{D as default};
