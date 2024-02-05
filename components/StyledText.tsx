import { StyleSheet, Text } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { LangContext } from '@/context/LanguageContext'
import Languages from '@/constants/Languages'

export enum Sizes {
  light,
  normal,
  bold
}


interface IProps {
  children?: string | JSX.Element | null | string[] | JSX.Element[],
  size?: Sizes,
  textStyle?:React.CSSProperties | string | any;
  [x:string] : any
}

const SText = ({ children, size = Sizes.light, textStyle, ...props }: IProps) => {

  const lang = useContext(LangContext)?.lang;
  const [currLang,setCurrLang] = useState<any>(Languages.ru)

  useEffect(() => {

    switch (lang) {
      case 'Русский': setCurrLang(Languages.ru)
        break
      case 'English': setCurrLang(Languages.eng)
        break
      default: setCurrLang(Languages.ru)
    }


  }, [lang])


  const currWord = typeof children === 'string'
    ? typeof(currLang[children]) !== 'undefined'
      ? currLang[children]
      : children
    : children

  return (
    <Text {...props} style={[textStyle, {
      fontFamily: size === Sizes.light
        ? 'GilroyThin'
        : size === Sizes.normal
          ? 'GilroyRegular'
          : 'GilroyBold'
    }]}>
      {currWord}
    </Text>
  )
}

export default SText

const styles = StyleSheet.create({})