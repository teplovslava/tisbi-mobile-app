import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext } from 'react'
import dayjs from 'dayjs'
import SText, { Sizes } from './StyledText'
import Colors from '@/constants/Colors'
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setDate } from '@/store/dateSlice'
import { LangContext } from '@/context/LanguageContext'


const SmallCalendar = () => {

    const currentDate = useAppSelector((state) => state.date.date)
    const dispatch = useAppDispatch()
    const currLang = useContext(LangContext)


    let days = []
    let today = dayjs().format('YYYY-MM-DD')

    for (let i = 0; i < 7; i++) {
        days.push(today)
        today = dayjs(today).add(1, 'day').format('YYYY-MM-DD')
    }

    let daysName = currLang?.lang === 'Русский' 
        ? ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'] 
        : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

    return (
        <View style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
            {days.map((day, i) => (
                <TouchableOpacity
                key={day}
                    onPress={() => dispatch(setDate(day))}
                    activeOpacity={0.7}
                    style={{ justifyContent: 'center', alignItems: 'center', gap: 5 }}>
                    <SText size={Sizes.normal} textStyle={{ color: Colors.grey, fontSize: 18 }}>{daysName[dayjs(day).day()]}</SText>
                    <View style={{ backgroundColor: day === currentDate ? '#6b99c3' : '#161616', padding: 12, borderRadius: 16 }}>
                        <SText size={Sizes.normal} textStyle={{ color: Colors.white, fontSize: 16 }}>{dayjs(day).format('DD')}</SText>
                    </View>
                </TouchableOpacity>
            )
            )}
        </View>
    )
}

export default SmallCalendar

const styles = StyleSheet.create({})