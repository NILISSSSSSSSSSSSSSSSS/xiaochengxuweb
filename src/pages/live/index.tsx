import Taro, { FC, useState, useEffect, useRouter, useCallback, useShareAppMessage } from '@tarojs/taro'
import { View, Image, Input, ScrollView, Video, Swiper, SwiperItem } from '@tarojs/components'
import cs from 'classnames'
import WithAuth from '../../components/layout/withAuth'
import { BubbleType, BubbleInfoType } from './bubble'
import {
  getClassInfo,
  getStoreInfo,
  liveInto,
  getLiveInfo,
  getClassDetail,
  getImUserSign,
  newImUser,
  getImMsg,
  liveMsgRecord,
  getLiveRoomHistoryMessage,
  getLiveRoomUser
} from '../../service/home'
import { Response, Request } from '../../types'
import { LocalStorageName, ELiveStatus } from '../../config'
import './index.scss'
import Tim from '../../static/tim-wx'

const enum TabItems {
  'live',
  'classInfo',
  'user',
  'storeInfo'
}

type Message = {
  // im 生成的 消息唯一id
  ID: string
  msgType: ImCustomMessage['msgItem']['type']
  /**
   * 用户id，和注册及生产userSign的id是同一个
   */
  sender: {
    senderId: string
    senderAvatar: string
    senderNickname: string
  }

  /**
   * 兼容老结构
   */
  senderId?: string
  senderAvatar?: string
  senderNickname?: string

  content: string
  voiceLength?: number
  isQuestion: boolean
}

type ImCustomMessage = {
  // kecheng: {
  //   /**
  //    * 课程id
  //    */
  //   id: string
  //   name: string
  //   imgDesc: string
  //   textDesc: string
  // }
  // dianPu: {
  //   /**
  //    * 店铺id
  //    */
  //   id: string
  //   name: string
  // }
  /**
   * 用户id，和注册及生产userSign的id是同一个
   */
  sender: {
    senderId: string
    senderAvatar: string
    senderNickname: string
    weChatAuth?: {}
  }
  msgItem: {
    type: 'TEXT' | 'IMAGE' | 'VOICE' | 'VIDEO' | 'URL' | 'SYSTEM'
    content: string
    voiceLength?: number
    /**
     * 图片、音频可能有标题
     */
    tittle?: string
    isAt: boolean
    atObj?: {
      userId: string
      nickname: string
      avatar: string
    }
  }
  source: 'CLIENT' | 'SERVER',
  msgType: "QUESTION" | 'ANSWER' | 'KEJIAN' | 'NORMAL'
  /**
   * 回答消息的话，这里是原问题消息id
   */
  orgId?: string
}
var groupId = '';
let messageId = 0;
let msgId = '';
let tempMsgList = [];

const Live: FC = () => {
  // const getAudioUrl = useSelector(getAudioUrlSelector)
  // const dispatch = useDispatch()
  // const dispatchCurrentAudioUrl = useCallback(
  //   (audioUrl: string) => {
  //     dispatch<SetCurrentAudioUrl>({ type: 'AUDIO/SET_CURRENT_AUDIO_URL', payload: { url: audioUrl }})
  //   },
  //   [dispatch]
  // )
  const navItemList = [
    {
      name: '直播'
    },
    {
      name: '详情'
    },
    {
      name: '用户'
    },
    {
      name: '门店'
    }
  ]

  const [systemInfo, setSystemInfo] = useState()

  const [tim, createTimInstance] = useState()

  // roomId就是groupId
  const [groupId, setGroupId] = useState('')
  const [imUserSign, setImUserSign] = useState('')

  // tab
  const [currentNavItem, setCurrentNavItem] = useState<number>(0)

  // withauth 弹窗
  const [authModalVisible, setAuthModalVisible] = useState(false)

  // token
  const [token, setToken] = useState<string>('')
  const [userId, setUserId] = useState('')

  // userinfo
  const [userInfo, setUserInfo] = useState<Request.saveProfile>()
  // storeinfo
  const [storeInfo, setStoreInfo] = useState<Response.storeInfo['data']['data']>()
  // classinfo
  const [classInfo, setClassInfo] = useState<Response.classInfo['data']['data']>()
  const [liveRoomUsers, setLiveRoomUsers] = useState<any[]>([])

  const [videoContext, setVideoContext] = useState<Taro.VideoContext>()

  /**
   * video
   */
  const [currentVideoUrl, setCurrentVideoUrl] = useState('')
  const [isVideoPause, setIsVideoPause] = useState(true)

  const [isBindEvent, setIsBindEvent] = useState(false)

  // audio
  const [currentAudioUrl, setCurrentAudioUrl] = useState('')
  // const [prevAudioUrl, setPrevAudioUrl] = useState('')
  const [innerAudioContext, setInnerAudioContext] = useState<Taro.InnerAudioContext>()
  const [canPlay, setCanPlay] = useState(false)
  // 音频自然播放结束
  const [audioOnEnd, setAudioOnEnd] = useState(false)
  // 正在播放的状态
  const [audioPlayStatus, setAudioPlayStatus] = useState(false)

  const [currentMsgId, setCurrentMsgId] = useState('') //Id
  const [value, setValue] = useState('')

  const [liveStatus, setLiveStatus] = useState('')
  const [messageList, setMessageList] = useState<Message[]>([])
  const [loadMsgListEnd, setLoadMsgListEnd] = useState(false)
  const [isQuestionChecked, setIsQuestionChecked] = useState(false)
  // const [messageId, setMessageId] = useState(0)

  // 问号提示tips
  const [isShowInputTip, setIsShowInputTip] = useState(false)
  const [isShowedInputTip, setIsShowedInputTip] = useState(false)

  /**
   * 下拉刷新，获取历史消息记录有关
   */
  // 滚动是否到顶
  const [isUpper, setIsUpper] = useState(true)
  const [scrollTop, setScrollTop] = useState(0) // 用于 onScroll 事件 记录scrollTop值 iphone
  const [touchMoveDistance, setTouchMoveDistance] = useState(-80) // 用于 touchxx 事件， 手指滑动的距离
  const [touchStartY, setTouchStartY] = useState(0)
  const [isTouchEnd, setIsTouchEnd] = useState(true)
  const [hideAreaText, setHideAreaText] = useState('下拉加载历史消息')
  // 是否正在获取历史消息
  const [isLoadingHistoryMessage, setIsLoadingHisotryMessage] = useState(false)
  // 历史消息是否已经获取完毕
  const [isloadedHistoryMessage, setIsloadedHistoryMessage] = useState(false)
  const [conversationId, setConversationId] = useState('')
  const [nextReqMessageID, setNextReqMessageID] = useState('')


  const router = useRouter()

  const closeAuthModalCallback = (type: 'cancel' | 'confirm') => {
    setAuthModalVisible(false)
    if (type === 'confirm') {
      const t = Taro.getStorageSync(LocalStorageName.token)
      const u = Taro.getStorageSync(LocalStorageName.wechatUserInfo)
      const id = Taro.getStorageSync(LocalStorageName.userId)
      if (!t || !u || !id) {
        setAuthModalVisible(true)
        return
      }
      setToken(t)
      setUserInfo(u)
      setUserId(id)
    } else {
      console.log('跳转到前一页或者首页')
      Taro.navigateBack({
        delta: 1
      })
        .then(() => {})
        .catch(err => {
          console.log(err)
          Taro.reLaunch({
            url: `/pages/index/index?${router.params.dianPuId}`
          })
        })
    }
  }

  const onBubbleClick = (bubble: Message) => {
    if (bubble.msgType === 'VOICE') {
      setCanPlay(false)
      playAudio(bubble.content, bubble)
    }
    if (bubble.msgType === 'IMAGE') {
      msgId = ''
      setCurrentAudioUrl('')
      Taro.previewImage({ current: bubble.content, urls: [ bubble.content ] })
    }
  }

  const playAudio = (url: string, bubble: Message) => {
    // 点击了两次或者多次同一个音频气泡
    if (innerAudioContext) {
      // currentAudioUrl === url
      if (bubble.msgId === msgId) {
        if (audioPlayStatus) {
          innerAudioContext.stop()
          msgId = ''
        } else {
          innerAudioContext.play()
        }
      } else {
        if (audioPlayStatus) {
          innerAudioContext.stop()
          var t = setTimeout(()=>{
            innerAudioContext.src = url
            setCurrentAudioUrl(url)
            clearTimeout(t)
          }, 300)
        }else {
          innerAudioContext.src = url
          setCurrentAudioUrl(url)
        }
        msgId = bubble.msgId

        if(bubble.isRead == false){
          liveMsgRecord({sendMsgId: bubble.msgId, roomId: groupId}, token)
          .subscribe(val => {
            if (val.data.code === 200) {
              setMessageList(tempMsgList.map((item, index)=>{
                if (item.msgType === "VOICE" && item.msgId === bubble.msgId){
                  item.isRead = true; return item;
                }else{
                  return item;
                }
              }))
            }
          })
        }
      }
    }
  }

  const sendMessage = () => {
    if (value) {
      let valueTemp = value
      setValue('')
      if (tim) {
        const customMessage: ImCustomMessage = {
          sender: {
            senderId: Taro.getStorageSync(LocalStorageName.userId),
            senderNickname: userInfo!.nickname,
            senderAvatar: userInfo!.avatar
          },
          msgType: isQuestionChecked ? 'QUESTION' : 'NORMAL',
          msgItem: {
            type: 'TEXT',
            content: valueTemp,
            isAt: false
          },
          source: 'CLIENT'
        }
        let message = tim.createCustomMessage({
          to: groupId,
          conversationType: Tim.TYPES.CONV_GROUP,
          // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考：https://cloud.tencent.com/document/product/269/3663#.E6.B6.88.E6.81.AF.E4.BC.98.E5.85.88.E7.BA.A7.E4.B8.8E.E9.A2.91.E7.8E.87.E6.8E.A7.E5.88.B6)
          // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
          // priority: TIM.TYPES.MSG_PRIORITY_HIGH,
          payload: {
            data: JSON.stringify(customMessage), // 用于标识该消息是骰子类型消息
            // description: String(random(1,6)), // 获取骰子点数
            extension: 'txhbbyunying'
          }
        })
        let promise = tim.sendMessage(message)
        promise.then(res => {
            if (res.code === 0) {
              let imMsg = res.data.message
              let payloadMessage: ImCustomMessage = JSON.parse(imMsg.payload.data)
              let msgId = ''
              if (imMsg.ID) {
                msgId = imMsg.ID
              } else {
                messageId++
                msgId = messageId.toString()
              }
              let msgTemp: Message = {
                ID: msgId,
                msgType: payloadMessage.msgItem.type,
                sender: {
                  senderId: payloadMessage.sender.senderId,
                  senderAvatar: payloadMessage.sender.senderAvatar,
                  senderNickname: payloadMessage.sender.senderNickname
                },
                content: payloadMessage.msgItem.content,
                voiceLength: payloadMessage.msgItem.voiceLength,
                isQuestion: payloadMessage.msgType === 'QUESTION'
              }
              setMessageList(messageList.slice().concat(msgTemp))

              setTimeout(() => {
                // 如果没在播放音频，则滚动到最底部
                if (!audioPlayStatus) {
                  setCurrentMsgId(msgTemp.ID)
                }
              })

              setIsQuestionChecked(false)
            } else {
              Taro.showToast({
                title: '发送失败',
                icon: 'none',
                duration: 1000
              })
            }
          })
          .catch(error => {
            console.log(error)
          })
      }

    } else {
      Taro.showToast({
        title: '请输入内容',
        icon: 'none',
        duration: 1000
      })
    }
  }

  const calcVoiceSquareLength = (vs: number) => {
    // console.log(voiceSeconds)
    let voiceSeconds = vs / 1000
    if (voiceSeconds > 0 && voiceSeconds < 60) {
      let length = (voiceSeconds / 60) * 450
      // console.log(length)
      if (length < 40) {
        return 40
      } else {
        return length
      }
    } else {
      return 450
    }
  }
  const PreviewAlbum = (index) => {
    Taro.previewImage({ current: storeInfo.shopImages[index], urls: storeInfo.shopImages})
  }
  const getHistoryMessage = () => {
    if (classInfo && groupId != "") {
      if (isLoadingHistoryMessage) {
        return
      }
      setIsLoadingHisotryMessage(true)
      // setHideAreaText('加载中...')
      msgId = ''
      Taro.showLoading({ title: '加载历史消息' })
      getLiveRoomHistoryMessage(groupId, classInfo.id, token)
      .subscribe(val => {
        if (val.data.code === 200) {
          const historyMessageList = val.data.data || []// 消息列表。
          const historyMessageListTemp = historyMessageList.map(message => {
            try {
              let msg: ImCustomMessage = message
              messageId++

              let msgTemp: Message = {
                ID: messageId.toString(),
                msgType: msg.msgItem.type,
                msgId: msg.id,
                isRead: msg.isRead,
                sender: {
                  senderId: msg.sender.senderId,
                  senderAvatar: msg.sender.senderAvatar,
                  senderNickname: msg.sender.senderNickname
                },
                content: msg.msgItem.content,
                voiceLength: msg.msgItem.voiceLength,
                isQuestion: msg.msgType === 'QUESTION'
              }
              return msgTemp
            } catch (error) {
              let msgTemp: Message = {
                ID: 'error',
                msgType: 'TEXT',
                senderId: 'json-error',
                senderAvatar: '',
                senderNickname: '消息',
                sender: {
                  senderId: '-1',
                  senderAvatar: '',
                  senderNickname: '消息格式错误',
                },
                content: '消息格式错误',
                voiceLength: 0,
                isQuestion: false
              }
              return msgTemp
            }
          })
          const filterReceiveListTemp = historyMessageListTemp.filter((message) => {
            if (message.msgType !== 'SYSTEM') {
              return true
            }
            // setLiveStatus(message.content)
            return false
          })
          setMessageList(messageList.slice().concat(filterReceiveListTemp))

          if (/iPhone/.test(systemInfo.model)) {
            setScrollTop(0)
          }
          setIsLoadingHisotryMessage(false)
          Taro.hideLoading()
          setLoadMsgListEnd(true)
        }
      })
    }
    // im相关
    // if (!conversationId) {
    //   tim.getConversationList()
    //   .then(res => {
    //     for (let i = 0; i < res.data.conversationList.length; i++) {
    //       let conversation = res.data.conversationList[i]
    //       res.data.conversationList.length
    //       if (conversation.groupProfile && conversation.groupProfile.groupID === groupId) {
    //         setConversationId(conversation.conversationID)
    //         tim.getMessageList({conversationID: conversation.conversationID, nextReqMessageID: nextReqMessageID, count: 15})
    //         .then(imResponse => {
    //           const historyMessageList = imResponse.data.messageList // 消息列表。
    //           const historyMessageListTemp = historyMessageList.map(message => {
    //             try {
    //               const payloadMessage = JSON.parse(message.payload.data)
    //               let msgTemp: Message = {
    //                 ID: message.ID,
    //                 msgType: payloadMessage.msgType,
    //                 sender: {
    //                   senderId: payloadMessage.sender.senderId || payloadMessage.senderId,
    //                   senderAvatar: payloadMessage.sender.senderAvatar || payloadMessage.senderAvatar,
    //                   senderNickname: payloadMessage.sender.senderNickname || payloadMessage.senderNickname,
    //                 },
    //                 content: payloadMessage.content,
    //                 voiceLength: payloadMessage.voiceLength | 0,
    //                 isQuestion: payloadMessage.isQuestion
    //               }
    //               return msgTemp
    //             } catch (error) {
    //               let msgTemp: Message = {
    //                 ID: 'error',
    //                 msgType: 'text',
    //                 senderId: 'json-error',
    //                 senderAvatar: '',
    //                 senderNickname: '消息',
    //                 sender: {
    //                   senderId: '-1',
    //                   senderAvatar: '',
    //                   senderNickname: '消息格式错误',
    //                 },
    //                 content: '消息格式错误',
    //                 voiceLength: 0,
    //                 isQuestion: false
    //               }
    //               return msgTemp
    //             }
    //           })
    //           const nextReqMsgID = imResponse.data.nextReqMessageID // 用于续拉，分页续拉时需传入该字段。
    //           const isCompleted = imResponse.data.isCompleted // 表示是否已经拉完所有消息。
    //           setIsloadedHistoryMessage(isCompleted)
    //           console.log(messageList)
    //           setMessageList(historyMessageListTemp.concat(messageList))
    //           setNextReqMessageID(nextReqMsgID)
    //           if (/iPhone/.test(systemInfo.model)) {
    //             setScrollTop(0)
    //           }
    //           setIsLoadingHisotryMessage(false)
    //           if (isCompleted) {
    //             setHideAreaText('无历史消息')
    //           } else {
    //             setHideAreaText('下拉加载历史消息')
    //           }
    //         })
    //       }
    //     }
    //   })
    // } else {
    //   tim.getMessageList({conversationID: conversationId, nextReqMessageID: nextReqMessageID, count: 15})
    //   .then(imResponse => {
    //     const historyMessageList = imResponse.data.messageList // 消息列表。
    //     const historyMessageListTemp = historyMessageList.map(message => {
    //       try {
    //         const payloadMessage = JSON.parse(message.payload.data)
    //         let msgTemp: Message = {
    //           ID: message.ID,
    //           msgType: payloadMessage.msgType,
    //           sender: {
    //             senderId: payloadMessage.sender.senderId || payloadMessage.senderId,
    //             senderAvatar: payloadMessage.sender.senderAvatar || payloadMessage.senderAvatar,
    //             senderNickname: payloadMessage.sender.senderNickname || payloadMessage.senderNickname,
    //           },
    //           content: payloadMessage.content,
    //           voiceLength: payloadMessage.voiceLength | 0,
    //           isQuestion: payloadMessage.isQuestion
    //         }
    //         return msgTemp
    //       } catch (error) {
    //         let msgTemp: Message = {
    //           ID: 'error',
    //           msgType: 'text',
    //           senderId: 'json-error',
    //           senderAvatar: '',
    //           senderNickname: '消息',
    //           sender: {
    //             senderId: '-1',
    //             senderAvatar: '',
    //             senderNickname: '消息格式错误',
    //           },
    //           content: '消息格式错误',
    //           voiceLength: 0,
    //           isQuestion: false
    //         }
    //         return msgTemp
    //       }
    //     })
    //     const nextReqMsgID = imResponse.data.nextReqMessageID // 用于续拉，分页续拉时需传入该字段。
    //     const isCompleted = imResponse.data.isCompleted // 表示是否已经拉完所有消息。
    //     setIsloadedHistoryMessage(isCompleted)
    //     console.log(messageList)
    //     setMessageList(historyMessageListTemp.concat(messageList))
    //     setNextReqMessageID(nextReqMsgID)
    //     if (/iPhone/.test(systemInfo.model)) {
    //       setScrollTop(0)
    //     }
    //     setIsLoadingHisotryMessage(false)
    //     if (isCompleted) {
    //       setHideAreaText('无历史消息')
    //     } else {
    //       setHideAreaText('下拉加载历史消息')
    //     }
    //   })
    // }
  }
  const onVideoPlay = () => {
    // if (innerAudioContext) {
    //   innerAudioContext.stop()
    // }
    // if (videoContext) {
    //   if (!videoContext.pause) {
    //     videoContext.stop()
    //   }
    // }
    setIsVideoPause(false)
  }

  const onVideoPause = () => {
    setIsVideoPause(true)
  }

  const onInputFocus = (e) => {
    if (!isShowInputTip && !isShowedInputTip) {
      setIsShowInputTip(true)
      setIsShowedInputTip(true)
      setTimeout(() => {
        setIsShowInputTip(false)
      }, 3000)
    }
  }

  const onTouchStart = (event: any) => {
    // 苹果设备
    if (/iPhone/.test(systemInfo.model)) {
      if (!messageList.length) {
        setTouchStartY(event.changedTouches[0].clientY)
      }
    } else {
      setTouchStartY(event.changedTouches[0].clientY)
    }
    setIsTouchEnd(false)
  }

  const onTouchMove = (event: any) => {
    // 苹果设备
    if (/iPhone/.test(systemInfo.model)) {
      if (!messageList.length) {
        let move = -80 + (event.changedTouches[0].clientY - touchStartY)
        if (move >= 0) {
          move = 0
        } else if (move <= -80) {
          move = -80
        }

        if (move >= -60) {
          // if (!isLoadingHistoryMessage) {
          //   if (hideAreaText !== '放开加载历史消息') {
          //     setHideAreaText('放开加载历史消息')
          //   }
          // }
        }
        setTouchMoveDistance(move)
      }
    } else {
      let move = -80 + (event.changedTouches[0].clientY - touchStartY)
      if (move >= 0) {
        move = 0
      } else if (move <= -80) {
        move = -80
      }

      if (move >= -60) {
        // if (!isLoadingHistoryMessage) {
        //   if (hideAreaText !== '放开加载历史消息') {
        //     setHideAreaText('放开加载历史消息')
        //   }
        // }
      }
      setTouchMoveDistance(move)
    }
    setIsTouchEnd(false)
  }

  const onTouchEnd = () => {
    if (/iPhone/.test(systemInfo.model) && messageList.length) {
      setIsTouchEnd(true)
      // console.log(scrollTop)
      // if (scrollTop <= -30) {
      //   console.log('获取历史消息 iphone')
      //   getHistoryMessage()
      // }
    } else {
      if (touchMoveDistance >= -60) {
        getHistoryMessage()
      }
      setTouchMoveDistance(-80)
    }

    // if (!/iPhone/.test(systemInfo.model)) {
    //   if (touchMoveDistance >= -60) {
    //     console.log('获取历史消息')
    //     getHistoryMessage()
    //   }
    //   setTouchMoveDistance(-80)
    //   setHideAreaText('下拉加载历史消息')
    // }
  }

  const onScroll = (event: any) => {
    if (/iPhone/.test(systemInfo.model) && messageList.length) {
      const s = event.detail.scrollTop
      console.log(s)
      if (s >= -40 && s < 0) {
        if (s <= -30) {
          // if (!isLoadingHistoryMessage) {
          //   if (hideAreaText !== '放开加载历史消息') {
          //     setHideAreaText('放开加载历史消息')
          //   }
          // }
        }
        if (s < scrollTop) {
          setScrollTop(s)
        }
      }
    }
    // setScrollTop(event.detail.scrollTop)
    // setScrollTop
    // if (isUpper) {
    //   setScrollTop(event.detail.scrollTop)
    // }
  }

  const onScrollToUpper = (event) => {
    // console.log('到顶了')
    // console.log(event)
    // console.log('到顶了')
    // setIsUpper(true)
  }

  const InputOnClick = () => {
    console.log(liveStatus)
    if (liveStatus !== ELiveStatus.ANSWER) {
      Taro.showToast({
        title: '答疑阶段才能发言',
        icon: 'none'
      })
    }
  }

  useEffect(() => {
    Taro.getSystemInfo()
      .then(res => {
        setSystemInfo(res)
      })
    setInnerAudioContext(Taro.createInnerAudioContext())
    setVideoContext(Taro.createVideoContext('hbb-video'))
    createTimInstance(Tim.create({SDKAppID: 1400304449}))
  }, [])

  useEffect(() => {
    const t = Taro.getStorageSync(LocalStorageName.token)
    const u = Taro.getStorageSync(LocalStorageName.wechatUserInfo)
    const id = Taro.getStorageSync(LocalStorageName.userId)
    if (!t || !u || !id) {
      setAuthModalVisible(true)
      return
    }
    setToken(t)
    setUserInfo(u)
    setUserId(id)
  }, [])

  useEffect(() => {
    if (isTouchEnd) {
      if (scrollTop <= -30) {
        getHistoryMessage()
      }
    }

  }, [isTouchEnd, scrollTop])

  useEffect(() => {
    console.log(currentMsgId)
  }, [currentMsgId])

  useEffect(() => {
    /**
     * CANCEL
     * START
     * ANSWER
     * STOP
     * ABORT
     */
    console.log(liveStatus)
    if (liveStatus === 'ANSWER') {
      Taro.showToast({
        title: '现在可以提问'
      })
    }
  }, [liveStatus])

  // 设置tim监听事件
  useEffect(() => {
    const ready = (event) => {
      Taro.hideLoading()
      console.log(event)
      tim.joinGroup({ groupID: groupId, type: Tim.TYPES.GRP_PUBLIC })
        .then(function(imResponse) {
          console.log(imResponse)
          switch (imResponse.data.status) {
            case tim.TYPES.JOIN_STATUS_WAIT_APPROVAL: // 等待管理员同意
              break;
            case tim.TYPES.JOIN_STATUS_SUCCESS: // 加群成功
              console.log(imResponse.data.group); // 加入的群组资料
              break;
            case tim.TYPES.JOIN_STATUS_ALREADY_IN_GROUP: // 已经在群中
              break;
            default:
              break;
          }
        }).catch(function(imError){
          console.warn('joinGroup error:', imError); // 申请加群失败的相关信息
        })
    }
    const receive = (e) => {
      console.log('Tim.EVENT.MESSAGE_RECEIVED')
      let receiveList: any[] = []
      if (Array.isArray(e)) {
        receiveList = e
      } else if (Array.isArray(e.data)) {
        receiveList = e.data
      }
      // const receiveList = e // 消息列表。
      const receiveListTemp = receiveList.map(message => {
        try {
          let payloadMessage: ImCustomMessage = JSON.parse(message.payload.data)
          let msgId = ''
          if (message.ID) {
            msgId = message.ID
          } else {
            messageId++
            msgId = messageId.toString()
          }
          let msgTemp: Message = {
            ID: msgId,
            msgType: payloadMessage.msgItem.type,
            sender: {
              senderId: payloadMessage.sender.senderId,
              senderAvatar: payloadMessage.sender.senderAvatar,
              senderNickname: payloadMessage.sender.senderNickname
            },
            content: ((payloadMessage.msgItem.atObj === undefined || payloadMessage.msgItem.atObj === null)?payloadMessage.msgItem.content:"@" + payloadMessage.msgItem.atObj.nickname + " " + payloadMessage.msgItem.content),
            voiceLength: (payloadMessage.msgItem.voiceLength === undefined)?0:payloadMessage.msgItem.voiceLength,
            isQuestion: payloadMessage.msgType === 'QUESTION'
          }
          if(payloadMessage.id === undefined){
            msgTemp.msgId = payloadMessage.id
          }
          if(payloadMessage.msgItem.type === "VOICE"){
            msgTemp.isRead = false
          }
          return msgTemp
        } catch (error) {
          // @TIM#SYSTEM
          // 过滤tim发的系统消息
          let content = '消息格式错误'
          if (message.conversationType === '@TIM#SYSTEM') {
            content = message.conversationType
          }
          let msgTemp: Message = {
            ID: 'error',
            msgType: 'TEXT',
            senderId: 'json-error',
            senderAvatar: '',
            senderNickname: '消息',
            sender: {
              senderId: '-1',
              senderAvatar: '',
              senderNickname: '消息格式错误',
            },
            content: content,
            voiceLength: 0,
            isQuestion: false
          }
          return msgTemp
        }
      })
      const filterReceiveListTemp = receiveListTemp.filter((message) => {
        if (message.content === '@TIM#SYSTEM') {
          // 过滤tim系统消息
          return false
        } else if (message.msgType !== 'SYSTEM') {
          // 正常消息
          return true
        }
        // 正常消息
        // setLiveStatus('')
        console.log(message.content)
        setLiveStatus(message.content)
        return false
      })

      if (filterReceiveListTemp[0]) {
        let recMsg = filterReceiveListTemp[0]
        // 接受到消息，是音频。 直播间没在播放音频
        if (recMsg.msgType === 'VOICE' && !audioPlayStatus) {

          if (innerAudioContext) {
            if (videoContext && isVideoPause) {
              if (isVideoPause) {
                setTimeout(() => {
                  innerAudioContext.src = recMsg.content
                }, 0)
              }
            } else {
              setTimeout(() => {
                innerAudioContext.src = recMsg.content
              }, 0)
            }
          }
        }
      }
      const msgListTemp = messageList.slice()
      const msgListTemp2 = msgListTemp.concat(filterReceiveListTemp)

      setMessageList(messageList.slice().concat(filterReceiveListTemp))
    }
    if (tim && groupId) {
      tim.on(Tim.EVENT.SDK_READY, ready)
      tim.on(Tim.EVENT.MESSAGE_RECEIVED, receive)
    }
    return () => {
      if (tim) {
        tim.off(Tim.EVENT.SDK_READY, ready)
        tim.off(Tim.EVENT.MESSAGE_RECEIVED, receive)
      }
    }
  }, [tim, groupId, messageList, audioPlayStatus, innerAudioContext, videoContext, isVideoPause])

  useEffect(() => {
    if(messageList.length > 3){
      // 如果没在播放音频，则滚动到最底部
      var t = setTimeout(() => {
        if (!audioPlayStatus) {
          setCurrentMsgId(messageList[messageList.length - 1].ID)
        }
        clearTimeout(t)
      }, 100)
    }
  }, [messageList])

  useEffect(() => {
    // 页面摧毁，退出tim
    return () => {
      if (tim) {
        tim.logout()
      }
    }
  }, [tim])

  useEffect(() => {
    if(groupId != ""){
      if(loadMsgListEnd == true){
        // var uId = Taro.getStorageSync('userId');
        // userid: uId,
        getImMsg({roomid: groupId}, Taro.getStorageSync('token'))
        .subscribe(val => {
          if (val.data.code === 200) {
            if(val.data.data != null){
              var msgArray = [];
              for(var i = 0; i < val.data.data.length; i++){
                var obj = val.data.data[i];
                if(obj.txImMsg.msgItem.type === "SYSTEM" || obj.txImMsg.msgItem.type === "GROUP"){ continue; }
                let msgTemp: Message = {
                  ID: "GROUP" + obj.roomId + "-" + obj.msgSeq + "-" + Math.round(Math.random() * 1000),
                  msgType: obj.txImMsg.msgItem.type,
                  sender: {
                    senderId: obj.txImMsg.sender.senderId,
                    senderAvatar: obj.txImMsg.sender.senderAvatar,
                    senderNickname: obj.txImMsg.sender.senderNickname
                  },
                  content: ((obj.txImMsg.msgItem.atObj === undefined || obj.txImMsg.msgItem.atObj === null)?obj.txImMsg.msgItem.content:"@" + obj.txImMsg.msgItem.atObj.nickname + " " + obj.txImMsg.msgItem.content),
                  voiceLength: (obj.txImMsg.msgItem.voiceLength === undefined)?0:obj.txImMsg.msgItem.voiceLength,
                  isQuestion: obj.txImMsg.msgType === 'QUESTION'
                }
                if(obj.txImMsg.msgItem.type === "VOICE"){
                  // debugger
                  msgTemp.isRead = true;
                }
                msgArray.push(msgTemp);
              }
              setMessageList(messageList.slice().concat(msgArray));
            }
          }
        })
      }
    }
  }, [groupId, loadMsgListEnd]);

  useEffect(() => {
    if (tim && groupId) {
      Taro.showLoading({
        title: '正在登录',
        mask: true
      })
      const t = Taro.getStorageSync(LocalStorageName.token)
      const u = Taro.getStorageSync(LocalStorageName.wechatUserInfo)
      const id = Taro.getStorageSync(LocalStorageName.userId)
      if (!t || !u || !id) {
        setAuthModalVisible(true)
        return
      }
      newImUser({ userName: id, nickName: u.nickName, faceUrl: u.avatar }, t)
        .subscribe(v => {
          if (v.data.code === 200 || v.data.code === 401) {
            getImUserSign(id, t)
              .subscribe(val => {
                if (val.data.code === 200) {
                  setImUserSign(val.data.data.genSign)
                  tim.login({
                    userID: id,
                    userSig: val.data.data.genSign
                  })
                  .then(res => {
                    Taro.hideLoading()
                  })
                  .catch(error => {
                    console.error(error)
                    Taro.hideLoading()
                  })
                }
              })
          }
        })
    }
  }, [tim, groupId])

  useEffect(() => {
    if (canPlay && innerAudioContext) {
      if (currentAudioUrl) {
        innerAudioContext.play()
      } else {
        innerAudioContext.stop()
      }
    }
  }, [canPlay, currentAudioUrl, innerAudioContext])


  // 设置video监听事件
  useEffect(() => {
    if (videoContext) {
    }
    return () => {
      if (videoContext) {
        videoContext.stop()
      }
    }
  }, [videoContext])

  // 设置audio监听事件
  useEffect(() => {
    if (innerAudioContext) {
      innerAudioContext.onCanplay(() => {
        // innerAudioContext.play()
        setCanPlay(true)
      })

      innerAudioContext.onPlay(() => {
        setAudioPlayStatus(true)
        setAudioOnEnd(false)
        setCanPlay(false)
        setCurrentAudioUrl(innerAudioContext.src)
        if (videoContext) {
          videoContext.stop()
        }
      })

      // innerAudioContext.onPause(() => {
      //   console.log('暂停播放音频')
      //   setAudioPlayStatus(false)
      // })

      innerAudioContext.onStop(() => {
        setAudioPlayStatus(false)
        setCurrentAudioUrl('')
      })
      // innerAudioContext.onEnded(() => {
      //   setAudioOnEnd(true)
      //   setAudioPlayStatus(false)
      // })
      innerAudioContext.onError(() => {
        Taro.showToast({
          title: '播放错误',
          icon: 'none',
          duration: 2000
        })
      })
    }
    return () => {
      if (innerAudioContext) {
        innerAudioContext.stop()
        innerAudioContext.destroy();
      }
    }
  }, [innerAudioContext, videoContext])

  useEffect(() => {
    tempMsgList = messageList
    if(messageList.length > 0 && isBindEvent === false){
      setIsBindEvent(true)
      innerAudioContext.onEnded(() => {
        innerAudioContext.seek(0);
        var indexPlay = 0;
        for(let i = 0; i< tempMsgList.length; i++){
          if(tempMsgList[i].msgType === "VOICE" && tempMsgList[i].msgId === msgId){
            indexPlay = i; break;
          }
        }

        for(let i = indexPlay; i< tempMsgList.length; i++){
          if(tempMsgList[i].msgType === "VOICE" && tempMsgList[i].isRead === false){
            console.log("播放索引：" + i);
            onBubbleClick(tempMsgList[i]); return;
          }
        }
        msgId = ''
        setCurrentAudioUrl('')
        setAudioOnEnd(true)
        setAudioPlayStatus(false)
      })
    }
    return ()=>{tempMsgList = []}
  },[messageList, isBindEvent])

  // useEffect(() => {
  //   if (audioOnEnd && innerAudioContext) {
  //     let currentAudioIndex = 0
  //     for (let i = 0; i < messageList.length; i++) {
  //       let msg = messageList[i]
  //       if (msg.msgType === 'VOICE') {
  //         if (msg.content === currentAudioUrl) {
  //           currentAudioIndex = i
  //         }
  //         if (currentAudioIndex < i) {
  //           debugger
  //           innerAudioContext.src = msg.content
  //         }
  //       }
  //     }
  //   }
  // }, [audioOnEnd, currentAudioUrl, messageList, innerAudioContext])

  useEffect(() => {
    // if (router.params)
    const params = router.params
    if (params.dianPuId && params.keChengId && token) {
      liveInto({ keChengId: params.keChengId, dianPuId: params.dianPuId }, token)
        .subscribe(v => {})

      const sub1 = getClassInfo(params.keChengId, token).subscribe(res => {
        Taro.setNavigationBarTitle({ title: res.data.data.name })
        if (res.data.code === 200) {
          setClassInfo(res.data.data)
        } else if (res.data.code === 401) {
          setAuthModalVisible(true)
        }
        sub1.unsubscribe()
        })

      const sub2 = getStoreInfo(params.dianPuId, token).subscribe(res => {
        if (res.data.code === 200) {
          setStoreInfo(res.data.data)
        } else if (res.data.code === 401) {
          setAuthModalVisible(true)
        }
        sub2.unsubscribe()
      })

      const sub3 = getLiveInfo(params.dianPuId, params.keChengId, token).subscribe(res => {
        // console.log(res.data.data)
        if (res.data.code === 200) {
          setGroupId(res.data.data.roomId);
          setLiveStatus(res.data.data.status)
        } else if (res.data.code === 401) {
          setAuthModalVisible(true)
        }
        sub3.unsubscribe()
      })

      const sub4 = getClassDetail(params.dianPuId, token).subscribe(res => {
        // console.log(res)
        sub4.unsubscribe()
      })
    } else {
      // alert('课程不存在')
    }
    //
  }, [router, token])

  useEffect(() => {
    if (classInfo && classInfo.id && groupId !== '') {
      getHistoryMessage()
    }
  }, [classInfo, groupId])

  useEffect(() => {
    if (currentNavItem === 2) { // 用户tab栏
      Taro.showLoading({
        title: '加载用户列表'
      })
      getLiveRoomUser(groupId, token)
      .subscribe(v => {
        if (v.data.code === 200) {
          setLiveRoomUsers(v.data.data)
        }
        Taro.hideLoading()
      })
    }

  }, [currentNavItem, groupId, token])

  /* 分享 */
  useShareAppMessage(res => {
    return {
      title: classInfo.keJian.title,
      imageUrl: classInfo.keJian.headImg
    }
  })

  return (
    <WithAuth visible={authModalVisible} cb={closeAuthModalCallback} currentTitle="直播间">
      <View className="container hbb-live">
        <View className="hbb-header"
          // onClick={() => setAuthModalVisible(true)}
          >
          {
            /* <Image className="hbb-header-image" mode="aspectFit" src={classInfo!.imgDesc} /> */
          }
          <Swiper
            className="swiper-container"
            circular
            indicatorDots
            indicatorColor='#999'
            indicatorActiveColor='#bf708f'
            autoplay>
            { classInfo.keJian.rollImgs.map((item, index) => (
              <SwiperItem key={index}>
                <Image className="swiper-img" mode="widthFix" src={item}></Image>
              </SwiperItem>
            ))}
          </Swiper>
        </View>
        <View className="nav">
          {navItemList.map((item, index) => {
            return <View onClick={() => setCurrentNavItem(index)} key={item.name} className={cs('nav-item', { current: index === currentNavItem })}>{ item.name }</View>
          })}
        </View>
        {/* <View className="separate"></View> */}
        <View className="tab-container">
          {
            currentNavItem === TabItems.live
            ? <Button className="share-btn" open-type="share" size='mini' plain>分享</Button>
            : <View></View>
          }

          {
            currentNavItem === TabItems.live
            ? <ScrollView
              // style={{ transform: `translateY(${Taro.pxTransform(touchMoveDistance)})` }}
              className="tab-item tab-live"
              // onTouchStart={onTouchStart}
              // onTouchMove={onTouchMove}
              // onTouchEnd={onTouchEnd}
              // onScroll={onScroll}
              // onScrollToUpper={onScrollToUpper}
              scrollY={true}
              scrollIntoView={currentMsgId}
              scrollWithAnimation={true}>
                {/* {chatList.map((chat, index) => <Bubble id={chat.msgId} key={index} {...chat} onBubbleClick={onBubbleClick} currentAudioUrl={currentAudioUrl} />)} */}
                {/* <View className="scroll-hide">{ hideAreaText }</View> */}
                {messageList.map((msg, index) => {
                  var formatTimer = "";
                  if(msg.msgType === "VOICE"){
                    var time = (msg.voiceLength/1000);

                    if (time >= 60 && time <= 3600) {
                      time = parseInt(time / 60) + "分" + time % 60 + "秒";
                    } else {
                      if (time > 3600) {
                        time = parseInt(time / 3600) + "小时" + parseInt(((time % 3600) / 60)) + "分" + time % 60 + "秒";
                      } else {
                        time = time + "秒";
                      }
                    }
                    formatTimer = time;
                  }
                  return (
                    <View key={msg.ID} id={msg.ID} className={cs(['bubble-container', msg.msgType.toLocaleLowerCase(), {self: msg.sender.senderId === userId}])}>
                      <View className="avatar">
                        <Image className="avatar-image" src={msg.senderAvatar || msg.sender.senderAvatar} />
                      </View>
                      <View className="info">
                        <View className="name">
                          {
                            msg.isQuestion
                            ? `${msg.senderNickname || msg.sender.senderNickname}:提问`
                            : (msg.senderNickname || msg.sender.senderNickname)
                          }
                        </View>
                        <View className="view-flex">
                          <View className="content" onClick={() => onBubbleClick(msg)}>
                            {
                              msg.msgType === 'TEXT'
                              ? msg.content
                              : msg.msgType === 'IMAGE'
                              ? <Image className="bubble-image" mode="widthFix" src={msg.content} />
                              : msg.msgType === 'VOICE'
                              ? <View className="content__voice--inner" style={{ width: Taro.pxTransform(Math.max(calcVoiceSquareLength(msg.voiceLength!), 60)) }}>
                                {(msgId === msg.msgId) ? <View className="inner--voice"></View>: <View className="inner--voice1"></View>}{ formatTimer }
                              </View>
                              : msg.msgType === 'VIDEO'
                              ? <Video onPlay={onVideoPlay} onPause={onVideoPause} id="hbb-video" className="video" src={msg.content} />
                              : <View />
                            }
                          </View>
                          {(msg.msgType === 'VOICE' && msg.isRead == false) && <View className="mark-point"></View>}
                        </View>
                      </View>
                    </View>
                  )
                })}
              </ScrollView>
            : <View></View>
          }
          {
            currentNavItem === TabItems.classInfo && classInfo
            ? (<View className="tab-item tab-class-info">
                <View className="class-info-title">{classInfo.name}</View>
                <View className="class-info-intro">{classInfo.textDesc}</View>
                <View className="doctor-info">
                  <View className="doctor-avatar">
                    <Image className="doctor-avatar-image" src={classInfo.doctor.avatar} />
                  </View>
                  <View className="doctor-intro">
                    <View className="doctor-name">{classInfo.doctor.name}</View>
                    <View className="doctor-department">{classInfo.doctor.department} {classInfo.doctor.company}</View>
                  </View>
                </View>
              </View>)
            : <View></View>
          }
          {
            currentNavItem === TabItems.user
            ? <View className="tab-item tab-user">
                {
                  liveRoomUsers.map((user, index) => {
                    return (
                      <View key={index} className="user-container">
                        <View className="user-avatar">
                          <Image className="user-avatar-image" src={user.avatar} />
                        </View>
                        <View className="user-name">{user.username}</View>
                      </View>
                    )
                  })
                }
              </View>
            : <View></View>
          }
          {
            currentNavItem === TabItems.storeInfo && storeInfo
            ? <View className="tab-item tab-store-info">
                <View className="store-box">
                  <View className="store-logo">
                    <Image className="store-logo-image" src={(storeInfo.logo == '')?'/assets/images/default.png':storeInfo.logo} />
                  </View>
                  <View className="store-info">
                    <View className="store-name">{storeInfo.name}</View>
                    <View className="store-intro">店主：{storeInfo.dianZhu.userName}  电话: {storeInfo.dianZhu.phone}</View>
                  </View>
                </View>
                <View className="cell">
                  <View className="cell-left">门店地址</View>
                  <View className="cell-right">{storeInfo.address.province + storeInfo.address.city + storeInfo.address.addr}</View>
                </View>
                <View className="cell">
                  <View className="cell-left">营业时间</View>
                  <View className="cell-right">{storeInfo.businessHours}</View>
                </View>
                <View className="cell cell-album">
                  <View className="cell-left">门店相册</View>
                  <View className="cell-right">
                    <View className="image-album">
                      {storeInfo.shopImages.map((imageUrl, index) => <Image key={index} className="store-image" src={imageUrl} onClick={PreviewAlbum.bind(this, index)}/>)}
                    </View>
                  </View>
                </View>
              </View>
            : <View></View>
          }
        </View>
        {
          currentNavItem === 0
          ?
            <View className="input-box">
              <View className={cs(['input-tips', { show: isShowInputTip }])}>点亮问号，发起提问</View>
              <View className="input-label">
                {
                  liveStatus !== ELiveStatus.ANSWER
                  ? <Input confirmType="send" placeholder={liveStatus == ELiveStatus.STOP ? '直播已结束，请到育儿问答提问' : '正在直播中，请稍后提问'} className="input" disabled={liveStatus !== ELiveStatus.ANSWER} onClick={InputOnClick} />
                  : <Input confirmType="send" placeholder="请输入 问题 或 提问..." onConfirm={() => sendMessage()} className="input" value={value} onFocus={onInputFocus} onInput={(e) => setValue(e.detail.value)} />
                }
                {
                  liveStatus === ELiveStatus.ANSWER
                  ?<View className={cs(['input-question', { checked: isQuestionChecked }])} onClick={() => setIsQuestionChecked(!isQuestionChecked)}></View>
                  :<View style="margin-right: 13px;"></View>
                }
                {
                  liveStatus === ELiveStatus.ANSWER
                  ?<View className="input-send" onClick={() => sendMessage()}>发送</View>
                  :null
                }
              </View>
            </View>
          : <View style={{ height: 0 }}></View>
        }

      </View>
    </WithAuth>
  )
}

Live.config = {
  disableScroll: true
}

export default Live
