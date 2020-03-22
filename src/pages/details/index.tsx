import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import { liveKC, liveDP, liveInto } from '../../service/home'
import './index.scss'

export default class Details extends Component{
  config = {
    navigationBarTitleText: '详情页面'
  }
  state = {
    height: (Taro.getSystemInfoSync().windowHeight - 50) + 'px',
    KeCheng: {doctor: {}},
    DianPu: {dianZhu: {}}
  }
  componentDidMount(){
    var that = this;
    liveDP({dianPuId: this.$router.params.dianPuId}, Taro.getStorageSync('token'))
      .subscribe(v => {
        if (v.data.code == 200) {
          that.setState({ DianPu: v.data.data});
        }
      });
    liveKC({keChengId: this.$router.params.id}, Taro.getStorageSync('token'))
      .subscribe(v => {
        if (v.data.code == 200) {
          that.setState({ KeCheng: v.data.data});
        }
      });
  }
  gotoLive(){
    Taro.navigateTo({url: "/pages/live/index?dianPuId=" + this.$router.params.dianPuId + "&keChengId=" + this.$router.params.id});
  }
  onShareAppMessage(){
    return {
      title: this.state.KeCheng.keJian.title,
      imageUrl: this.state.KeCheng.keJian.headImg,
    }
  }
  render(){
    return (
      <View className="container">
        <View className="view-scroll" style={{'height': this.state.height}}>
          <View className="view-header">
            {this.state.KeCheng.keJian.headImg && <Image src={this.state.KeCheng.keJian.headImg} lazyLoad="true" mode="scaleToFill" className="image-top" />}
          </View>
          <View className="view-body">
            <View className="view-content">
              <View className="view-title">
                <View className="view-title-txt">{this.state.DianPu.name}</View>
                <Button className="share-btn" open-type="share" size='mini' type='default' plain>分享</Button>
              </View>
              <View className="view-subtitle">{this.state.KeCheng.name}</View>
              {this.state.KeCheng.status == 'BAOMINGSTOP' && <View className="view-status blue1">直播未开始</View>}
              {this.state.KeCheng.status == 'START' && <View className="view-status blue">直播中</View>}
              {this.state.KeCheng.status == 'ANSWER' && <View className="view-status orange">答疑中</View>}
              {this.state.KeCheng.status == 'STOP' && <View className="view-status gray">已结束</View>}
              <View className="view-doctor">
                <Image src={this.state.KeCheng.doctor.avatar} className="image-avatar" />
                <View className="view-right">
                  <View className="text-name">{this.state.KeCheng.doctor.name}</View>
                  <View className="text-info">{this.state.KeCheng.doctor.title} {this.state.KeCheng.doctor.company}</View>
                </View>
              </View>
              {this.state.KeCheng.textDesc != "" && <View className="view-bebi">{this.state.KeCheng.textDesc}</View>}
            </View>

            <View className="view-content">
              <View className="view-title2">
                <View className="view-dividing-line"></View>门店信息
              </View>
              <View className="view-store-info">
                <Image src={(this.state.DianPu.logo == '')?'/assets/images/default.png':this.state.DianPu.logo} className="image-store-avatar"></Image>
                <View className="view-info">
                  <View className="view-name">{(this.state.DianPu.name == null)?'--':this.state.DianPu.name}</View>
                  <View className="view-contact">
                    <Text style="margin-right: 16px;">店主：{(this.state.DianPu.dianZhu.userName == null)?'-':this.state.DianPu.dianZhu.userName}</Text>
                    <Text>电话：{(this.state.DianPu.dianZhu.phone == null)?'-':this.state.DianPu.dianZhu.phone}</Text>
                  </View>
                </View>
              </View>
              <View className="view-address">
                <View className="text-tip">门店地址</View>
                <View className="view-address-1">
                  {
                    (this.state.DianPu.address == null)?'-':this.state.DianPu.address.province + this.state.DianPu.address.city + this.state.DianPu.address.addr
                  }
                </View>
              </View>
              <View className="view-timer">
                <Text className="text-tip">营业时间</Text><Text>{(this.state.DianPu.businessHours == null)?'-':this.state.DianPu.businessHours}</Text>
              </View>
            </View>
            <View className="view-content">
              <View className="view-title2">
                <View className="view-dividing-line"></View>课程详情
              </View>
              <View className="view-desc">
                {/*(this.state.KeCheng.textDesc == null)?'-':this.state.KeCheng.textDesc*/}
                {this.state.KeCheng.keJian.imgDesc && <Image src={this.state.KeCheng.keJian.imgDesc} lazyLoad="true" mode="widthFix" class="detail-image" />}
              </View>
            </View>
            {
              // <Image src="" className="image-details" />
            }
          </View>
        </View>
        { this.state.KeCheng.status == 'BAOMINGSTOP' && <View className="view-bottom1">直播未开始</View> }
        { this.state.KeCheng.status != 'BAOMINGSTOP' && <View className="view-bottom" onClick={this.gotoLive.bind(this)}>进入直播</View> }
      </View>
    )
  }
}
