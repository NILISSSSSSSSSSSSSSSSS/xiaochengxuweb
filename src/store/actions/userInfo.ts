import { SET_USER_INFO } from '../constants'
import Taro from '@tarojs/taro'

type UserInfo = Taro.UserInfo
interface SetUserInfo {
  type: typeof SET_USER_INFO
  payload: UserInfo
}

export type actionTypes = SetUserInfo

export const setUserInfo = (payload: UserInfo): SetUserInfo => {
  return {
    type: SET_USER_INFO,
    payload
  }
}

export const asyncGetUserInfo = () => {

}
