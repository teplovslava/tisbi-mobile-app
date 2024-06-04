import { Dispatch, SetStateAction } from "react"

type Dispatcher<S> = Dispatch<SetStateAction<S>>;

export interface ISchedule {
  buildingId: number
  code: string
  contactTypeId: number
  countWeek: number
  currWeekOdd: number
  dayId: number
  extId: any
  extStaffId: any
  extStaffName: any
  finish: string
  hoursQuant: number
  id: number
  lessonDate: any
  lessonTypeId: any
  lessonTypeName: any
  name: string
  pairId: number
  placeName: string
  placeTypeId: number
  schedRootId: number
  sectId: number
  sectName: string
  shedFinish: string
  shedStart: string
  staffId: number
  staffName: string
  start: string
  threadLine: string
  threadName: string
  weekEven: number
  weekOdd: number
}

export interface IOnlineLesson {
  beginDate: string
  eduTypeId: number
  eduYear: number
  endDate: string
  hash: string
  id: number
  isConfirm: any
  objectId: number
  placeId: number
  shedRecExtId: any
  shedTypeId: number
  shedTypeName: string
  statusId: number
  title: string
  typeId: number
  typeName: string
  typeShortName: string
  userStatusId: number
}

export interface IMessage {
  AttachmentInfo: any
  ChatID: number
  DateAdd: string
  DateEdit: string
  ID: number
  IsFixed: number
  MemberName: string
  Msg: string
  PeopleRoleID: number
  QuotesInfo: any
  RowNum: string
  SessionID: number
  Status: number
}

export interface IWebSocketContext {
  ws: WebSocket | null,
  isReady: boolean,
  chatList:IChatList | null,
  history:IHistory | null,
  fixed:any,
  setHistory: Dispatcher<IHistory | null>,
  setChatList: Dispatcher<IChatList | null>,
  currentChat: any,
  setFixed:any,
  prevChat: any,
  currentMessage: any,
  answeredMessage:any,
}


export interface IChatList {
  chats: IChat[]
}

export interface IChat {
    activeUsers: ActiveUsers;
    chat: Chat;
}

export interface Chat {
  ChatDescr: string;
  ChatLastMsgID?: any;
  ChatLastMsgTimestamp?: any;
  ChatName: string;
  ChatStatusID: number;
  ChatStatusName: string;
  DateEnd?: any;
  DateStart: string;
  GroupID: number;
  GroupName: string;
  ID: number;
  MemberCnt: number;
  MemberLastReadID?: any;
  MsgAdded?: any;
  MsgAuthor?: any;
  MsgCnt: number;
  ParentID: number;
  UnreadCnt: number;
}

export interface ActiveUsers {
  [key: string]: {
    roleId: number;
    userName: string;
  }
}

export interface IUserList {
  type: string;
  users: User[];
}

export interface User {
  roleId: number;
  userName: string;
}


export interface IGroupsList {
  groups: Group[]
}

export interface Group {
  ID: number;
  IsActual: number;
  IsDefaultGroup: number;
  Name: string;
  PeopleRoleID: number;
  SessionID: number;

}

export interface IHistory {
  draft: any
  fixed: any
  lastRead: LastRead
  messages: Message[]
  newMessages: any[]
  type: string
  user: User
}

export interface LastRead {
  LastReadMsgID: number
  RoleTypeID: number
}

export interface Message {
  AttachmentInfo: any
  ChatID: number
  DateAdd: string
  DateEdit: string
  ID: number
  IsFixed: number
  MemberName: string
  Msg: string
  PeopleRoleID: number
  QuotesInfo: any
  RowNum: string
  SessionID: number
  Status: number
}

export interface IMember {
  members: Member[]
  type: string
  user: User
}

export interface Member {
  ChatRoleTypeID: number
  ChatRoleTypeName: string
  ID: number
  MemberInfo: string
  MemberName: string
  PeopleRoleID: number
  Status: number
  StatusName: string
  SubChatID: any
}


export interface IAnsweredMessage {
  ID: any
  InProggress: boolean
  IsRemove: boolean
  MemberName: string
  Msg: string
  MsgSourceID: string
}
