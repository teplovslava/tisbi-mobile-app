import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import SText, { Sizes } from './StyledText'

interface IProps{
    children?:string | JSX.Element | null,
    handler?:() => void,
    [x:string]: any
}

const Button = ({children,handler,textStyleProps,buttonStyleProps, ...props }:IProps) => {
  return (
   <TouchableOpacity {...props} style={[styles.buttonStyle, buttonStyleProps]} onPress={handler}>
        <SText textStyle={[styles.textStyle, textStyleProps]} size={Sizes.normal}>{children}</SText>
   </TouchableOpacity>
  )
}


export default Button

const styles = StyleSheet.create({
    buttonStyle:{
        padding:20,
        borderRadius:20,
    },
    textStyle:{
        fontSize:16,

    }
})