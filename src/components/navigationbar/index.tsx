import Taro, { useEffect, useState, FC } from '@tarojs/taro'
import { of, from, combineLatest } from 'rxjs'
import { map } from 'rxjs/operators'
import { CSSProperties } from 'react'
import { Colors } from '../../metrics'
import {
  View,
  Text
} from '@tarojs/components'
import './index.scss'

export interface NavBarConfig {
  /**
   * 底边框
   *
   * 显示或者隐藏
   */
  showBorderBottom?: boolean
  /**
   * 左边返回按钮
   *
   * 显示或者隐藏
   */
  showLeftBackButton?: boolean
  /**
   * 标题居中
   *
   * 居中或者靠左显示
   */
  middleTitle?: boolean
  /**
   * 导航栏背景色
   */
  backgroundColor?: string
  /**
   * 导航栏标题颜色
   */
  textColor?: string
  borderBottom?: CSSProperties['borderBottom']
  /**
   * 导航栏标题 如果有children则以children优先
   */
  titleText?: string

  /**
   * 返回路由的层数
   */
  backStackNum?: number
  children?: any
}

const NavBar: FC = (props: NavBarConfig) => {
  const [navBarHeight, setNavBarHeight] = useState(44)
  const [statusBarHeight, setStatusBarHeight] = useState(20)
  const [navBarStyles, setNavBarStyles] = useState<CSSProperties>({
    backgroundColor: '#fff',
    borderBottom: '1px solid ' + Colors.navBorderColor
  })
  const [navBarConfig, setNavBarConfig] = useState<NavBarConfig>({
    showBorderBottom: true,
    showLeftBackButton: true,
    middleTitle: true,
    backgroundColor: '#fff',
    textColor: 'black',
    titleText: ''
  })
  const [navBarTitle, setNavBarTitle] = useState('')

  // 合并配置项
  useEffect(() => {
    setNavBarConfig({ ...navBarConfig, ...props })
  }, [])

  // title
  useEffect(() => {
    if (navBarConfig.titleText) {
      setNavBarTitle(navBarConfig.titleText)
    } else {
      setNavBarTitle(props.children)
    }
  }, [navBarConfig])

  // 计算navBar样式
  useEffect(() => {
    let styles: {[k: string]: any} = {}
    if (navBarConfig.borderBottom) {
      styles.borderBottom = navBarConfig.borderBottom
    }
    if (navBarConfig.backgroundColor) {
      styles.backgroundColor = navBarConfig.backgroundColor
    }
    setNavBarStyles(prev => ({ ...prev, ...styles }))
  }, [navBarConfig])

  // 计算 navBar 高度
  useEffect(() => {
    const systemInfo$ = from(Taro.getSystemInfo())
    const menuButtonRect$ = of(Taro.getMenuButtonBoundingClientRect())
    const source$ = combineLatest(systemInfo$, menuButtonRect$)
    source$
      .pipe(
        map(v => {
          const [systemInfo, menuButtonRect] = v
          const { statusBarHeight } = systemInfo
          const { height: menuButtonHeight, top: menuButtonTop } = menuButtonRect
          const gap = menuButtonTop - statusBarHeight
          console.log(systemInfo)
          // 胶囊按钮高度 + 状态栏到胶囊按钮间距 * 2 + 状态栏高度(paddingTop)
          // return menuButtonHeight + gap * 2
          return {
            navBarHeight: menuButtonHeight + gap * 2,
            statusBarHeight: statusBarHeight
          }
        })
      )
      .subscribe(v => {
        setNavBarHeight(v.navBarHeight)
        setStatusBarHeight(v.statusBarHeight)
      })
  }, [])

  const onBack = () => {
    // Taro.navigateBack()
    const { backStackNum } = props
    const num = backStackNum ? backStackNum : 1
    Taro.navigateBack({ delta: num })
      // .then(res => console.log(res))
  }

  return (
    <View
      className="container"
      style={{
        height: Taro.pxTransform(navBarHeight * 2),
        paddingTop: Taro.pxTransform(statusBarHeight * 2),
        display: 'flex',
        alignItems: 'center',
        justifyContent: navBarConfig.middleTitle ? 'center' : 'flex-start',
        ...navBarStyles,
      }}
    >
      { navBarConfig.showLeftBackButton ? <View onClick={onBack} className="left-button" style={{ height: 'calc(100% - '+ Taro.pxTransform(statusBarHeight * 2) +')' }}></View> : <View /> }
      <View style={{ marginLeft: navBarConfig.middleTitle ? '' : Taro.pxTransform(39 * 2) }}>
        <Text className="title" style={{color: navBarConfig.textColor ? navBarConfig.textColor : ''}}>{ navBarTitle }</Text>
      </View>
    </View>
  )
}

export default NavBar
