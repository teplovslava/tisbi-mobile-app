import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons'
import SText, { Sizes } from '@/components/StyledText'
import Colors from '@/constants/Colors'
import Animated, { BounceIn, FadeInDown, FadeInUp, FadeOutDown, FadeOutUp, FlipInXDown } from 'react-native-reanimated'

interface IProps{
    scrollToMessage: (id:string) => void,
    message:any,
    unfixMessage:(message:any) => void
}

const FixedMessage = ({scrollToMessage, message, unfixMessage}:IProps) => {
  return <Animated.View style={[{backgroundColor: Colors.lightBlack, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', overflow: 'hidden' }]}>
    <TouchableOpacity onPress={() => scrollToMessage(message.ID)} style={{ borderTopColor: 'black', borderTopWidth: 1, padding: 15, paddingVertical: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <AntDesign style={{ flexGrow: 0, flexShrink: 0 }} name="pushpino" size={20} color={Colors.light} />
        <View style={{ flex: 1 }}>
            <SText textStyle={{ color: Colors.lightGrey, fontSize: 14, marginBottom: 5 }}>Закрепленное сообщение</SText>
            {
                message && <Animated.View exiting={FadeOutDown.duration(150)}>
                    <SText size={Sizes.normal} numberOfLines={1} textStyle={{ color: Colors.light, fontSize: 16 }}>{message?.Msg}</SText>
                </Animated.View>
            }
                        {
                !message && <SText size={Sizes.normal} numberOfLines={1} textStyle={{ color: Colors.light, fontSize: 16 }}></SText>
            }
        </View>
        <TouchableOpacity onPress={() => unfixMessage(message)} style={{ flexGrow: 0, flexShrink: 0 }}>
            <AntDesign name="close" size={20} color={Colors.lightGrey} />
        </TouchableOpacity>
    </TouchableOpacity>
  </Animated.View>
    
  
}

export default FixedMessage

const styles = StyleSheet.create({})