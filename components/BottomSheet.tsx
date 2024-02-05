import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'

import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';

interface IProps{
    refer?: React.Ref< BottomSheet>,
    children?: string | JSX.Element | null,
    scrollable?:boolean,
    dynamic?:boolean,
    [x:string]: any;
}

const BottomSheetContainer = ({refer, children,scrollable = false,dynamic=true, ...props}: IProps) => {
  return (
    <BottomSheet ref={refer}
        {...props}
        enableDynamicSizing={dynamic}>
       <BottomSheetScrollView scrollEnabled={scrollable}> 
           {children}
       </BottomSheetScrollView>
 </BottomSheet>
  )
}

export default BottomSheetContainer

const styles = StyleSheet.create({})

  
