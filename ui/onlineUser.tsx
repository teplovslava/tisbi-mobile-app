import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SText, { Sizes } from '@/components/StyledText'
import Colors from '@/constants/Colors'
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'

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
            maxHeight: withTiming(showed ? 100 : 0),
            paddingVertical: withTiming(showed ? 15 : 0),
            marginBottom: withTiming(showed ? 10 : 0),

        };
    });

    return (
        <Animated.View style={[styles.container, animatedStyles]}>
            <View style={{ backgroundColor: online ? 'green' : 'red', width: 10, height: 10, borderRadius: 10 }} />
            <View style={styles.info}>
                <SText size={Sizes.bold} textStyle={styles.name}>{name}</SText>
                <SText size={Sizes.normal} textStyle={styles.role}>{role}</SText>
            </View>
        </Animated.View>
    )
}

export default OnlineUser

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        gap: 20,
        backgroundColor: '#303030',
        borderRadius: 20,
        paddingHorizontal:15
    },
    info: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 5
    },
    name: {
        fontSize: 14,
        color: 'black'
    },
    role: {
        fontSize: 14,
        color: 'black'
    }
})