import Taro, { FC, useState } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import Cell from '../../components/cell'
import './index.scss'

const data = [
  ['门店地址', '四川省成都市布鲁明顿广场001号'],
  ['营业时间', '9:00～22:00']
]

const CourseDetail: FC = () => {
  return (
    <View className="container">
      <View className="header"></View>
      <View className="introduction">
        <View className="store-name">课程详情</View>
        <View className="class-box">
          <View className="title">
            新手爸妈必备：0-6个月宝宝疫苗接种全攻略6个月宝宝疫苗接种全攻略
          </View>
          <View className="tag-group"></View>
          <View className="expert-introduction">
            <View className="avatar"></View>
            <View className="intro">
              <View className="name">赖芳芳</View>
              <View className="desc">主任医生 成都新世纪妇女儿童医院成都新世纪妇女儿童医院</View>
            </View>
          </View>
          <View className="class-description">
            宝宝一出生，就要接受一连串的疫苗，看着宝贝挨针大哭，每个妈妈一定很心疼。
          </View>
        </View>
        <View className="store-box">
          <View className="store-introduction">
            <View className="image"></View>
            <View className="intro">
              <View className="name">
                好呗呗门店
              </View>
              <View className="desc">
                店主：张三 电话： 18511111111
              </View>
            </View>
          </View>
          {data.map(item => <Cell data={item} />)}
        </View>
      </View>
      <View className="course-detail">
        <View className="title">课程详情</View>
        <View>下面是长图</View>
      </View>
      <View className="postion-button-container">
        <View className="button">进入直播</View>
      </View>
    </View>
  )
}

export default CourseDetail
