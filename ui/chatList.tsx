import { StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React, { useContext } from 'react'
import Colors from '@/constants/Colors'
import SText, { Sizes } from '@/components/StyledText'
import { router } from 'expo-router'
import { WebsocketContext } from '@/context/WebSocketContext'
import { IChat } from '@/interface'


interface IProps {
    info:IChat
    text: string,
    count?: number
}

const ChatList = ({info, text, count }: IProps) => {
    const socket = useContext(WebsocketContext)
    let currentChat = socket?.currentChat 
    
    return (
        <TouchableOpacity
            onPress={() => {
                currentChat.current = String(info.chat.ID);
                router.push({ pathname: "/(tabs)/(chat)/chatWindow", params: { info: JSON.stringify(info) } });
            }}
            style={styles.container} >
            <View style={styles.header}>
                <View style={{ flexGrow: 0, flexShrink: 0, width: '80%' }}>
                    <SText textStyle={{ fontSize: 18, color: Colors.white }} size={Sizes.bold}>{text}</SText>
                </View>
                {!!count && <View style={styles.notific}>
                    <SText textStyle={{ fontSize: 12, color: Colors.dark }} size={Sizes.normal}>{String(count)}</SText>
                </View>}
            </View>
        </TouchableOpacity>
    )
}

export default ChatList

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.secondaryDark,
        padding: 20,
        borderRadius: 20,
        flexDirection: 'column',
    },
    notific: {
        backgroundColor: '#CCFF00',
        padding: 5,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 15,
        minWidth: 22
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between'

    }
})