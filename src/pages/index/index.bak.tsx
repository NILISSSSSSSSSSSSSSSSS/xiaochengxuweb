import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import IndexPage from '../../components/tabBarPages/indexPage'
import LiveList from '../../components/tabBarPages/liveListPage'
import HbbTabBar from '../../components/layout/HbbTabBar'
import WithAuth from '../../components/layout/withAuth'
import { connect } from '@tarojs/redux'
import { StateTypes } from '../../store/reducers'
import { ButtonProps } from '@tarojs/components/types/Button'
import * as Types from '../../types'
import { TabPages, TabPagesTitle, LocalStorageName, userInfoMap } from '../../config'
import { doLogin, saveProfile } from '../../service/home'
import './index.scss'

// #region 书写注意
//
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion

// type IProps = PageStateProps & PageDispatchProps & PageOwnProps
// interface Index {
//   props: ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & PageOwnProps
// }

const mapStateToProps = (state: StateTypes) => ({
  tabBarSelected: state.ui.tabBarSelected
})

const mapDispatchToProps = dispatch => ({})

// types
type PageOwnProps = {
}
type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & PageOwnProps
type State = {
  /**
   * 授权弹窗
   */
  showModal: boolean
}

@connect(mapStateToProps, mapDispatchToProps)
class Index extends Component<Props, State> {
  constructor() {
    super()
    this.state = {
      showModal: false
    }
  }
    /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  static config: Config = {
    navigationBarTitleText: '首页',
    // enablePullDownRefresh: true
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidMount () {
    console.log(Taro.getCurrentPages())
    // Taro.showNavigationBarLoading()
    // Taro.startPullDownRefresh()
    // const subscription = getUsers(35).subscribe(v => console.log(v))
  }

  componentDidShow () { }

  componentDidHide () { }

  onClick() {
    Taro.checkSession()
      .then((r) => {
        console.log(r)
        Taro.login()
        .then((res) => {
          console.log(res)
          doLogin({ code: res.code, platform: 'XIAOCHENGXU' })
          .subscribe((v) => {
            console.log(v.data.data.token)
            Taro.setStorage({ key: 'token', data: v.data.data.token })
          })
        })
      })
      .catch(error => {
        console.log(error)
        Taro.login()
        .then((res) => {
          console.log(res)
          doLogin({ code: res.code, platform: 'XIAOCHENGXU' })
          .subscribe(v => {
            Taro.setStorage({ key: 'token', data: v.data.data.token })
          })
        })
      })
  }

  getUserInfo: ButtonProps['onGetUserInfo'] = (e) => {
    console.log(e)
    // saveProfile(e.detail.userInfo, '12313')
    const wechatUserInfo = e.detail.userInfo
    const data: Types.Request.saveProfile = {
      ...wechatUserInfo,
      nickname: wechatUserInfo[userInfoMap.nickname],
      avatar: wechatUserInfo[userInfoMap.avatar],
      sex: wechatUserInfo[userInfoMap.sex]
    }
    console.log(data)
    saveProfile(data, Taro.getStorageSync(LocalStorageName.token))
      .subscribe(v => console.log(v))
  }

  onSuccess(res) {
    console.log(res)
  }

  onFail(res) {
    console.log(res)
  }


  callback() {
    Taro.showLoading({ title: '加载中...' })
    setTimeout(() => {
      Taro.hideLoading()
    }, 2000)
  }

  onModalShow () {
    this.setState({ showModal: true })
  }


  render () {
    const { tabBarSelected } = this.props
    const { showModal } = this.state
    setTimeout(() => {
      console.log(tabBarSelected)
    }, 4000)
    return (
      <WithAuth
        visible={showModal}
        cb={this.callback}
        currentTitle={TabPagesTitle[TabPages[tabBarSelected]]}
      >
        <View className='index html'>
          {
            tabBarSelected === TabPages.Index
            ? <IndexPage />
            : <LiveList />
          }
        </View>
        <HbbTabBar />
      </WithAuth>
    )
  }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default Index as ComponentClass<PageOwnProps, State>
