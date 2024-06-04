import { IOnlineLesson } from "@/interface";
import dayjs from "dayjs";

export function lessonsNormalize(lessonsList:IOnlineLesson[]){
    let result:{[key:string]: [] | IOnlineLesson[]}  = {}

    lessonsList.forEach((lesson) => {
        const formatedDate = dayjs(lesson.beginDate).format('YYYY-MM-DD')
        if(result[formatedDate]){
            result[formatedDate] = [...result[formatedDate] ,lesson]
        }else{
            result[formatedDate] = [lesson]
        }
    })

    return result
}