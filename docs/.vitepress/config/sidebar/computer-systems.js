export const computerSystemsSidebar = {
  '/computer-systems/cpu-gpu/': [
    {
      text: 'CPU 概述',
      collapsed: false,
      items: [
        { text: 'CPU 架构概览', link: '/computer-systems/cpu-gpu/' },
        { text: 'README', link: '/computer-systems/cpu-gpu/README' }
      ]
    },
    {
      text: 'CPU 基础架构',
      collapsed: false,
      items: [
        { text: '流水线 (Pipeline)', link: '/computer-systems/cpu-gpu/cpu-architecture/pipeline-performance/pipline' },
        { text: '缓存系统 (Cache)', link: '/computer-systems/cpu-gpu/cpu-architecture/memory-systems/cache' },
        { text: '内存管理单元 (MMU)', link: '/computer-systems/cpu-gpu/cpu-architecture/memory-systems/MMU' },
        { text: '虚拟内存与分页', link: '/computer-systems/cpu-gpu/cpu-architecture/memory-systems/memory_va_page' }
      ]
    },
    {
      text: '指令集架构 (ISA)',
      collapsed: false,
      items: [
        { text: 'x86 指令集', link: '/computer-systems/cpu-gpu/cpu-architecture/instruction-sets/x86_inst' },
        { text: 'AMX 矩阵扩展', link: '/computer-systems/cpu-gpu/cpu-architecture/instruction-sets/amx' },
        {
          text: 'ARM 架构',
          collapsed: true,
          items: [
            { text: 'ARM 概述', link: '/computer-systems/cpu-gpu/arm-architecture/' },
            { text: 'ARM 指令集', link: '/computer-systems/cpu-gpu/arm-architecture/arm_ins' },
            { text: 'ARM 内联汇编', link: '/computer-systems/cpu-gpu/arm-architecture/arm_inline_assembly' }
          ]
        }
      ]
    },
    {
      text: '系统架构',
      collapsed: false,
      items: [
        { text: 'NUMA 与 Socket', link: '/computer-systems/cpu-gpu/cpu-architecture/memory-systems/numa_socket' },
        { text: 'IBS 指令采样', link: '/computer-systems/cpu-gpu/cpu-architecture/pipeline-performance/ibs' }
      ]
    }
  ],
  '/computer-systems/linux/': [
    {
      text: 'Linux 概述',
      collapsed: false,
      items: [
        { text: 'Overview', link: '/computer-systems/linux/' },
        { text: 'README', link: '/computer-systems/linux/README' }
      ]
    },
    {
      text: 'Linux 工具',
      collapsed: false,
      items: [
        { text: '命令行工具', link: '/computer-systems/linux/commands-tools/command' }
      ]
    },
    {
      text: 'Linux 内核',
      collapsed: false,
      items: [
        { text: '内核 README', link: '/computer-systems/linux/kernel/README' },
        { text: 'RCU', link: '/computer-systems/linux/kernel/process-scheduling/rcu' },
        { text: 'Idle Tick', link: '/computer-systems/linux/kernel/process-scheduling/idle_tick' },
        { text: 'Idle', link: '/computer-systems/linux/kernel/process-scheduling/idle' },
        { text: 'I2C 驱动', link: '/computer-systems/linux/kernel/device-drivers/i2c' },
        { text: 'BL31', link: '/computer-systems/linux/kernel/architecture/BL31' },
        { text: 'THP', link: '/computer-systems/linux/kernel/memory-management/THP' },
        { text: 'Notifier', link: '/computer-systems/linux/kernel/core-concepts/notifier' },
        { text: 'Pthread', link: '/computer-systems/linux/kernel/core-concepts/pthread' },
        { text: 'Thermal Init', link: '/computer-systems/linux/kernel/thermal-management/thermal_init' },
        { text: 'Thermal', link: '/computer-systems/linux/kernel/thermal-management/thermal' }
      ]
    },
    {
      text: '系统编程',
      collapsed: false,
      items: [
        { text: '系统编程 README', link: '/computer-systems/linux/system-programming/README' },
        { text: 'Linkers & Loaders', link: '/computer-systems/linux/system-programming/linkers_loaders' },
        { text: 'size_t', link: '/computer-systems/linux/system-programming/size_t' },
        { text: 'C Pointer', link: '/computer-systems/linux/system-programming/c-pointer' },
        { text: 'CMake', link: '/computer-systems/linux/system-programming/cmake' },
        { text: 'CMake Makefile', link: '/computer-systems/linux/system-programming/cmake_makefile' }
      ]
    },
    {
      text: '系统管理',
      collapsed: false,
      items: [
        { text: 'APT', link: '/computer-systems/linux/system-administration/apt' }
      ]
    },
    {
      text: '教育资源',
      collapsed: false,
      items: [
        { text: 'XV6', link: '/computer-systems/linux/educational/xv6' }
      ]
    }
  ]
}