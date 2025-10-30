import { io, Socket } from "socket.io-client";
import { apiUrl } from "./api";

export interface ServerToClientEvents {
  noArg: () => void;
}

export interface ClientToServerEvents {
  userData: (userData: UserData) => void;
  voiceChannelUpdate: (voiceChannel: VoiceChannel) => void;
  update: (details: Track) => void;
}


export interface UserData {
  "id": string,
  "username": string,
  "globalName": string,
  "avatar": string,
  "defaultAvatarURL": string,
  "avatarURL": string,
  "displayAvatarURL": string
}

export interface User {
  "id": string,
  "username": string,
  "globalName": string,
  "avatar": string,
  "bot": boolean
}

export interface VoiceState {
  "selfDeaf": boolean,
  "selfMute": boolean,
  "selfVideo": boolean,
  "serverDeaf": boolean,
  "streaming": boolean
}

export interface Guild {
  "id": string,
  "name": string,
  "icon": string
}

export interface Member {
  "user": User,
  "voice": VoiceState
}

export interface VoiceChannel {
  "name": string,
  "members": Member[],
  "guild": Guild
}

export interface Image {
  url: string
}

export interface Track {
  id?: string
  name?: string
  title?: string
  artists?: Artist[]
  lengthMs: number
  images?: Image[]
  type: string
  requester: Requester
  playbackDuration: number
  queueFinished: boolean
  playerState: string
  queueIndex: number
}

export interface Artist {
  external_urls: ExternalUrls
  href: string
  id: string
  name: string
  type: string
  uri: string
}

export interface ExternalUrls {
  spotify: string
}

export interface Requester {
  username: string
  avatar: string
  id: string
}
