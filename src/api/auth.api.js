/**
 * Created by frank on 2017/3/21.
 */
import instance from './client'

export const requestLogin = params => {
  return instance.post(`/login`, params).then(res => res.data)
}