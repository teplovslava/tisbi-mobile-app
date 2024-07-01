import { Alert, FlatList, KeyboardAvoidingView, Keyboard, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
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
import { IAnsweredMessage, IChat, IMessage } from '@/interface'
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import Backdrop from '@/components/Backdrop'
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import OnlineUsers from '@/ui/onlineUsers'
import { normalizeAnsweredMessage } from '@/service/normalizeAnsweredMessage'
import { FileView } from '@/ui/File'
import dayjs from 'dayjs'
import * as Clipboard from 'expo-clipboard';




const chatWindow = () => {
    const insets = useSafeAreaInsets()

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const onlineUserBottomSheetRef = useRef<BottomSheet | null>(null);

    const [loading, setLoading] = useState(true)
    const actionListPosition = useSharedValue({ state: false, x: 0, y: 0 })
    const [isChooseMode, setChooseMode] = useState(false)
    const [choosedMessage, setChoosedMessage] = useState<any>([])
    const [isHalfExpanded, setIsHalfExpanded] = useState(true);
    const [currentPressedMessage, setCurrentPressedMessage] = useState<IAnsweredMessage & { isMyMessage: boolean, message: any } | null>(null)
    const [scrolledMessageID, setScrolledMessageID] = useState<number | null>(0)
    const [isEditMode, setEditMode] = useState(false)
    const flatListRef = useRef<FlatList>(null)
    const chatInputRef = useRef<TextInput | null>(null)

    const socket = useContext(WebsocketContext)
    const ws = socket?.ws
    const history = socket?.history
    const isReady = socket?.isReady
    const messages = history?.messages
    const messagesRef = useRef(messages)
    const setHistory = socket?.setHistory
    const currentMessage = socket?.currentMessage
    const answeredMessage = socket?.answeredMessage
    const chatList = socket?.chatList
    const setChatList = socket?.setChatList
    const setFixed = socket?.setFixed


    // const fixed = socket?.fixed
    // const setFixed = socket?.setFixed

    const currentChat = socket?.currentChat
    const prevChat = socket?.prevChat


    const { id } = useLocalSearchParams()
    const chatId = JSON.parse(id as string)
    const chat = chatList?.chats?.filter((chatItem: IChat) => String(chatItem.chat.ID) === id) || []


    const scrollToMessage = useCallback((id: string) => {
        setScrolledMessageID(null)
        const idx = messagesRef?.current?.findIndex((message) => String(message.ID) === String(id));

        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        if (idx !== undefined && idx >= 0) {
            flatListRef.current?.scrollToIndex({ animated: true, index: messagesRef?.current ? messagesRef?.current?.length - idx - 1 : 0 });
            setScrolledMessageID(messagesRef.current ? messagesRef?.current?.[idx].ID : null);
        } else {
            flatListRef.current?.scrollToIndex({ animated: true, index: messagesRef?.current ? messagesRef?.current?.length - 1 : 0 });
            timerRef.current = setTimeout(() => {
                if (recursiveCallbackRef.current) {
                    recursiveCallbackRef.current(id);
                }
            }, 500);
        }
    }, [messagesRef]);

    const recursiveCallbackRef = useRef(scrollToMessage);

    useEffect(() => {
        recursiveCallbackRef.current = scrollToMessage;
    }, [scrollToMessage]);


    const setEdit = () => {
        setEditMode(true)
        chatInputRef.current?.setNativeProps({ text: currentPressedMessage?.Msg })
        chatInputRef.current?.focus()
        actionListPosition.value = {
            state: false,
            x: actionListPosition.value.x,
            y: actionListPosition.value.y,
        }
    }

    const sendEditMessage = useCallback((message: string) => {
        if (message.trim()) {
            currentMessage.current = message
            ws?.send(JSON.stringify({
                type: 'msg-edit',
                chatId: chatId,
                id: currentPressedMessage?.MsgSourceID,
                message,
                files: [],
                answer: []
            }))
            setChoosedMessage([])
            flatListRef.current?.scrollToIndex({ animated: true, index: 0 })
        }
        setEditMode(false)
    }, [])


    const sendMessage = useCallback((message: string) => {

        if (message.trim()) {
            currentMessage.current = message
            ws?.send(JSON.stringify({
                type: 'draft-msg',
                chatId: chatId,
                id: null,
                message,
                files: [],
                answer: []
            }))
            setChoosedMessage([])
            flatListRef.current?.scrollToIndex({ animated: true, index: 0 })
        }
    }, [ws])

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
                        chatId: chatId,
                        msgId: currentPressedMessage?.MsgSourceID
                    }));
                }
            },
        ]);
    }

    const unfixMessage = (message: any) => {
        ws?.send(JSON.stringify({
            type: 'msg-fixed',
            chatId: chatId,
            msgId: message.ID,
            msg: message.Msg,
            fix: 0
        }));

    }


    const fixMessage = () => {
        ws?.send(JSON.stringify({
            type: 'msg-fixed',
            chatId: chatId,
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
                chatId: chatId,
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

    const setMessageAndBelt = useCallback((message: IMessage) => {
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
    }, [])

    // add messages to answer when choose mode is true
    const addMessagesToAnswer = () => {
        setChooseMode(false)
        answeredMessage.current = choosedMessage
        openKeyboard()
        chatInputRef.current?.focus()
    }

    const copyMessageText = () => {
        Clipboard.setStringAsync(currentPressedMessage?.Msg || '');
        actionListPosition.value = {
            state: false,
            x: actionListPosition.value.x,
            y: actionListPosition.value.y,
        }
    }

    const reversedMessages = useMemo(() => {
        return messages ? [...messages].reverse() : [];
    }, [messages]);

    const clearAnsweredMessages = () => {
        setChoosedMessage([])
        answeredMessage.current = []
    }

    const openKeyboard = useCallback(() => {
        chatInputRef.current?.focus()
    }, [])

    const handleSheetChange = (index: number) => {
        if (index === 1) {
            setIsHalfExpanded(true);
        } else {
            setIsHalfExpanded(false);
        }
    };

    useEffect(() => {
        if (currentChat && prevChat) {
            currentChat.current = chatId;
            prevChat.current = chatId;
        }

        if (ws?.readyState) {
            setLoading(true);
            ws?.send(JSON.stringify({
                type: 'member-list',
                chatId: chatId
            }));
            ws?.send(JSON.stringify({
                type: 'chat-history',
                chatId: chatId
            }));
        }

        return () => {
            setHistory && setHistory(null);
            setFixed(null)
            currentChat.current = null
        };
    }, [ws, ws?.readyState]);


    useEffect(() => {
        messagesRef.current = messages
        if (messages) {
            setLoading(false);
            if (setChatList) {
                setChatList((prev: any) => {
                    const newValue = prev.chats.map((chat: any) => {
                        if (chatId === prevChat.current) {
                            return {
                                ...chat,
                                chat: {
                                    ...chat.chat,
                                    UnreadCnt: 0
                                }
                            };
                        } else {
                            return chat;
                        }
                    });

                    return { chats: newValue };
                });
            }
        }
    }, [messages, history]);

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
        },
        {
            name: 'COPYTEXT',
            private: false,
            title: 'Скопировать',
            icon: <Feather name="copy" size={20} color="black" />,
            color: 'black',
            func: () => copyMessageText()
        }
    ]


    const renderItem = useCallback(({ item, index }: { item: IMessage, index: number }) => {

        const prevItem = index >= 0 ? messages ? messages[messages?.length - index - 2] : null : null;
        const nextItem = index >= 0 ? messages ? messages[messages?.length - index] : null : null;

        const prevDate = prevItem ? dayjs(prevItem.DateAdd).format(`DD MMMM`) : null
        const nextDate = nextItem ? dayjs(nextItem.DateAdd).format(`DD MMMM`) : null
        const todayDate = dayjs(item.DateAdd).format(`DD MMMM`)

        const newDate = prevDate !== todayDate ? true : false
        const newDateNext = nextDate !== todayDate ? true : false

        const isMyMessage = history?.user?.roleId === item?.PeopleRoleID

        if (item.Status === 2 || item.Status === 3) {
            return <ChatMessage
                newDate={newDate}
                samePrev={prevItem?.PeopleRoleID === item.PeopleRoleID && !newDate}
                sameNext={nextItem?.PeopleRoleID === item.PeopleRoleID && !newDateNext}
                setMessageAndBelt={setMessageAndBelt}
                scrolledMessage={scrolledMessageID === item.ID}
                onQuotaClick={scrollToMessage}
                message={item}
                handleLongPress={handleLongPress}
                isChooseMode={isChooseMode}
                isChoosed={choosedMessage?.findIndex((mess: any) => mess.MsgSourceID === item.ID) >= 0}
                setChoosedMessage={setChoosedMessage}
                isMyMessage={isMyMessage}

            />
        } else if (item.Status === 4) {
            return <DeletedMessage
                samePrev={prevItem?.PeopleRoleID === item.PeopleRoleID && !newDate}
                sameNext={nextItem?.PeopleRoleID === item.PeopleRoleID && !newDateNext}
                message={item}
                isMyMessage={isMyMessage} />
        } else return null
    }, [messages, scrolledMessageID, isChooseMode, choosedMessage]);

    return (
        <View style={{ flex: 1, backgroundColor: Colors.black }}>
            <Animated.View style={[hintStyleOverlay, { position: 'absolute', backgroundColor: 'rgba(0,0,0,0.25)', width: '100%', height: '100%', overflow: 'hidden', }]}>
                <TouchableOpacity activeOpacity={1} onPress={overlayClick} style={{ width: '100%', height: '100%' }}>
                    <BlurView intensity={15} style={{ width: '100%', height: '100%', position: 'relative' }}>
                        <Animated.View style={[hintStyle, { backgroundColor: 'rgba(255,255,255,0.75)', position: 'absolute', borderRadius: 30, overflow: 'hidden', padding: 10 }]}>
                            {/* <View style={[styles.container, { backgroundColor: currentPressedMessage?.isMyMessage ? '#00bedb' : Colors.secondaryDark, alignItems: currentPressedMessage?.isMyMessage ? 'flex-end' : 'flex-start', }]}>
                            <SText size={Sizes.normal} textStyle={{ fontSize: 12, color: currentPressedMessage?.isMyMessage ? 'white' : '#6C6C6C', }}>{currentPressedMessage?.isMyMessage ? 'Вы' : currentPressedMessage?.message.MemberName}</SText>
                                {
                                    currentPressedMessage?.message.QuotesInfo && <View style={{ flexDirection: 'column', gap: 5, width:'100%' }}>
                                        {
                                            normalizeAnsweredMessage(currentPressedMessage?.message.QuotesInfo).map((str, i) => {
                                                return <View key={`${str.ID}${str.MsgSourceID}${str.MemberName}`} style={{ flexDirection: 'row', gap: 10, backgroundColor: Colors.dark, paddingHorizontal: 20, paddingVertical: 10, paddingLeft: 10, borderRadius: 10 }}>
                                                    <View style={{ width: 2, backgroundColor: '#CCFF00', alignItems: 'stretch' }}></View>
                                                    <View style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 5, }}>
                                                        <SText size={Sizes.normal} textStyle={{ color: Colors.grey, fontSize: 14, }}>{str.MemberName}</SText>
                                                        <SText size={Sizes.normal} textStyle={{ color: 'white', fontSize: 14, maxWidth: '95%' }} numberOfLines={1}>{str.Msg || 'Вложение'}</SText>
                                                    </View>
                                                </View>
                                            })
                                        }
                                    </View>
                                }
                                {currentPressedMessage?.message.Msg && <SText size={Sizes.normal} textStyle={{ fontSize: 14, color: currentPressedMessage?.isMyMessage ? 'black' : '#fff' }}>{currentPressedMessage?.message.Msg}</SText>}

                                {currentPressedMessage?.message.AttachmentInfo && currentPressedMessage?.message.AttachmentInfo?.split(';').map((file: string, i: number) => file.length ? <FileView key={i} isChooseMode={isChooseMode} file={file} /> : null)}
                            </View> */}


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
                headerTitle: (props) => (<View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 200 }}>
                    <SText numberOfLines={1} textStyle={{ fontSize: 18, color: Colors.light, width: '100%', }} size={Sizes.normal}>{chat.length ? chat[0].chat.GroupName : ''}</SText>
                    <SText numberOfLines={1} textStyle={{ fontSize: 12, color: Colors.lightGrey, width: '100%', textAlign: 'center' }} size={Sizes.normal}>{chat.length ? isReady ? loading ? 'Обновление...' : chat[0].chat.ChatName : 'Connecting...' : ''}</SText>
                </View>),
                headerStyle: { backgroundColor: Colors.lightBlack },
                headerTitleStyle: { color: Colors.light },
                headerShadowVisible: false,
                headerBackTitleVisible: false,
                headerBackVisible: false,
                headerBlurEffect: 'dark',
                headerRight: (props) => (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        {/* <TouchableOpacity onPress={() => {
                            router.push({pathname: '/(tabs)/(chat)/videoCall', params:{id: JSON.stringify(id)}})
                        }}>
                            <Ionicons name="videocam-outline" size={30} color="white" />
                        </TouchableOpacity> */}
                        <TouchableOpacity onPress={() => {
                            Keyboard.dismiss()
                            onlineUserBottomSheetRef.current?.collapse()
                        }}>
                            <Feather name="more-horizontal" size={30} color="white" />
                        </TouchableOpacity>
                    </View>
                ),
                headerLeft: (props) => (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <TouchableOpacity onPress={() => {
                            router.back()

                        }} {...props}>
                            <Ionicons name="chevron-back-outline" size={28} color={Colors.main} />
                        </TouchableOpacity>
                        {/* <View style={{width:30}}></View> */}
                    </View>

                ),
            }}
            />
            <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.black, }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 87}
                    style={{ flex: 1, backgroundColor: Colors.black, position: 'relative' }}>
                    {
                        loading || !isReady
                            ? <View style={{ backgroundColor: Colors.black, flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <Loader />
                            </View>
                            :
                            chat.length ?
                                Boolean(messages?.length)
                                    ? <View style={{ backgroundColor: Colors.lightBlack, flex: 1 }}>
                                        {
                                            history?.fixed && <TouchableOpacity onPress={() => scrollToMessage(history?.fixed.ID)} style={{ borderTopColor: 'black', borderTopWidth: 1, padding: 15, paddingVertical: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                                                <AntDesign style={{ flexGrow: 0, flexShrink: 0 }} name="pushpino" size={20} color={Colors.light} />
                                                <View style={{ flex: 1 }}>
                                                    <SText textStyle={{ color: Colors.lightGrey, fontSize: 14, marginBottom: 5 }}>Закрепленное сообщение</SText>
                                                    <SText size={Sizes.normal} numberOfLines={1} textStyle={{ color: Colors.light, fontSize: 16 }}>{history?.fixed.Msg}</SText>
                                                </View>
                                                <TouchableOpacity onPress={() => unfixMessage(history?.fixed)} style={{ flexGrow: 0, flexShrink: 0 }}>
                                                    <AntDesign name="close" size={20} color={Colors.lightGrey} />
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
                                            contentContainerStyle={{ padding: 15, flexDirection: 'column', }}
                                            style={{ backgroundColor: Colors.black }}
                                            removeClippedSubviews={true}
                                            data={reversedMessages}
                                            initialNumToRender={20}
                                            maxToRenderPerBatch={5}
                                            keyExtractor={item => item.ID.toString()}
                                            renderItem={renderItem}
                                            ListFooterComponent={() => {
                                                return messages && Number(messages[0]?.RowNum) - 1 > 1 ? <SText textStyle={{ textAlign: 'center', color: 'white' }}>Загрузка...</SText> : null

                                            }}
                                        />
                                    </View>
                                    : <View style={{ backgroundColor: Colors.black, flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                        <SText size={Sizes.bold} textStyle={{ color: Colors.light, fontSize: 16 }}>Сообщений пока нет</SText>
                                    </View>
                                : <View style={{ backgroundColor: Colors.black, flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <SText size={Sizes.bold} textStyle={{ color: Colors.light, fontSize: 16 }}>Чат устарел или не существует</SText>
                                </View>
                    }
                    <Animated.View style={answeredMessageStyle}>
                        <AnsweredMessage choosedMessage={choosedMessage} clearAnsweredMessages={clearAnsweredMessages} />
                    </Animated.View>

                    <View style={{ backgroundColor: Colors.lightBlack, paddingBottom: insets.bottom + 10, position: 'relative' }}>

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
                                    disabled={Number(new Date(chat[0]?.chat?.DateEnd)) < Number(new Date()) || !isReady || !chat.length}
                                    handler={isEditMode ? sendEditMessage : sendMessage}
                                />
                            </View>

                        </Animated.View>



                    </View>

                </KeyboardAvoidingView>
                <BottomSheet
                    index={-1}
                    onChange={(idx) => {
                        if (idx === -1) {
                            Keyboard.dismiss()
                        }
                        handleSheetChange(idx)

                    }}
                    backgroundStyle={{ backgroundColor: Colors.lightBlack }}
                    snapPoints={['50%', '95%']}
                    enablePanDownToClose
                    ref={onlineUserBottomSheetRef}
                    style={{ borderRadius: 40, overflow: "hidden", backgroundColor: Colors.lightBlack }}
                    containerStyle={{ borderRadius: 40 }}
                    backdropComponent={(props: any) => (
                        <Backdrop children={<BlurView intensity={10} style={{ flex: 1, width: '100%', height: '100%' }} />}  {...props} opacity={0.8} disappearsOnIndex={-1} appearsOnIndex={0} >

                        </Backdrop>)}
                    handleIndicatorStyle={{}}>
                    <BottomSheetView>
                        <OnlineUsers isHalfExpanded={isHalfExpanded} ref={onlineUserBottomSheetRef} />
                    </BottomSheetView>
                </BottomSheet>


            </GestureHandlerRootView>

        </View>
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
        marginTop: 7,
    },
    container: {
        padding: 20,
        borderRadius: 25,
        backgroundColor: Colors.secondaryDark,
        gap: 10,
        width: 'auto',
        marginBottom: 7
    }
})