import { actionTypes } from '../actions/audio'
import Taro from '@tarojs/taro'

export type State = {
  playStatus: 'play' | 'stop'
  currentAudioUrl: string
  volume?: string
}

const INITIAL_STATE: State = {
  playStatus: 'stop',
  currentAudioUrl: ''
}

const audio = (state = INITIAL_STATE, action: actionTypes) => {
  switch (action.type) {
    case 'AUDIO/SET_CURRENT_AUDIO_URL':
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}

export default audio
