import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import Colors from '@/constants/Colors'

const Layout = () => {
  return (
    <View style={{flex:1,backgroundColor: Colors.dark }}>
      <Stack />
    </View>
  )
}

export default Layout

const styles = StyleSheet.create({})