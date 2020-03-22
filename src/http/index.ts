import Taro from '@tarojs/taro'
import { Observable } from 'rxjs'

type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>
type ExtractValue<T, K extends keyof T> = T[K]
type InitReuqestParam = Omit<Taro.request.Option, 'url' | 'data'>
type method = ExtractValue<Taro.request.Option, 'method'>

export const httpClient = (BASE_URL: string, options: InitReuqestParam = {}) => {
  const requestParams = { ...options }

  const agent = <T = any, U = any>(uri: string, method: method, data: any = {}, options: InitReuqestParam = {}) => {
    const url = BASE_URL + uri
    const params: Taro.request.Option = { url, data, method, ...requestParams, ...options }
    const observerble: Observable<U> = Observable.create(observer => {
      Taro.request<T, U>(params)
      .then(data => {
        observer.next(data)
      })
      .catch(error => {
        console.log(error)
        observer.error(error)
      })
    })
    return observerble
  }

  const get = <T extends any , U = any>(uri: string, data?: T, options: InitReuqestParam = {}) => {
    return agent<T, U>(uri, 'GET', data, options)
  }
  const post = <T extends any, U = any>(uri: string, data?: T, options: InitReuqestParam = {}) => {
    return agent<T, U>(uri, 'POST', data, options)
  }

  return {
    get,
    post
  }
}
