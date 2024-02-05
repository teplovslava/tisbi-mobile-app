import { StyleSheet, Text, View } from 'react-native'
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef } from 'react'

const Empty = () => {
    const animationRef = useRef<LottieView>(null);

    useEffect(() => {
      animationRef.current?.play();
  
      // Or set a specific startFrame and endFrame with:
      animationRef.current?.play(0, 234);
    }, []);
  
    return (
      <LottieView
      speed={1.3}
      style={{height:300, width:300}}
        ref={animationRef}
        source={require('../assets/animations/Animation - 1706691079042.json')}
      />
    );
  
}

export default Empty

const styles = StyleSheet.create({})