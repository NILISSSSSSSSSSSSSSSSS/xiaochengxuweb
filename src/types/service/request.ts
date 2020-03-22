/**
 * 小程序登录
 */
export interface login {
  code: string
  platform: 'XIAOCHENGXU'
}

/**
 * 保存小程序用户信息
 */
export interface saveProfile {
  /**
   * 微信昵称
   */
  nickname: string
  /**
   * 性别
   * 0 未知
   * 1 男
   * 2 女
   */
  sex: 0 | 1 | 2
  /**
   * 头像
   */
  avatar: string
  /**
   * 城市
   */
  city: string
  /**
   * 省
   */
  province: string
  /**
   * 国家
   */
  country: string
  [k: string]: any
}

export interface classInfo {

}

export interface intoClass {
  keChengId: string
  dianPuId: string
}

export interface newImUser {
  // appId: string, userName: string, nickName: string, faceUrl: string
  userName: string
  nickName: string
  faceUrl: string
}

export interface classList {
  dianPuId: string
  // status: 'BAOMING' | 'START' | 'ANSWER' | 'STOP' | 'ABORT' | 'HISTORY'
  status: string
  page?: string | number
  size?: string | number
}

export interface getHistoryMessage {
  roomId: string
}
