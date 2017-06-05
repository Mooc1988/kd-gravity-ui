/**
 * Created by frank on 2017/4/7.
 */
import instance from './client'

// 获取专辑列表
export const getAll = params => {
  return instance.get('/templates', {
    params
  })
}
export const getUserTemplates = params => {
  return instance.get('/templates/user', {params})
}

export const getById = id => {
  return instance.get(`/templates/${id}`)
}

export const modifyById = params => {
  let {id} = params
  return instance.put(`/templates/${id}`, params)
}

export const upgradeById = params => {
  let {id} = params
  return instance.put(`/templates/${id}/upgrade`, params)
}

export const createOrUpdate = params => {
  return instance.post(`/templates`, params)
}

export const getSubTypes = params => {
  return instance.get('/templates/subTypes', params)
}


