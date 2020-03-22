import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import cs from 'classnames'
import { liveKClist, jumpAPPBind } from '../../../service/home'
import './index.scss'
import { dateFormat } from '../../../utils'
import noDataImg from '../../../static/images/noData.png'

type Props = {
  isPullDownRefresh: boolean
  isReachBottom: boolean
  indexPagePullDownRefreshCallback(): void
  indexPageReachBottomCallback(): void
}
export default class IndexPage extends Component<Props>{
  state = {
    dianPuId: '',
    testDianPuId: '',
    liveList: [],
    list: [],
    livingCoursePage: 1,
    livingCourseSize: 5,
    livingCourseIsLoading: false,
    livingCourseIsLoaded: false,
    historyCoursePage: 1,
    historyCourseSize: 5,
    historyCourseIsLoading: false,
    hisotryCourseIsLoaded: false
  }
  componentDidMount(){
    var options = Taro.getLaunchOptionsSync();
    if(options.scene == 1037){
      //第三方调入
      // options.referrerInfo.extraData
      var that = this; debugger;
      jumpAPPBind(options.referrerInfo.extraData, Taro.getStorageSync('token'))
      .subscribe(v => {
        console.log(v)
        if (v.data.code == 200) {
          that.setState({
            name: v.data.data.name,
            dianPuId: v.data.data.id
          },()=>{
            Taro.setNavigationBarTitle({title: that.state.name});
            Taro.setStorageSync('dianPuId', that.state.dianPuId);
            that.refreshData();
          });
        }
      });
    }else{
      //默认门店
      var that = this;
      jumpAPPBind({onlyId: "1"}, Taro.getStorageSync('token'))
      .subscribe(v => {
        if (v.data.code == 200) {
          that.setState({
            name: v.data.data.name,
            // dianPuId: v.data.data.id,
            dianPuId: '5e38d4dfd3ef02a9ca0f4f26',
            testDianPuId: v.data.data.id,
          },()=>{
            Taro.setNavigationBarTitle({title: that.state.name});
            Taro.setStorageSync('dianPuId', that.state.dianPuId);
            that.refreshData();
          });
        }
      });
    }
  }
  refreshData(){
    var that = this;
    this.setState({ livingCourseIsLoading: true, historyCourseIsLoading: true }, () => {
      liveKClist({dianPuId: that.state.dianPuId, status: 'BAOMINGSTOP,START', page: this.state.livingCoursePage, size: this.state.livingCourseSize}, Taro.getStorageSync('token'))
      .subscribe(v => {
        if (v.data.code == 200) {
          if(v.data.data.data == null){
            that.setState({ liveList: []});
            this.setState({ livingCourseIsLoaded: true })
          }else{
            that.setState({ liveList: v.data.data.data, livingCoursePage: ++that.state.livingCoursePage}, () => {
              if (that.state.liveList.length >= v.data.data.total) {
                this.setState({ livingCourseIsLoaded: true })
              }
            });
          }
        }
        this.setState({ livingCourseIsLoading: false })
      });

      liveKClist({dianPuId: that.state.dianPuId, status: 'ANSWER,STOP',  page: this.state.historyCoursePage, size: this.state.historyCourseSize}, Taro.getStorageSync('token'))
        .subscribe(v => {
          if (v.data.code == 200) {
            if(v.data.data.data == null){
              that.setState({ list: []});
              this.setState({ hisotryCourseIsLoaded: true })
            }else{
              that.setState({ list: v.data.data.data, historyCoursePage: ++that.state.historyCoursePage}, () => {
                if (that.state.list.length >= v.data.data.total) {
                  this.setState({ hisotryCourseIsLoaded: true })
                }
              });
            }
          }
          this.setState({ historyCourseIsLoading: false })
        });
      })
  }
  componentWillReceiveProps(props: Props) {
    let that = this
    if (props.isPullDownRefresh) {
      this.setState({ livingCourseIsLoading: true, historyCourseIsLoading: true, livingCourseIsLoaded: false, hisotryCourseIsLoaded: false }, () => {
        liveKClist({dianPuId: that.state.dianPuId, status: 'BAOMINGSTOP,START', page: 1, size: this.state.livingCourseSize}, Taro.getStorageSync('token'))
        .subscribe(v => {
          if (v.data.code == 200) {
            if(v.data.data.data == null){
              that.setState({ liveList: []});
            }else{
              this.state.livingCoursePage = 2;
              that.setState({ liveList: v.data.data.data, livingCoursePage: this.state.livingCoursePage}, () => {
                if (that.state.liveList.length >= v.data.data.total) {
                  this.setState({ livingCourseIsLoaded: true })
                }
              });
            }
          }
          this.setState({ livingCourseIsLoading: false })
        });
      liveKClist({dianPuId: that.state.dianPuId, status: 'ANSWER,STOP',  page: 1, size: this.state.historyCourseSize}, Taro.getStorageSync('token'))
        .subscribe(v => {
          if (v.data.code == 200) {
            if(v.data.data.data == null){
              that.setState({ list: []});
            }else{
              this.state.historyCoursePage = 2;
              that.setState({ list: v.data.data.data, historyCoursePage: this.state.historyCoursePage}, () => {
                if (that.state.list.length >= v.data.data.total) {
                  this.setState({ hisotryCourseIsLoaded: true })
                }
              });
            }
          }
          this.setState({ historyCourseIsLoading: false })
        });
      })
    }

    if (props.isReachBottom && !this.state.hisotryCourseIsLoaded) {
      if (this.state.historyCourseIsLoading) {
        return false
      }
      this.setState({ historyCourseIsLoading: true }, () => {
        liveKClist({dianPuId: that.state.dianPuId, status: 'ANSWER,STOP',  page: this.state.historyCoursePage, size: this.state.historyCourseSize}, Taro.getStorageSync('token'))
        .subscribe(v => {
          if (v.data.code == 200) {
            if (v.data.data.data == null) {
              that.setState({ list: []});
            } else {
              const arrTemp = this.state.list.concat(v.data.data.data);
              let currentPage = this.state.historyCoursePage;
              currentPage++;
              that.setState({ list: arrTemp, historyCoursePage: currentPage}, () => {
                if (that.state.list.length >= v.data.data.total) {
                  that.setState({ hisotryCourseIsLoaded: true })
                }
              })
            }
          }
          that.setState({ historyCourseIsLoading: false })
          setTimeout(() => {
            that.props.indexPageReachBottomCallback && that.props.indexPageReachBottomCallback()
          })
        })
      })
    }
  }

  componentDidUpdate() {
    if (!this.state.livingCourseIsLoading && !this.state.historyCourseIsLoading && this.props.isPullDownRefresh) {
      this.props.indexPagePullDownRefreshCallback && this.props.indexPagePullDownRefreshCallback()
    }
  }

  config: Config = {
    enablePullDownRefresh: true
  }

  clickNavigate(id){
    Taro.navigateTo({url: "/pages/details/index?id=" + id + "&dianPuId=" + this.state.testDianPuId});
  }

  livingCourseLoadMore() {
    if (!this.state.livingCourseIsLoaded) {
      Taro.showLoading({
        title: '加载中'
      })
      this.setState({ livingCourseIsLoading: true }, () => {
        liveKClist({dianPuId: this.state.dianPuId, status: 'START', page: this.state.livingCoursePage, size: this.state.livingCourseSize}, Taro.getStorageSync('token'))
        .subscribe(v => {
          if (v.data.code == 200) {
            if(v.data.data.data == null){
              this.setState({ liveList: []});
            }else{
              const arrTemp = this.state.liveList.concat(v.data.data.data)
              let currentPage = this.state.livingCoursePage
              const page = currentPage++
              this.setState({ liveList: arrTemp, livingCoursePage: page}, () => {
                if (this.state.liveList.length >= v.data.data.total) {
                  this.setState({ livingCourseIsLoaded: true })
                }
              });
            }
          }
          this.setState({ livingCourseIsLoading: false })
          Taro.hideLoading()
        });
      })
    }
  }

  /** 测试门店切换按钮 */
  changeShop(label){
    var that = this;
    jumpAPPBind({onlyId: label}, Taro.getStorageSync('token'))
    .subscribe(v => {
      console.log(v)
      if (v.data.code == 200) {
        that.setState({
          name: v.data.data.name,
          // dianPuId: v.data.data.id,
          dianPuId: '5e38d4dfd3ef02a9ca0f4f26',
          testDianPuId: v.data.data.id,
        },()=>{
          Taro.setNavigationBarTitle({title: that.state.name});
          Taro.setStorageSync('dianPuId', that.state.dianPuId);
          // that.refreshData();
        });
      }
    });
  }

  render(){
    return (
      <View className="container">
        <View className="header">
          <View className="text sub-title">
            <View className="image-live"></View>
            当前直播
          </View>
          {this.state.liveList.length <= 0 && <View className="view-empty-data">
            <Image src={noDataImg} mode="aspectFit" className="imgNoData"></Image>
            当前暂无课程哦
          </View>}
          {
            this.state.liveList.length > 0 && this.state.liveList.map((item, key)=>{
              return <View className="class-introduction" key={item.id} onClick={this.clickNavigate.bind(this, item.keCheng.id)}>
                <Image src={item.keCheng.imgDesc} mode="scaleToFill" className="image"></Image>
                {item.status === "START" && <View className="image-live-tag">正在直播</View>}
                {item.status === "BAOMINGSTOP" && <View className="image-live-tag1">未开课</View>}
                <View className="description">
                  <View className="course-start-time">
                    开课时间：
                    {
                      dateFormat('YYYY-mm-dd HH:MM', new Date(item.keCheng.realStartTime > 0 ? String(item.keCheng.realStartTime).length > 10 ? item.keCheng.realStartTime : item.keCheng.realStartTime * 1000 : item.keCheng.startTime))
                    }
                  </View>
                  <View className="view-flex view-flex-live">
                    <View className="view-title">{item.keCheng.name}</View>
                    <View className="view-desc">{item.keCheng.textDesc}</View>
                  </View>
                  <View className="button-wrapper">
                    <Button className="button">免费学习</Button>
                  </View>
                </View>
              </View>
            })
          }
          {
            this.state.livingCourseIsLoaded
            ? <View style={{ height: 0 }}></View>
            :
              <View className="load-more">
                <Text className="load-more-text" onClick={this.livingCourseLoadMore}>点击加载更多</Text>
              </View>
          }

        </View>
        <View className="middle">
          <View className="sub-title">
            <View className="image-history"></View>
            历史直播
          </View>
          <View className="class-list">
            {this.state.list.length <= 0 && <View className="view-empty-data">
              <Image src={noDataImg} mode="aspectFit" className="imgNoData"></Image>
              当前暂无课程哦
            </View>}
            {
              this.state.list.length > 0 && this.state.list.map((item, key)=>{
                return <View className="list-item" key={item.id} onClick={this.clickNavigate.bind(this, item.keCheng.id)}>
                  <Image src={item.keCheng.imgDesc} lazyLoad mode="scaleToFill" className="image-pic"></Image>
                  <View className="view-info">
                    <View className="view-title">{item.keCheng.name}</View>
                    <View className="view-flex">
                      <View className="view-num">
                        {/* <Image src="/assets/images/eye.png" className="image-eye"></Image> */}
                        <View className="image-eye"></View>
                        <View className="view-num1">{item.num}</View>
                      </View>
                      { item.status == 'BAOMINGSTOP' && <View className="view-status3">暂未开课</View>}
                      { item.status == 'ANSWER' && <View className="view-status1">答疑中</View>}
                      { item.status == 'STOP' && <View className="view-status2">已结束</View>}
                    </View>
                  </View>
                </View>
              })
            }
          </View>
        </View>

        {/* 测试按钮 开始 */}
        <View className="float-test-btns">
          <Button className="test-btn" size="mini" type='primary' onClick={this.changeShop.bind(this, '1')} plain>好呗呗总店</Button>
          <Button className="test-btn" size="mini" type='primary' onClick={this.changeShop.bind(this, '2')} plain>肯德基</Button>
          <Button className="test-btn" size="mini" type='primary' onClick={this.changeShop.bind(this, '3')} plain>爱亲</Button>
        </View>
        {/* 测试按钮 结束 */}
      </View>
    )
  }
}
