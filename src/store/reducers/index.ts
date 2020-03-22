import { combineReducers } from 'redux'
import userInfo from './userInfo'
import ui from './ui'
import audio from './audio'

// types
import { State as UserInfoState } from './userInfo'
import { State as uiState } from './ui'
import { State as audioState } from './audio'

export type StateTypes = {
  userInfo: UserInfoState
  ui: uiState
  audio: audioState
}

export default combineReducers({
  userInfo,
  ui,
  audio
})
