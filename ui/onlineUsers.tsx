import { Keyboard, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useContext, useState } from 'react'
import OnlineUser from './onlineUser'
import { IMember } from '@/interface'
import { WebsocketContext } from '@/context/WebSocketContext'
import { FlatList, TextInput } from 'react-native-gesture-handler'
import { AntDesign } from '@expo/vector-icons'

const OnlineUsers = (props:any,ref:any) => {

    const socket = useContext(WebsocketContext)
    const ws = socket?.ws
    const connectedMembers = socket?.connectedMembers
    const member = socket?.member

    console.log(member?.members.length)

    const [value, setValue] = useState('')
    return (
        <View style={{ paddingHorizontal: 20, paddingTop:10, height:'100%'}}>
            <TouchableOpacity 
            style={{padding:5, backgroundColor:'#303030', marginLeft:'auto', marginBottom:10, borderRadius:20, marginTop:-10}} 
            onPress={() => {
                Keyboard.dismiss()
                ref?.current?.forceClose()
            }}>
                <AntDesign name="close" size={20} color="white" />
            </TouchableOpacity>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <TextInput  placeholder='Поиск...' style={{padding:10,fontFamily:'GilroyRegular', backgroundColor:'#303030', borderRadius:12}} onFocus={() => ref?.current?.snapToIndex(1)} onChangeText={setValue}
                value={value} onCancelled={() => ref?.current?.forceClose()}/>
                </TouchableWithoutFeedback>
            <FlatList
            onScroll={() => ref.current.snapToIndex(1)}
                contentContainerStyle={{ paddingVertical: 20}}
                showsVerticalScrollIndicator={false}
                data={member?.members || []}
                renderItem={({ item }) => {
                    const active = connectedMembers?.findIndex((person: any) => person.user === item.PeopleRoleID) >= 0
                    return <OnlineUser showed={item.MemberName.includes(value)} online={active} name={item.MemberName} role={item.MemberInfo} />
                }}
            />
        </View>
    )
}

export default React.forwardRef(OnlineUsers)

const styles = StyleSheet.create({})