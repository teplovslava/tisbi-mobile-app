import Colors from '@/constants/Colors';
import React, { memo, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp, FlipInXUp, FlipOutXDown, SlideInDown, SlideOutUp } from 'react-native-reanimated';

const ChatActivityInfo = ({ length, name, isReady, loading }: { length: number, name: string, isReady: any, loading: boolean }) => {

    return (
        <View style={{
            flexDirection: "column",
            width:'100%'
        }}>
            {length && isReady && loading && 
            <Animated.Text
            entering={FadeInUp.delay(300)}
            exiting={FadeOutUp.delay(300)}
            numberOfLines={1}
            style={{
                fontFamily: 'GilroyRegular',
                fontSize: 12,
                color: Colors.lightGrey,
                width: '100%',
                textAlign: 'center',
            }}>Обновление...</Animated.Text>}

            {length && isReady && !loading && <Animated.Text
                entering={FadeInUp.delay(300)}
                exiting={FadeOutUp.delay(300)}
                numberOfLines={1}
                style={{
                    fontFamily: 'GilroyRegular',
                    fontSize: 12,
                    color: Colors.lightGrey,
                    width: '100%',
                    textAlign: 'center',
                }}>{name}</Animated.Text>}

            {length && !isReady && <Animated.Text
                entering={FadeInUp.delay(300)}
                exiting={FadeOutUp.delay(300)}
                numberOfLines={1}
                style={{
                    fontFamily: 'GilroyRegular',
                    fontSize: 12,
                    color: Colors.lightGrey,
                    width: '100%',
                    textAlign: 'center',
                }}>Подключение...</Animated.Text>}
        </View>
    );
};

export default memo(ChatActivityInfo);