export const programmingLanguagesSidebar = {
  '/programming-languages/java/': [
    {
      text: 'Java 基础',
      collapsed: false,
      items: [
        { text: 'Overview', link: '/programming-languages/java/' },
        { text: 'Java 核心概念', link: '/programming-languages/java/java/core-concepts' },
        { text: 'Java 索引', link: '/programming-languages/java/java/' }
      ]
    },
    {
      text: 'JVM 虚拟机',
      collapsed: false,
      items: [
        { text: 'JVM 内存模型', link: '/programming-languages/java/jvm/01_jvm_memory' },
        { text: 'JVM 指令集', link: '/programming-languages/java/jvm/jvm_inst' },
        { text: 'G1 垃圾收集器', link: '/programming-languages/java/jvm/gc_g1' },
        { text: 'Java 反射机制', link: '/programming-languages/java/jvm/reflection' }
      ]
    },
    {
      text: 'ART 运行时',
      collapsed: false,
      items: [
        { text: 'ART 创建过程', link: '/programming-languages/java/art/art_create' },
        { text: 'ART DEX2OAT', link: '/programming-languages/java/art/art_dex2oat' },
        { text: 'ART JNI', link: '/programming-languages/java/art/art_jni' },
        { text: 'ART GC 原理', link: '/programming-languages/java/art/gc_art_01' }
      ]
    },
    {
      text: 'Android 系统',
      collapsed: false,
      items: [
        { text: 'ADB 调试工具', link: '/programming-languages/java/android/adb' },
        { text: 'Binder 机制', link: '/programming-languages/java/android/binder' },
        { text: 'Binder 原理 (1)', link: '/programming-languages/java/android/binder_01' },
        { text: 'Binder 原理 (2)', link: '/programming-languages/java/android/binder_02' },
        { text: 'IPC 进程间通信', link: '/programming-languages/java/android/ipc' },
        { text: 'Parcel 序列化', link: '/programming-languages/java/android/parcel' }
      ]
    }
  ],
  '/programming-languages/python/': [
    {
      text: 'Python Programming',
      collapsed: false,
      items: [
        { text: 'Hash', link: '/programming-languages/python/language/hash' },
        { text: 'Effective Python', link: '/programming-languages/python/language/effective-python' },
        { text: 'Pytest', link: '/programming-languages/python/language/pytest' },
        { text: 'Python C', link: '/programming-languages/python/language/python_c' },
        { text: 'Itertools', link: '/programming-languages/python/language/itertools' },
        { text: 'Python Function', link: '/programming-languages/python/language/python-function' },
        { text: 'Python Data Structure', link: '/programming-languages/python/language/py-data-struct' },
        { text: 'Pip', link: '/programming-languages/python/language/pip' }
      ]
    },
    {
      text: 'Python Tools',
      collapsed: false,
      items: [
        { text: 'Virtual Environment', link: '/programming-languages/python/tools/virtualenv' },
        { text: 'Python Tools', link: '/programming-languages/python/tools/py-tools' }
      ]
    }
  ]
}