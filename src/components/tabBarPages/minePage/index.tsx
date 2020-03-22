import Taro, { FC, useState, useEffect } from '@tarojs/taro'
import { View, Image, Button } from '@tarojs/components'
import './index.scss'
import { LocalStorageName } from '../../../config'

type Props = {
  callback?(): void
  token: string
  userInfo: any
}

const MinePage: FC<Props> = (props) => {
  const [token, setToken] = useState('')
  const [userInfo, setUserInfo] = useState()

  const goHistoryList = () => {
    Taro.navigateTo({
      url: '/pages/history/index'
    })
  }


  useEffect(() => {
    console.log('init token')
    const t = Taro.getStorageSync(LocalStorageName.token)
    const u = Taro.getStorageSync(LocalStorageName.wechatUserInfo)
    setToken(t)
    setUserInfo(u)
  }, [])
  useEffect(() => {
    if (props.token) {
      setToken(props.token)
    }
    if (props.userInfo) {
      setUserInfo(props.userInfo)
    }

  }, [props])

  return (
    <View className="container">
      <View className="header">
        <View className="avatar">
          <Image className="avatar-image" src={userInfo ? userInfo.avatarUrl : '/assets/images/default.png'} />
        </View>
        <View className="introduction">
          <View className="name">{ userInfo ? userInfo.nickname : '未登录' }</View>
          {/* <View className="desc">学习时间：129小时36分钟</View> */}
          <View className="desc"></View>
        </View>
      </View>
      <View className="main">
        <View className="service">
          <View className="title">我的服务</View>
          <View className="content">
            <View className="item" onClick={goHistoryList}>
              <View className="icon icon-study"></View>
              <View className="name">学习记录</View>
            </View>
            <View className="item">
              <Button className="item-button" openType="contact">
                <View className="icon icon-qa"></View>
                <View className="name">问答历史</View>
              </Button>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}
export default MinePage
