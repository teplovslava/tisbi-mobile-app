import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo, useContext, useEffect, useState } from 'react'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import SText, { Sizes } from '@/components/StyledText'
import Colors from '@/constants/Colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { WebsocketContext } from '@/context/WebSocketContext'
import ChatList from '@/ui/chatList'
import { Ionicons } from '@expo/vector-icons'
import ChatActivityInfo from '@/ui/chatActivityInfo'

const ChatsList = () => {
  const insets = useSafeAreaInsets()
  const { name } = useLocalSearchParams()

  const socket = useContext(WebsocketContext)
  const chatList = socket?.chatList
  const isReady = socket?.isReady
  const ws = socket?.ws

  const list = chatList?.chats?.filter((chatItem: any) => chatItem.chat.GroupName === name) || []

  return (
    <>
      <Stack.Screen options={{
        headerShown: true,
        headerTitleAlign: 'center',
        headerTitle: (props) => (<View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center',width:230}}>
        <SText numberOfLines={1} textStyle={{ fontSize: 18, color: Colors.light, textAlign:'center' }} size={Sizes.normal}>{name ? name : 'Без названия'}</SText>
        <ChatActivityInfo length={1} name={''} isReady={isReady} loading={false}/>
    </View>),
        headerStyle: { backgroundColor: Colors.lightBlack },
        headerTitleStyle: { color: Colors.light },
        headerShadowVisible: false,
        headerBackTitleVisible: false,
        headerBackVisible:false,
        headerLeft: (props) => (
          <TouchableOpacity onPress={() => {
            router.back()
          }} {...props}>
            <Ionicons name="chevron-back-outline" size={28} color={Colors.main} />
          </TouchableOpacity>
        ),
        headerBlurEffect: 'dark',
        // headerLeft: (props) => (
        //     <TouchableOpacity onPress={() => router.back()} {...props}>
        //         <Ionicons name="chevron-back-outline" size={28} color="#6b99c3" />
        //     </TouchableOpacity>
        // ),
      }}
      />
      <View style={{ flex: 1, backgroundColor: Colors.black, gap: 10 }}>
        <FlatList
          data={list || []}
          renderItem={({item}) => <ChatList info={item} key={item.chat.ID} text={item.chat.ChatName} count={item.chat.UnreadCnt} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 70, gap: 10 }}
          style={{ paddingTop: 15, paddingHorizontal: 20, flex: 1 }}
          refreshing={!isReady}
          onRefresh={() => ws?.close()}
        />
      </View>
    </>
  )
}

export default memo(ChatsList)

const styles = StyleSheet.create({})