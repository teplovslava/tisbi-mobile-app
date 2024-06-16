import { Keyboard, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { memo, useCallback, useContext, useMemo, useRef, useState } from 'react'
import OnlineUser from './onlineUser'
import { IMember } from '@/interface'
import { WebsocketContext } from '@/context/WebSocketContext'
import { FlatList, TextInput } from 'react-native-gesture-handler'
import { AntDesign } from '@expo/vector-icons'
import SText, { Sizes } from '@/components/StyledText'
import Colors from '@/constants/Colors'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

const OnlineUsers = (props: any, ref: any) => {

    const { isHalfExpanded } = props

    const socket = useContext(WebsocketContext)
    const ws = socket?.ws
    const connectedMembers = socket?.connectedMembers
    const member = socket?.member


    const leftPosValue = useSharedValue(5)

    const [value, setValue] = useState('')
    const [type, setType] = useState(0)

    const handleScroll = (event: any) => {
        const currentScrollY = event.nativeEvent.contentOffset.y;

        if (currentScrollY <= 0 && isHalfExpanded) {
            ref.current.snapToIndex(0)
        }
    };


    const elementsRef = useRef<(TouchableOpacity | null)[]>([]);

    const handlePress = (index: number) => {
        elementsRef.current[index]?.measure((x, y, width, height, pageX, pageY) => {
            setType(index)
            leftPosValue.value = withTiming(pageX - width / 8, {
                duration: 200
            })
        });
    };

    const elements = ['Все', 'Онлайн', 'Оффлайн'];

    const animatedStyle = useAnimatedStyle(() => ({
        left: leftPosValue.value,
    }));

    const isShown = useCallback((active: boolean) => {
        switch (type) {
            case 0:
                return true
            case 1:
                return active;
            case 2:
                return !active;
            default:
                return true;
        }
    }, [type])

    const allCount = member?.members.length || 0
    const onlineCounts = useCallback(() => {
        
        return (
          member?.members.reduce((acc, item) => {
            return connectedMembers?.findIndex((person: any) => person.user === item.PeopleRoleID) >= 0 ? acc + 1 : acc;
          }, 0) || 0
        );
      }, [member?.members, connectedMembers]);
    
      const counts = useMemo(() => {
        const onlineCount = onlineCounts();
        return [allCount, onlineCount, allCount - onlineCount];
      }, [allCount, onlineCounts]);

    return (

        <View style={{ paddingHorizontal: 20, paddingTop: 10, height: '100%' }}>
            <TouchableOpacity
                style={{ padding: 5, backgroundColor: '#303030', marginLeft: 'auto', marginBottom: 10, borderRadius: 20, marginTop: -10 }}
                onPress={() => {
                    Keyboard.dismiss()
                    ref?.current?.forceClose()
                }}>
                <AntDesign name="close" size={20} color="white" />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', backgroundColor: '#303030', borderRadius: 12, marginBottom: 10 }}>
                <Animated.View style={[{ width: '30%', backgroundColor: '#202020', height: 30, position: 'absolute', borderRadius: 7 }, animatedStyle]} />
                {elements.map((element, index) => (
                    <TouchableOpacity
                        key={index}
                        ref={(el) => (elementsRef.current[index] = el)}
                        onPress={() => handlePress(index)}
                        style={{ padding: 12, width: '33.3%' }}
                    >
                        <SText size={Sizes.normal} textStyle={{ color: Colors.white, textAlign: 'center' }}>{element} ({String(counts[index])})</SText>
                    </TouchableOpacity>
                ))}
            </View>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <TextInput placeholder='Поиск...' style={{ padding: 10, marginBottom: 10, fontFamily: 'GilroyRegular', backgroundColor: '#303030', borderRadius: 12 }} onFocus={() => ref?.current?.snapToIndex(1)} onChangeText={setValue}
                    value={value} onCancelled={() => ref?.current?.forceClose()} />
            </TouchableWithoutFeedback>
            <FlatList
                bounces
                scrollEnabled={isHalfExpanded}
                onScroll={handleScroll}
                contentContainerStyle={{ paddingVertical: 20 }}
                showsVerticalScrollIndicator={false}
                data={member?.members || []}
                renderItem={({ item }) => {
                    const active = connectedMembers?.findIndex((person: any) => person.user === item.PeopleRoleID) >= 0
                    return <OnlineUser showed={item.MemberName.includes(value) && isShown(active)} online={active} name={item.MemberName} role={item.MemberInfo} />
                }}
            />
        </View>
    )
}

export default memo(React.forwardRef(OnlineUsers))

const styles = StyleSheet.create({})