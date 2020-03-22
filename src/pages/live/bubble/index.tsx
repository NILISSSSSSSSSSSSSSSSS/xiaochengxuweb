import Taro, { FC, useState, useEffect } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import cs from 'classnames'
import { Omit } from '../../../types/utils'

import './index.scss'

export type BubbleInfoType = {
  type: 'text'
  content: string
} | {
  type: 'audio'
  url: string
  duration: number
} | {
  type: 'image'
  url: string
}

// https://pic1.zhimg.com/v2-fda399250493e674f2152c581490d6eb_1200x500.jpg
type Props = {
  avatar: string,
  name: string,
  self?: boolean,
  onBubbleClick(bubble: BubbleInfoType): void,
  currentAudioUrl?: string,
  msgId: string
} & BubbleInfoType
export type BubbleType = Omit<Props, 'onBubbleClick'>
const Bubble: FC<Props> = (props) => {
  const { type, avatar, name } = props

  const [vioceBubbleLength, setVoiceBubbleLength] = useState(40)

  const onBubbleClick = () => {
    if (props.type === 'audio') {
      props.onBubbleClick({ type: props.type, url: props.url, duration: props.duration })
    } else if (props.type === 'image') {
      props.onBubbleClick({ type: props.type, url: props.url })
    } else if (props.type === 'text') {
      props.onBubbleClick({ type: props.type, content: props.content })
    }
  }

  const calcVoiceSquareLength = (voiceSeconds) => {
    // console.log(voiceSeconds)
    if (voiceSeconds > 0 && voiceSeconds < 60) {
      let length = (voiceSeconds / 60) * 210
      // console.log(length)
      if (length < 40) {
        return 40
      } else {
        return length
      }
    } else {
      return 210
    }
  }

  useEffect(() => {
    if (props.type === 'audio') {
      setVoiceBubbleLength(calcVoiceSquareLength(props.duration))
    }
    if (props.type === 'audio') {
      // console.log(props.currentAudioUrl)
      // console.log(props.url)
    }
  }, [props])

  return (
    <View id={props.msgId} className={cs(['bubble-container', type, {self: props.self}, { current: props.type === 'audio' && props.currentAudioUrl === props.url }])}>
      <View className="avatar">
        <Image className="avatar-image" src={avatar} />
      </View>
      <View className="info">
        <View className="name">{name}</View>
        <View className="content" onClick={() => onBubbleClick()}>
          {
            props.type === 'text'
            ? props.content
            : props.type === 'image'
            ? <Image className="bubble-image" src={props.url} />
            : props.type === 'audio'
            ? <View className="content__voice--inner" style={{ width: vioceBubbleLength + 'px' }} />
            : <View />
          }
        </View>
      </View>
    </View>
  )
}

export default Bubble
