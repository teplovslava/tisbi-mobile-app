import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext } from 'react'
import SText, { Sizes } from '@/components/StyledText'
import { AntDesign } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import Animated from 'react-native-reanimated';

const AnsweredMessage = ({ choosedMessage, clearAnsweredMessages }: any) => {


    // const isMyMessage = history?.user.userName === choosedMessage.MemberName
    const oneMessage = choosedMessage.length === 1



    return <Animated.View style={[{ paddingHorizontal: 15, paddingVertical: 10,backgroundColor:Colors.lightBlack, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', overflow: 'hidden' }]}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ width: 2, backgroundColor: '#CCFF00', alignItems: 'stretch' }}></View>
            <View style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 5, width: '80%' }}>
                <SText size={Sizes.normal} textStyle={{ color: Colors.lightGrey, fontSize: 14, }}>{
                    oneMessage
                        ? choosedMessage[0]?.MemberName
                        : Boolean(choosedMessage?.length)
                            ? `${choosedMessage?.length} сообщений`
                            : ''}
                </SText>
                <SText size={Sizes.normal} textStyle={{ color: Colors.light, fontSize: 14 }} numberOfLines={1}>{oneMessage ? choosedMessage[0]?.Msg  : choosedMessage[0]?.Msg}</SText>
            </View>
        </View>
        <TouchableOpacity onPress={clearAnsweredMessages}>
            <AntDesign name="closecircleo" size={20} color={Colors.light} />
        </TouchableOpacity>
    </Animated.View>


}

export default AnsweredMessage



const styles = StyleSheet.create({})