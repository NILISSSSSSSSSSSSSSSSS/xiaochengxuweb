import Taro, { useState, useEffect, FC, usePullDownRefresh, useReachBottom } from '@tarojs/taro'
import { useSelector } from '@tarojs/redux'
import { View } from '@tarojs/components'
import { createSelector } from 'reselect'
import IndexPage from '../../components/tabBarPages/indexPage'
// import LiveList from '../../components/tabBarPages/liveListPage'
import MinePage from '../../components/tabBarPages/minePage'
import HbbTabBar from '../../components/layout/HbbTabBar'
import WithAuth from '../../components/layout/withAuth'
import { StateTypes } from '../../store/reducers'

// import { ButtonProps } from '@tarojs/components/types/Button'
// import * as Types from '../../types'
import { TabPages, TabPagesTitle, LocalStorageName, userInfoMap } from '../../config'
import './index.scss'
import { ButtonProps } from '@tarojs/components/types/Button'
import * as Types from '../../types'
// import '../../plugins/tim'
// import TIM from '../../static/tim-wx'
// import COS from 'cos-wx-sdk-v5';

const getTabBarSelected = createSelector(
  (state: StateTypes) => state.ui.tabBarSelected,
  v => v
)
const Index: FC = () => {
  const [showModal, setShowModal] = useState(false)
  const tabBarSelected = useSelector(getTabBarSelected)
  const [token, setToken] = useState('')
  const [userInfo, setUserInfo] = useState()
  const [isPullDownRefresh, setIsPullDownRefresh] = useState(false)
  const [isReachBottom, setIsReachBottom] = useState(false)

  useEffect(() => {
  }, [])

  useEffect(() => {
    if (tabBarSelected === TabPages.Mine) {
      if (!Taro.getStorageSync(LocalStorageName.token) || !Taro.getStorageSync(LocalStorageName.wechatUserInfo)) {
        setShowModal(true)
      }
    }
  }, [tabBarSelected])

  const callback = () => {
    const t = Taro.getStorageSync(LocalStorageName.token)
    const u = Taro.getStorageSync(LocalStorageName.wechatUserInfo)
    setToken(t)
    setUserInfo(u)
  }

  const withAuthCallback = () => {
    console.log(123)
  }

  const indexPagePullDownRefreshCallback = () => {
    console.log('刷新首页数据完毕')
    Taro.stopPullDownRefresh()
    setIsPullDownRefresh(false)
  }

  const indexPageReachBottomCallback = () => {
    setIsReachBottom(false)
  }

  usePullDownRefresh(() => {
    console.log('刷新了')
    setIsPullDownRefresh(true)
  })

  useReachBottom(() => {
    console.log('上拉触底')
    setIsReachBottom(true)
  })

  return (
    // <View>
    //   <View className="index html">
    //     {
    //       tabBarSelected === TabPages.Index
    //       ? <IndexPage />
    //       : tabBarSelected === TabPages.Mine
    //       ? <WithAuth
    //         visible={showModal}
    //         cb={callback}
    //         currentTitle={TabPagesTitle[TabPages[tabBarSelected]]}>
    //           <MinePage />
    //         </WithAuth>
    //       : <View>对应tabbar页面未找到</View>
    //     }
    //   </View>
    //   <HbbTabBar />
    // </View>
  <WithAuth
    visible={showModal}
    cb={callback}
    currentTitle={TabPagesTitle[TabPages[tabBarSelected]]}
  >
    <View className="index html">
      {
        tabBarSelected === TabPages.Index
        ? <IndexPage isPullDownRefresh={isPullDownRefresh} indexPagePullDownRefreshCallback={indexPagePullDownRefreshCallback} indexPageReachBottomCallback={indexPageReachBottomCallback} isReachBottom={isReachBottom}  />
        : tabBarSelected === TabPages.Mine
        ? <MinePage token={token} userInfo={userInfo} callback={withAuthCallback} />
        : <View>对应tabbar页面未找到</View>
      }
      <HbbTabBar />
    </View>

  </WithAuth>
  )
}

export default Index

Index.config = {
  enablePullDownRefresh: true,
  onReachBottomDistance: 50
}
