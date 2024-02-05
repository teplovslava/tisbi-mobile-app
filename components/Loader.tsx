import { StyleSheet, Text, View } from 'react-native'
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef } from 'react'

const Loader = () => {
    const animationRef = useRef<LottieView>(null);

    useEffect(() => {
      animationRef.current?.play();
  
      // Or set a specific startFrame and endFrame with:
      animationRef.current?.play(0, 24);
    }, []);
  
    return (
      <LottieView
      style={{height:100, width:100}}
        ref={animationRef}
        source={require('../assets/animations/Animation - 1706378631468.json')}
      />
    );
  
}

export default Loader

const styles = StyleSheet.create({})