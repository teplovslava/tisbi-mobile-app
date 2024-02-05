import AsyncStorage from '@react-native-async-storage/async-storage'; 

export const addValue = async (item:string, value:any)=>{ 
    try { 
      await AsyncStorage.setItem(item, value) 
    } 
    catch (e){ 
      console.error(e); 
    } 
  } 
  
export const getValue = async (item:string) => { 
      const value = await AsyncStorage.getItem(item) 
      if(value !== null) { 
          return value
      } 
  } 