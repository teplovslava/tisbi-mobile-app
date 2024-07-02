import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Stack, router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import Colors from '@/constants/Colors'
import SText from '@/components/StyledText'





const VideoCall = () => {

    return (
        <>
            <Stack.Screen
                options={{
                    headerLeft: (props) => (
                        <TouchableOpacity onPress={() => {
                            router.back()

                        }} {...props}>
                            <Ionicons name="chevron-back-outline" size={28} color={Colors.main} />
                        </TouchableOpacity>
                    ),
                    headerTransparent: true,
                    headerTitle: ''

                }}
            />
            <View style={{ backgroundColor: Colors.black, flex: 1 }}>


            </View>

        </>
    )
}

export default VideoCall

const styles = StyleSheet.create({})