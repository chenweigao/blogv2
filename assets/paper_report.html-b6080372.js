import{_ as i}from"./plugin-vue_export-helper-c27b6911.js";import{o as t,c as p,e as n,a,f as s,b as e}from"./app-22cda79c.js";const r={},l=a("div",{class:"hint-container tip"},[a("p",{class:"hint-container-title"},"Abstract"),a("p",null,"记录论文答辩的答辩稿")],-1),h=s('<h2 id="开始" tabindex="-1"><a class="header-anchor" href="#开始" aria-hidden="true">#</a> 开始</h2><p>各位老师，晚上好！ 我叫陈惟高，我的论文题目是融合视觉的WiFi室内定位算法，论文是在李瑞导师的悉心指点下完成的，在这里我向我的导师表示深深的谢意，向各位老师不辞辛苦参加我的论文答辩表示衷心的感谢，下面我将本论文的主要内容向各位老师作一汇报，恳请各位老师批评指导。</p><p>本文主要提出了InDeFi，一个融合视觉的WiFi室内定位系统，结合WiFi室内定位技术和计算机视觉技术，实现了高精度的融合室内定位算法。</p><p>本文的融合算法优点在于，解决了单一室内定位系统存在的缺陷，如WiFi室内定位系统精度较低易受干扰，计算机视觉室内定位技术对光线环境较为敏感和容易受到遮挡等缺陷，融合了WiFi室内定位的可穿墙性和视觉室内定位的高精度优点，新的室内定位系统精度较高、鲁棒性强，适用范围广。</p><p>本文由两个主要的模块组成，分别是基于 WiFi 的室内定位模块和基于视觉的室内定位模块，围绕这两个模块，本文提出了一系列创新性的算法和计算机视觉模型，接下来将分别讲述每个模块的细节，最后讲述一下本文如何将两个定位模块有效融合并在实际测试中说明本文室内定位系统的优越性。</p><p>本次报告主要分为六个部分，第一、二部分简单讲述一下室内定位的研究背景和相关理论，相关理论包括WiFi相关理论和计算机视觉目标检测相关理论，第三部分重点讲述一下基于WiFi的室内定位算法的设计与实现，第四部分重点讲述一下基于视觉的室内定位算法的设计与实现，第五部分重点阐述融合视觉的WiFi室内定位算法的设计实现与测试，最后一部分对本文进行一个小结。</p><p>室内定位拥有很广阔的应用前景，但是现有的室内定位技术都存在缺陷，如 RFID和 UWB 等，这些技术定位精度较高，可以到达厘米级，但是依赖设备的定制，成本较高，WiFi 与 蓝牙定位技术成本较低但是精度无法达到室内定位的要求，超声波定位技术易受干扰，视觉定位技术对光线环境较为敏感等。基于此，本文选择了成本较低的摄像头和商用WiFi设备，将其融合以获得精度的提升。</p><p>室内定位的发展已经有将近 30 年的历史，其定位精度已经从米级到达了本文的厘米级，不难预测，未来将出现更多高精度的室内定位技术。</p><p>第二部分主要讲述室内定位的基本理论，为节省时间，本文从论文中选取了四个经典的基本理论，本文的部分算法都是基于这四个基本理论改进而来。首先是室内的多径效应，多径效应在室内环境中十分常见，多径效应的存在会导致多径失真现象，在基于WiFi的室内定位系统中，有效克服多径效应的影响可以极大提高系统的定位精度。</p><p>信道状态信息 CSI 是基于WiFi的室内定位系统采用的主要技术，CSI 可以从商用无线网卡中获得，其可以反映丰富的室内空间信息，当同时CSI 信息中也伴随着很多误差和干扰信息，如何有效利用 CSI 信息并提出精确的 CSI 解析和误差消除算法是WiFi室内定位的一个挑战点。CSI 信号包含丰富的子载波信息，功率时延谱可以在测量 CSI 信号的同时得到，用于结合 CSI 信息确定主径，非常实用。</p><p>在目标检测领域，BBox 或者边界框是目标检测的重要概念，如何在目标检测网络中生成精确的BBox 是目标检测问题的目的和重点，围绕BBox 产生了一系列的相关理论，如IoU，一般作为测试的重点指标，RPN锚箱，可以优化BBox的检测效率，YOLO网络，其思想可以被借鉴用于提高网络的检测速度等。</p><p>特征金字塔结构在目标检测中十分有用，但是在最近的目标检测模型中由于其复杂性较高，逐渐被放弃使用，本文基于传统的特征金字塔进行优化，提出了可伸缩的特征金字塔结构，很大程度上提高了目标检测模型的精度和性能。</p><p>接下来重点讲述一下本文的两个重点模型之一，基于 WiFi 的室内定位算法，（下一页）该算法包含四个重点部分，CSI的收集和误差消除，AoA 室内定位算法，TDoA室内定位算法以及最终融合AoA和TDoA的基于WiFi的室内定位算法，接下来我将分别重点讲述这些算法。</p><p>首先是 CSI 的测量误差及消除，CSI 在收集过程中的每一步都会产生或大或小的一些误差，总结来说会产生 4 个较大的影响最终定位误差，分别是。。。。，这些误差会使得收集到的 CSI 信号的振幅和相位产生偏差，本文针对每一个偏差提出了有效的误差消除算法，(翻页)特别是针对 SFO，本文结合 PDP 提出了 SFO 消除算法，相比于现有的 SFO 误差消除研究成果，本文的 SFO 消除算法速度更快，且消除效果更佳。<br> 右图表示 CSI 消除误差后的相位拼接结果，我们共选取了5000 组CSI信号进行拼接。</p><p>AoA 定位算法是基于CSI的室内定位技术的重点，其原理简单并且定位精准，近年来被广泛研究。</p><p>本文还从数学角度基于传统的 MUSIC 算法进行改进，提出了共轭MUSIC算法，该算法基于共轭矩阵优化噪音信号，比传统的MUSIC算法能够更加有效地过滤噪音信号。</p><p>WiFi 室内定位系统中，多径地抑制一直是研究的重点和难点，本文提出了多路径抑制算法，基于1000组benchmark的观察得出结论，可以很好地抑制室内多径效应，有效辨别主径信号的AoA。</p><p>除了AoA 定位算法之外，本文还提出了TDoA定位算法与AoA加以结合，进一步提高了室内定位的精度，本文提出混合流萤算法，结合WSL算法的搜索思想改进，可以有效快速地确定目标位置。</p><p>总结一下 WiFi 室内定位算法，该算法共包含五个子模块，最终通过各模块之间的有效融合，结合最大似然聚类算法，能够精确地根据WiFi信号计算空间中的目标位置。</p><p>接下来介绍本文的第二个重点模块，基于视觉的室内定位算法模块，在该模块中，本文共提出了三个创新性的深度卷积神经网络模型，分别是。。。。这三个模型相互结合，可以完成超级精确的视觉室内定位任务。</p><p>首先讲述第一个模型，InDetectNet 目标检测网络，该网络的创新点在于，使用了 BBox 偏移用于衡量BBox的位置，减少了训练所需要的参数数量，使用类别和聚类损失结合，提高了训练的损失精度，使用了方差投票算法，极大提升了模型的速度，使得模型深度提升的同时，兼顾了精度和检测速度。</p><p>本文的SFPN结构十分具有创新性，相比于FPN，SFPN可以任意堆叠并连接到网络的任何层次，这使得本文的目标检测网络在每一层都可以生成高分辨率高语义的目标特征，后文测试部分将通过烧融实验对使用SFPN对网络产生的精度提升加以说明。</p><p>接下来讲述第二个模型，InDepthNet 深度提取网络，该网络使用经典的编码器-解码器结构，并使用了 DenseNet-101作为编码器进行迁移学习，使用横向连接设计解码器，表格中列举了网络的详细架构。除此之外，该网络将三个损失函数有效加以结合，折中结合可以有效提升编码器-解码器的精度，由于现有的深度数据集数据较少，为了训练更稳定的模型，我们还使用了一系列有效的数据扩充操作。</p><p>最后一个模型是。。。网络，该网络基于人群密度的特点，使用加权。。。距离衡量人物头部距离，设计一个独立的网络用于生成密度图像，为了增强网络的深度的同时不损失过多的密度信息，该模型还是用了空洞卷积，灵活地将多尺度的上下文信息聚合在一起。</p><p>为实现最终的视觉室内定位，本文使用点云的方式结合了InDetectNet 和 InDepthNet 的结果，提出一个融合RGB特征的三维BBox预测结构，达到了视觉三维定位的目的。</p><p>第五部分主要是融合视觉的WiFi室内定位系统的设计实现与测试，该部分首先分别对WiFi定位模块和视觉定位模块进行了测试，然后对融合的定位方法进行说明，并对结果进行了测试，每个测试中均对比了近3年内的先进算法或模型。</p><p>首先是InDeFi系统的概要，图中展示了如何对WiFi定位结果和视觉定位结果进行有效融合，（翻页）融合的算法为基于线性卡尔曼滤波的定位信息融合算法，融合后的定位系统相比于单个定位系统精度更高、适用性更强。</p><p>接下来分别讲述每个模块的测试，首先是WiFi定位模块的实现与测试，上表表示收集的CSI信号的解析结果，下图表示CSI误差消除后的相位和振幅，右下图是带有5300网卡的信号接受和处理设备。</p><p>WiFi定位模块经过聚类后的结果如图所示，我们分别列举了视距路径和非视距路径的聚类结果。</p><p>视觉定位模块的实现与测试分为几个部分，首先是对相机的标定，我们通过标定板和本文提到的基于单应矩阵的相机标定算法得到了相机的内参和外参矩阵，如表所示。<br> 视觉定位模块第二个实现与测试是对目标检测网络InDetectNet的实现与测试，表中表示在COCO 数据集中进行的烧融实验，该实验主要测试。。。三个技术对模型精度的影响，可以看出，同时使用本文提到的三个优化算法可以获得很大的精度提升。<br> 我们在VOC数据集上对InDetectNet进行了测试，并对比了现有的先进的目标检测器，可以看出，InDetectNet具有极大的精度领先。<br> 除VOC数据集以外，我们还在COCO数据集上对InDetectNet进行了测试，并对比先进的目标检测模型，可以看出，InDetectNet在对小目标的检测上拥有十分巨大的优势。</p><p>视觉定位模块的深度提取网络InDepthNet的实现细节如下所示，我们在NYU DepthV2 上对该模型进行了训练和测试，测试结果如表所示，<br> 除此之外，（翻页）在KITTI数据集上的测试结果如表所示，（翻页）模型的实际运行结果如图所示。</p><p>视觉定位模块最后一个网络InCrowNet的训练基于Shanghai Tech Dataset，我们在Part A和Part B上分别对模型进行了训练和测试，以寻找最佳精度的模型，并分别在三个密度图数据集上进行了测试，结果如表格所示。（翻页）图表示InCrowNet的运行结果。</p><p>融合InDetectNet 和 InDepthNet 的 InDeFi 视觉模块实现与测试结果如表所示。</p><p>接下来重点讲述一下InDeFi的测试，我们在实验室中选取了一块实验区域如图所示，实验区域大小为10m×3m，共分了3000个网格以方便测试，实验的定位误差用下式衡量。</p><p>本文共设计了两组benchmark，分别测试了四个环境的排列组合下系统的定位性能，包括视距路径、非视距路径、强光环境、弱光环境，对每一组测试分别计算最大定位误差和最小定位误差，并绘制误差累计分布图。</p><p>从测试中可以看出。。结论。。。</p><p>完</p><h2 id="选题背景" tabindex="-1"><a class="header-anchor" href="#选题背景" aria-hidden="true">#</a> 选题背景</h2><h3 id="精确的定位系统十分重要" tabindex="-1"><a class="header-anchor" href="#精确的定位系统十分重要" aria-hidden="true">#</a> 精确的定位系统十分重要</h3><p>定位服务与我们的生活息息相关，在室外，拥有很多成熟的定位技术，如全球定位系统GPS，北斗导航卫星等，但是在高层建筑、机场车站、地下停车场等室内环境中，传统的室外定位无法对目标进行精确的定位。</p><p>室内定位拥有广阔的应用场景，现有的室内定位技术都存在着一些缺陷，如。。。</p><h3 id="室内定位的发展过程" tabindex="-1"><a class="header-anchor" href="#室内定位的发展过程" aria-hidden="true">#</a> 室内定位的发展过程</h3><p>。。</p><h3 id="室内定位的国内外研究现状" tabindex="-1"><a class="header-anchor" href="#室内定位的国内外研究现状" aria-hidden="true">#</a> 室内定位的国内外研究现状</h3><p>从广义上讲，这些室内定位技术可以被分为两类，基于信号的室内定位和基于视觉的室内定位</p><h2 id="论文结构" tabindex="-1"><a class="header-anchor" href="#论文结构" aria-hidden="true">#</a> 论文结构</h2><p>为解决这些室内定位存在的问题，本论文提出了一种融合视觉的室内定位算法，该算法使用常见的商用 WiFi 设备和单目相机，可以实现厘米级的室内定位，本文共分为六章，第一章主要介绍了室内定位的背景和国内外研究现状，第二章介绍了与室内定位相关的基础理论，包括信道状态信息 CSI 的基本概念，室内多径效应及其影响和多信号分类算法 MUSIC，在视觉定位方面，第二章介绍了</p><h2 id="研究方法" tabindex="-1"><a class="header-anchor" href="#研究方法" aria-hidden="true">#</a> 研究方法</h2><h3 id="多径效应" tabindex="-1"><a class="header-anchor" href="#多径效应" aria-hidden="true">#</a> 多径效应</h3><p>多径效应普遍存在于室内环境中，WiFi 信号在传播过程中会随着传输距离的增加而变宽，特别是在室内存在大量反射物体的环境下，当信号遇到多个干扰物体发生反射时，会产生大量重复波前，此时无线网卡的接收天线会接收到多个无线信号，发生多径传播效应。</p><p>多径效应使得信号的一部分到达目的地，另一部分被障碍物反射，然后到达目的地，对接收天线而言，被反射的信号会经过更长的路径延迟到达。一般而言，将信号传播更长的路径叫做多径，信号传播最短的路径叫做直接路径或主径，如图所示，红色的为主径，穿过障碍物后信号衰弱但未发生反射，传播路径最短；蓝色和绿色标识的多径都经过墙壁或家具的反射，传播路径更长。</p><p>多径效应使得室内定位存在两个比较大的挑战，第一是室内较强的多径对主径产生较大的影响，</p><h3 id="csi" tabindex="-1"><a class="header-anchor" href="#csi" aria-hidden="true">#</a> CSI</h3><p>如图所示，表示 WiFi 的发射端和接收端之间的多径传播及其信道响应，图中的每条路径都对应信道脉冲响应（CIR），该响应可以由右边的公式得到。</p><p>其中 ap ,θp ,τp 分别表示振幅、相位和第 i 条路径的时延，L 表示路径的总数，在图中为 3 条，包括 1 条视距路径（主径）和 2 条非视距路径（多径）。在频域上，相位的波动也会引起频率的选择性衰弱，产生信道频率响应 (CFR)，CFR 由振幅频率响应和相位频率响应组成，CIR 和 CFR 都描述了小尺度的多径效应，被广泛应用于信道测量，信道响应具有更细粒度的频率分辨率和时域分辨率，可以很好地区分多径。</p>',55),o=a("p",null,[e("CFR 和 CSI 的转换关系如式所示，其中 n 为噪音的功率，SNR 表示网卡上天线的信噪比，"),a("span",{class:"katex"},[a("span",{class:"katex-mathml"},[a("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[a("semantics",null,[a("mrow",null,[a("msub",null,[a("mi",null,"P"),a("mrow",null,[a("mi",null,"R"),a("mi",null,"S"),a("mi",null,"S")])])]),a("annotation",{encoding:"application/x-tex"},"P_{RSS}")])])]),a("span",{class:"katex-html","aria-hidden":"true"},[a("span",{class:"base"},[a("span",{class:"strut",style:{height:"0.8333em","vertical-align":"-0.15em"}}),a("span",{class:"mord"},[a("span",{class:"mord mathnormal",style:{"margin-right":"0.13889em"}},"P"),a("span",{class:"msupsub"},[a("span",{class:"vlist-t vlist-t2"},[a("span",{class:"vlist-r"},[a("span",{class:"vlist",style:{height:"0.3283em"}},[a("span",{style:{top:"-2.55em","margin-left":"-0.1389em","margin-right":"0.05em"}},[a("span",{class:"pstrut",style:{height:"2.7em"}}),a("span",{class:"sizing reset-size6 size3 mtight"},[a("span",{class:"mord mtight"},[a("span",{class:"mord mathnormal mtight",style:{"margin-right":"0.05764em"}},"RSS")])])])]),a("span",{class:"vlist-s"},"​")]),a("span",{class:"vlist-r"},[a("span",{class:"vlist",style:{height:"0.15em"}},[a("span")])])])])])])])]),e(" 是接收信号强度的功率，"),a("span",{class:"katex"},[a("span",{class:"katex-mathml"},[a("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[a("semantics",null,[a("mrow",null,[a("msub",null,[a("mi",null,"P"),a("mrow",null,[a("mi",null,"C"),a("mi",null,"S"),a("mi",null,"I")])])]),a("annotation",{encoding:"application/x-tex"},"P_{CSI}")])])]),a("span",{class:"katex-html","aria-hidden":"true"},[a("span",{class:"base"},[a("span",{class:"strut",style:{height:"0.8333em","vertical-align":"-0.15em"}}),a("span",{class:"mord"},[a("span",{class:"mord mathnormal",style:{"margin-right":"0.13889em"}},"P"),a("span",{class:"msupsub"},[a("span",{class:"vlist-t vlist-t2"},[a("span",{class:"vlist-r"},[a("span",{class:"vlist",style:{height:"0.3283em"}},[a("span",{style:{top:"-2.55em","margin-left":"-0.1389em","margin-right":"0.05em"}},[a("span",{class:"pstrut",style:{height:"2.7em"}}),a("span",{class:"sizing reset-size6 size3 mtight"},[a("span",{class:"mord mtight"},[a("span",{class:"mord mathnormal mtight",style:{"margin-right":"0.05764em"}},"CS"),a("span",{class:"mord mathnormal mtight",style:{"margin-right":"0.07847em"}},"I")])])])]),a("span",{class:"vlist-s"},"​")]),a("span",{class:"vlist-r"},[a("span",{class:"vlist",style:{height:"0.15em"}},[a("span")])])])])])])])]),e(" 是 CSI 信号的接收功率。")],-1),c=s('<p>图表示 CSI 信号的处理过程，来自天线的信号通过下转频转换得到基带信号 s(t)，在数据采样过程中，通过模数转换器 (ADC) 将 s(t) 转换为数字信号 s[n]，包检测阶段通过包边界检测器 (PBD) 用于矫正 s[n]，PBD 检测到数据包的头部信息时，CFO 校正器会对信号的中心频率进行校准，OFDM 接收器根据 s[n] 来估算 CSI，并将 CSI 传递给后续的模块进行处理。</p><p>功率时延谱 (PDP) 表示 CSI 在不同时延下的功率分布，功率时延谱可以由信道脉冲响应计算得到，其描述多路径的信道特征，如图所示，由于主径的路程最短，故通常假定第一个到达的峰值是主径的接收功率。从图中可以看出，由于室内多径的影响，第一个峰值对应的功率并不是最大值，如果第一个峰值是最高的功率峰值，则说明发送端和接收端之间存在直接视距路径 (LoS)，反之则存在非直接视距路径<br> (NLoS)，如此就可以根据功率时延谱来判断室内多径对主径的影响。</p><h3 id="计算机视觉相关理论" tabindex="-1"><a class="header-anchor" href="#计算机视觉相关理论" aria-hidden="true">#</a> 计算机视觉相关理论</h3><p>目标检测模型可分为两阶段目标检测器和单阶段目标检测器，两阶段目标检测器无法完成端到端的目标检测任务，实时性较差，单阶段目标检测器实时性较高但是精度较差，因此本文着重于研究单阶段目标检测器，并从各个方面优化其精度。</p><p>典型的单阶段目标检测器包括 Fast R-CNN、Faster R-CNN 和 YOLO 等，其主要思路在于使用区域建议 (Region Proposal Algorithms, RPA) 绘制边界框 (Bounding Box, BBox) 进行目标检测，利用不同尺寸的 BBox 选取图像中的某一部分作为兴趣区域(Regions of Interest, RoI)，而后利用 CNN 提取 RoI 相关的视觉特征，最后使用分类器进行识别。</p><p>在图中的 448 × 448 像素的狸花猫图片分别对应两个 BBox，红色的代表 ground truth 所生成的 BBox，绿色代表预测网格生成的 BBox，两个 BBox 之间相交区域面积除以 ground truth 的面积所得的值即代表 IoU 的大小，图中列举了几种不同大小的 IoU，IoU 的值越大，代表该网格所对应的 BBox 预测的准确度越高。一般定义一个阈值 I 用于衡量 IoU 的精确程度，若取 I = 0.5，则 IoU 小于 I 的BBox 被认为是一个比较糟糕的预测，例如图 2.8 (b)；而大于 I 的可以认为是较好的预测，例如图 2.8 (c),(d)；一般而言，若 IoU 的值越接近于 1，则认为 BBox 的预测目标大小越接近实际图像中的目标大小。</p><h3 id="特征金字塔" tabindex="-1"><a class="header-anchor" href="#特征金字塔" aria-hidden="true">#</a> 特征金字塔</h3><p>特征金字塔网络是多尺度下的目标识别网络的常用组成部分。</p><p>图 (a) 表示使用单个图像金字塔来构建特征金字塔的示意图，由于每一个尺度下的图像都需要分别计算并预测特征，这样不仅增加了特征的推算时长，而且使得训练一个端到端系统时产生过大的内存消耗。</p><p>图 (b) 表示只在单一尺度下的特征预测，这样能够实现更快的检测速度，但是只生成一个高分辨率的单一高级特征图，会牺牲其他尺度下的特征。</p><p>图 (c) 表示利用 CNN 固有的金字塔特征结构，将这个特征结构视作和图 (a) 相似的图像金字塔，不同的网络层次会产生不同的特征图，这些特征图的深度不同，语义差异也较大，这就导致了高分辨率的低等级特征损害了目标识别中的表达能力。</p><p>图 (d) 表示 FPN 特征金字塔网络，FPN 利用深度神经网络金字塔具有从低到高语义的结构建立，使其自始至终都具有高级语义。</p><p>如图 (d) 通过自顶向下 (top-down) 的结构，将低分辨率、强语义与高分辨率、弱语义的特征连接起来，使得该结构生成的 FPN 在每一层上都具有丰富的语义，在网络内创建 FPN 用于代替特征化的图像金字塔能在不牺牲表达能力、速度和内存消耗的前提下，实现相同的准确率。</p><p>右图简单展示了构建自顶向下架构的结构图，对于一个较低分辨率的特征图而言，使用最邻近上采样将空间分辨率提升了 2 倍，为了避免信道维度缺失问题，将上采样的结果与对应的自底向上的特征图通过 1×1 的卷积层结合，自顶向下的过程将迭代直到产生最细精度的分辨率，一般与原始输入图像分辨率相等即可，最后为了减少上采样的混叠效果 (aliasing effect)，最终在合并的特征图后追加一个 3 × 3 的卷积层来生成最终的特征层。</p><h2 id="基于-wifi-的室内定位算法" tabindex="-1"><a class="header-anchor" href="#基于-wifi-的室内定位算法" aria-hidden="true">#</a> 基于 WiFi 的室内定位算法</h2><h3 id="csi-相位误差消除" tabindex="-1"><a class="header-anchor" href="#csi-相位误差消除" aria-hidden="true">#</a> CSI 相位误差消除</h3><p>CSI 信号在收集过程中可能出现的振幅偏差包括以下几点：</p><ol><li><p>采样频偏 SFO。SFO 的产生是由于非时钟同步，传输对的采样频率会产生偏移，使得 s[n] 产生一个微小的时钟偏移 τ o ，由于 τ o 在很短的时间中趋于稳定，故 SFO 会对 CSI 相位产生一个常数误差 λ o 。</p></li><li><p>包边界检测PBD错误。包检测过程中包检测器对不同数据包头部检测偏差，在传输信号中产生一个时移 τ b ，该时移在 CSI 相位上产生一个随机误差 λ b 。</p></li><li><p>中心频偏 CFO。由于收发端的中心频率不能完全同步所导致，虽然 CFO 校正器会对中心频率偏移进行补偿，但是由于硬件不完善，这种补偿通常不够完整。CFO 会导致 CSI 产生相位偏移 β。</p></li></ol><p>对于 SFO 的消除，本文提出了 SFO 消除算法，我们观察图中的相位偏差可知，每条线（对应于向量之间存在着一个微小的旋转偏差，<br> 基于这个原理，对于任意两个向量在频域中进行“旋转”直到这两个向量的功率时延谱基本上保持一致就可以消除 SFO，本文的 SFO 消除算法从数学上定义了相位和 PDP 之间的关系，从而达到消除 SFO 误差的目的。（定义一个相似度函数，而后估计参数）</p><p>对于包检测错误，由于不同的包接收时延 τ b 都不相同但是遵循均值为 0 的高斯分布规律，这意味着 λ b 遵循同样的高斯分布规律，根据弱大数定理的原则，可以将所有测量的 CSI 相位 φ k 相加取均值以达到消除 λ b 的目的。从原理上来讲，测量越多的 CSI 值，误差消除的效果也会越好，但是其可能会在扫描信道的时候产生延迟，所以需要选择合适的 CSI 测量数量，同时兼顾误差和效率。</p><p>对于中心频偏 CFO 而言，其会产生一个相位的偏移 β，CFO 偏差一般不会导致斜率上的偏移，在移除掉包边界检测 (PBD) 错误偏移 λ b 和中心采样频偏 SFO 之后，不同 WiFi 频段重叠子载波相位的形状会变得相似，只存在一些平移的偏差，可以从任意频带中选择一个相位作为参考相位并用于校准补偿其他频带上的相位平移误差，即可达到消除 CFO 的目的。</p><p>受限于硬件的分辨率，自动增益控制器 AGC 不能很好地补充信号的振幅衰减，无法使得振幅与发射功率一致，故测量到的 CSI 振幅等于补偿后的功率，使得 CSI 的振幅产生偏移。</p><p>CSI 由于振幅衰减产生的振幅误差与 WiFi 频段无关，从不同频段测量的振幅具有相同的分布，所有 CSI 数据包中振幅的误差整体符合高斯分布，其均值为 0，只需对所有的频段进行平均即可达到消除振幅误差的目的。</p><h3 id="aoa-室内定位算法" tabindex="-1"><a class="header-anchor" href="#aoa-室内定位算法" aria-hidden="true">#</a> AoA 室内定位算法</h3><p>左图表示 AoA 的计算原理，在每个 CSI 信号波长 λ 内，相位以 2π 为周期变化，当发送天线发送数据包被接收天线接收到的过程中，经过路径长度为 d ，由于两根天线之间以距离 λ/2 分布，所以对于两根天线接收到的同一方位上目标的信号，先到达的信号和后到达的信号之间存在着距离差，这个距离差的大小只与方向角 θ 相关，由图中的三角关系可得出相位和方向角的关系。一般在空旷环境下计算 AoA 只需要测量出两天线之间的相位差值即可。</p><p>多径抑制算法的思想在于：当发射端和接收端之间的目标产生轻微的运动时，如身体的自然摆动，对应在 AoA 频谱上的主径峰值通常十分稳定，而多径峰值会产生剧烈的变化。</p><p>基于这个思想，本文定义一个角度值 θ 0 和一个距离值 d 0 。当目标在距离 d 0 之内移动都被视为轻微的运动，如果两个信号的 AoA 频谱峰值中心轴的角度差距小于 θ 0 ，便认为其未发生改变；反之，如果该差距大于 θ 0 ，则发生改变。如此，在目标轻微运动时，就能够使用 AoA 频谱区分出多径和主径。</p><p>多径抑制算法对于未改变的信号加以保留，改变的信号加以抑制或删除，如此就能在 AoA 频谱图上抑制或消除多径信号的峰值，达到减少多径效应影响的目的。</p>',28);function d(m,I){return t(),p("div",null,[l,n(" more "),h,o,c])}const F=i(r,[["render",d],["__file","paper_report.html.vue"]]);export{F as default};
