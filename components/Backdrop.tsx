import { StyleSheet, Text, View } from 'react-native'
import React, { useCallback } from 'react'
import { BottomSheetBackdrop } from '@gorhom/bottom-sheet';

const Backdrop = (props:any) => (
      <BottomSheetBackdrop
        {...props}
        style={{backgroundColor:'black', position:'absolute', top:0, left:0, right:0, bottom:0}}
      >{props?.children}</BottomSheetBackdrop>
  );

export default Backdrop

const styles = StyleSheet.create({
    
})