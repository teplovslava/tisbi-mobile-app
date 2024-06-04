import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, FlatList } from 'react-native'
import React, { Context, useContext, useEffect, useState } from 'react'
import { WebsocketContext } from '@/context/WebSocketContext'
import Colors from '@/constants/Colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Stack, router } from 'expo-router'
import SText, { Sizes } from '@/components/StyledText'
import ChatGroup from '@/ui/chatGroup'
import { normalizeGroup } from '@/service/groupsNormalize'

export default function Chat() {
  const insets = useSafeAreaInsets()

  const socket = useContext(WebsocketContext)
  const isReady = socket?.isReady
  const ws = socket?.ws
  const chatList = socket?.chatList?.chats

  const groups = normalizeGroup(chatList)




  return (
    <>
      <Stack.Screen options={{
        headerShown: true,
        headerBackButtonMenuEnabled: false,
        headerBackVisible: false,
        headerTitleAlign: 'center',
        headerTitle: (props) => (<View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <SText numberOfLines={1} textStyle={{ fontSize: 18, color: Colors.white, textAlign:'center' }} size={Sizes.normal}>Forum</SText>
        <SText numberOfLines={1} textStyle={{ fontSize: 12, color: '#505050', width: '100%', textAlign: 'center' }} size={Sizes.normal}>{isReady ? '' : 'Connecting...'}</SText>
    </View>),
        headerStyle: { backgroundColor: '#161616' },
        headerBackTitleVisible: false,
        headerTitleStyle: { color: Colors.white },
        headerShadowVisible: false,
        headerBlurEffect: 'dark',
        title: 'Forum'
        // headerLeft: (props) => (
        //     <TouchableOpacity onPress={() => router.back()} {...props}>
        //         <Ionicons name="chevron-back-outline" size={28} color="#6b99c3" />
        //     </TouchableOpacity>
        // ),
      }}
      />
      <View style={{ flex: 1, backgroundColor: Colors.dark, gap: 10 }}>
      
        <FlatList
          data={Array.from(groups) || []}
          renderItem={({item}) => <ChatGroup key={item[0]} text={item[0]} count={item[1]} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 70, gap: 10 }}
          style={{ paddingTop: 15, paddingHorizontal: 20, flex: 1 }}
        />
      </View>
    </>
  )
}