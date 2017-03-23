/**
 * Created by frank on 2017/3/21.
 */
import instance from './client'

export const getBooks = params => { return instance.get('/dzs/books', params) }
