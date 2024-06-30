import { ActivityIndicator, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import SText, { Sizes } from './StyledText'
import { useAppSelector } from '@/store/hooks'
import  {contType, contTypeColors, contTypeEng}  from '@/constants/Details'
import Colors from '@/constants/Colors'
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import { getScheduleLink } from '@/service'
import { LangContext } from '@/context/LanguageContext'


const DetailsItem = () => {
    const {details} = useAppSelector((state) => state.details)
    const {role,user,token} = useAppSelector((state) => state.user)

    const currLang = useContext(LangContext)

    const lessonTypes = currLang?.lang === 'Русский' ? contType  : contTypeEng

    const [loading, setLoading] = useState<boolean>(false)
    if(!details) return <SText>Oooops... Something went wrong!</SText>

    const hash = user 
        ? user?.studentHash 
            ? user?.studentHash 
            : user?.staffHash
        : ''

        

    function getLessonLink(id:string){
        setLoading(true)
        getScheduleLink(hash, id, token)
        .then(res => {
            if (res.url) {
                Linking.openURL(res.url)
            }
        })
        .catch((e) => alert('Занятие еще не создано преподавателем'))
        .finally(() => setLoading(false))
    }

  return (
    <View style={{flex:1, alignItems:'center'}}>
        <View style={{backgroundColor:contTypeColors[details.contactTypeId], paddingVertical:10,paddingHorizontal:20, marginBottom:20, borderRadius:20}}> 
            <SText size={Sizes.normal} textStyle={{color:Colors.dark}}>{lessonTypes[details.contactTypeId]}</SText>
        </View>
        <SText size={Sizes.bold} textStyle={{fontSize:24, textAlign:'center', marginBottom:20, color:Colors.light}}>{details.sectName}</SText>
        <SText size={Sizes.normal} textStyle={{marginBottom:20, color:Colors.darkGrey}}>{details.placeName}</SText>
        <View style={{gap:10,width:'100%'}}>
        <View style={{backgroundColor:Colors.black, padding:20, width:'100%', flexDirection:'row', alignItems:'center', gap:20, borderRadius:25}}>
            <AntDesign name="clockcircleo" size={24} color={Colors.light} />
            <View style={{flexDirection:'row', alignItems:'center'}}>
                <SText size={Sizes.normal} textStyle={{fontSize:16, color:Colors.light}}>{details.start.split('T')[1].slice(0, 5)}</SText>
                <SText size={Sizes.normal} textStyle={{fontSize:16, color:Colors.light}}>-</SText>
                <SText size={Sizes.normal} textStyle={{fontSize:16, color:Colors.light}}>{details.finish.split('T')[1].slice(0, 5)}</SText>
            </View>
        </View>
        <View style={{backgroundColor:Colors.black, padding:20, width:'100%', flexDirection:'row', alignItems:'center', gap:20, borderRadius:25}}>
        {role === 'Преподаватель' ? <FontAwesome name="group" size={24} color={Colors.light} /> : <FontAwesome name="user-o" size={24} color={Colors.light} />}
            <View style={{flexDirection:'row', alignItems:'center'}}>
                <SText numberOfLines={1} size={Sizes.normal} textStyle={{fontSize:16, color:Colors.light}}>{role === 'Преподаватель' ? details.threadName: details.staffName}</SText>
            </View>
        </View>
        {details.extId &&  <View style={{backgroundColor:Colors.black, padding:20, width:'100%', flexDirection:'row', alignItems:'center', gap:20, borderRadius:25}}>
        <Ionicons name="videocam-outline" size={24} color={Colors.light} />
            <View style={{flexDirection:'row', alignItems:'center',flex:1}}>
                <SText numberOfLines={1} size={Sizes.normal} textStyle={{fontSize:16, color:Colors.light}}>{details.lessonTypeName}</SText>
                <TouchableOpacity disabled={loading} onPress={()=> getLessonLink(details.extId)} activeOpacity={0.7} style={{paddingVertical:loading ? 7 : 10, paddingHorizontal:20, borderRadius:25, marginLeft:'auto', backgroundColor:Colors.dark}}>
                {loading ? <ActivityIndicator  size={'small'}/> :<SText size={Sizes.normal} textStyle={{color:Colors.light}}>Enter</SText>}
                </TouchableOpacity>
            </View>
        </View>}
        <View style={{backgroundColor:Colors.black, padding:20, width:'100%', flexDirection:'row', alignItems:'center', gap:20, borderRadius:25}}>
        <SimpleLineIcons name="location-pin" size={24} color={Colors.light} />
            <View style={{flexDirection:'row', alignItems:'center'}}>
                <SText numberOfLines={1} size={Sizes.normal} textStyle={{fontSize:16, color:Colors.light}}>{details.name}, {details.code}</SText>
            </View>
        </View>
        </View>
    </View>
  )
}

export default DetailsItem

const styles = StyleSheet.create({})