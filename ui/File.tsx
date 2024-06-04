import SText, { Sizes } from "@/components/StyledText"
import { WebsocketContext } from "@/context/WebSocketContext"
import { getFile } from "@/service"
import { generateExcel } from "@/service/saveFile"
import { useAppSelector } from "@/store/hooks"
import { FontAwesome } from "@expo/vector-icons"
import { useContext, useEffect, useState } from "react"
import { ActivityIndicator, Alert, Linking, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"

export const FileView = ({ isChooseMode, file }: {isChooseMode:boolean, file: string }) => {

    const [isLoading,setLoading] = useState(false)

    const { token } = useAppSelector((store) => store.user)
    const socket = useContext(WebsocketContext)
    const currentChat = socket?.currentChat

    const id = file.split('/')[0]
    const name = file.split('/')[1].replace(';', '')
    const fileSlices = name.split('.')
    const format = fileSlices[fileSlices.length - 1].replace(';', '')



    const downloadFile = () => {
        // setLoading(true)
        Alert.alert('Ошибка', 'К сожалению, эта функция на данный момент в разработке')
        // getFile(id, currentChat.current, token)

        // .then((res) => {

           
        //     // Linking.openURL(URL.createObjectURL(res))
        //     // generateExcel(res, name, format)
        // }

        // )

        // .catch((e) => {
        //     console.log(e)
        // })
        // .finally(() => setLoading(false))
    }

    return (
        <TouchableOpacity disabled={isChooseMode} onPress={downloadFile} activeOpacity={0.5} style={{ flexDirection: 'row', gap: 10, padding:10, borderRadius:10, backgroundColor:'#262930', width:'100%',}}>
            <View style={{ position: 'relative' }}>
                <FontAwesome name="file" size={40} color="#7B68EE" />
                <SText size={Sizes.bold} textStyle={{ color: 'white', position: 'absolute', left: 0, top: 20, width: '100%', textAlign: 'center', fontSize: 10 }}>{format}</SText>
            </View>
            <SText numberOfLines={3} size={Sizes.normal} textStyle={{ fontSize: 14, color: '#fff', flexGrow:1, flexShrink:1}}>{name}</SText>
            {isLoading ? <ActivityIndicator size={"small"}/> : <View style={{width:20, height:20}}></View>}

        </TouchableOpacity>
    )

}