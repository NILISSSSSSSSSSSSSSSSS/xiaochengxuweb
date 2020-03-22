import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import { learnRecord } from '../../service/home'
import './index.scss'

export default class Details extends Component{
  config = {
    navigationBarTitleText: '历史列表'
  }
  state = {
    height: (Taro.getSystemInfoSync().windowHeight) + 'px',
    page: 1, total: 0,
    list: []
  }
  componentDidMount(){
    var that = this;
    learnRecord({dianPuId: Taro.getStorageSync('dianPuId'), page: this.state.page}, Taro.getStorageSync('token'))
      .subscribe(v => {
        if (v.data.code == 200) {
          that.setState({ list: v.data.data.data, total: v.data.data.total});
        }
      });
  }
  gotoLive(id){
    Taro.navigateTo({url: "/pages/details/index?id=" + id + "&dianPuId=" + Taro.getStorageSync('dianPuId')});
  }
  onReachBottom(){
    if(this.state.list.length < this.state.total){
      Taro.showLoading({ title: '加载中...' }); var that = this; this.state.page++;
      learnRecord({dianPuId: '5e38d4dfd3ef02a9ca0f4f26', page: this.state.page}, Taro.getStorageSync('token'))
        .subscribe(v => {
          if (v.data.code == 200) {
            Taro.hideLoading();
            that.state.list = that.state.list.concat(v.data.data.data)
            that.setState({ list: that.state.list, total: v.data.data.total});
          }
        });
    }else{
      Taro.showToast({
        title: '暂无数据', icon: 'none',
        duration: 2000
      });
    }
  }
  render(){
    return (
      <View className="container" style={{'height': this.state.height}}>
        {this.state.list.length <= 0 && <View className="view-empty-data">
          <Image src="/assets/images/noData1.png" mode="aspectFit" className="imgNoData"></Image>
          没有相关历史数据。
        </View>}
        {
          this.state.list.length > 0 && this.state.list.map((item, key)=>{
            return (<View className="view-item" key={key} onClick={this.gotoLive.bind(this, item.keCheng.id)}>
              <Image src={item.keCheng.imgDesc} lazyLoad="true" mode="aspectFit" className="image-pic"></Image>
              <View className="view-right">
                <View className="view-title">{item.keCheng.name}</View>
                <View className="view-bottom">
                  <Image src="/assets/images/timer.png" className="image-timer"></Image>
                  <Text className="text-time">上次学习：{item.updateT.humanTime}</Text>
                </View>
              </View>
            </View>)
          })
        }
      </View>
    )
  }
}
