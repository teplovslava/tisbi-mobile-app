import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext } from 'react'
import { WebsocketContext } from '@/context/WebSocketContext'
import { Message } from '@/interface'
import Colors from '@/constants/Colors'
import SText, { Sizes } from '@/components/StyledText'
import { LinearGradient } from 'expo-linear-gradient'

interface IProps {
    message: Message,
    isMyMessage: boolean,
    sameNext: boolean,
    samePrev: boolean

}

const DeletedMessage = ({ message, samePrev, sameNext, isMyMessage }: IProps) => {

    return <LinearGradient
        colors={isMyMessage ? [Colors.violet, Colors.main, Colors.main] : ['#19181e', Colors.lightBlack]}
        end={{ x: 1, y: 1 }}
        style={[styles.containerInner, {
            marginLeft:isMyMessage ? 'auto' : 0,
            alignItems: isMyMessage ? 'flex-end' : 'flex-start',
            borderTopRightRadius: samePrev && isMyMessage ? 10 : 25,
            borderBottomRightRadius: sameNext && isMyMessage ? 10 : 25,
            borderTopLeftRadius: samePrev && !isMyMessage ? 10 : 25,
            borderBottomLeftRadius: sameNext && !isMyMessage ? 10 : 25
        }]}>
        <SText size={Sizes.normal} textStyle={{ fontSize: 12, color: isMyMessage ? 'white' : '#6C6C6C', }}>{isMyMessage ? 'Вы' : message.MemberName}</SText>
        <SText size={Sizes.light} textStyle={{ fontSize: 14, color: '#fff', marginBottom:3 }}>Сообщение удалено</SText>
    </LinearGradient>

}

export default DeletedMessage

const styles = StyleSheet.create({
    containerInner: {
        padding: 20,
        paddingBottom: 10,
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25,
        backgroundColor: Colors.secondaryDark,
        gap: 7,
        maxWidth: '80%',
        width: 'auto',
        marginBottom:3,
        opacity:0.5
    },
})