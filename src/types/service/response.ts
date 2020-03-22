/**
* 微信request接口包装的返回
*/
interface WechatResponse<T> {
  cookies: string[]
  data: T
  errMsg: string
  header: { [k: string]: any }
  statusCode: number
}

interface Response<T> {
  /**
   * 后台返回的code码
   * 200 有用户信息
   * 2000 无用户信息(用户第一次使用该小程序)
   */
  code: number
  data: T
  /**
   * 响应类型信息
   */
  msg: string
}
/**
* 微信小程序登录，通过code，从后台换取资料
*/
export type login = WechatResponse<Response<{
  token: string
  user: object
}>>

/**
 * 后台返回的token
 */
export type token = WechatResponse<Response<{
  /**
   * token
   */
  token: string
}>>

export type classInfo = WechatResponse<Response<{
  /**
   * 课程id
   */
  id: string
  /**
   * 课程名称
   */
  name: string
  /**
   * 课程图片
   */
  imgDesc: string
  /**
   * 课程文字描述
   */
  textDesc: string
  /**
   * 专家id
   */
  doctorId: string
  /**
   * 专家信息
   */
  doctor: {
    id: string
    userId: string
    phone: string
    name: string
    avatar: string
    company: string
    /**
     * 部门
     */
    department: string
    /**
     * 头衔
     */
    title: string
    /**
     * 额外信息
     */
    addInfo: string
    active: boolean
    useStatus: number
  }
  startTime: number
  endTime: number
  realStartTime: number
  realEndTime: number
  users: {
    userId: string
    name: string
    avatar: string
    role: string
  }
  status: string
}>>

export type storeInfo = WechatResponse<Response<{

  /**
   * 店铺id
   */
  id: string
  domain: string
  /**
   * 店名
   */
  name: string
  /**
   * 店主id
   */
  ownerId: string
  dianZhu: {
    id: string
    userId: string
    userName: string
    shopName: string
    phone: string
    /**
     * 微信昵称
     */
    wxNickname: string
    groupId: string
    /**
     * ？？什么字段
     */
    group: string
    /**
     * ?未知字段
     */
    address: string
    businessHours: string
    shopImages: string[]
    /**
     * 合作伙伴
     */
    heHuoRen: string
    active: string
    source: string
    logo: string
    /**
     * ?? 注册信息?
     */
    regInfo: string
    domain: string
    regStatus: number
    useStatus: number
  }
  address: string
  businessHours: string
  shopImages: string[]
  /**
   * EDIT 编辑中
   * ONLINE 已上线
   * OFFLINE 已下线
   * DELETED 已删除
   */
  status: string
}>>

export type saveProfile = WechatResponse<Response<{
  token: string
  user: {
    avatar: string
    ban: boolean
    banReason: string
    banT: number
    history: string[]
    id: string
    idPasswd: null
    ip: string
    loginType: string
    name: string
    phoneAuth: null
    platform: string
    referId: string
    weChatAuth: {
      avatar: string
      city: string
      country: string
      id: string
      nickname: string
      openId: string
      platform: string
      province: string
      sex: number
      unionId: string
      userId: string
    }
  }
}>>

export type newImUser = WechatResponse<Response<{
  userName: string
  nickName: string
  faceUrl: string
  role: null
}>>

export type getUserSign = WechatResponse<Response<{
  expire: number
  genSign: string
}>>
