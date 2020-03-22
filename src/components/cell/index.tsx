import Taro, { FC, useState, useEffect } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'

type Props = {
  /**
   * [title, detail]
   */
  data: string[]
}

const Cell: FC<Props> = (props) => {
  const { data } = props
  return (
    <View className="cell__container">
      <View className="cell__container-left">{ data[0] }</View>
      <View className="cell__container-right">{ data[1] }</View>
    </View>
  )
}

export default Cell
