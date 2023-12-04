import{_ as t}from"./plugin-vue_export-helper-c27b6911.js";import{r as o,o as l,c as d,a as n,b as a,d as i,f as e}from"./app-22cda79c.js";const r={},c=e(`<h1 id="snap" tabindex="-1"><a class="header-anchor" href="#snap" aria-hidden="true">#</a> Snap</h1><p>Easily Upgraded, Universal Linux Package</p><p>Snaps are containerised software packages that are simple to create and install. They auto-update and are safe to run. And because they bundle their dependencies, they work on all major Linux systems without modification.</p><p>Snapcraft is a command line tool used to build snaps. This guide details the recommended steps to get ready to build snaps.The easiest way to package your code as a snap is to use Snapcraft, which supports building from source and from existing packages, integrates into your CI process and handles publishing your snaps to the world.</p><h2 id="_1-abstract" tabindex="-1"><a class="header-anchor" href="#_1-abstract" aria-hidden="true">#</a> 1. Abstract</h2><p>Snapcraft builds on top of tools like autotools, make, and cmake to create snaps fro people to install on Linux.</p><p><code>sudo apt-get install snapcraft</code></p><p>Here are some snap advantages that will benefit many C/C++ projects:</p><ul><li>Installation: <code>snap install myapp</code></li><li>Directly control the delivery of automatic application updates</li></ul><h2 id="_2-dosbox-snap" tabindex="-1"><a class="header-anchor" href="#_2-dosbox-snap" aria-hidden="true">#</a> 2. DOSBox Snap</h2><p>Snaps are defined in a single yaml file placed in the root of your project. The DOSBox example shows the entire <code>snapcraft.yaml</code> for a existing project.</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>name: dosbox
version: <span class="token string">&quot;0.74-svn&quot;</span>
summary: DOSBox
description: <span class="token operator">|</span>
  DOSBox is a x86 emulator with Tandy/Hercules/CGA/EGA/VGA/SVGA graphics
  sound and DOS. It<span class="token string">&#39;s been designed to run old DOS games under platforms that
  don&#39;</span>t support it.

confinement: devmode

apps:
  dosbox:
    command: dosbox

parts:
  dosbox:
    plugin: autotools
    source-type: <span class="token function">tar</span>
    source: http://source.dosbox.com/dosboxsvn.tgz
    build-packages:
      - g++
      - <span class="token function">make</span>
      - libsdl1.2-dev
      - libpng12-dev
      - libsdl-net1.2-dev
      - libsdl-sound1.2-dev
      - libasound2-dev
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="confinement" tabindex="-1"><a class="header-anchor" href="#confinement" aria-hidden="true">#</a> Confinement</h3>`,13),p={href:"https://docs.snapcraft.io/reference/confinement",target:"_blank",rel:"noopener noreferrer"},u=n("code",null,"devmode",-1),h=e(`<div class="language-bash" data-ext="sh"><pre class="language-bash"><code>confinement: devmode
</code></pre></div><h3 id="parts" tabindex="-1"><a class="header-anchor" href="#parts" aria-hidden="true">#</a> Parts</h3><p>Parts define how to build your application.</p><p>Before building the part, the dependencies listed as <strong>build-package</strong> are installed. More information of autotools plugin is given by command <code>snapcraft help autotools</code>.</p><h2 id="_3-basic-about-snap" tabindex="-1"><a class="header-anchor" href="#_3-basic-about-snap" aria-hidden="true">#</a> 3.Basic about Snap</h2><h3 id="install-snap-on-ubuntu" tabindex="-1"><a class="header-anchor" href="#install-snap-on-ubuntu" aria-hidden="true">#</a> Install snap on Ubuntu</h3><p>Ubuntu includes Snap by default starting with the 16.04LTS release, for the older 14.04LTS release or any flavor, you have to install it form the archive:</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code><span class="token function">sudo</span> <span class="token function">apt</span> <span class="token function">install</span> snap
</code></pre></div><h3 id="using-the-snap-command" tabindex="-1"><a class="header-anchor" href="#using-the-snap-command" aria-hidden="true">#</a> Using the snap command</h3>`,9),b={href:"https://login.ubuntu.com/",target:"_blank",rel:"noopener noreferrer"},m=e(`<div class="language-bash" data-ext="sh"><pre class="language-bash"><code><span class="token function">sudo</span> snap login <span class="token operator">&lt;</span>youremail<span class="token operator">&gt;</span>
</code></pre></div><p>When you are logged in, <strong>find snaps</strong> in the snap store, and then you can install it using the snap name.</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>snap <span class="token function">find</span> hello
snap <span class="token function">install</span> hello-world
snap list <span class="token comment"># view details about installed snap</span>
</code></pre></div><h2 id="_4-snapcraft" tabindex="-1"><a class="header-anchor" href="#_4-snapcraft" aria-hidden="true">#</a> 4.Snapcraft</h2><h3 id="setup-lxd" tabindex="-1"><a class="header-anchor" href="#setup-lxd" aria-hidden="true">#</a> Setup LXD</h3><p>LXD installation on Ubuntu is quite straightforward:</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>snap <span class="token function">install</span>
<span class="token function">sudo</span> lxd init
<span class="token function">sudo</span> <span class="token function">usermod</span> <span class="token parameter variable">-g</span> lxd <span class="token variable">\${<span class="token environment constant">USER</span>}</span>
<span class="token comment">#LXD requires that your user is in the lxd group.</span>
</code></pre></div><h3 id="test-a-container-build" tabindex="-1"><a class="header-anchor" href="#test-a-container-build" aria-hidden="true">#</a> Test a container build</h3><p>By now should be all set, we can test that everything is setup correctly with a few commands:</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> test-snapcraft
<span class="token builtin class-name">cd</span> test-snapcraft
snapcraft init
snapcraft cleanbuild
</code></pre></div><h3 id="build-first-snap" tabindex="-1"><a class="header-anchor" href="#build-first-snap" aria-hidden="true">#</a> Build first snap</h3><p>Snapcraft uses single text file to describe the entire build process for a snap:</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code><span class="token function">vim</span> test-snapcraft/snapcraft.yaml
</code></pre></div><p>To get start with a template, you can run <code>snapcraft init</code>, it wll create a new directory <em>snap</em> with a file named <em>snapcraft.yaml</em> , the final file looks like this:</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>name: hello
version: <span class="token string">&quot;2.10&quot;</span>
summary: GNU Hello, the <span class="token string">&quot;hello world&quot;</span> snap
description: GNU Hello prints a friendly greeting.
grade: stable
confinement: strict

apps:
  hello:
    command: hello

parts:
  gnu-hello:
    plugin: autotools
    source: http://ftp.gnu.org/gnu/hello/hello-2.10.tar.gz
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>This is the only file needed in the directory, Snapcraft can use local source code or fetch everything needed to build the snap from remote sources.</p><h3 id="run-snapcraft" tabindex="-1"><a class="header-anchor" href="#run-snapcraft" aria-hidden="true">#</a> Run snapcraft</h3><p>You can now build a snap out of your <code>snapcraft.yaml</code> by running <code>snapcraft</code> in the project directory:</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>snapcraft
</code></pre></div><p>After this process, the snap is now available in your directory.</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">ls</span>
hello_2.10_amd64.snap  parts  snap  prime 
$ <span class="token function">sudo</span> snap <span class="token function">install</span> hello_2.10_amd64.snap <span class="token parameter variable">--dangerous</span>
hello <span class="token number">2.10</span> installed
$ hello
Hello, World<span class="token operator">!</span>
<span class="token variable">$sudo</span> snap remove dosbox
</code></pre></div>`,21);function v(f,g){const s=o("ExternalLinkIcon");return l(),d("div",null,[c,n("p",null,[a("To get started, we won’t "),n("a",p,[a("confine"),i(s)]),a(" this application. Unconfined applications, specified with "),u,a(", can only be released to the hidden “edge” channel where you and other developers can install them.")]),h,n("p",null,[a("Login with "),n("a",b,[a("Ubuntu One Account"),i(s)])]),m])}const y=t(r,[["render",v],["__file","snap.html.vue"]]);export{y as default};
