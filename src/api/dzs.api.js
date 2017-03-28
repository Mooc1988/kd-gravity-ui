/**
 * Created by frank on 2017/3/21.
 */
import instance from './client'

export const getBooks = params => {
  return instance.get('/dzs/books', {params})
}

export const getCategories = params => { return instance.get('/dzs/categories', {params}) }

// 添加书籍到app
export const addToApp = params => {
  let {appId, bookIds} = params
  return instance.post(`/dzs/apps/${appId}/books`, {
    bookIds
  })
}