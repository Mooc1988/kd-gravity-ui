/**
 * Created by frank on 2017/4/7.
 */
import instance from './client'

export const findAll = params => {
  return instance.get('/users', {params})
}