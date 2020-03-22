import { httpClient } from '../http'
import { Request, Response } from '../types'

const SsoService = httpClient('https://xiaochengxuplatform.hbbclub.com/api')
const classService = httpClient('https://xiaochengxuplatform.hbbclub.com/api')
const testService = httpClient('http://hbbtest.utools.club/api')

export const doLogin = (params: Request.login) => SsoService.post<Request.login, Response.login>('/sso/user/wx/xcxlogin', params)
export const saveProfile = (params: Request.saveProfile, token: string) => SsoService.post<Request.saveProfile, Response.saveProfile>('/sso/user/wx/xcxprofile', params, { header: { token } })

export const liveKClist = (params: Request.classList, token: string) => SsoService.get('/xcxapi/live/kclist/' + params.dianPuId, {status: params.status, page: params.page, size: params.size},{ header: { token } })
export const liveKC = (params: Object, token: string) => SsoService.get('/xcxapi/live/kc/' + params.keChengId, null,{ header: { token } })
export const liveDP = (params: Object, token: string) => SsoService.get('/xcxapi/live/dp/' + params.dianPuId, null,{ header: { token } })
export const liveInto = (params: Request.intoClass, token: string) => SsoService.post<Request.intoClass, Response.intoClass>('/xcxapi/live/into', params,{ header: { token } })
export const learnRecord = (params: Object, token: string) => SsoService.get('/xcxapi/my/learn_record/' + params.dianPuId + "?page=" + params.page, null,{ header: { token } })
//第三方程序跳转
export const jumpAPPBind = (params: Object, token: string) => SsoService.post('/xcxapi/live/bind', params,{ header: { token } })

export const getClassInfo = (classID: string, token: string) => classService.get<any, Response.classInfo>(`/xcxapi/live/kc/${classID}`, {}, { header: { token } })
export const getStoreInfo = (storeId: string, token: string) => classService.get<any, Response.storeInfo>(`/xcxapi/live/dp/${storeId}`, {}, { header: { token: token } })
export const getLiveInfo = (dianPuId: string, keChengId: string, token: string) => classService.post<any, any>('/yyapi/zbj/zhibojian', { dianPuId, keChengId }, { header: { token: token } })
export const getClassDetail = (dianPuId: string, token: string) => classService.get<any, any>(`/xcxapi/live/detail/${dianPuId}`, {}, { header: { token: token } })
export const getLiveRoomUser = (groupId: string, token: string) => classService.get<any, any>(`/yyapi/zbj/users?rid=${groupId}`, {}, { header: { token } })
export const getLiveRoomHistoryMessage = (roomId: string, classID: string, token: string) => classService.get<any, any>(`/yyapi/zbj/kecheng/history/${classID}?roomid=${roomId}`, {}, { header: { token } })
// export const getLiveRoomHistoryMessage = (roomId: string, classID: string, token: string) => testService.get<any, any>(`/yyapi/parsedmsg/im/msgs?roomid=${roomId}`, {}, { header: { token } })

export const newImUser = (params: Request.newImUser, token: string) => classService.post<Request.newImUser, Response.newImUser>('/yyapi/tx/user', params, { header: { token, appId: 'txhbbyunying' } })
export const getImUserSign = (username: string, token: string) => classService.post<any, Response.getUserSign>('/yyapi/tx/sign', { userName: username }, { header: { token, appId: 'txhbbyunying' } })

export const getImMsg = (params: Object, token: string) => classService.get('/yyapi/parsedmsg/im/msgs', params, { header: { token } })
export const liveMsgRecord = (params: Object, token: string) => classService.post('/xcxapi/live/msg/record', params, { header: { token } })
