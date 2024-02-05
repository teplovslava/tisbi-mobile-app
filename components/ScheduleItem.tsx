import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import SText, { Sizes } from './StyledText'
import Colors from '@/constants/Colors'
import { ISchedule } from '@/interface'
import Animated, { FadeIn, FadeInUp, useAnimatedStyle, withTiming } from 'react-native-reanimated'

const ScheduleItem = ({handler, item, index}:{item:ISchedule, index:number, handler:(item: ISchedule) => void}) => {
  return (
    <Animated.View entering={FadeInUp.delay(index*200)} style={[{opacity:1}]}>
    <TouchableOpacity onPress={() => handler(item)} activeOpacity={0.7} style={[{ flexDirection: 'row', borderRadius: 35, padding: 25,backgroundColor:'#161616', justifyContent: 'space-between', gap: 20, flexGrow: 1}]}>
    <View style={{flexShrink:1}}>
      <SText textStyle={{ fontSize: 18, marginBottom: 20, color:Colors.white }} numberOfLines={2} size={Sizes.bold}>
        {item.sectName}
      </SText>
      <SText textStyle={{color:Colors.white}} size={Sizes.normal}>{item.name}, {item.code}</SText>
    </View>
    <View style={{ justifyContent: 'space-between', }}>
      <View style={{ alignItems: 'flex-end', justifyContent: 'flex-start', gap: 5 }}>
        <SText textStyle={{ fontSize: 16,color:Colors.white }} size={Sizes.bold}>{item.start.split('T')[1].slice(0, 5)}</SText>
        <SText textStyle={{ fontSize: 14, color: Colors.grey }} size={Sizes.normal}>{item.finish.split('T')[1].slice(0, 5)}</SText>
      </View>
      {item.extId && <View style={{height:7,width:7, borderRadius:10,backgroundColor:'#39ff14',marginLeft:'auto'}}></View>}
    </View>
  </TouchableOpacity>
  </Animated.View>
  )
}

export default ScheduleItem

const styles = StyleSheet.create({})