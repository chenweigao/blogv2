import{_ as n}from"./plugin-vue_export-helper-c27b6911.js";import{r as a,o as r,c as i,e as o,a as t,b as e,d as h,f as p}from"./app-22cda79c.js";const l={},s=t("p",null,"这篇博客主要记录 KVM 学习中的收获和心得，主要阅读书籍为《深度实践 KVM》",-1),c=p('<h2 id="kvm-介绍" tabindex="-1"><a class="header-anchor" href="#kvm-介绍" aria-hidden="true">#</a> KVM 介绍</h2><h3 id="虚拟化介绍" tabindex="-1"><a class="header-anchor" href="#虚拟化介绍" aria-hidden="true">#</a> 虚拟化介绍</h3><p>KVM 全称 Kernel-based Virtual Machine.</p><p>KVM 是一种开源的虚拟化技术，是 OpenStack 平台上份额较高的<strong>虚拟化引擎</strong>。</p><p>KVM 必须在具有 Intel VT 或 AMD-V 功能的 X86 平台上运行，在 3.9 内核以后加入了对 ARM 的支持。</p><div class="hint-container tip"><p class="hint-container-title">提示</p><p>X86 平台的指令集权限分为 Ring 0 到 Ring 3 共计 4 个特权模式，操作系统一般使用 Ring 0 级别，驱动程序使用 Ring 1 和 Ring 2 级别，应用程序使用 Ring 3 级别。</p><p>VMware 公司的虚拟化技术将自己的虚拟化引擎 VMM 放在了 Ring 1 层，这是一种软件全虚拟化方案。</p></div><p>Intel 公司推出了对 CPU 指令进行改造的方案 VT-x，基于<strong>硬件全虚拟化</strong>方案，是当前虚拟化引擎的主要解决方案。</p><blockquote><p>简而言之，就是使得物理硬件支持虚拟化特性。由于基于硬件，故其效率非常高。</p></blockquote><p>还有一种<strong>容器虚拟化</strong>方案，最著名的就是 Docker。其原理是基于 CGroups 和 Namespace 等技术将进程隔离，使得每个进程就像一台单独的虚拟机一样。</p><blockquote><p>容易虚拟化当下发展较为广泛，比如 K8S 等，个人认为这是学习的重点。</p></blockquote><h3 id="kvm-架构" tabindex="-1"><a class="header-anchor" href="#kvm-架构" aria-hidden="true">#</a> KVM 架构</h3><p>KVM Driver 包括在 Linux Kernel 中，一台虚拟机就是一个普通的 Linux 进程，对虚拟机的管理通过对这个进程的管理加以完成。</p><p>由于对进程的管理十分复杂，RedHat 发布了开源的项目<strong>Libvirt</strong>（有 API 和命令行管理工具），现有的大多数管理平台通过 Libvirt 来完成 KVM 虚拟机的管理，如 OpenStack，CloudStack 和 OpenNebula 等。</p><p>Libvirt 主要由 3 部分组成：</p><ol><li>一套 API 的 lib 库，支持主流的编程语言。</li><li>Libvirtd 服务。</li><li>命令行工具 virsh。</li></ol><p>一般而言，KVM 的管理都是使用 Libvirt。</p><div class="hint-container tip"><p class="hint-container-title">提示</p><p>常用的企业级虚拟化产品主要有：VMware（EMC），HyperV（微软），Xen（开源），KVM（开源）。</p></div><h2 id="网络虚拟化技术" tabindex="-1"><a class="header-anchor" href="#网络虚拟化技术" aria-hidden="true">#</a> 网络虚拟化技术</h2><p>一些容易忘的点，写在这随时查阅。</p><h3 id="虚拟机的网络模式" tabindex="-1"><a class="header-anchor" href="#虚拟机的网络模式" aria-hidden="true">#</a> 虚拟机的网络模式</h3><p>对比一下：</p><table><thead><tr><th></th><th>NAT</th><th>Bridged</th><th>Internal</th><th>Host-Only</th></tr></thead><tbody><tr><td>虚拟机 -&gt; 主机</td><td>√</td><td>√</td><td>×</td><td>× 可配</td></tr><tr><td>主机 -&gt; 虚拟机</td><td>×</td><td>√</td><td>×</td><td>× 可配</td></tr><tr><td>虚拟机 -&gt; 其他主机</td><td>√</td><td>√</td><td>×</td><td>× 可配</td></tr><tr><td>其他主机 -&gt; 虚拟机</td><td>×</td><td>√</td><td>×</td><td>× 可配</td></tr><tr><td>虚拟机之间</td><td>√</td><td>√</td><td>×</td><td>√</td></tr></tbody></table><h4 id="nat" tabindex="-1"><a class="header-anchor" href="#nat" aria-hidden="true">#</a> NAT</h4><p>网络地址转换。其原理类似于路由器的工作方式，使用 NAT 模式可以使得虚拟机通过网络地址转换功能，通过宿主机所在的机器网络对公网进行访问。</p><p>其本质原理是虚拟机的网卡连接到宿主机的 VMnet8 虚拟交换机上（安装虚拟机后会创建两张网卡：VMnet1 和 VMnet8，之前还会有一个自带的 VMnet0，这指的是 VM 虚拟化的方式，其他虚拟化在后面讨论，用 VM 虚拟化进行举例），这时候把 VMnet8 当做一个路由器来用，VMnet8 对数据包进行地址转换以后发送到实际网络中，返回也是同理。</p><p>这种方式的缺点在于：</p><ol><li>虚拟机的网络比较依赖宿主机的网络，宿主机的网络如果断开了，虚拟机的网络也就挂了。</li><li>主机 ping 虚拟机，不通；同一宿主的虚拟机，可以 ping 通。</li><li>其他主机要访问虚拟机，也不行（这里指的应该是不能直接访问，走 NAT 地址转换应该是可以进来的）。</li></ol><h4 id="host-only" tabindex="-1"><a class="header-anchor" href="#host-only" aria-hidden="true">#</a> Host-Only</h4><p>仅主机。经典的建局域网的场景，在这种模式下，一切通信都似乎不行（默认关闭），又似乎可以（可以设置），需要精通网络知识的人进行配置，也比较麻烦。</p><p>其本质原理是，将虚拟机连接到了 VNnet1 上面，VMnet1 默认是使用的是桥接方式进行网络连接，但是系统不给其提供任何路由服务，故在默认情况下，虚拟机只能和宿主机通信，无法访问外网。</p><h4 id="bridged" tabindex="-1"><a class="header-anchor" href="#bridged" aria-hidden="true">#</a> Bridged</h4><p>桥接模式。</p><p>这个模式比较厉害，在这个模式下，虚拟机被视为和宿主机同等地位的存在（其网络在一个网段）。</p><p>其使用的是宿主机自带的 VMnet0 虚拟网卡（VMnet0 本质上就是一个虚拟网桥），这个网桥有若干接口(port1, port2,..,portN),任一端口都可以用于连接主机，剩下的用于连接虚拟机。</p><p>虚拟机和主机在一个网段下面，就可以互相通信，很强！</p><h4 id="internal" tabindex="-1"><a class="header-anchor" href="#internal" aria-hidden="true">#</a> Internal</h4>',36),b=t("br",null,null,-1),V={href:"https://www.jianshu.com/p/305f7384cfe9",target:"_blank",rel:"noopener noreferrer"},u=t("h3",{id:"多网卡-bond-模式",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#多网卡-bond-模式","aria-hidden":"true"},"#"),e(" 多网卡 bond 模式")],-1),M=t("p",null,"多网卡绑定一共有 7 种 bond 模式，bond0 ~ bond6，通常而言，bond 模式是想要将多个物理网卡绑定为一个逻辑网卡。",-1);function _(g,f){const d=a("ExternalLinkIcon");return r(),i("div",null,[s,o(" more "),c,t("p",null,[e("内部网络。内部网络与桥接网络相似，不同之处在于内部通信，不多赘述。"),b,e(" 参考 "),t("a",V,[e("https://www.jianshu.com/p/305f7384cfe9"),h(d)])]),u,M])}const k=n(l,[["render",_],["__file","kvm.html.vue"]]);export{k as default};
