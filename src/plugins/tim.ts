// import Tim from '../static/tim-wx'
// import COS from 'cos-wx-sdk-v5'
const Tim = require('../static/tim-wx')
import { getImUserSign } from '../service/home'

const tim = Tim.create({SDKAppID: 1400304449})
tim.on(Tim.EVENT.SDK_READY, function ready(event) {
  console.log(event)

  tim.joinGroup({ groupID: '5e4ba1010264352fc1a43225', type: Tim.TYPES.GRP_PUBLIC })
    .then(function(imResponse) {
      console.log(imResponse)
      switch (imResponse.data.status) {
        case tim.TYPES.JOIN_STATUS_WAIT_APPROVAL: // 等待管理员同意
          break;
        case tim.TYPES.JOIN_STATUS_SUCCESS: // 加群成功
          console.log(imResponse.data.group); // 加入的群组资料
          break;
        case tim.TYPES.JOIN_STATUS_ALREADY_IN_GROUP: // 已经在群中
          break;
        default:
          break;
    }
    }).catch(function(imError){
      console.warn('joinGroup error:', imError); // 申请加群失败的相关信息
    })
  // tim.getGroupList()
  //   .then((res) => {
  //     console.log(res)
  //   })
  //   .catch(imError => console.warn('getGroupList error:', imError))
  // @TGS#32ISZ4FGJ 聊天室

  // tim.createGroup({
  //   type: Tim.TYPES.GRP_CHATROOM,
  //   name: '孙杰测试用group',
  //   memberList: [{userID: 'user1'}, {userID: 'user2'}] // 如果填写了 memberList，则必须填写 userID
  // })
  //   .then((res) => {
  //     console.log(res)
  //   })

  // tim.getGroupMemberList({
  //   groupID: '5df98d11fc416b3ccc1adf2f',
  //   count: 30,
  // })
  // .then(function(imResponse) {
  //   console.log(imResponse)
  //   console.log(imResponse.data.memberList); // 群成员列表
  // }).catch(function(imError) {
  //   console.warn('getGroupMemberProfile error:', imError);
  // })
});
export default tim

const sub1 = getImUserSign('sunjie').subscribe(v => {
  console.log(v)
  sub1.unsubscribe()
})

// tim.login({
//   userID: '10010',
//   userSig: 'eJyrVgrxCdYrSy1SslIy0jNQ0gHzM1NS80oy0zLBwoYGBoYwieKU7MSCgswUJStDEwMDI0szIwMDiExqRUFmUSpQ3NTUFCgIFS3JzAWLmVsaWBgaGBtBTclMB5obWBCj7*oR6uzmX2Dhm5-lEaNv4mWamBeWEukXkuEc4eeR55sU5msaox9Z7u9vYatUCwARyDCE'
// })
// .then((e) => {
//   console.log(e)
// })
