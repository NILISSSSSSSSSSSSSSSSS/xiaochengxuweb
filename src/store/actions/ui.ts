import {
  SET_NAV_BAR_OPTIONS,
  GET_TAB_BAR_OPTIONS,
  SET_TAB_BAR_OPTIONS,
  SET_AUTH_MODAL_OPTIONS
} from '../constants/ui'

/**
 * \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
 * payload
 * \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
 */
export type NavBarOptions = {
  /**
   * 导航栏高度
   */
  navBarHeight: number
  /**
   * 头部高度 = 导航栏高度 + 状态栏高度 + （微信菜单胶囊的上边 - 减去状态栏高度）* 2
   */
  totalNavBarHeight: number
  /**
   * 状态栏高度
   */
  statusBarHeight: number
}

export type TabBarOptions = {
  /**
   * tab页面的索引
   */
  tabBarSelected: number
}

export type AuthModalOptions = {
  /**
   * 现隐modal
   */
  authModalStatus: boolean
}





/**
 * \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
 * actions
 * \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
 */
export interface setNavBarOptionsType {
  type: typeof SET_NAV_BAR_OPTIONS,
  payload: NavBarOptions
}

export interface setTabBarOptionsType {
  type: typeof SET_TAB_BAR_OPTIONS
  payload: TabBarOptions
}

export interface getTabBarOptionsType {
  type: typeof GET_TAB_BAR_OPTIONS
}

export interface setAuthModalOptionsType {
  type: typeof SET_AUTH_MODAL_OPTIONS
  payload: AuthModalOptions
}

export type actionTypes = setNavBarOptionsType | setTabBarOptionsType | setAuthModalOptionsType

export const setNavBarOptions = (payload: NavBarOptions): setNavBarOptionsType => {
  return {
    type: 'UI/SET_NAV_BAR_OPTIONS',
    payload
  }
}

export const setTabBarOptions = (payload: TabBarOptions): setTabBarOptionsType => {
  return {
    type: 'SET_TAB_BAR_OPTIONS',
    payload
  }
}

export const setAuthModalOptions = (payload: AuthModalOptions): setAuthModalOptionsType => {
  return {
    type: 'SET_AUTH_MODAL_OPTIONS',
    payload
  }
}
