import SText, { Sizes } from '@/components/StyledText';
import Colors from '@/constants/Colors';
import React, { memo, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp, FlipInXUp, FlipOutXDown, SlideInDown, SlideOutUp } from 'react-native-reanimated';

const ChatActivityInfo = ({ length, name, isReady, loading }: { length: number, name: string, isReady: any, loading: boolean }) => {

    return (
        <View style={{
            flexDirection: "column",
            width: '100%'
        }}>
            {length && isReady && loading &&
                <Animated.View
                    entering={FadeInUp.delay(300)}
                    exiting={FadeOutUp.delay(300)}
                ><SText numberOfLines={1} size={Sizes.normal} textStyle={{
                    fontSize: 12,
                    color: Colors.lightGrey,
                    width: '100%',
                    textAlign: 'center',
                }}>Обновление...</SText></Animated.View>}

            {length && isReady && !loading && <Animated.View
                entering={FadeInUp.delay(300)}
                exiting={FadeOutUp.delay(300)}
            ><SText numberOfLines={1} size={Sizes.normal} textStyle={{
                fontSize: 12,
                color: Colors.lightGrey,
                width: '100%',
                textAlign: 'center',
            }}>{name}</SText></Animated.View>}

            {length && !isReady && <Animated.View
                entering={FadeInUp.delay(300)}
                exiting={FadeOutUp.delay(300)}
            ><SText numberOfLines={1} size={Sizes.normal} textStyle={{
                fontSize: 12,
                color: Colors.lightGrey,
                width: '100%',
                textAlign: 'center',
            }}>Подключение...</SText></Animated.View>}
        </View>
    );
};

export default memo(ChatActivityInfo);