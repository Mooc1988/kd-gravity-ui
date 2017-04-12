import instance from './client'

export const getAppListPage = params => {
  return instance.get(`/apps`, {
    params
  })
}
export const addApp = params => {
  return instance.post('/apps', params)
}

export const modifyApp = params => {
  let {id} = params
  return instance.put(`/apps/${id}`, params)
}

export const removeApp = appId => {
  return instance.delete(`/apps/${appId}`)
}

export const switchAuditMode = appId => {
  return instance.put(`/apps/${appId}/switchAuditMode`)
}

export const batchModifyAds = params => {
  return instance.put('/ads/batch', params)
}
