import { StyleSheet, Text, View } from 'react-native'
import React, { memo } from 'react'
import SText, { Sizes } from '@/components/StyledText'
import Colors from '@/constants/Colors'
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'
import OnlineUserInner from './onlineUserInner'

interface IProps {
    showed: boolean,
    online: boolean,
    name: string,
    role: string
}

const OnlineUser = ({ showed, online, name, role }: IProps) => {

    const animatedStyles = useAnimatedStyle(() => {
        return {
            opacity: withTiming(showed ? 1 : 0),
            height: withTiming(showed ? 65 : 0),
            paddingVertical: withTiming(showed ? 15 : 0),
            marginBottom: withTiming(showed ? 10 : 0),

        };
    });

    return (
        <Animated.View style={[styles.container, animatedStyles]}>
            <OnlineUserInner online={online} name={name} role={role}/>
        </Animated.View>
    )
}

export default memo(OnlineUser)

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        gap: 20,
        backgroundColor: '#090909',
        borderRadius: 20,
        paddingHorizontal:15,
        overflow:'hidden'
    }
})