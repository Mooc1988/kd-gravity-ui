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

export const getById = id => {
  return instance.get(`/templates/${id}`)
}

export const modifyById = params => {
  let {id} = params
  return instance.put(`/templates/${id}`, params)
}

export const createOrUpdate = params => {
  let {UserId} = params
  return instance.post(`/users/${UserId}/templates`, params)
}

export const getUserTemplates = params => {
  let {UserId} = params
  return instance.get(`/users/${UserId}/templates`, {params})
}

export const getPositions = params => {
  return instance.get('/templates/positions', {params})
}