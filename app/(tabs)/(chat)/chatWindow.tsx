import { Alert, FlatList, KeyboardAvoidingView, Keyboard, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { WebsocketContext } from '@/context/WebSocketContext'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import SText, { Sizes } from '@/components/StyledText'
import Colors from '@/constants/Colors'
import { AntDesign, Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler'
import ChatInput from '@/ui/chatInput'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ChatMessage from '@/ui/chatMessage'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { BlurView } from 'expo-blur'
import Loader from '@/components/Loader'
import * as Haptics from 'expo-haptics';
import AnsweredMessage from '@/ui/answeredMessage'
import DeletedMessage from '@/ui/deletedMessage'
import { IAnsweredMessage } from '@/interface'
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';


const chatWindow = () => {
    const insets = useSafeAreaInsets()

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [loading, setLoading] = useState(true)
    const actionListPosition = useSharedValue({ state: false, x: 0, y: 0 })
    const [isChooseMode, setChooseMode] = useState(false)
    const [choosedMessage, setChoosedMessage] = useState([])
    const [currentPressedMessage, setCurrentPressedMessage] = useState<IAnsweredMessage & { isMyMessage: boolean } | null>(null)
    const [scrolledMessageID, setScrolledMessageID] = useState<number | null>(0)
    const [isEditMode, setEditMode] = useState(false)
    const flatListRef = useRef<FlatList>(null)
    const chatInputRef = useRef<TextInput | null>(null)

    const socket = useContext(WebsocketContext)
    const ws = socket?.ws
    const history = socket?.history
    const messages = history?.messages
    const setHistory = socket?.setHistory
    const currentMessage = socket?.currentMessage
    const answeredMessage = socket?.answeredMessage
    const chatList = socket?.chatList
    const setChatList = socket?.setChatList
    // const fixed = socket?.fixed
    // const setFixed = socket?.setFixed

    const currentChat = socket?.currentChat
    const prevChat = socket?.prevChat


    const { info } = useLocalSearchParams()
    const chat = JSON.parse(info as string)



    const scrollToMessage = useCallback((id: string) => {
        const idx = messages?.findIndex((message) => String(message.ID) === String(id));

        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        if (idx !== undefined && idx >= 0) {
            flatListRef.current?.scrollToIndex({ animated: true, index: messages ? messages.length - idx - 1 : 0 });
            setScrolledMessageID(messages ? messages[idx].ID : null);
        } else {
            flatListRef.current?.scrollToIndex({ animated: true, index: messages ? messages.length - 1 : 0 });
            timerRef.current = setTimeout(() => {
                if (recursiveCallbackRef.current) {
                    recursiveCallbackRef.current(id);
                }
            }, 500);
        }
    }, [messages]);

    const recursiveCallbackRef = useRef(scrollToMessage);

    useEffect(() => {
        recursiveCallbackRef.current = scrollToMessage;
    }, [scrollToMessage]);


    const setEdit = () => {
        setEditMode(true)
        console.log(currentPressedMessage)
        chatInputRef.current?.setNativeProps({text:currentPressedMessage?.Msg})
        chatInputRef.current?.focus()
        actionListPosition.value = {
            state: false,
            x: actionListPosition.value.x,
            y: actionListPosition.value.y,
        }
    }

    const sendEditMessage = (message: string) => {
        console.log(message)
        if (message.trim()) {
            currentMessage.current = message
            ws?.send(JSON.stringify({
                type: 'msg-edit' ,
                chatId: chat.chat.ID,
                id: currentPressedMessage?.MsgSourceID,
                message,
                files: [],
                answer: []
            }))
            setChoosedMessage([])
            flatListRef.current?.scrollToIndex({ animated: true, index: 0 })
        }
        setEditMode(false)
    }


    const sendMessage = (message: string) => {
        if (message.trim()) {
            currentMessage.current = message
            ws?.send(JSON.stringify({
                type: 'draft-msg',
                chatId: chat.chat.ID,
                id: null,
                message,
                files: [],
                answer: []
            }))
            setChoosedMessage([])
            flatListRef.current?.scrollToIndex({ animated: true, index: 0 })
        }
    }

    const deleteMessage = () => {
        actionListPosition.value = {
            state: false,
            x: actionListPosition.value.x,
            y: actionListPosition.value.y,
        }
        Alert.alert('Удалить сообщение?', 'Вы уверены, что хотите удалить сообщение', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'OK', onPress: () => {
                    ws?.send(JSON.stringify({
                        type: 'msg-delete',
                        chatId: chat.chat.ID,
                        msgId: currentPressedMessage?.MsgSourceID
                    }));
                }
            },
        ]);
    }

    const unfixMessage = (message: any) => {
        ws?.send(JSON.stringify({
            type: 'msg-fixed',
            chatId: chat.chat.ID,
            msgId: message.ID,
            msg: message.Msg,
            fix: 0
        }));

    }

    const fixMessage = () => {
        ws?.send(JSON.stringify({
            type: 'msg-fixed',
            chatId: chat.chat.ID,
            msgId: currentPressedMessage?.MsgSourceID,
            msg: currentPressedMessage?.Msg,
            fix: 1
        }));
        actionListPosition.value = {
            state: false,
            x: 0,
            y: 0,
        }
    }

    const answeredMessageStyle = useAnimatedStyle(() => {
        return {
            maxHeight: withTiming(choosedMessage.length && !isChooseMode ? 100 : 0),
            // paddingVertical:withTiming(choosedMessage.length && !isChooseMode ? 10 : 0),
        }
    })

    const hintStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scaleY: withTiming(actionListPosition.value.state ? 1 : 0, {
                        duration: 200,

                    })
                },
                {
                    translateY: withTiming(actionListPosition.value.state ? 0 : 200, {
                        duration: 200,
                    })
                }
            ],
            bottom: actionListPosition.value.y,
            left: actionListPosition.value.x,
        };
    });

    const inputFiledStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: withTiming(isChooseMode ? 200 : 0
                    )
                }
            ],
            opacity: withTiming(isChooseMode ? 0 : 1
            )
        };
    });

    const buttonsFiledStyle = useAnimatedStyle(() => {
        return {
            top: withTiming(isChooseMode ? 0 : 200),
            opacity: withTiming(isChooseMode ? 1 : 0)
        };
    });

    const getOldMessages = useCallback((messages: any) => {
        if (messages && Number(messages[0]?.RowNum) - 1 > 1) {
            ws?.send(JSON.stringify({
                type: 'chat-history',
                chatId: chat.chat.ID,
                offset: Number(messages[0]?.RowNum) - 1
            }))
        }
    }, [messages])

    const hintStyleOverlay = useAnimatedStyle(() => {
        return {
            opacity: withTiming(actionListPosition.value.state ? 1 : 0, {
                duration: 100
            }),
            zIndex: withTiming(actionListPosition.value.state ? 1 : -1, {
                duration: 100
            })
        };
    });

    //pick doc

    // const pickDocument = async () => {

    //     try{
    //         let result = await DocumentPicker.getDocumentAsync({});
    //         if (!result.canceled) {
    //             const fileUri = result.assets[0].uri;
    //             const fileInfo = await FileSystem.getInfoAsync(fileUri);

    //             if (fileInfo.exists) {
    //               const fileBinary = await FileSystem.readAsStringAsync(fileUri, {
    //                 encoding: FileSystem.EncodingType.Base64,
    //               });
    //               ws?.send(fileBinary);
    //               console.log('Binary data:', fileBinary);
    //             } else {
    //               console.log('File does not exist');
    //             }
    //         }
    //     }catch(e){
    //         console.log(e)
    //     }

    // }

    // click on hint overlay
    const overlayClick = (e: any) => {

        e.stopPropagation()
        actionListPosition.value = {
            state: false,
            x: actionListPosition.value.x,
            y: actionListPosition.value.y,
        }
        // setCurrectChoosedMessage(null)
    }

    // long press on message
    const handleLongPress = useCallback((pos: any, message: any) => {
        actionListPosition.value = {
            state: true,
            x: pos.x,
            y: pos.y,
        }
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
        setCurrentPressedMessage(message)
    }, [])

    const chooseModeOn = () => {
        setChooseMode(true)
        actionListPosition.value = {
            state: false,
            x: 0,
            y: 0,
        }
        setChoosedMessage([currentPressedMessage as never])
    }

    // add one messages to answer when choose mode is false
    const addOneMessageToanswer = () => {
        if (!currentPressedMessage) return
        answeredMessage.current = [currentPressedMessage]
        setChoosedMessage([currentPressedMessage as never])
        actionListPosition.value = {
            state: false,
            x: actionListPosition.value.x,
            y: actionListPosition.value.y,
        }
        openKeyboard()
    }

    // add messages to answer when choose mode is true
    const addMessagesToAnswer = () => {
        setChooseMode(false)
        answeredMessage.current = choosedMessage
        openKeyboard()
        chatInputRef.current?.focus()
    }

    const clearAnsweredMessages = () => {
        setChoosedMessage([])
        answeredMessage.current = []
    }

    const openKeyboard = useCallback(() => {
        chatInputRef.current?.focus()
    }, [chatInputRef])

    useEffect(() => {
        if (currentChat && prevChat) {
            currentChat.current = chat.chat.ID
            prevChat.current = chat.chat.ID
        }

        ws?.send(JSON.stringify({
            type: 'member-list',
            chatId: chat.chat.ID
        }))
        ws?.send(JSON.stringify({
            type: 'chat-history',
            chatId: chat.chat.ID
        }))

        return () => {
            setHistory && setHistory(null)
            currentChat.current = ''
        }
    }, [])

    useEffect(() => {
        if (messages) {
            setLoading(false)
            if (setChatList) {
                setChatList((prev: any) => {
                    const newValue = prev.chats.map((chat: any) => {
                        if (chat.chat.ID === prevChat.current) {
                            return {
                                ...chat,
                                chat: {
                                    ...chat.chat,
                                    UnreadCnt: 0
                                }
                            }
                        } else {
                            return chat
                        }
                    })

                    return { chats: newValue }
                })
            }
        }

        console.log(history)
    }, [messages, history])

    const actionList = [
        {
            name: 'DELETE',
            private: true,
            title: 'Удалить',
            icon: <MaterialCommunityIcons name="delete-outline" size={20} color="red" />,
            color: 'red',
            func: () => deleteMessage()
        },
        {
            name: 'ANSWER',
            private: false,
            title: 'Ответить',
            icon: <AntDesign name="back" size={20} color="black" />,
            color: 'black',
            func: () => addOneMessageToanswer()
        },
        {
            name: 'FIX',
            private: false,
            title: 'Закрепить',
            icon: <AntDesign name="pushpino" size={20} color="black" />,
            color: 'black',
            func: () => fixMessage()
        },
        {
            name: 'CHANGE',
            private: true,
            title: 'Редактировать',
            icon: <MaterialCommunityIcons name="pencil" size={20} color="black" />,
            color: 'black',
            func: () => setEdit()
        },
        {
            name: 'CHOOSE',
            private: false,
            title: 'Выбрать',
            icon: <MaterialIcons name="done" size={20} color="black" />,
            color: 'black',
            func: () => chooseModeOn()
        }
    ]

    return (
        <>
            <Animated.View style={[hintStyleOverlay, { position: 'absolute', backgroundColor: 'rgba(0,0,0,0.25)', width: '100%', height: '100%', overflow: 'hidden', }]}>
                <TouchableOpacity activeOpacity={1} onPress={overlayClick} style={{ width: '100%', height: '100%' }}>
                    <BlurView intensity={15} style={{ width: '100%', height: '100%', position: 'relative' }}>
                        <Animated.View style={[hintStyle, { backgroundColor: 'rgba(255,255,255,0.75)', position: 'absolute', borderRadius: 30, overflow: 'hidden', padding: 10 }]}>
                            {
                                actionList.map((item) => {
                                    return (!item.private || currentPressedMessage?.isMyMessage) ?
                                        <TouchableOpacity onPress={item.func} style={{ paddingHorizontal: 15, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 20, justifyContent: 'space-between' }} key={item.name}>
                                            <SText size={Sizes.normal} textStyle={{ fontSize: 16, color: item.color }}>{item.title}</SText>
                                            {item.icon}
                                        </TouchableOpacity>
                                        : null

                                })
                            }
                        </Animated.View>
                    </BlurView>
                </TouchableOpacity>
            </Animated.View>

            <Stack.Screen options={{
                headerShown: true,
                headerTitleAlign: 'center',
                headerTitle: (props) => (<View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 230 }}>
                    <SText numberOfLines={1} textStyle={{ fontSize: 18, color: Colors.white, width: '100%', }} size={Sizes.normal}>{chat.chat.GroupName}</SText>
                    <SText numberOfLines={1} textStyle={{ fontSize: 12, color: '#505050', width: '100%', textAlign: 'center' }} size={Sizes.normal}>{chat.chat.ChatName}</SText>
                </View>),
                headerStyle: { backgroundColor: '#161616' },
                headerTitleStyle: { color: Colors.white },
                headerShadowVisible: false,
                headerBackTitleVisible: false,
                headerBlurEffect: 'dark',
                headerRight: (props) => (
                    <TouchableOpacity>
                        <Feather name="more-horizontal" size={30} color="white" />
                    </TouchableOpacity>
                ),
                headerLeft: (props) => (
                    <TouchableOpacity onPress={() => router.back()} {...props}>
                        <Ionicons name="chevron-back-outline" size={28} color="#6b99c3" />
                    </TouchableOpacity>
                ),
            }}
            />
            <GestureHandlerRootView style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={65}
                    style={{ flex: 1, backgroundColor: Colors.secondaryDark, position: 'relative' }}>
                    {
                        loading
                            ? <View style={{ backgroundColor: Colors.dark, flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <Loader />
                            </View>
                            : Boolean(messages?.length)
                                ? <>
                                    {
                                        history?.fixed && <TouchableOpacity onPress={() => scrollToMessage(history?.fixed.ID)} style={{ borderTopColor: 'black', borderTopWidth: 1, padding: 15, paddingVertical: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                                            <AntDesign style={{ flexGrow: 0, flexShrink: 0 }} name="pushpino" size={20} color={Colors.white} />
                                            <View style={{ flex: 1 }}>
                                                <SText textStyle={{ color: Colors.grey, fontSize: 14, marginBottom: 5 }}>Закрепленное сообщение</SText>
                                                <SText size={Sizes.normal} numberOfLines={1} textStyle={{ color: Colors.white, fontSize: 16 }}>{history?.fixed.Msg}</SText>
                                            </View>
                                            <TouchableOpacity onPress={() => unfixMessage(history?.fixed)} style={{ flexGrow: 0, flexShrink: 0 }}>
                                                <AntDesign name="close" size={20} color={Colors.grey} />
                                            </TouchableOpacity>
                                        </TouchableOpacity>
                                    }
                                    <FlatList
                                        ref={flatListRef}
                                        keyboardDismissMode='interactive'
                                        onEndReached={() => getOldMessages(messages)}
                                        onEndReachedThreshold={0.9}
                                        onScrollToIndexFailed={() => { }}
                                        inverted
                                        contentContainerStyle={{ padding: 15, gap: 15, flexDirection: 'column', }}
                                        style={{ backgroundColor: Colors.dark }}
                                        data={messages ? [...messages].reverse() : []}
                                        keyExtractor={item => `${item.ID} ${item.ChatID} ${item.MemberName} ${item.SessionID}`}
                                        renderItem={({ item }) => {
                                            if (item.Status === 2 || item.Status === 3) {
                                                return <ChatMessage
                                                    openKeyboard={openKeyboard}
                                                    scrolledMessage={scrolledMessageID === item.ID}
                                                    onQuotaClick={scrollToMessage}
                                                    message={item}
                                                    handleLongPress={handleLongPress}
                                                    isChooseMode={isChooseMode}
                                                    isChoosed={choosedMessage?.findIndex((mess: any) => mess.MsgSourceID === item.ID) >= 0}
                                                    setChoosedMessage={setChoosedMessage}

                                                />
                                            } else if (item.Status === 4) {
                                                return <DeletedMessage message={item} />
                                            } else return null
                                        }}
                                        ListFooterComponent={() => {
                                            return messages && Number(messages[0]?.RowNum) - 1 > 1 ? <SText textStyle={{ textAlign: 'center', color: 'white' }}>Загрузка...</SText> : null

                                        }}
                                    />
                                </>
                                : <View style={{ backgroundColor: Colors.dark, flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <SText size={Sizes.bold} textStyle={{ color: Colors.grey, fontSize: 16 }}>Сообщений пока нет</SText>
                                </View>
                    }
                    <Animated.View style={answeredMessageStyle}>
                        <AnsweredMessage choosedMessage={choosedMessage} clearAnsweredMessages={clearAnsweredMessages} />
                    </Animated.View>

                    <View style={{ backgroundColor: Colors.secondaryDark, paddingBottom: insets.bottom + 10, position: 'relative' }}>

                        <Animated.View style={[buttonsFiledStyle, { flexDirection: 'row', paddingTop: 7, paddingBottom: 5, paddingHorizontal: 15, alignItems: 'center', gap: 10, justifyContent: 'center', position: 'absolute' }]}>
                            <TouchableOpacity style={[styles.helperBtn]} onPress={() => {
                                setChooseMode(false)
                                clearAnsweredMessages()
                            }}><SText textStyle={[styles.helperBtnText, { color: 'red' }]} size={Sizes.normal}>Отменить</SText></TouchableOpacity>
                            <TouchableOpacity

                                disabled={!choosedMessage.length}
                                onPress={addMessagesToAnswer}
                                style={[styles.helperBtn, { opacity: !choosedMessage.length ? 0.2 : 1 }]}>
                                <SText textStyle={[styles.helperBtnText, { color: 'white' }]} size={Sizes.normal}>
                                    Ответить
                                </SText>
                            </TouchableOpacity>
                        </Animated.View>

                        <Animated.View style={[inputFiledStyle]}>
                            <View style={styles.bottomPartStyle}>
                                {/* <TouchableOpacity onPress={pickDocument}>
                                    <SText textStyle={{ color: Colors.white, fontSize: 40, lineHeight: 40, marginTop: 6 }}>+</SText>
                                </TouchableOpacity> */}
                                <ChatInput
                                    reff={chatInputRef}
                                    disabled={Number(new Date(chat.chat.DateEnd)) < Number(new Date())}
                                    handler={isEditMode ? sendEditMessage : sendMessage}
                                />
                            </View>

                        </Animated.View>



                    </View>
                </KeyboardAvoidingView>
            </GestureHandlerRootView>
        </>
    )
}

export default chatWindow

const styles = StyleSheet.create({
    helperBtn: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: 'black',
        flex: 1,
        borderRadius: 15
    },
    helperBtnText: {
        textAlign: 'center'
    },
    bottomPartStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 15,
        paddingHorizontal: 15,
        marginTop: 7
    }
})