import { StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Colors from '@/constants/Colors'
import SText, { Sizes } from '@/components/StyledText'
import { router } from 'expo-router'


interface IProps {
    text: string,
    count?: string
}

const ChatGroup = ({ text, count }: IProps) => {

    return (
        <TouchableOpacity onPress={() => router.push({ pathname: "/(tabs)/(chat)/chatsList", params: { name: text } })} style={styles.container}>
            <View style={{ flexGrow: 0, flexShrink: 0, width: '80%' }}>
                <SText textStyle={{ fontSize: 18, color: Colors.white }} size={Sizes.bold}>{text || 'Без названия'}</SText>
            </View>
            {!!count && <View style={styles.notific}>
                <SText textStyle={{ fontSize: 12, color: Colors.dark }} size={Sizes.normal}>{count}</SText>
            </View>}
        </TouchableOpacity>
    )
}

export default ChatGroup

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.secondaryDark,
        padding: 20,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        minHeight: 100,
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
    }
})