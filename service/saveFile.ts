import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

export const generateExcel = (
  data: any,
  name: string = "",
  format: string = ""
) => {
  if (!name) {
    name = "unknown";
  }

  // console.log(data.slice(0,10))

  // let file = new File([data], name, {
  //   type:data.type,
  //   lastModified:Date.now()
  // })

  // console.log(file)

  const filename = FileSystem.documentDirectory + `${name}.${format}`;
  FileSystem.writeAsStringAsync(filename, `blob:https://isu.tisbi.ru/${data}`, {
    encoding: FileSystem.EncodingType.Base64,
  })
    .then(() => {
      Sharing.shareAsync(filename);
    })
    .catch((e) => console.log(e));
  
  // function getBase64(file:File) {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result);
  //     reader.onerror = error => reject(error);
  //   });
  // }
  

  // getBase64(file).then(
  //   (data) => {
      
  //   }
    
  // )

  }
