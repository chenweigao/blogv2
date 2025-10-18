export const artificialIntelligenceSidebar = {
  '/artificial-intelligence/': [
    {
      text: 'AI Infrastructure Overview',
      collapsed: false,
      items: [
        { text: 'Overview', link: '/artificial-intelligence/' }
      ]
    },
    {
      text: 'Hardware Acceleration',
      collapsed: false,
      items: [
        { text: 'GPU Architecture', link: '/artificial-intelligence/gpu-computing/gpu_arch' },
        { text: 'GPU Communication', link: '/artificial-intelligence/gpu-computing/gpu_communication' },
        { text: 'Intel AMX & OpenVINO', link: '/artificial-intelligence/AMX/openvino' }
      ]
    },
    {
      text: 'Infrastructure & Operations',
      collapsed: false,
      items: [
        { text: 'Model Optimization', link: '/artificial-intelligence/model-optimization/' },
        { text: 'Monitoring & Operations', link: '/artificial-intelligence/monitoring-ops/' },
        { text: 'Cloud Platforms', link: '/artificial-intelligence/cloud-platforms/' },
        { text: 'Training Frameworks', link: '/artificial-intelligence/training-frameworks/' }
      ]
    },
    {
      text: 'Research & Papers',
      collapsed: true,
      items: [
        { text: 'SAC - ISCA 23', link: '/artificial-intelligence/gpu-computing/SAC - ISCA 23' }
      ]
    }
  ]
}