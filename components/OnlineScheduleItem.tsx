import { ActivityIndicator, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import SText, { Sizes } from './StyledText'
import Colors from '@/constants/Colors'
import { contType,contTypeEng, contTypeColors } from '@/constants/Details'
import { IOnlineLesson } from '@/interface'
import dayjs from 'dayjs'
import { getOnlineScheduleLink } from '@/service'
import { useAppSelector } from '@/store/hooks'
import { LangContext } from '@/context/LanguageContext'

interface IProps{
    lesson:IOnlineLesson,
}




const OnlineScheduleItem = ({lesson}:IProps) => {

    const [loading, setLoading] = useState<boolean>()
    const { token } = useAppSelector((store) => store.user)
    const currLang = useContext(LangContext)

    const lessonTypes = currLang?.lang === 'Русский' ? contType  : contTypeEng

    function getLink(hash:string){
        setLoading(true)
        getOnlineScheduleLink(hash, token)
            .then((res) =>{
                Linking.openURL(res.url)
            })
            .catch((e) => alert(e))
            .finally(() => setLoading(false))
    }


  return (
    <View style={{ backgroundColor: '#161616', padding: 20, borderRadius: 30, gap:10}}>
    <View style={{ flexDirection: 'row', flex:1 }}>
        <View style={{ flexShrink: 1, flex:1}}>
            <SText size={Sizes.bold} textStyle={{ color: Colors.white, fontSize: 16, marginBottom: 10 }}>{lesson.title ? lesson.title : 'Без названия'}</SText>
        </View>
        <View>
            <SText size={Sizes.bold} textStyle={{ color: Colors.white, fontSize: 16 }}>{dayjs(lesson.beginDate).format('HH:mm')}</SText>
            <SText size={Sizes.normal} textStyle={{ color: Colors.white, fontSize: 14 }}>{dayjs(lesson.endDate).format('HH:mm')}</SText>
        </View>
    </View>
    <View>
        < View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <SText size={Sizes.normal} textStyle={{ color: Colors.white, fontSize: 14 }}>{String(lesson.shedTypeName)}</SText>
            <View style={{ backgroundColor: contTypeColors[lesson.typeId], paddingVertical: 5, paddingHorizontal: 10, borderRadius: 15 }}>
                <SText size={Sizes.normal} textStyle={{ color: Colors.dark }}>{lessonTypes[lesson.typeId]}</SText>
            </View>

        </View >
    </View>
    <View>
        <TouchableOpacity onPress={() => getLink(lesson.hash)} style={{backgroundColor: Colors.dark, marginTop:10, padding:loading ? 12 : 15, borderRadius:18}}>
            {loading ? <ActivityIndicator size={'small'}/> : <SText textStyle={{textAlign:'center', color:Colors.white}} size={Sizes.normal}>Enter</SText>}
        </TouchableOpacity>
    </View>
</View>
  )
}

export default OnlineScheduleItem

const styles = StyleSheet.create({})