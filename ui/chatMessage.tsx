import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { Dispatch, SetStateAction, memo, useContext, useState } from 'react'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import SText, { Sizes } from '@/components/StyledText'
import { Message } from '@/interface'
import dayjs from 'dayjs'
import Animated, { Easing, interpolateColor, runOnJS, useAnimatedStyle, useSharedValue, withDelay, withSequence, withTiming } from 'react-native-reanimated'
import Colors from '@/constants/Colors'
import { WebsocketContext } from '@/context/WebSocketContext'
import * as Haptics from 'expo-haptics';
import { normalizeAnsweredMessage } from '@/service/normalizeAnsweredMessage'
import { FontAwesome } from '@expo/vector-icons';
import { FileView } from './File'


interface IProps {
    newDate: boolean,
    samePrev: boolean,
    sameNext: boolean,
    message: Message,
    handleLongPress: any,
    isChooseMode: boolean,
    setChoosedMessage: any,
    isChoosed: boolean,
    onQuotaClick: any,
    scrolledMessage: any,
    openKeyboard: any
}

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

const ChatMessage = ({ newDate, samePrev, sameNext, message, openKeyboard, handleLongPress, isChooseMode, setChoosedMessage, isChoosed, onQuotaClick, scrolledMessage }: IProps) => {

    const socket = useContext(WebsocketContext)
    const history = socket?.history
    const answeredMessage = socket?.answeredMessage

    const isChanged = message.DateEdit &&  message.DateAdd !== message.DateEdit

    const DateAdd = dayjs(message.DateAdd).format(`HH:mm`)
    const DateEdit = dayjs(message.DateEdit).format(`HH:mm`)

    const initialTouchLocation = useSharedValue<{ x: number, y: number } | null>(null);
    const translateX = useSharedValue(0);
    const isBelt = useSharedValue(false);
    const isChoosedMessage = useSharedValue(false)
    const isMyMessage = history?.user?.roleId === message?.PeopleRoleID

    console.log('render')




    const setMessageAndBelt = () => {
        openKeyboard()
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
        setChoosedMessage([{
            ID: null,
            InProggress: true,
            IsRemove: false,
            MemberName: message.MemberName,
            Msg: message.Msg,
            MsgSourceID: message.ID
        }])

        const isInChoosed = answeredMessage.current.findIndex((mess: any) => mess.MsgSourceID === message.ID)
        if (isInChoosed >= 0) {
            answeredMessage.current?.filter((mess: any) => mess.MsgSourceID !== message.ID)
        } else {
            answeredMessage.current.push({
                ID: null,
                InProggress: true,
                IsRemove: false,
                MemberName: message.MemberName,
                Msg: message.Msg,
                MsgSourceID: message.ID
            })
        }
    }

    const drag = Gesture.Pan()
        .manualActivation(true)
        .onBegin((evt) => {
            initialTouchLocation.value = { x: evt.x, y: evt.y };
        })
        .onTouchesMove((evt, state) => {
            // Sanity checks
            if (!initialTouchLocation.value || !evt.changedTouches.length) {
                state.fail();
                return;
            }

            const xDiff = Math.abs(evt.changedTouches[0].x - initialTouchLocation.value.x);
            const yDiff = Math.abs(evt.changedTouches[0].y - initialTouchLocation.value.y);
            const isHorizontalPanning = xDiff > yDiff;


            if (isHorizontalPanning && !isChooseMode) {
                state.activate();
            } else {
                state.fail();
            }
        })
        .onChange((event) => {
            if (event.translationX > -35 && event.translationX < 0) {
                translateX.value = event.translationX
                isBelt.value = false
            } else if (event.translationX < - 35 && event.translationX > -350) {
                translateX.value = event.translationX * 0.5 - 20
                if (!isBelt.value) {
                    isBelt.value = true
                    runOnJS(setMessageAndBelt)()
                }
            } else {
                return
            }
        })
        .onEnd((event) => {
            translateX.value = withTiming(0, {
                duration: 300,
                easing: Easing.inOut(Easing.quad)
            })
        })


    const containerStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: translateX.value,
                }
            ],
        };
    });

    const scrolledMessageStyle = useAnimatedStyle(() => {
        return {
            opacity: withDelay(300, withSequence(withTiming(scrolledMessage ? 0.7 : 1), withTiming(1, {
                duration: 500
            }))),
            transform: [
                {
                    translateX: withDelay(300, withSequence(withTiming(scrolledMessage ? isMyMessage ? -20 : 20 : 0), withTiming(1, {
                        duration: 500
                    }))),
                },
                // {

                //     scale: withDelay(300, withSequence(withTiming(scrolledMessage ? 0.8 : 1), withTiming(1, {
                //         duration: 500
                //     }))),
                // }
            ],
        }
    })


    const choosedMessageStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(isChoosed ? 1 : 0, {
                duration: 250,
                easing: Easing.bezier(0.69, -0.38, 0.34, 1.3),
            }),
            transform: [
                {

                    scale: withTiming(isChoosed ? 1 : 0, {
                        duration: 250,
                        easing: Easing.bezier(0.69, -0.38, 0.34, 1.3),
                    }),
                }
            ],
        }
    })

    const choosedMessageDotStyle = useAnimatedStyle(() => {
        return {
            marginLeft: withTiming(isChooseMode ? 0 : -40),
            paddingRight: withTiming(isChooseMode ? 0 : 10)

        }
    })

    const choosedMessageContainerStyle = useAnimatedStyle(() => {
        return {
            maxWidth: withTiming(isChooseMode ? (screenWidth * 0.8) : screenWidth * 0.8),
        }
    })

    const longPress = (e: any) => {
        if (isChooseMode) return
        const posX = e.nativeEvent.pageX + 220 > screenWidth ? screenWidth - 220 : e.nativeEvent.pageX
        const posY = (e.nativeEvent.pageY - screenHeight) * -1 + 50
        handleLongPress({ x: posX, y: posY > screenHeight - 400 ? posY - 350 : posY }, {
            ID: null,
            InProggress: true,
            IsRemove: false,
            MemberName: message.MemberName,
            Msg: message.Msg,
            MsgSourceID: message.ID,
            isMyMessage,
            message
        })
        isChoosedMessage.value = true
    }

    const setMessageChoosed = () => {
        if (!isChooseMode) return
        setChoosedMessage((prev: any) => {
            const isInChoosed = prev.findIndex((mess: any) => mess.MsgSourceID === message.ID)
            if (isInChoosed >= 0) {
                return prev?.filter((mess: any) => mess.MsgSourceID !== message.ID)
            } else {
                return [...prev, {
                    ID: null,
                    InProggress: true,
                    IsRemove: false,
                    MemberName: message.MemberName,
                    Msg: message.Msg,
                    MsgSourceID: message.ID
                }]
            }
        })
    }


    const files = message.AttachmentInfo?.split(';')

    return (
        <>
            <GestureDetector gesture={drag} >

                <TouchableOpacity
                    activeOpacity={1}
                    onPress={setMessageChoosed}
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: isMyMessage ? 'flex-end' : 'flex-start', gap: 10, marginBottom: sameNext ? 3 : 15 }}>
                    <Animated.View style={[choosedMessageDotStyle]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, borderRadius: 20, borderWidth: 1, borderColor: Colors.blue, marginBottom: 10 }}>
                            <Animated.View style={[choosedMessageStyle, { width: 16, height: 16, backgroundColor: Colors.blue, borderRadius: 16 }]}></Animated.View>
                        </View>
                    </Animated.View>

                    <View style={{
                        flex: 1,
                        alignSelf: isMyMessage ? 'flex-end' : 'flex-start',
                        alignItems: isMyMessage ? 'flex-end' : 'flex-start',
                    }}>
                        <Animated.View style={[containerStyle, scrolledMessageStyle, choosedMessageContainerStyle]}>
                            <TouchableOpacity
                                onPress={setMessageChoosed}
                                activeOpacity={1}
                                style={[styles.container,
                                {
                                    backgroundColor: isMyMessage ? '#00bedb' : Colors.secondaryDark,
                                    alignItems: isMyMessage ? 'flex-end' : 'flex-start',
                                    borderTopRightRadius: samePrev && isMyMessage ? 10 : 25,
                                    borderBottomRightRadius: sameNext && isMyMessage ? 10 : 25,
                                    borderTopLeftRadius: samePrev && !isMyMessage ? 10 : 25,
                                    borderBottomLeftRadius: sameNext && !isMyMessage ? 10 : 25
                                }]}
                                onLongPress={longPress}
                            >
                                {!samePrev && <SText size={Sizes.normal} textStyle={{ fontSize: 12, color: isMyMessage ? 'white' : '#6C6C6C', }}>{isMyMessage ? 'Вы' : message.MemberName}</SText>}
                                {
                                    message.QuotesInfo && <View style={{ flexDirection: 'column', gap: 5, width: '100%' }}>
                                        {
                                            normalizeAnsweredMessage(message.QuotesInfo).map((str, i) => {
                                                return <TouchableOpacity disabled={isChooseMode} onPress={() => onQuotaClick(str.MsgSourceID)} key={`${str.ID}${str.MsgSourceID}${str.MemberName}`} style={{ flexDirection: 'row', gap: 10, backgroundColor: Colors.dark, paddingHorizontal: 20, paddingVertical: 10, paddingLeft: 10, borderRadius: 10 }}>
                                                    <View style={{ width: 2, backgroundColor: '#CCFF00', alignItems: 'stretch' }}></View>
                                                    <View style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 5, }}>
                                                        <SText size={Sizes.normal} textStyle={{ color: Colors.grey, fontSize: 14, }}>{str.MemberName}</SText>
                                                        <SText size={Sizes.normal} textStyle={{ color: 'white', fontSize: 14, maxWidth: '95%' }} numberOfLines={1}>{str.Msg || 'Вложение'}</SText>
                                                    </View>
                                                </TouchableOpacity>
                                            })
                                        }
                                    </View>
                                }
                                {message.Msg && <SText size={Sizes.normal} textStyle={{ fontSize: 14, color: isMyMessage ? 'black' : '#fff' }}>{message.Msg}</SText>}

                                {message.AttachmentInfo && files.map((file: string, i: number) => file.length ? <FileView key={i} isChooseMode={isChooseMode} file={file} /> : null)}
                                <SText size={Sizes.normal} textStyle={{ fontSize: 10, color: isMyMessage ? 'white' : '#6C6C6C', marginRight:isMyMessage ? -5 : 0, marginLeft: isMyMessage ? 0 : -5 }}>{isChanged ? 'изменено' : ''} {DateEdit ? DateEdit : DateAdd}</SText>
                            </TouchableOpacity>
                        </Animated.View>

                    </View>

                </TouchableOpacity>
            </GestureDetector>
            {
                newDate && <SText textStyle={{ color: Colors.light, marginVertical:30, textAlign:'center' }}>{dayjs(message.DateAdd).format(`DD MMMM`)}</SText>
            }
        </>
    )
}

export default memo(ChatMessage)








const styles = StyleSheet.create({
    messageContainer: {
        backgroundColor: 'red'
    },
    container: {
        padding: 20,
        paddingBottom: 10,
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25,
        backgroundColor: Colors.secondaryDark,
        gap: 10,
        width: 'auto',
    }
})