import { actionTypes, NavBarOptions, TabBarOptions, AuthModalOptions } from '../actions/ui'
import { Metrics } from '../../metrics'

// export interface State {
//   /**
//    * 导航栏高度
//    */
//   navBarHeight: number
//   /**
//    * 头部高度 = 导航栏高度 + 状态栏高度 + （微信菜单胶囊的上边 - 减去状态栏高度）* 2
//    */
//   totalNavBarHeight: number
//   /**
//    * 状态栏高度
//    */
//   statusBarHeight: number
//   tabBarSelected: number
// }

export type State = NavBarOptions & TabBarOptions & AuthModalOptions


const INITIAL_STATE: State = {
  navBarHeight: Metrics.navBarHeight,
  totalNavBarHeight: Metrics.totalNavBarHeight,
  statusBarHeight: Metrics.statusBarHeight,
  tabBarSelected: 0,
  authModalStatus: false
}

const ui = (state = INITIAL_STATE, action: actionTypes) => {
  switch(action.type) {
    case 'UI/SET_NAV_BAR_OPTIONS':
      return {
        ...state,
        ...action.payload
      }
    case 'SET_TAB_BAR_OPTIONS':
      return {
        ...state,
        ...action.payload
      }
    case 'SET_AUTH_MODAL_OPTIONS':
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}

export default ui



