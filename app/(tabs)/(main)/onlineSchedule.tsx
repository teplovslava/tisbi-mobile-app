import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Colors from '@/constants/Colors'
import { Stack, router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';
import SText, { Sizes } from '@/components/StyledText';
import { AntDesign } from '@expo/vector-icons';
import { useAppSelector } from '@/store/hooks';
import { getOnlineSchedule} from '@/service';
import { lessonsNormalize } from '@/service/onlineLessonsNormalize';
import { IOnlineLesson } from '@/interface';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import dayjs from 'dayjs';
import Loader from '@/components/Loader';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Empty from '@/components/EmptyAnimation';
import OnlineScheduleItem from '@/components/OnlineScheduleItem';

const OnlineSchedule = () => {

    
    const { token } = useAppSelector((store) => store.user)
    const [lessons, setLessons] = useState<{ [key: string]: IOnlineLesson[] | [] }>({})
    const [loading, setLoading] = useState<boolean>()


    const insets = useSafeAreaInsets()

    function getOnlineLessons() {
        setLoading(true)
        setLessons({})
        getOnlineSchedule(token)
            .then((res) => {setLessons(lessonsNormalize(res))})
            .catch((e) => alert(e))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        getOnlineLessons()
    }, [])
    return (
        <>
            <Stack.Screen options={{
                headerShown: true,
                headerBackButtonMenuEnabled:false,
                headerBackVisible:false,
                headerTitleAlign:'center',
                headerTitle: (props) => (<SText textStyle={{ fontSize: 18, color: Colors.white }} size={Sizes.normal}>Online lessons</SText>),
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
                headerRight: (props) => (
                    <TouchableOpacity onPress={getOnlineLessons} {...props}>
                        <AntDesign name="reload1" size={22} color={Colors.white} />
                    </TouchableOpacity>
                )
            }}
            />
            <View style={{ flex: 1, backgroundColor: Colors.dark, paddingHorizontal: 20 }}>
                {loading ? (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Loader /></View>)
                    : !Object.keys(lessons).length
                    ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <SText size={Sizes.normal} textStyle={{ color: Colors.white, fontSize:18}}>No lessons</SText>
                            <Empty/>
                          </View>
                    : <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={{ flex: 1 }}
                        contentContainerStyle={{ paddingTop: 20, paddingBottom: insets.bottom + 40 }}>
                        {
                            Object.keys(lessons).map((item: any, i: number) => (
                                <Animated.View key={i} entering={FadeInUp.delay(i*150)}>
                                    <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center', gap:7}}>
                                        <SText  size={Sizes.bold} textStyle={{ color: Colors.white, marginBottom: 10, fontSize: 20, textAlign: 'center' }}>{dayjs(item).format('DD')}</SText>
                                        <SText  size={Sizes.bold} textStyle={{ color: Colors.white, marginBottom: 10, fontSize: 20, textAlign: 'center' }}>{dayjs(item).format('MMMM')}</SText>
                                    </View>
                                    <View style={{ gap: 10, marginBottom: 20 }}>
                                        {lessons[item].map((lesson: IOnlineLesson, index: number) => <OnlineScheduleItem key={index} lesson={lesson}/>)}
                                    </View>
                                </Animated.View>
                            ))
                        }

                    </ScrollView>
                }
            </View>

        </>
    )
}

export default OnlineSchedule

const styles = StyleSheet.create({})



