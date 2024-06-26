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
import { WebsocketContext } from '@/context/WebSocketContext'
import { router } from 'expo-router'

interface IProps{
    lesson:IOnlineLesson,
}




const OnlineScheduleItem = ({lesson}:IProps) => {
    const socket = useContext(WebsocketContext)
    let currentChat = socket?.currentChat 
    const [loading, setLoading] = useState<boolean>()
    const { token } = useAppSelector((store) => store.user)
    const currLang = useContext(LangContext)

    const lessonTypes = currLang?.lang === 'Русский' ? contType  : contTypeEng

    function getLink(hash:string){
        setLoading(true)
        getOnlineScheduleLink(hash, token)
            .then((res) =>{
                if(res.url){
                    Linking.openURL(res.url)
                }else if (res.chatId){
                    currentChat.current = String(res.chatId);
                    router.push({ pathname: "/(tabs)/(chat)/chatWindow", params: { id: JSON.stringify(res.chatId) } });
                }
                
            })
            .catch((e) => alert(e))
            .finally(() => setLoading(false))
    }


  return (
    <View style={{ backgroundColor: Colors.dark, padding: 20, borderRadius: 30, gap:1}}>
    <View style={{ flexDirection: 'row', flex:1, gap:10 }}>
        <View style={{ flexShrink: 1, flex:1}}>
            <SText size={Sizes.bold} textStyle={{ color: Colors.light, fontSize: 16, marginBottom: 10 }}>{lesson.title ? lesson.title : 'Без названия'}</SText>
        </View>
        <View>
            <SText size={Sizes.bold} textStyle={{ color: Colors.light, fontSize: 16 }}>{dayjs(lesson.beginDate).format('HH:mm')}</SText>
            <SText size={Sizes.normal} textStyle={{ color: Colors.lightGrey, fontSize: 14 }}>{dayjs(lesson.endDate).format('HH:mm')}</SText>
        </View>
    </View>
    <View>
        < View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <SText size={Sizes.normal} textStyle={{ color: Colors.darkGrey, fontSize: 14 }}>{String(lesson.shedTypeName)}</SText>
            <View style={{ backgroundColor: contTypeColors[lesson.typeId], paddingVertical: 5, paddingHorizontal: 10, borderRadius: 15 }}>
                <SText size={Sizes.normal} textStyle={{ color: Colors.dark }}>{lessonTypes[lesson.typeId]}</SText>
            </View>

        </View >
    </View>
    <View>
        <TouchableOpacity onPress={() => getLink(lesson.hash)} style={{backgroundColor: Colors.black, marginTop:10, padding:loading ? 12 : 15, borderRadius:18}}>
            {loading ? <ActivityIndicator size={'small'}/> : <SText textStyle={{textAlign:'center', color:Colors.light}} size={Sizes.normal}>Enter</SText>}
        </TouchableOpacity>
    </View>
</View>
  )
}

export default OnlineScheduleItem

const styles = StyleSheet.create({})