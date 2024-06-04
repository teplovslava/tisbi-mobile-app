import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext } from 'react'
import { WebsocketContext } from '@/context/WebSocketContext'
import { Message } from '@/interface'
import Colors from '@/constants/Colors'
import SText, { Sizes } from '@/components/StyledText'

interface IProps {
    message: Message

}

const DeletedMessage = ({ message }: IProps) => {
    const socket = useContext(WebsocketContext)
    const history = socket?.history
    const isMyMessage = history?.user?.roleId === message?.PeopleRoleID
    return (<View style={{
        flex: 1,
        alignSelf: isMyMessage ? 'flex-end' : 'flex-start',
        alignItems: isMyMessage ? 'flex-end' : 'flex-start',
    }}>
        <View
            style={[styles.container, { opacity: 0.7, backgroundColor: isMyMessage ? '#00bedb' : Colors.secondaryDark, alignItems: isMyMessage ? 'flex-end' : 'flex-start', }]}
        >
            <SText size={Sizes.normal} textStyle={{ fontSize: 12, color: isMyMessage ? 'white' : '#6C6C6C', }}>{isMyMessage ? 'Вы' : message.MemberName}</SText>
            <SText size={Sizes.light} textStyle={{ fontSize: 14, color: isMyMessage ? 'black' : '#fff' }}>Сообщение удалено</SText>
            </View>
    </View>
    )
}

export default DeletedMessage

const styles = StyleSheet.create({
    container: {
        maxWidth: '80%',
        padding: 20,
        borderRadius: 25,
        backgroundColor: Colors.secondaryDark,
        gap: 10,
        width: 'auto',
        marginBottom: 7
    }
})