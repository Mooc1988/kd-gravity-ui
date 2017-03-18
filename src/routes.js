import Login from './pages/Login.vue'
import NotFound from './pages/404.vue'
import Home from './pages/Home.vue'
import Main from './pages/Main.vue'
import YssApps from './pages/yss/AppList.vue'
import YssAlbums from './pages/yss/AlbumList.vue'

import H5Apps from './pages/h5/AppList.vue'
import H5AppDetail from './pages/h5/AppDetail.vue'
import BookApps from './pages/book/AppList.vue'
import QipaiApps from './pages/qipai/AppList.vue'
import HuanzhuangApps from './pages/huanzhuang/AppList.vue'

let routes = [{
  path: '/login',
  component: Login,
  name: '',
  hidden: true
},
  {
    path: '/404',
    component: NotFound,
    name: '',
    hidden: true
  },
  {
    path: '/yss',
    component: Home,
    name: '有声书',
    iconCls: 'el-icon-message', //图标样式class
    children: [{
      path: '/yss/apps',
      component: YssApps,
      name: 'App列表'
    },
      {
        path: '/yss/albums',
        component: YssAlbums,
        name: '专辑列表',
      },
    ]
  },
  {
    path: '/h5',
    component: Home,
    name: 'h5游戏',
    iconCls: 'el-icon-message', //图标样式class
    children: [{
      path: '/h5/apps',
      component: H5Apps,
      name: 'App列表'
    },
      {
        path: '/h5/apps/:id',
        component: H5AppDetail,
        name: 'App详情',
        hidden: true
      }
    ]
  },
  {
    path: '/huanzhuang',
    cohuanzhuang: Home,
    name: '换装',
    iconCls: 'el-icon-message', //图标样式class
    children: [{
      path: '/huanzhuang/apps',
      component: HuanzhuangApps,
      name: 'App列表'
    }]
  },
  {
    path: '/qipai',
    component: Home,
    name: '棋牌',
    iconCls: 'el-icon-message', //图标样式class
    children: [{
      path: '/qipai/apps',
      component: QipaiApps,
      name: 'App列表'
    }]
  },
  {
    path: '/book',
    component: Home,
    name: '电子书',
    iconCls: 'el-icon-message', //图标样式class
    children: [{
      path: '/book/apps',
      component: BookApps,
      name: 'App列表'
    }]
  },
  {
    path: '*',
    hidden: true,
    redirect: {
      path: '/404'
    }
  }
];

export default routes;
