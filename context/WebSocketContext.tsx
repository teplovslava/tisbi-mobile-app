import { IChatList, IGroupsList, IHistory, IMember, IUserList, IWebSocketContext } from "@/interface";
import { createContext, useCallback, useEffect, useRef, useState } from "react";
import * as Haptics from 'expo-haptics';

interface IProps {
    children: JSX.Element,
    token: string
}

export const WebsocketContext = createContext<IWebSocketContext | null>(null)

let timer: ReturnType<typeof setTimeout>

export const WebsocketProvider = ({ children, token }: IProps) => {
    const ws = useRef<WebSocket | null>(null)

    const [isReady, setIsReady] = useState(false)
    const [chatList, setChatList] = useState<IChatList | null>(null)
    const [groupList, setGroupList] = useState<IGroupsList | null>(null)
    const [userList, setUserList] = useState<IUserList | null>(null)
    const [member, setMember] = useState<IMember | null>(null)
    const [history, setHistory] = useState<IHistory | null>(null)
    const [connectedMembers, setConnectedMembers] = useState<any>([])


    const [fixed, setFixed] = useState(null)
    const currentChat = useRef('')
    const prevChat = useRef('')
    const currentMessage = useRef('')
    const currentMessageId = useRef('')
    const answeredMessage = useRef([])

    //1443


    const webSocketConnect = useCallback(() => {
        let socket = new WebSocket(`wss://ws.tisbi.ru:38000?jwt=${token}`)

        socket.onopen = () => {
            setIsReady(true)
            clearTimeout(timer)
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }

        socket.onclose = (value) => {
            setIsReady(false)
            timer = setTimeout(() => {
                webSocketConnect()
            }, 1000)
        }


        socket.onerror = () => {
            socket.close()
        }

        socket.onmessage = (event) => {
            const value = JSON.parse(event.data)

            switch (value.type) {
                case 'member-list':
                    setMember(value)
                    break;

                case 'chat-history':
                    setHistory((prev: any) => {
                        if (currentChat.current != value.messages[0].ChatID) {
                            return { ...value, messages: [...value.messages, ...value.newMessages] }
                        } else {
                            let newValue = value?.messages ? value.messages : []
                            let newPrev = prev?.messages ? prev.messages : []
                            if (prev) {
                                return {
                                    ...prev,
                                    messages: [...newValue, ...newPrev]
                                }
                            } else {
                                // console.log(value)
                                // // const newValue = {...value, messages: [...value.messages,...value.newMessages]}
                                return { ...value, messages: [...value.messages, ...value.newMessages] }
                            }
                        }

                    })
                    break;

                case 'chat-list':

                    setChatList(value)
                    break;

                case 'user-list':
                    setConnectedMembers((prev: any) => {
                        return value.users.map((user: any) => {
                            return {
                                user: user.roleId,
                                userName: user.userName
                            }
                        })
                    })
                    setUserList(value)
                    break;

                case 'group-list':
                    setGroupList(value)
                    break;

                case 'new-msg':
                    if (currentChat.current) {
                        console.log("New message received:", value);
                        setHistory((prev: any) => {
                            let newPrev = prev?.messages ? prev.messages : []
                            if (prev) {
                                return {
                                    ...prev,
                                    messages: [...newPrev, value]
                                }
                            } else {
                                return [value]
                            }
                        })
                    } else {
                        setChatList((prev: any) => {

                            const newValue = prev.chats.map((chat: any) => {
                                if (chat.chat.ID === prevChat.current) {
                                    return {
                                        ...chat,
                                        chat: {
                                            ...chat.chat,
                                            UnreadCnt: chat.chat.UnreadCnt += 1
                                        }
                                    }
                                } else {
                                    return chat
                                }
                            })

                            return { chats: newValue }
                        })


                    }
                    break;

                case 'draft-msg':
                    currentMessageId.current = value.id
                    if (answeredMessage.current.length) {
                        ws?.current?.send(JSON.stringify({
                            type: 'msg-answer',
                            chatId: currentChat.current,
                            id: value.id,
                            message: currentMessage.current,
                            files: [],
                            answer: answeredMessage.current
                        }))
                    } else {
                        ws?.current?.send(JSON.stringify({
                            type: 'new-msg',
                            chatId: currentChat.current,
                            id: currentMessageId.current,
                            message: currentMessage.current,
                            files: [],
                            answer: answeredMessage.current
                        }))
                    }
                    break;

                case 'msg-answer':
                    ws?.current?.send(JSON.stringify({
                        type: 'new-msg',
                        chatId: currentChat.current,
                        id: currentMessageId.current,
                        message: currentMessage.current,
                        files: [],
                        answer: answeredMessage.current
                    }))
                    answeredMessage.current = []
                    break

                case 'chat-new-msg':
                    setChatList((prev: any) => {
                        if (prev) {
                            const currMessageIdx = prev?.chats.findIndex((item: any) => (item.chat.ID === value.chatId))
                            let newChats = { ...prev }
                            if (newChats.chats[currMessageIdx]) {
                                newChats.chats[currMessageIdx].chat.UnreadCnt = prev?.chats[currMessageIdx].chat.UnreadCnt + 1
                                return newChats
                            }
                        }
                        return prev
                    })

                    break;

                case 'msg-delete':
                    if (currentChat.current == value.ChatID) {
                        setHistory((prev: any) => {
                            const newHistory = { ...prev }
                            const idx = newHistory.messages.findIndex((mess: any) => mess.ID === value.ID)
                            if (idx && idx >= 0) {
                                newHistory.messages[idx].Status = 4
                            }
                            return newHistory
                        })
                    }
                    break

                case 'msg-fixed':
                    if (value.ChatID === currentChat.current) {
                        if (value.fixed) {
                            setHistory((prev: any) => {
                                return { ...prev, fixed: value.fixed }
                            })
                        } else {
                            setHistory((prev: any) => {
                                return { ...prev, fixed: null }
                            })
                        }
                    }
                    break

                case 'msg-edit':
                    setHistory((prev: any) => {
                        const messages = prev?.messages || []
                        const fixed = prev?.fixed
                        const idx = messages?.findIndex((mess: any) => String(mess.ID) === String(value.ID))
                        const isFixed = String(fixed.ID) === String(value.ID)
                        if (idx !== undefined && idx >= 0) {
                            messages[idx] = {
                                ...messages[idx],
                                Msg: value.Msg,

                            }
                        }


                        return {
                            ...prev,
                            fixed: isFixed ? { ...prev.fixed, Msg: value.Msg } : { ...prev.fixed },
                            messages
                        }
                    })

                    break

                case 'new-connect':
                    setConnectedMembers((prev: any) => {
                        return [...prev, { user: value.user, userName: value.userName }]
                    })
                    break

                case 'close-connect':
                    setConnectedMembers((prev: any) => {
                        const currentUser = prev.filter((user: any) => user.user !== value.user)
                        return currentUser

                    })
                    break

                default:
                    console.log(value)
            }
        }

        ws.current = socket

    }, [])

    useEffect(() => {
        webSocketConnect()

        return () => {
            ws?.current?.close()
        }
    }, [webSocketConnect, ws])

    const socketValue = {
        ws: ws.current,
        history,
        isReady,
        chatList,
        fixed,
        member,
        connectedMembers,
        setFixed,
        setHistory,
        setChatList,
        prevChat,
        currentChat,
        currentMessage,
        answeredMessage,
    }

    return (
        <WebsocketContext.Provider value={socketValue}>
            {children}
        </WebsocketContext.Provider>
    )
}
