import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { LegacyRef, useRef, useState } from "react";
import Colors from "@/constants/Colors";

interface IPropsInput {
  change: (val:string) => void;
  icon1?: string | JSX.Element;
  handler?: () => void;
  placeHolder?: string;
  secret?: boolean;
  [x: string]: any;
}


interface IPropsInputPass extends IPropsInput {
  icon2?: string | JSX.Element;
  icon3?: string | JSX.Element;
}

export const Input = ({
  icon1,
  change,
  handler,
  placeHolder,
  secret = false,
  styleProps,
  containerStyleProps,
  ...props
}: IPropsInput) => {
  const [val, setVal] = useState<string | null>();
  const [visible, setVisible] = useState<boolean>(secret)

  return (
    <View
      style={[styles.container,containerStyleProps,{ backgroundColor: Colors.dark },]}
    >
      {icon1 && icon1}
      <TextInput
        {...props}
        placeholderTextColor={Colors.darkGrey}
        style={[styles.input, styleProps]}
        onChangeText={(value) => {
          setVal(value)
          change(value)
        }}
        placeholder={placeHolder}
        secureTextEntry={visible}
      />
    </View>
  );
};



export const InputPass = ({
  change,
  icon1,
  icon2,
  icon3,
  handler,
  placeHolder,
  secret = false,
  styleProps,
  containerStyleProps,
  ...props
}:IPropsInputPass) => {
  const [val, setVal] = useState<string | null>();
  const [visible, setVisible] = useState<boolean>(secret)
  return (
    <View style={[styles.container,containerStyleProps,{ backgroundColor: Colors.dark },]}
    >
      {icon1 && icon1}
      <TextInput
        {...props}
        placeholderTextColor={Colors.darkGrey}
        style={[styles.input, styleProps]}
        onChangeText={(value) => {
          setVal(value)
          change(value)
        }}
        placeholder={placeHolder}
        secureTextEntry={visible}
      />
      {icon2 && <TouchableOpacity
        style={{ padding: 5 }}
        onPress={() => setVisible(prev => !prev)}>
        {!visible ? icon2 : icon3}
      </TouchableOpacity>}
    </View>
  )
}



const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
    paddingHorizontal: 10,
    borderRadius: 24,
    paddingRight: 15
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 18,
    fontFamily:'GilroyRegular',
    color:Colors.lightGrey
  },
});
