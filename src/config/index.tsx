/**
 * tab页 索引
 * { Index = 0 } 直播
 * { Mine = 2 } 我的
 */
export enum TabPages {
  Index = 0,
  Mine = 2
}

/**
 * tab页 title
 * { Index } 直播
 * { Mine } 我的
 */
export enum TabPagesTitle {
  Index = "直播",
  Mine = "我的"
}

export enum LocalStorageName {
  token = 'token',
  wechatUserInfo = 'wechatUserInfo',
  userId = 'userId'
}

/**
 * 微信返回的用户信息字段与后台的用户信息字段
 */
export enum userInfoMap {
  /**
   * 昵称
   */
  nickname = 'nickName',
  /**
   * 性别
   * 0 未知
   * 1 男
   * 2 女
   */
  sex = 'gender',
  /**
   * 头像
   */
  avatar = 'avatarUrl'
}


// export const liveStatus = [
//   {value: 'INIT',name: '初始化'},
//   {value: 'CREATING',name: '创建中'},
//   {value: 'CANCEL',name: '已取消'},
//   {value: 'STOP',name: '课程结束'},
//   {value: 'BAOMING',name: '正在报名'},
//   {value: 'BAOMINGSTOP',name: '报名结束'},
//   {value: 'START',name: '开课中'},
//   {value: 'ANSWER',name: '答疑中'},
//   {value: 'ABORT',name: '课程已中止'}
// ]

export enum ELiveStatus {
  INIT = "INIT",
  CREATING = 'CREATING',
  CANCEL = 'CANCEL',
  STOP = 'STOP',
  BAOMING = 'BAOMING',
  BAOMINGSTOP = 'BAOMINGSTOP',
  START = 'START',
  ANSWER = 'ANSWER',
  ABORT = 'ABORT'
}
