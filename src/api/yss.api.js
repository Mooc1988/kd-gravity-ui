/**
 * Created by frank on 2017/3/21.
 */

import instance from './client'

// 获取专辑列表
export const getAlbumListPage = params => {
  return instance.get('/yss/albums', {
    params
  })
}

//根据id修改专辑信息
export const modifyAlbumById = params => {
  let {id} = params
  return instance.put(`/yss/albums/${id}`, params)
}

// 添加专辑到app
export const addAlbumsToApp = params => {
  let {appId, albumIds} = params
  return instance.post(`/yss/apps/${appId}/albums`, {
    albumIds
  })
}