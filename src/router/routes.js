// ()=>import home from '../pages/home/index.vue'
import SideBar from '@/components/sideBar/index.vue'

// login
export const login = {
  path: '/login',
  name: 'login',
  component: () => import('@/pages/login/index.vue')
}

// 主页面
export const mainRouter = {
  path: '',
  component: SideBar,
  redirect: '/userSearch',
  meta: {
    requireAuth: true
  },
  children: [
    {
      path: '/userSearch',
      component: () => import('@/pages/userSearch/index.vue'),
      meta: { title: "用户查询", icon: "HomeFilled" },
    },
    {
      path: '/withDraw',
      component: () => import('@/pages/withDraw/index.vue'),
      meta: { title: "提现审核", icon: "HomeFilled" },
    },
    {
      path: '/stopAct',
      component: () => import('@/pages/stopAct/index.vue'),
      meta: { title: "停止活动", icon: "HomeFilled" },
    },
    {
      path: '/unionAct',
      component: () => import('@/pages/unionAct/index.vue'),
      meta: { title: "聚合拉新", icon: "HomeFilled" },
    },
    {
      path: '/redPackage',
      component: () => import('@/pages/redPackage/index.vue'),
      meta: { title: "支付宝红包", icon: "HomeFilled" },
    },
    {
      path: '/versionLink',
      component: () => import('@/pages/versionLink/index.vue'),
      meta: { title: "多版本链接", icon: "HomeFilled" },
    },
    {
      path: '/order',
      component: () => import('@/pages/order/index.vue'),
      meta: { title: "返现订单", icon: "HomeFilled" },
    },
    {
      path: '/convertOrder',
      component: () => import('@/pages/convertOrder/index.vue'),
      meta: { title: "兑换订单", icon: "HomeFilled" },
    },
    {
      path: '/dingShop',
      component: () => import('@/pages/dingShop/index.vue'),
      meta: { title: "钉钉店铺", icon: "HomeFilled" },
    },
    {
      path: '/popup',
      meta: { title: "运营弹窗", icon: "HomeFilled" },
      component: () => import('@/pages/popup/index.vue'),
      children: [
        {
          path: 'createPopup',
          component: () => import('@/pages/popup/createPopup/index.vue'),
          meta: { title: "创建弹窗", icon: "HomeFilled" }
        },
        {
          path: 'managePopup',
          component: () => import('@/pages/popup/managePopup/index.vue'),
          meta: { title: "管理弹窗", icon: "HomeFilled" }
        },
        {
          path: 'createUserGroup',
          component: () => import('@/pages/popup/createUserGroup/index.vue'),
          meta: { title: "创建用户组", icon: "HomeFilled" }
        },
        {
          path: 'manageUserGroup',
          component: () => import('@/pages/popup/manageUserGroup/index.vue'),
          meta: { title: "管理用户组", icon: "HomeFilled" }
        },
        {
          path: 'managePage',
          component: () => import('@/pages/popup/managePage/index.vue'),
          meta: { title: "管理页面", icon: "HomeFilled" }
        }
      ]
    }
  ]
}

export const routes = [login, mainRouter]


