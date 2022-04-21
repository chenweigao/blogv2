# Basic Knowledge

[[toc]]

## Abstract

这个文档主要用于收集嵌入式和芯片中公开的、基础的知识，用于扫盲。

如果某个知识点需要更加深入的了解的话，则单独新增新的博客。

## I2C and I3C

### I2C

> I2C (Inter-Integrated Circuit) is an on-board communication protocol that is ideal for short distances and low bandwidth.[^1]

Inter-Integrated Circuit 直译为内部集成电路。

这句话说了 I2C 是一个理想的短距离、低带宽的通信协议。

>  It has a master-slave architecture in which all slaves are connected to the master via two lines: the serial data line (SDA) and the serial clock line (SCL).

架构是 master-slave 架构，所有的 slave 通过串行的 data line 和串行的 clock line 连接到 master, 简而言之，就是一个 master 多个 slave.

> I2C is typically used to connect lower speed peripherals, such as sensors to processors and microcontrollers over short distances, within an integrated circuit.

peripherals /pə'rifərəls/ 外设。

这句话说的是 I2C 一般用来连接低速外设，比如说传感器。I2C --> Sensor.

------

> The I2C protocol defines how data is sent.

I2C 协议定义了数据如何发送。（通常协议会做的事情）

> Initially, the master issues a start condition followed by the address of the slave device with which it is communicating. Once the appropriate slave has identified its address, it searches for the progressive read / write flag issued by the master. This flag tells the slave if it can receive data or send data. As soon as the slave has confirmed the master, communication continues.

上面这段过程比较长，总的而言就是 master 和 slave device 之前发生的一些事情。

### I3C

I3C[^3]: *Improved Inter Integrated Circuit*.

> I3C is also known as MIPI I3C and SenseWire. I3C is the new industry standard for serial multidrop data buses.

MIPI[^2] 是一个联盟，Mobile Industry Processor Interface, 旨在推进手机应用处理器接口的标准化，I3C 就是其新的一个行业标准。

> I3C adds a considerable number of system interface functions while maintaining upward compatibility with existing I²C slave devices, while native I3C devices support higher data rates similar to SPI (Serial Peripheral Interface). 

I3C 增加了大量的系统接口，并保持了向后兼容。

原生的 I3C 设备支持更高数据速率，类似于 SPI(串行外设接口).

> With I3C, one or more master devices can be connected to one or more slaves via the bus. 

I3C 支持多个 master devices 连接到多个 slaves.

> I3C the evolution of I²C.

I3C 是 I2C 的演化。

> I3C was originally intended as the only interface for all digitally connected sensors used in a mobile application. 

> The bus is also suitable for all medium and high speed embedded applications, including sensors, power controllers, actuators, MCUs and FPGAs. 

I3C 的应用范围。

> I3C builds on and enhances the features and benefits of I2C, while maintaining backward compatibility.

增强了 I2C 并保持了向后兼容性。

> The interface is useful for many applications because it provides high-speed data transmission at very low power levels while allowing multi-drop between the host processor and the peripherals, which is highly desirable for any embedded system.

对于嵌入式系统来说，I3C 非常优秀，以非常低的功耗提供了高速的数据传输速率，同时允许主机处理器和外设之间的多点传输。

### I2C vs I3C

- Energy-saving and space-saving design for mobile devices (smartphones and IoT devices).
- Two-pole interface, which is a superset of the I2C standard. Older I2C slave devices can be connected to the newer bus.
- In-band interrupts over the serial bus instead of requiring separate pins.
- Standard Data Rate (SDR) throughput of up to 12.5 Mbps when using CMOS I / O levels
- HDR (High Data Rate) modes provide SPI-comparable throughput, but only require a fraction of the I2C fast-mode performance.
- A standardized set of common command codes
- Support for command queues
- Error detection and recovery (parity check in SDR mode and 5-bit CRC for HDR modes)
- **Dynamic Address Assignment** (DAA) for I3C slaves, but still supports static addresses for older I2C devices
- Hot-Join (some devices on the bus can be turned on and off during operation)
- **Multi-master** operation with clearly defined transfer
- Four different device classes can be supported on an I3C bus in standard mode (SDR)

### I2C Problem

Q: I2C 总线可以挂多个 Sensor, 但是我们的 SoC 中设置了很多 I2C Controller, 为什么要这么做呢？

1. 虽然一个 I2C 总线可以挂多个 Sensor, 但是总线可以传输的总的数据是固定的
2. 不同的 I2C Controller 是挂在不同的处理器上面的，如 ACPU 有一个 I2C Controller, MCPU 也有一个 I2C Controller, 那么我们设置多个 I2C Controller 可以避免不同的 CPU 子系统对一个 controller 进行复用，简化软件控制

---------------

Q: SensorHub 和 I2C 对 Sensor 而言有什么区别？

I2C Controller 有些属于 CPU 控制，有些属于 SensorHub 控制；这也是为什么说 I2C 控制 Sensor 但是有一个 SensorHub，其关系应该是这样的：SensorHub --> I2C Controller(驱动软件) --> I2C 总线 --> Sensor.


## Reference

[^1]: <https://evision-webshop.de/I2C-vs-I3C-Protocol-Analyzers-Differences-and-Similarities>
[^2]: [MIPI Alliance](https://en.wikipedia.org/wiki/MIPI_Alliance)
[^3]: [I3C Bus Wiki](https://en.wikipedia.org/wiki/I3C_(bus)#I%C2%B2C_features_not_supported_in_I3C)
