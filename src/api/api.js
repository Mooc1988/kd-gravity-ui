import axios from 'axios'

const API_URL = process.env.API_BASE_URL
const instance = axios.create({
  baseURL: API_URL,
  timeout: 1000,
  headers: {
    'X-Custom_Header': 'foobar'
  }
})

instance.interceptors.request.use(function (config) {
  let token = sessionStorage.getItem('jwtToken')
  if (token !== undefined && token !== null) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config;
}, function (error) {
  return Promise.reject(error);
})

export const requestLogin = params => {
  return instance.post(`/login`, params).then(res => res.data)
}

export const getAppListPage = params => {
  return instance.get(`/apps`, {
    params
  })
}

export const addApp = params => {
  return instance.post('/apps', params)
}

export const modifyApp = params => {
  let {
    id
  } = params
  return instance.put(`/apps/${id}`, params)
}

export const removeApp = appId => {
  return instance.delete(`/apps/${appId}`)
}

export const switchAuditMode = appId => {
  return instance.put(`/apps/${appId}/switchAuditMode`)
}

export const getAlbumListPage = params => {
  return instance.get('/yss/albums', {
    params
  })
}

export const addAlbumsToApp = params => {
  let {appId, albumIds} = params
  return instance.post(`/yss/apps/${appId}/albums`, {
    albumIds
  })
}
