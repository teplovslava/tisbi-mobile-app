export  const memoization = (map: any, key:string, value:any) => {
    if(map.has(key)){
        return map.get(key)
    }else{
        map.set(key, value)
    }
}