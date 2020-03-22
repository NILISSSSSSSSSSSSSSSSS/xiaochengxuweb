import Taro, { useState, useEffect } from '@tarojs/taro'

const useWechatInnerAudio = () => {
  const instance = Taro.createInnerAudioContext()


  const initialListener = () => {
    instance.onCanplay(() => {
      console.log('可以播放了')
    })

    instance.onPlay(() => {
      console.log('开始播放')
    })
  }
}

export default useWechatInnerAudio
