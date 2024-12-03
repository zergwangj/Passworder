/**
 * 基础路由
 * @type { *[] }
 */

const constantRouterMap = [
  {
    path: '/',
    name: 'Main',
    redirect: { name: 'MainList' },
    children: [
      {
        path: '/main',
        name: 'MainList',
        component: () => import('@/views/main/List.vue')
      },
    ]
  },
]

export default constantRouterMap