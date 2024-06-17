import SText, { Sizes } from "@/components/StyledText";
import { StatusBar } from "expo-status-bar";
import { Alert, Keyboard, KeyboardAvoidingView, StyleSheet, View } from "react-native";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/userSlice";
import { useContext, useEffect, useRef, useState } from "react";
import { getHash, getRoleInfo, getRoleList, getToken } from "@/service";
import BottomSheet, { TouchableOpacity } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Backdrop from "@/components/Backdrop";
import Colors from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomSheetContainer from "@/components/BottomSheet";
import Button from "@/components/Button";
import { Input, InputPass } from "@/components/Input";
import { FontAwesome } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { Feather } from '@expo/vector-icons';
import Loader from "@/components/Loader";
import { useAuth } from "@/context/Auth";
import { LangContext } from "@/context/LanguageContext";
import * as Haptics from 'expo-haptics';
import { addValue, getValue } from "@/store/AsyncStorge";
import * as LocalAuthentication from 'expo-local-authentication';
import authenticate from "@/service/biometric";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Auth() {
  const dispatch = useAppDispatch();
  const [roleList, setRoleList] = useState<any>(null);
  const [currRole, setCurrRole] = useState('')
  const [currentRole, setCurrentRole] = useState('');
  const [open, setOpen] = useState<boolean>(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [savedAuthData, setSavedAuthData] = useState('')

  const currLang = useContext(LangContext)

  const [loading, setLoding] = useState<boolean>(true);

  const [login, setLogin] = useState<string>('')
  const [pass, setPass] = useState<string>('')
  const [currToken, setToken] = useState('')
  const [routeLink, setRouteLink] = useState('')

  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();


  useEffect(() => {
    checkAndGetAuthData()
  }, [])


  function checkAndGetAuthData() {
    getValue('user-login')
      .then((res) => {
        if (res && typeof res === 'string') {
          const data = JSON.parse(res as string)
          setSavedAuthData(data.login)
          authenticate(data.login).then((result) => {
            if (result) {
              handleLogin(data.login, data.password)
            } else {
              setLoding(false)
            }
          })
        } else {
          setLoding(false)
        }
      })
      .catch((e) => {
        console.log(e)
        setLoding(false)
      })
  }




  function handleLogin(login: string, password: string) {
    Keyboard.dismiss()
    setLoding(true)

    getToken(login, password)
      .then((res) => {
        setToken(res)
        addValue('user-login', JSON.stringify({ login, password }))
        setSavedAuthData(login)
        return getRoleList(res)
      })
      .catch((e) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        alert('Неверный логин или пароль')
      })
      .then((res) => {
        if (res) {
          setRoleList(res);
          bottomSheetRef.current?.collapse();
          setOpen(true);
        }
      })
      .catch((e) => alert('Ошибка!' + e))
      .finally(() => setLoding(false))
  }

  function continueEntrance() {
    let token = currToken
    bottomSheetRef.current?.close()
    setLoding(true)
    getRoleInfo(token, currentRole)
      .then(res => {
        token = res
        return getHash(res, routeLink)

      })
      .catch(e => alert(e))
      .then(res => {
        if (res) {
          signIn()
          dispatch(setUser({ user: res, token, role: currRole }))
          setCurrentRole('')
          setRoleList(null)
        }
      })
      .catch(e => alert(e))
      .finally(() => setLoding(false))
  }


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style={open ? "light" : "dark"} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding'>
        <View
          style={{ flex: 1, backgroundColor: Colors.white, padding: 20, alignItems: "center", justifyContent: "center" }}
        >
          {
            savedAuthData && <SText textStyle={{ fontSize: 20, textAlign: "center", marginBottom: 5 }} size={Sizes.normal}>
              {savedAuthData},
            </SText>
          }
          <View style={{ width: "100%", marginHorizontal: 10, gap: 15 }}>

            <SText textStyle={{ fontSize: 20, textAlign: "center", marginBottom: 20 }} size={Sizes.normal}>
              Welcome !
            </SText>
            <Input change={(val: string) => setLogin(val)} containerStyleProps={{ width: "100%" }} placeHolder={currLang?.lang === 'Русский' ? 'Логин/Е-маил' : 'Login/Email'} icon1={
              <View style={{ paddingVertical: 8, paddingHorizontal: 10, borderRadius: 14, backgroundColor: Colors.white }}>
                <FontAwesome name="user" size={20} color="black" />
              </View>
            }
            />
            <InputPass change={(val: string) => setPass(val)} containerStyleProps={{ width: "100%" }} placeHolder={currLang?.lang === 'Русский' ? 'Пароль' : "Password"} icon1={
              <View style={{ paddingVertical: 8, paddingHorizontal: 10, borderRadius: 14, backgroundColor: Colors.white }}>
                <Octicons name="lock" size={20} color="black" />
              </View>
            }
              icon2={<Feather name="eye" size={16} color="black" />}
              icon3={<Feather name="eye-off" size={16} color="black" />}
              secret={true}
            />
            <View style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, marginHorizontal: 20 }}>
              <SText size={Sizes.normal} textStyle={{ color: Colors.dark, fontSize: 12, textAlign: 'center' }}>For log in to the application, use your credentials from the personal account of the ISU University</SText>
            </View>
            <Button
              disabled={login.length < 2 || pass.length < 7}
              handler={() => handleLogin(login, pass)}
              buttonStyleProps={{ backgroundColor: Colors.dark, marginTop: 30, opacity: (login.length < 2 || pass.length < 7) ? 0.1 : 1 }}
              textStyleProps={{ textAlign: "center", color: Colors.light }}
            >
              Enter
            </Button>
            {
              savedAuthData && <TouchableOpacity
                onPress={() => {
                  AsyncStorage.removeItem('user-login')
                  setSavedAuthData('')
                }}
                style={{marginTop:10}}
              >
                <SText textStyle={[{color: Colors.dark, textAlign:'center', fontSize:14} ]} size={Sizes.normal}>Выйти из учетной записи {savedAuthData}</SText>
              </TouchableOpacity>
            }
          </View>
        </View>
      </KeyboardAvoidingView>
      <BottomSheetContainer
        index={-1} refer={bottomSheetRef}
        style={{ borderRadius: 40, overflow: "hidden" }}
        containerStyle={{ margin: 20, borderRadius: 40, marginBottom: insets.bottom + 10, }}
        handleIndicatorStyle={{ display: "none" }}
        scrollable
        backdropComponent={(props: any) => (
          <Backdrop {...props} opacity={0.7} pressBehavior={false} disappearsOnIndex={-1} appearsOnIndex={0} />
        )}
      >
        <View style={{ flex: 1, margin: 20, marginTop: 0 }}>
          <SText textStyle={styles.textStyle} size={Sizes.normal}>
            Choose role
          </SText>
          <View style={{ gap: 10 }}>
            {roleList?.map((role: any) => (
              <Button handler={() => {
                setCurrRole(role.roleTypeName)
                setRouteLink(role.internetPageName)
                setCurrentRole(role.peopleRoleId)
              }
              } activeOpacity={0.7} key={role.peopleRoleId}
                buttonStyleProps={{ backgroundColor: currentRole === role.peopleRoleId ? Colors.main : Colors.lightGrey }}
                textStyleProps={{ color: currentRole === role.peopleRoleId ? Colors.white : Colors.grey }}
              >
                {role.roleTypeName}
              </Button>
            ))}
          </View>
          {currentRole && (
            <Button
              handler={() => continueEntrance()}
              buttonStyleProps={{ backgroundColor: Colors.dark, marginTop: 30 }}
              textStyleProps={{ textAlign: "center", color: Colors.light }}
            >
              Enter
            </Button>
          )}
        </View>
      </BottomSheetContainer>
      {loading && <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.75)', position: 'absolute', zIndex: 100000000000, top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ backgroundColor: Colors.white, borderRadius: 40, padding: 20 }}>
          <Loader />
        </View>
      </View>}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red",
  },
  textStyle: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 30,
  },
  roleChooseBtn: {
    padding: 20,
    borderRadius: 20,
  },
  roleChooseBtnText: {
    fontSize: 16,
  },
});
