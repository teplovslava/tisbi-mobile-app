import { StyleSheet, Text, View } from 'react-native'
import React, { memo } from 'react'
import SText, { Sizes } from '@/components/StyledText'
import Colors from '@/constants/Colors'

interface IProps {
    online: boolean,
    name: string,
    role: string
}

const OnlineUserInner = ({ online, name, role }: IProps) => {
    return (
        <>
            <View style={{ backgroundColor: online ? Colors.green : Colors.red, width: 10, height: 10, borderRadius: 10 }} />
            <View style={styles.info}>
                <SText size={Sizes.bold} textStyle={styles.name}>{name}</SText>
                <SText size={Sizes.normal} textStyle={styles.role}>{role}</SText>
            </View></>
    )
}

export default memo(OnlineUserInner)

const styles = StyleSheet.create({

    info: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 5
    },
    name: {
        fontSize: 14,
        color: Colors.light
    },
    role: {
        fontSize: 14,
        color: Colors.lightGrey
    }
})