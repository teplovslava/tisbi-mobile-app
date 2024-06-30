import { StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import Colors from '@/constants/Colors'
import SText, { Sizes } from '@/components/StyledText'
import BottomSheetContainer from '@/components/BottomSheet'
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler'
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import SmallCalendar from '@/components/SmallCalendar'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet'
import { setDate } from '@/store/dateSlice'
import { DatePicker } from '../../../components/BigCallendar/datePicker/DatePicker'
import dayjs from 'dayjs'
import { getSchedule } from '@/service'
import { filterSchedule } from '@/service/filterSchedule'
import { ISchedule } from '@/interface'
import Loader from '@/components/Loader'
import ScheduleItem from '@/components/ScheduleItem'
import { setSchedule } from '@/store/scheduleSlice'
import Empty from '@/components/EmptyAnimation'
import Backdrop from '@/components/Backdrop'
import DetailsItem from '@/components/DetailsItem'
import { setDetails } from '@/store/detailsSlice'
import { Stack, router } from 'expo-router'
import { LangContext } from '@/context/LanguageContext'

let map = new Map()

const Main = () => {
  const { height, width } = useWindowDimensions()
  const insets = useSafeAreaInsets()

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const storedSchedule = useAppSelector((state) => state.schedule);
  const currentDate = useAppSelector((state) => state.date.date);
  const { role } = useAppSelector((state) => state.user)
  const currLang = useContext(LangContext)



  const bottomRef = useRef<BottomSheet>(null)
  const calendarRef = useRef<BottomSheet>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [isOpened, setOpened] = useState(false)
  const [sched, setSched] = useState<number>(0)

  useEffect(() => {
    let canceled = false;
    calendarRef.current?.close()
    setOpened(false)

    const hash = user
      ? user.user?.studentHash
        ? user.user.studentHash
        : user.user.staffHash
      : ''

    if (!storedSchedule[currentDate]) {
      setLoading(true)
      getSchedule(user.token, hash, currentDate, role)
        .then(res => {
          if (!canceled) {
            dispatch(setSchedule([currentDate, filterSchedule(res, currentDate)]))
          }
        })
        .catch((e) => {
          if (!canceled) alert(e)
        })
        .finally(() => setLoading(false))
    }

    return () => {
      canceled = true;
    }

  }, [currentDate])

  function toggleCalendar() {
    if (!isOpened) {
      calendarRef.current?.snapToIndex(0)
    } else {
      calendarRef.current?.close()
    }
    setOpened(prev => !prev)
  }

  function closeCalendar() {
    calendarRef.current?.close()
    setOpened(false)
  }

  function handleItemPress(item: ISchedule) {
    bottomRef.current?.collapse()
    dispatch(setDetails(item))
  }




  const snapPoints = useMemo(() => ['20%', height - 250], []);
  return (
    <>
      <GestureHandlerRootView style={{ flex: 1,backgroundColor: Colors.dark, gap: 10,  }}>
        <View style={{ flex: 1, backgroundColor: Colors.black, gap: 10}}>
          <View style={{ marginTop: insets.top + 20, paddingHorizontal: 20, flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <SText size={Sizes.bold} textStyle={{ color: Colors.light, fontSize: 28 }}>{dayjs(currentDate).format('DD')}</SText>
                <SText size={Sizes.normal} textStyle={{ color: Colors.main, fontSize: 28 }}>{dayjs(currentDate).format('MMMM')}</SText>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                <TouchableOpacity onPress={() => router.push('/(tabs)/(main)/onlineSchedule')} style={{ padding: 5 }}>
                  <Feather name="monitor" size={24} color={Colors.light} />
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 5 }} onPress={toggleCalendar}>
                  <Ionicons name="calendar-outline" size={24} color={isOpened ? Colors.main : Colors.light} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={[{ width: '100%' }]}>
            </View>
            <SmallCalendar />
            <View style={{ flex: 1 }}>
              {
                loading ? (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Loader /></View>)
                  : !storedSchedule[currentDate]?.length
                    ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                      <SText size={Sizes.normal} textStyle={{ color: Colors.light, fontSize: 18 }}>No lessons</SText>
                      <Empty />
                    </View>
                    : <FlatList
                      contentContainerStyle={{ paddingTop: 40, gap: 10, paddingBottom: insets.bottom + 60 }}
                      showsVerticalScrollIndicator={false}
                      data={storedSchedule[currentDate]}
                      keyExtractor={(_, i) => i.toString()}
                      renderItem={({ item, index }: { item: ISchedule, index: number }) => <ScheduleItem handler={(el) => handleItemPress(el)} index={index} item={item} />}
                    />
              }
            </View>
          </View>
          <BottomSheetContainer
            backgroundStyle={{backgroundColor:Colors.lightBlack}}
            refer={bottomRef}
            enablePanDownToClose
            style={{ borderTopLeftRadius: 40, borderTopRightRadius: 40, overflow: 'hidden', backgroundColor: '#00bf8f' }}
            backdropComponent={(props: any) => (
              <Backdrop {...props} opacity={0.6} disappearsOnIndex={-1} appearsOnIndex={0} />)}
            index={-1}>
            <View style={{ padding: 20, paddingBottom: insets.bottom + 90 }}>
              <DetailsItem />
            </View>
          </BottomSheetContainer>
          <BottomSheetContainer
            index={-1}
            refer={calendarRef}
            backgroundStyle={{backgroundColor:Colors.lightBlack}}
            style={{ borderRadius: 40, overflow: "hidden", padding: 15, paddingTop: 0 }}
            containerStyle={{ margin: 20, borderRadius: 40, marginBottom: insets.bottom + 60 }}
            backdropComponent={(props: any) => (
              <Backdrop onPress={closeCalendar} {...props} opacity={0.8} disappearsOnIndex={-1} appearsOnIndex={0} />)}
            handleIndicatorStyle={{ display: "none", }}>
            <View>
              <TouchableOpacity
                onPress={closeCalendar}
                style={{ padding: 2, backgroundColor: Colors.lightGrey, borderRadius: 100, marginLeft: 'auto', marginTop: 5, marginRight: 5 }}>
                <Ionicons name="close" size={18} color={Colors.dark} />
              </TouchableOpacity>
              <DatePicker
                onDateChange={(date) => {
                  const formatedDate = dayjs(date).format('YYYY-MM-DD')
                  if (currentDate === formatedDate) return
                  dispatch(setDate(formatedDate))
                }}
                isGregorian={currLang?.lang === 'English'}
                options={{
                  backgroundColor: Colors.lightBlack,
                  textHeaderColor: Colors.main,
                  textDefaultColor: '#fff',
                  selectedTextColor: '#fff',
                  mainColor: '#085CFB',
                  textSecondaryColor: Colors.darkGrey,
                  textFontSize: 12,
                  borderColor: 'transparent',
                }}
                current={currentDate}
                selected={currentDate}
                style={{ marginVertical: 25 }}
                mode="calendar" />
            </View>
          </BottomSheetContainer>
        </View>
      </GestureHandlerRootView>
    </>
  )
}

export default Main

const styles = StyleSheet.create({})