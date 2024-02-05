import { getValue } from "@/store/AsyncStorge";
import { createContext, useEffect, useState } from "react";

export const LangContext = createContext<ILangContext | null>(null);

export interface ILangContext{
    lang:string,
    changeLang:(newLang:string) => void
}


const LanguageContext = ({children}: {children:JSX.Element}) => {
    const [lang,setLang] = useState('Русский')

    function changeLang(newLang:string):void{
        setLang(newLang)
    }

    useEffect(()=>{
        getValue('language').then((res) => {
            if(res){
                setLang(res)
            }else{
                setLang('Русский')
            }
        })
    },[])

  return (
    <LangContext.Provider value={{lang,changeLang}}> 
        {children}
    </LangContext.Provider>
  )
}

export default LanguageContext

