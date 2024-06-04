import dayjs from "dayjs";

export function firstLustDays(fromDate:Date) {
    let wDate = fromDate
    let dDay = wDate.getDay() > 0 ? wDate.getDay() : 7;
    let first = wDate.getDate() - dDay + 1;
    let firstDayWeek = new Date(wDate.setDate(first));
    let lastDayWeek = new Date(wDate.setDate(firstDayWeek.getDate()+6));

    return [dayjs(firstDayWeek).format('YYYY-MM-DD'), dayjs(lastDayWeek).format('YYYY-MM-DD')]
}

