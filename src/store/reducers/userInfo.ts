import { actionTypes } from '../actions/userInfo'
import Taro from '@tarojs/taro'

export type State = Taro.UserInfo

const INITIAL_STATE: State = {
  nickName: '',
  avatarUrl: '',
  gender: 0,
  city: '',
  province: '',
  country: '',
  language: 'zh_CN'
}

const userInfo = (state = INITIAL_STATE, action: actionTypes) => {
  switch (action.type) {
    case 'USERINFO/SET_USER_INFO':
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}

export default userInfo
