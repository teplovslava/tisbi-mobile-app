import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SText, { Sizes } from '@/components/StyledText'

const Notification = ({ notification }: { notification: string }) => {
    return (
        <View style={styles.container }>
            <SText textStyle={{ fontSize: 12, color: 'black' }} size={Sizes.normal}>{notification}</SText>
        </View>
    )
}

export default Notification

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: '80%',
        top: '-18%',
        padding:3,
        paddingHorizontal:3,
        minWidth: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        backgroundColor: '#CCFF00',
    }
})