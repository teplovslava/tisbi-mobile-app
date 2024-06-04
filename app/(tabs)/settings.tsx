import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useRef } from 'react'
import Colors from '@/constants/Colors'
import SText, { Sizes } from '@/components/StyledText'
import { Stack, router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useAppDispatch } from '@/store/hooks'
import { FontAwesome6 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import BottomSheetContainer from '@/components/BottomSheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Backdrop from '@/components/Backdrop'
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet'
import { LangContext } from '@/context/LanguageContext'
import { MaterialIcons } from '@expo/vector-icons';
import { clearUser } from '@/store/userSlice'
import { useAuth } from "@/context/Auth";
import { addValue } from '@/store/AsyncStorge'
import { clearSchedule } from '@/store/scheduleSlice'

const Settings = () => {
    const insets = useSafeAreaInsets()
    const langBottomSheetRef = useRef<BottomSheet>(null)
    const lang = useContext(LangContext)
    const dispatch = useAppDispatch()
    const { signOut } = useAuth();

    const langList = ['Русский', 'English']

    return (
        <>
            <Stack.Screen options={{
                headerShown: true,
                headerBackButtonMenuEnabled: false,
                headerBackVisible: false,
                headerTitleAlign: 'center',
                headerTitle: (props) => (<SText textStyle={{ fontSize: 18, color: Colors.white }} size={Sizes.normal}>Settings</SText>),
                headerStyle: { backgroundColor: '#161616' },
                headerBackTitleVisible: false,
                headerTitleStyle: { color: Colors.white },
                headerShadowVisible: false,
                headerBlurEffect: 'dark',
                headerLeft: (props) => (
                    <TouchableOpacity onPress={() => router.back()} {...props}>
                        <Ionicons name="chevron-back-outline" size={28} color="#6b99c3" />
                    </TouchableOpacity>
                ),
                // headerRight: (props) => (
                //     <TouchableOpacity onPress={getOnlineLessons} {...props}>
                //         <AntDesign name="reload1" size={22} color={Colors.white} />
                //     </TouchableOpacity>
                // )
            }}
            />
            <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.dark, }}>
                <ScrollView contentContainerStyle={{ flex: 1, paddingTop: 20, paddingBottom: insets.bottom + 40, gap: 10 }}>
                    <TouchableOpacity onPress={() => langBottomSheetRef.current?.collapse()} activeOpacity={0.8} style={{ backgroundColor: '#161616', marginHorizontal: 15, paddingVertical: 15, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 15 }}>
                        <SText size={Sizes.normal} textStyle={{ color: Colors.white, fontSize: 18 }}>Language</SText>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                            <SText size={Sizes.normal} textStyle={{ color: Colors.grey, fontSize: 18 }}>{lang?.lang}</SText>
                            <FontAwesome6 name="chevron-right" size={16} color={Colors.grey} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        signOut()
                        dispatch(clearUser())
                        dispatch(clearSchedule())
                    }
                    } activeOpacity={0.8} style={{ backgroundColor: '#161616', marginHorizontal: 15, paddingVertical: 15, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 15 }}>
                        <SText size={Sizes.normal} textStyle={{ color: Colors.orange, fontSize: 18, textAlign: 'center' }}>Log out</SText>
                    </TouchableOpacity>

                </ScrollView>
                <View style={{ position: 'absolute', bottom: insets.bottom + 60, width: '100%' }}>
                    <TouchableOpacity onPress={() => Linking.openURL('https://t.me/Slavateplov13')} activeOpacity={0.8} style={{}}>
                        <SText size={Sizes.normal} textStyle={{ color: Colors.white, fontSize: 14, textAlign: 'center', textDecorationLine: 'underline' }}>developed by Teplov Vyacheslav</SText>
                    </TouchableOpacity>
                </View>
                <BottomSheetContainer
                    refer={langBottomSheetRef}
                    index={-1}
                    style={{ borderRadius: 40, overflow: "hidden", }}
                    containerStyle={{ borderRadius: 40, }}
                    backdropComponent={(props: any) => (
                        <Backdrop  {...props} opacity={0.8} disappearsOnIndex={-1} appearsOnIndex={0} />)}
                    handleIndicatorStyle={{ display: "none", }}>
                    <View style={{ padding: 10, paddingTop: 10, paddingBottom: insets.bottom + 80 }}>
                        <SText size={Sizes.bold} textStyle={{ textAlign: 'center', fontSize: 18, marginBottom: 20 }}>Choose language</SText>
                        {langList.map((language, i) => (
                            <TouchableOpacity key={i} onPress={() => {
                                addValue('language', language)
                                lang?.changeLang(language)
                                langBottomSheetRef.current?.close()
                            }} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: lang?.lang === language ? 10 : 15, backgroundColor: Colors.lightGrey, marginBottom: 5, paddingHorizontal: 20, borderRadius: 15 }}>
                                <SText size={Sizes.normal} textStyle={{ fontSize: 16 }}>{language}</SText>
                                {lang?.lang === language && <MaterialIcons name="done" size={24} color="#6b99c3" />}
                            </TouchableOpacity>
                        ))}
                    </View>
                </BottomSheetContainer>
            </GestureHandlerRootView>

        </>
    )
}

export default Settings

const styles = StyleSheet.create({})