import{_ as l}from"./plugin-vue_export-helper-c27b6911.js";import{r as i,o as t,c as o,a as n,b as e,d as a,f as r}from"./app-22cda79c.js";const c={},d=n("h2",{id:"reference",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#reference","aria-hidden":"true"},"#"),e(" reference")],-1),u=n("thead",null,[n("tr",null,[n("th",null,"NAME"),n("th",null,"URL"),n("th",null,"DES")])],-1),p=n("td",null,"VundleVim",-1),m={href:"https://github.com/VundleVim/Vundle.vim",target:"_blank",rel:"noopener noreferrer"},v=n("td",null,"Vim plugin manager",-1),h=n("td",null,"ale",-1),b={href:"https://github.com/w0rp/ale",target:"_blank",rel:"noopener noreferrer"},g=n("td",null,null,-1),_=n("td",null,"vim-airline",-1),k={href:"https://github.com/vim-airline/vim-airline",target:"_blank",rel:"noopener noreferrer"},f=n("td",null,null,-1),V=n("h2",{id:"plugin-manager",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#plugin-manager","aria-hidden":"true"},"#"),e(" Plugin Manager")],-1),x={href:"http://github.com/VundleVim/Vundle.vim",target:"_blank",rel:"noopener noreferrer"},P=n("em",null,"Vim bundle",-1),w={href:"http://www.vim.org/",target:"_blank",rel:"noopener noreferrer"},y=r(`<div class="language-bash" data-ext="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> ~/.vim/bundle
<span class="token function">git</span> clone https://github.com/VundleVim/Vundle.vim.git ~/.vim/bundle/Vundle.vim
<span class="token function">vim</span> ~/.vimrc
</code></pre></div><p>In <code>.vimrc</code>, this is my config:</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token builtin class-name">set</span> nocompatible
filetype off

<span class="token builtin class-name">set</span> <span class="token assign-left variable">ts</span><span class="token operator">=</span><span class="token number">4</span>
<span class="token builtin class-name">set</span> expandtab

<span class="token builtin class-name">set</span> <span class="token assign-left variable">rtp</span><span class="token operator">+=</span>~/.vim/bundle/Vundle.vim
call vundle<span class="token comment">#begin()</span>

Plugin <span class="token string">&#39;VundleVim/Vundle.vim&#39;</span>
Plugin <span class="token string">&#39;https://github.com/Valloric/YouCompleteMe.git&#39;</span>
Bundle <span class="token string">&#39;luochen1990/rainbow&#39;</span>
<span class="token builtin class-name">let</span> g:rainbow_active <span class="token operator">=</span> <span class="token number">1</span>
Plugin <span class="token string">&#39;w0rp/ale&#39;</span>
Plugin <span class="token string">&#39;vim-airline/vim-airline&#39;</span>
Plugin <span class="token string">&#39;vim-airline/vim-airline-themes&#39;</span>
call vundle<span class="token comment">#end()</span>
filetype plugin indent on
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Then build:</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code><span class="token function">vim</span> +PluginInstall +qall

<span class="token comment"># options: PluginClean, PluginUpdate, PluginList</span>
</code></pre></div><p>Other useful settings:</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code><span class="token builtin class-name">set</span> nu<span class="token operator">!</span>
<span class="token builtin class-name">set</span> autoindent <span class="token comment">#自动对齐</span>
syntax on
</code></pre></div>`,7);function E(N,B){const s=i("ExternalLinkIcon");return t(),o("div",null,[d,n("table",null,[u,n("tbody",null,[n("tr",null,[p,n("td",null,[n("a",m,[e("https://github.com/VundleVim/Vundle.vim"),a(s)])]),v]),n("tr",null,[h,n("td",null,[n("a",b,[e("https://github.com/w0rp/ale"),a(s)])]),g]),n("tr",null,[_,n("td",null,[n("a",k,[e("https://github.com/vim-airline/vim-airline"),a(s)])]),f])])]),V,n("p",null,[n("a",x,[e("Vundle"),a(s)]),e(" is short for "),P,e(" and is a "),n("a",w,[e("Vim"),a(s)]),e(" plugin manager.")]),y])}const C=l(c,[["render",E],["__file","vim.html.vue"]]);export{C as default};
