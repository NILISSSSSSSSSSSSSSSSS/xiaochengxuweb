import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { StateTypes } from '../../store/reducers'
import NavBar, { NavBarConfig } from '../navigationbar'

export {
  NavBarConfig
}

type PageOwnProps = {
  navBarConfig?: NavBarConfig
}
type PageState = {}

const mapStateToProps = (state: StateTypes) => ({
  totalNavBarHeight: state.ui.totalNavBarHeight
})
const mapDispatchToProps = (dispatch) => ({})

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & PageOwnProps

@connect(mapStateToProps, mapDispatchToProps)
class WithNavigationBar extends Component<Props, PageState> {
  render() {
    const { totalNavBarHeight, children, navBarConfig } = this.props
    return (
      <View>
        <NavBar {...navBarConfig} />
        <View style={{ paddingTop: Taro.pxTransform(totalNavBarHeight * 2 + 3) }}>
          { children }
        </View>
      </View>
    )
  }
}

export default WithNavigationBar as ComponentClass<PageOwnProps, PageState>
