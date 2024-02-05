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

export interface IOnlineLesson{
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