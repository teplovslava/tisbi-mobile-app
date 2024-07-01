import { TouchableOpacity, View, Text, StyleSheet, Platform } from "react-native";

import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useContext, useState } from "react";
import { BlurView } from 'expo-blur';
import { FontAwesome6 } from '@expo/vector-icons';
import Colors from "@/constants/Colors";
import Animated, {useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import SText, { Sizes } from "@/components/StyledText";
import { useSegments } from "expo-router";
import { WebsocketContext } from "@/context/WebSocketContext";
import { normalizeGroup } from "@/service/groupsNormalize";
import Notification from "./notification";
import * as Haptics from 'expo-haptics';

type IProps = BottomTabBarProps & {
  icons:string[]
}

const TabBar = (props: IProps) => {
  const { insets, state, navigation, descriptors,icons } = props

  const socket = useContext(WebsocketContext)
  const chatList = socket?.chatList
  const notification = chatList?.chats.reduce((accumulator, currentValue) => accumulator + currentValue.chat.UnreadCnt,0)
  const segments = useSegments();

  // if screen is in the home or live stack, hide the tab bar
  const hide = segments.includes("chatWindow" as never) || segments.includes("videoCall" as never)

  const bottomStyle = useAnimatedStyle(() => {
    return {
      bottom: withTiming(hide ? -100 : 0, {
        duration: 100
      })
    };
  });




  return (
    <Animated.View style={[styles.container, bottomStyle]}>
    <BlurView experimentalBlurMethod="dimezisBlurView" intensity={Platform.OS === 'ios' ? 20 : 2} style={[styles.blur,{paddingBottom: insets.bottom}]} >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];

        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;


        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            // @ts-ignore
            navigation.navigate({ name: route.name, merge: true });
          }
        };

        return (
          <TouchableOpacity
            activeOpacity={1}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            key={route.key}
            style={{paddingBottom:5, alignItems:'center', justifyContent:'center', gap:5}}
          >
            <FontAwesome6 name={icons[index]} size={20} color={isFocused ? Colors.main : Colors.lightGrey}/>
            <SText textStyle={{ fontSize: 12, color:isFocused ? Colors.main : Colors.lightGrey }} size={Sizes.normal}>
              {label as string}
            </SText>
            {
              (index === 1 && notification) ? (<Notification notification={String(notification)}/>) : null
            }
          </TouchableOpacity>
        );
      })}

    </BlurView>
    </Animated.View>

  )

}

export {TabBar}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'absolute',
    backgroundColor:'transparent'

  },
  blur:{
    width: '100%',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-around',
    backgroundColor:'rgba(0,0,0,.75)',
    paddingTop:10
  },
  // background: {
  //   flex: 1,
  //   flexWrap: 'wrap',
  //   ...StyleSheet.absoluteFill,
  // },
  // box: {
  //   width: '25%',
  //   height: '20%',
  // },
  // boxEven: {
  //   backgroundColor: 'orangered',
  // },
  // boxOdd: {
  //   backgroundColor: 'gold',
  // },
  text: {
    fontSize: 10,
    fontWeight: '300',
  },
});