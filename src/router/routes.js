// ()=>import home from '../pages/home/index.vue'

// login
// export const login = {
//   path: '/login',
//   name: 'login',
//   component: () => ()=>import(/* webpackChunkName: "login" */ '@/pages/login'),
// }

// 主页面
export const routes = [
  {
    path: '',
    component: ()=>import('@/components/sideBar/index.vue'),
    redirect: '/userSearch',
  },
  {
    path: '/userSearch',
    component: ()=>import(/* webpackChunkName: "userSearch" */ '@/pages/userSearch/index.vue'),
    meta: { title: "用户查询", icon: "HomeFilled" },
  },
  {
    path: '/withDraw',
    component: ()=>import(/* webpackChunkName: "withDraw" */ '@/pages/withDraw/index.vue'),
    meta: { title: "提现审核", icon: "HomeFilled" },
  },
  {
    path: '/stopAct',
    component: ()=>import(/* webpackChunkName: "stopAct" */ '@/pages/stopAct/index.vue'),
    meta: { title: "停止活动", icon: "HomeFilled" },
  },
  {
    path: '/unionAct',
    component: ()=>import(/* webpackChunkName: "unionAct" */ '@/pages/unionAct/index.vue'),
    meta: { title: "聚合拉新", icon: "HomeFilled" },
  },
  {
    path: '/redPackage',
    component: ()=>import(/* webpackChunkName: "redPackage" */ '@/pages/redPackage/index.vue'),
    meta: { title: "支付宝红包", icon: "HomeFilled" },
  },
  {
    path: '/versionLink',
    component: ()=>import(/* webpackChunkName: "versionLink" */ '@/pages/versionLink/index.vue'),
    meta: { title: "多版本链接", icon: "HomeFilled" },
  },
  {
    path: '/order',
    component: ()=>import(/* webpackChunkName: "order" */ '@/pages/order/index.vue'),
    meta: { title: "返现订单", icon: "HomeFilled" },
  },
  {
    path: '/convertOrder',
    component: ()=>import(/* webpackChunkName: "convertOrder" */ '@/pages/convertOrder/index.vue'),
    meta: { title: "兑换订单", icon: "HomeFilled" },
  },
  {
    path: '/dingShop',
    component: ()=>import(/* webpackChunkName: "dingShop" */ '@/pages/dingShop/index.vue'),
    meta: { title: "钉钉店铺", icon: "HomeFilled" },
  },
  {
    path: '/popup',
    meta: { title: "运营弹窗", icon: "HomeFilled" },
    component: ()=>import(/* webpackChunkName: "popup" */ '@/pages/popup/index.vue'),
    children: [
      {
        path: 'createPopup',
        component: ()=>import(/* webpackChunkName: "createPopup" */ '@/pages/popup/createPopup/index.vue'),
        meta: { title: "创建弹窗", icon: "HomeFilled" }
      },
      {
        path: 'managePopup',
        component: ()=>import(/* webpackChunkName: "managePopup" */ '@/pages/popup/managePopup/index.vue'),
        meta: { title: "管理弹窗", icon: "HomeFilled" }
      },
      {
        path: 'createUserGroup',
        component: ()=>import(/* webpackChunkName: "createUserGroup" */ '@/pages/popup/createUserGroup/index.vue'),
        meta: { title: "创建用户组", icon: "HomeFilled" }
      },
      {
        path: 'manageUserGroup',
        component: ()=>import(/* webpackChunkName: "manageUserGroup" */ '@/pages/popup/manageUserGroup/index.vue'),
        meta: { title: "管理用户组", icon: "HomeFilled" }
      },
      {
        path: 'managePage',
        component: ()=>import(/* webpackChunkName: "managePage" */ '@/pages/popup/managePage/index.vue'),
        meta: { title: "管理页面", icon: "HomeFilled" }
      }
    ]
  }

]

