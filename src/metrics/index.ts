import Taro from '@tarojs/taro'
export const Colors = {
  mainBackgroundColor: 'rgba(246,246,251,1)',
  navBorderColor: 'rgba(246,246,251,1)',
  themeColor: '#FF3578'
}
const systemInfo = Taro.getSystemInfoSync()
const menuButton = Taro.getMenuButtonBoundingClientRect() // 方法不存在的时候需要做兼容处理
// console.log(Taro.getSystemInfoSync())
// console.log(menuButton)

// 处理导航栏高度
const statusBarHeight = systemInfo.statusBarHeight
const gap = menuButton.top - systemInfo.statusBarHeight
const navBarHeight = menuButton.height + (menuButton.top - systemInfo.statusBarHeight) * 2
const totalNavBarHeight = navBarHeight + statusBarHeight

export const Metrics = {
  statusBarHeight,
  gap,
  navBarHeight,
  totalNavBarHeight
}

// :root {
//   --main-background-color: #eee;
//   --main-theme-color: #FF3578;
//   --main-font-size: 16px;
//   --text-font-size: 14px;
//   --small-font-size: 12px;
// }
