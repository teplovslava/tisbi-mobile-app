import { ISchedule } from "@/interface"
import dayjs from "dayjs"

export const filterSchedule = (arr:ISchedule[], selectedDate:string) => {
    const newArr = arr?.filter((item:ISchedule) => (item.dayId === dayjs(selectedDate).day() && (item.weekOdd === item.currWeekOdd || item.weekEven !== item.currWeekOdd)))
    return newArr
}