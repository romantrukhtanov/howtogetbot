export enum GracefulStopEvent {
  SIGINT = 'SIGINT',
  SIGTERM = 'SIGTERM',
}

export enum Action {
  ADD_PLACE = 'ADD_PLACE',
  FIND_PLACE = 'FIND_PLACE',
  DEBUG_FILES = 'DEBUG_FILES',
}

export enum Command {
  MENU = 'menu',
  START = 'start',
  FIND = 'find',
  ADD = 'add',
  DEBUG = 'debug',
}

export enum TgMediaType {
  PHOTO = 'photo',
  VIDEO = 'video',
}
