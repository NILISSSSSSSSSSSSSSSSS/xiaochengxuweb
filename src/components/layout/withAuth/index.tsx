import Taro, { useState, FC, useEffect } from '@tarojs/taro'
import { View, CoverView, Button, CoverImage } from '@tarojs/components'
import { ButtonProps } from '@tarojs/components/types/Button'
import cs from 'classnames'
// import { useSelector } from '@tarojs/redux'
// import { createSelector } from 'reselect'
import './index.scss'
import { doLogin, saveProfile } from '../../../service/home'
import { userInfoMap, LocalStorageName } from '../../../config'
import * as Types from '../../../types'
// import { StateTypes } from '../../../store/reducers'

type OwnProps = {
  /**
   * modal是否显隐
   */
  visible: boolean
  /**
   * modal消失后的会调
   */
  cb?(type: 'confirm' | 'cancel'): void
  /**
   * 当前页面的title
   */
  currentTitle: string
}

// const enum BUTTONCLICK {
//   confirm = 'confirm',
//   cancel = 'cancel'
// }
// const getAuthModalStatus = createSelector(
//   (state: StateTypes) => state.ui.authModalStatus,
//   v => v
// )

const WithAuth: FC<OwnProps> = (props) => {
  const { cb, currentTitle, visible } = props
  const [modalStatus, changeModalStatus] = useState<boolean>(false)
  const [modalClassNames, setModalClassNames] = useState<any>(cs(['modal auth-modal', { 'trans': false }]))
  // const authModalStatus = useSelector(getAuthModalStatus)

  useEffect(() => {
    changeModalStatus(visible)
  }, [visible])

  useEffect(() => {
    // console.log(cs(['modal auth-modal', { 'trans': modalStatus }]))
    setModalClassNames(cs(['modal auth-modal', { 'trans': modalStatus }]))
  }, [modalStatus])

  useEffect(() => {
    if (modalStatus) {
      Taro.setNavigationBarTitle({ title: '授权' })
    } else {
      if (currentTitle) {
        Taro.setNavigationBarTitle({ title: currentTitle })
      }
    }
  }, [modalStatus, currentTitle])

  const getUserInfo: ButtonProps['onGetUserInfo'] = (e) => {
    Taro.showLoading({
      title: '加载中'
    })
    Taro.login()
      .then((res) => {
        doLogin({ code: res.code, platform: 'XIAOCHENGXU' })
          .subscribe(v => {
            // console.log(v)
            // console.log(e)
            if (e) {
              const wechatUserInfo = e.detail.userInfo
              const data: Types.Request.saveProfile = {
                ...wechatUserInfo,
                nickname: wechatUserInfo[userInfoMap.nickname],
                avatar: wechatUserInfo[userInfoMap.avatar],
                sex: wechatUserInfo[userInfoMap.sex],
                id: v.data.data.user
              }
              saveProfile(data, v.data.data.token)
              .subscribe(response => {
                // console.log(response)
                Taro.hideLoading()
                Taro.setStorageSync(LocalStorageName.token, response.data.data.token)
                Taro.setStorageSync(LocalStorageName.wechatUserInfo, data)
                Taro.setStorageSync(LocalStorageName.userId, response.data.data.user.id)
                cancel('confirm')
              })
            }
          })
      })
  }
  const cancel = (type: 'confirm' | 'cancel') => {
    changeModalStatus(false)
    cb && cb(type)
  }

  return (
    <View>
      { modalStatus ? <CoverView style={{ width: '100vw', height: '100vh' }}></CoverView> : props.children}
      { modalStatus ? (
        <CoverView className={modalClassNames}>
          <CoverView className="header">
            <CoverImage src="/assets/images/default.png" mode="aspectFit" className="logo"></CoverImage>
            <CoverView className="name">好呗呗</CoverView>
          </CoverView>
          <CoverView className="description">
            <CoverView className="desc-tpl">为了获取更好的体验，好呗呗将使用：</CoverView>
            <CoverView className="desc-list">● 你的公开信息（昵称，头像等）</CoverView>
          </CoverView>
          <CoverView className="button-group">
            <Button className="button button-auth" openType="getUserInfo" onGetUserInfo={getUserInfo}>允许使用</Button>
            <Button className="button button-cancel" onClick={() => cancel('cancel')}>取消</Button>
          </CoverView>
        </CoverView>
      ) : ''}
    </View>
  )
}

export default WithAuth
