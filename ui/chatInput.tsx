import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Colors from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

const ChatInput = ({reff, handler, disabled }: 
    { handler: (value: string) => any,  disabled?:boolean, reff:any}) => {
    const [value, setValue] = useState('')

    const animatedStyles = useAnimatedStyle(() => {
        return {
          marginRight: withTiming(value.trim().length ? 0 : -100)
        };
      });

    return (
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 15, flex:1 }}>
            <TextInput
                ref={reff}
                editable={!disabled}
                onChangeText={setValue}
                value={value}
                keyboardType='default'
                multiline
                placeholder={disabled ? 'Чат не активен' : 'Сообщение'}
                style={styles.input}
                placeholderTextColor="#333"
            />
            <Animated.View style={animatedStyles}>
                <TouchableOpacity disabled={disabled}  onPress={() => {handler(value); setValue('')}} style={{ borderRadius: 50, backgroundColor: Colors.blue, padding: 9, opacity:disabled ? 0.5 : 1 }}>
                    <Ionicons name="send" size={20} color={Colors.white} />
                </TouchableOpacity>
            </Animated.View>
        </View>
    )
}

export default ChatInput

const styles = StyleSheet.create({
    input: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 10,
        maxWidth:'100%',
        borderRadius: 20,
        borderWidth: 0.2,
        fontSize: 16,
        color: Colors.white,
        backgroundColor: Colors.dark
    }
})