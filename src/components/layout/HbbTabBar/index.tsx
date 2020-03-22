import Taro, { FC, useState, useCallback, useEffect } from '@tarojs/taro'
import { useSelector, useDispatch } from '@tarojs/redux'
import { createSelector } from 'reselect'
import { StateTypes } from '../../../store/reducers'
import { CoverView, CoverImage, Button } from '@tarojs/components'
import { setTabBarOptionsType } from '../../../store/actions/ui'
import { TabPages, TabPagesTitle } from '../../../config'
import cs from 'classnames'
import './index.scss'

const itemList = [
  {
    icon: 'icon-live.png',
    icon_selected: 'icon-live-selected.png',
    text: '直播',
    index: 0
  },
  {
    icon: 'icon-qa.png',
    icon_selected: 'icon-qa-selected.png',
    text: '育儿问答',
    index: 1
  },
  {
    icon: 'icon-mine.png',
    icon_selected: 'icon-mine-selected.png',
    text: '我的',
    index: 2
  },
]

const getSelected = createSelector(
  (state: StateTypes) => state.ui.tabBarSelected,
  v => v
)

type TabBarProps = {
  onConcat(): void
}

const HbbTabBar: FC<Partial<TabBarProps>> = (props) => {
  const selected = useSelector(getSelected)
  const dispatch = useDispatch()
  const setBarOptions = useCallback(
    (tabBarSelected: number) => {
      Taro.setNavigationBarTitle({ title: TabPagesTitle[TabPages[tabBarSelected]] })
        .then(() => dispatch<setTabBarOptionsType>({ type: 'SET_TAB_BAR_OPTIONS', payload: { tabBarSelected } }))
    },
    [dispatch]
  )

  const [liveIconPath, setLiveIconPath] = useState('../../../assets/images/tabbar/icon-live-selected.png')
  const [mineIconPath, setMineIconPath] = useState('../../../assets/images/tabbar/icon-mine.png')

  const { onConcat } = props

  useEffect(() => {
    if (selected === TabPages.Index) {
      setLiveIconPath('../../../assets/images/tabbar/icon-live-selected.png')
    } else {
      setLiveIconPath('../../../assets/images/tabbar/icon-live.png')
    }

    if (selected === TabPages.Mine) {
      setMineIconPath('../../../assets/images/tabbar/icon-mine-selected.png')
    } else {
      setMineIconPath('../../../assets/images/tabbar/icon-mine.png')
    }
  }, [selected, liveIconPath])

  return (
    <CoverView className="container">
      <CoverView className="item" onClick={() => setBarOptions(itemList[0].index)}>
        {/* {
          selected === 0
          ? <CoverImage className="item-image" src="../../../assets/images/tabbar/icon-live-selected.png" />
          : <CoverImage className="item-image" src="../../../assets/images/tabbar/icon-live.png" />
        } */}
        <CoverImage className="item-image" src={liveIconPath} />
        <CoverView className={cs("item-description", { "item-selected": selected === 0 })}>{ itemList[0].text }</CoverView>
      </CoverView>
      <CoverView className="item">
        <Button className="item-button" openType="contact" onContact={onConcat}>
          {
            selected === 1
            ? <CoverImage className="item-image" src="../../../assets/images/tabbar/icon-qa-selected.png" />
            : <CoverImage className="item-image" src="../../../assets/images/tabbar/icon-qa.png" />
          }
          <CoverView className={cs("item-description", { "item-selected": selected === 1 })}>{ itemList[1].text }</CoverView>
        </Button>
      </CoverView>
      <CoverView className="item" onClick={() => setBarOptions(itemList[2].index)}>
        <CoverImage className="item-image" src={mineIconPath} />
        {/* {
          selected === 2
          ? <CoverImage className="item-image" src="../../../assets/images/tabbar/icon-mine-selected.png" />
          : <CoverImage className="item-image" src="../../../assets/images/tabbar/icon-mine.png" />
        } */}
        <CoverView className={cs("item-description", { "item-selected": selected === 2 })}>{ itemList[2].text }</CoverView>
      </CoverView>
      {/* { itemList.map((item, index) => {
        const pathPrefix = '../../../assets/images/tabbar/'
        const useIcon = index === selected ? item.icon_selected : item.icon
        return (
          <CoverView className="item">
            <CoverImage className="item-image" src={pathPrefix + useIcon} />
            <CoverView className="item-description">{ item.text }</CoverView>
          </CoverView>
        )
      }) } */}
    </CoverView>
  )
}

export default HbbTabBar
