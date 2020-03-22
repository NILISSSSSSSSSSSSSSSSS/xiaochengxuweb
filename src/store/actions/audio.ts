import { SET_CURRENT_AUDIO_URL } from '../constants'
import Taro from '@tarojs/taro'

type currentUrlPayload = {
  url: string
}


export interface SetCurrentAudioUrl {
  type: typeof SET_CURRENT_AUDIO_URL
  payload: currentUrlPayload
}

export type actionTypes = SetCurrentAudioUrl

export const setCurrentAudioUrl = (payload: currentUrlPayload): SetCurrentAudioUrl => {
  return {
    type: SET_CURRENT_AUDIO_URL,
    payload
  }
}
