import Login from './pages/Login.vue'
import NotFound from './pages/404.vue'
import Home from './pages/Home.vue'
import AppList from './pages/common/AppList.vue'
import AdTemplateList from './pages/settings/ListTemplate.vue'
import EditTemplate from './pages/settings/EditTemplate.vue'
import BatchModifyAd from './pages/settings/BatchModifyAd.vue'
import AddTemplate from './pages/settings/AddTemplate.vue'
import YssAlbums from './pages/yss/AlbumList.vue'
import H5AppDetail from './pages/h5/AppDetail.vue'
import BookList from './pages/dzs/BookList.vue'
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
    path: '/androidhz',
    component: Home,
    name: '安卓换装',
    iconCls: 'el-icon-message', //图标样式class
    children: [{
      path: '/androidhz/apps',
      component: AppList,
      props: {appType: '安卓换装'},
      name: 'App列表-安卓换装'
    }]
  },
  {
    path: '/games',
    component: Home,
    name: '游戏',
    iconCls: 'el-icon-message', //图标样式class
    children: [{
      path: '/games/apps',
      component: AppList,
      props: {appType: '游戏'},
      name: 'App列表-游戏'
    }]
  },
  {
    path: '/dzs',
    component: Home,
    name: '电子书',
    iconCls: 'el-icon-message', //图标样式class
    children: [
      {
        path: '/dzs/apps',
        component: AppList,
        props: {appType: '电子书'},
        name: 'App列表-电子书'
      }, {
        path: '/dzs/books',
        component: BookList,
        name: '图书列表'
      }]
  },
  {
    path: '/zixun',
    component: Home,
    name: '资讯',
    iconCls: 'el-icon-message', //图标样式class
    children: [{
      path: '/zixun/apps',
      component: AppList,
      props: {appType: '资讯'},
      name: 'App列表-资讯'
    }]
  },
  {
    path: '/tools',
    component: Home,
    name: '工具',
    iconCls: 'el-icon-message', //图标样式class
    children: [{
      path: '/tools/apps',
      component: AppList,
      props: {appType: '工具'},
      name: 'App列表-工具'
    }]
  },
  {
    path: '/settings',
    component: Home,
    name: '设置',
    iconCls: 'el-icon-message', //图标样式class
    children: [
      {
        path: '/settings/templates',
        component: AdTemplateList,
        name: '模版列表',
        roles: ['admin']
      }, {
        path: '/settings/modifyAd',
        component: BatchModifyAd,
        name: '修改广告位',
        roles: ['admin']
      }, {
        path: '/settings/templates/add',
        component: AddTemplate,
        name: '添加模版',
        hidden: true
      }, {
        path: '/settings/templates/:id',
        component: EditTemplate,
        name: '模版详情',
        hidden: true
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
