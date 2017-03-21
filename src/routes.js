import Login from './pages/Login.vue'
import NotFound from './pages/404.vue'
import Home from './pages/Home.vue'
import YssAlbums from './pages/yss/AlbumList.vue'
import AppList from './pages/common/AppList.vue'
import H5AppDetail from './pages/h5/AppDetail.vue'
import  './pages/Main.vue'

let routes = [
  {
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
    children: [
      {
        path: '/yss/apps',
        component: AppList,
        props: {appType: '有声书'},
        name: 'App列表-有声书'
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
    children: [
      {
        path: '/h5/apps',
        component: AppList,
        props: {appType: 'h5'},
        name: 'App列表-h5'
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
    component: Home,
    name: '换装',
    iconCls: 'el-icon-message', //图标样式class
    children: [{
      path: '/huanzhuang/apps',
      component: AppList,
      props: {appType: '换装'},
      name: 'App列表-换装'
    }]
  },
  {
    path: '/qipai',
    component: Home,
    name: '棋牌',
    iconCls: 'el-icon-message', //图标样式class
    children: [{
      path: '/qipai/apps',
      component: AppList,
      props: {appType: '棋牌'},
      name: 'App列表-棋牌'
    }]
  },
  {
    path: '/book',
    component: Home,
    name: '电子书',
    iconCls: 'el-icon-message', //图标样式class
    children: [{
      path: '/book/apps',
      component: AppList,
      props: {appType: '电子书'},
      name: 'App列表-电子书'
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
