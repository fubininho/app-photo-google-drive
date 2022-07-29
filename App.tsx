import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Button,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {googleApi,googleApiUpload} from '../app-photo-google-drive/api/request';
import * as FileSystem from 'expo-file-system';
// import { useAutoDiscovery } from 'expo-auth-session';
// import { Buffer } from 'buffer'
// const RFNS = require('react-native-fs')
import { utf8toBin, binToUtf8 } from 'utf8-binary';


export default function App() {

  const [image, setImage] = React.useState<null | ImagePicker.ImageInfo>(null);

  const [hasGalleryPermission, setHasGalleryPermission] = React.useState<null | boolean>(null);

  // Tutorial de login no google: 
  // Login no Google https://docs.expo.dev/guides/authentication/#google
  // Passo 1: criar app na google https://console.developers.google.com/apis/credentials
  // Passo 2: seguir os passos da documentação do expo para criar as client keys https://docs.expo.dev/guides/authentication/#google
    // Escopos mínimos das client keys: ['openid', 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
  // Passo 3: usar esse vío para fazer o login https://www.youtube.com/watch?v=hmZm_jPvWWM
  
  const [accessToken, setAccessToken] = React.useState();
  const [userInfo, setUserInfo] = React.useState();
  // requesição de login no google
  // const discovery = useAutoDiscovery('https://accounts.google.com');
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '330310690010-1sftd7h176igv51umi1c76dcbbt9pbgv.apps.googleusercontent.com',
    usePKCE: false,
    prompt: 'consent',
    scopes: ['https://www.googleapis.com/auth/photoslibrary','https://www.googleapis.com/auth/photoslibrary.appendonly','https://www.googleapis.com/auth/photoslibrary.sharing',
    "https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/drive.appdata"],
    // redirectUri: "exp://127.0.0.1:19000/",
  }, );

  // conseguindo o access token
  React.useEffect(() => {
    if (response?.type === 'success'){
      setAccessToken(response.authentication.accessToken)
      setAsyncStorage('google_access_token',response.authentication.accessToken)
      console.log(response)
    }
  }, [response])

  async function setAsyncStorage(keyword:string,accessToken:string) {
    await AsyncStorage.setItem(keyword, accessToken);
  }

  // Conseguir as informações do usuário
  async function getUserData() {
    let userInfoResponse = await fetch("https://www.googleapis.com/userinfo/v2/me",{
      headers: { Authorization: `Bearer ${accessToken}`}
    })

    userInfoResponse.json().then(data => {
      setUserInfo(data)
    })
  }

  // Função para ver se o login funcionou
  function showUserInfo(){
    if(userInfo){
      return (
        <View>
          <Text>{userInfo.name}</Text>
        </View>
      );
    }
  }

  function handleRefresh() {
    setImage(null);
  }

  async function handleShare() {
    console.log("CODAR AQUI:");
    // image -> googleDrive;
    // CODAR AQUI:
    // se já tem o accessToken
    if(accessToken){
      uploadToDrive();
    }
    // caso contrário, pedir para fazer o login
    else{
      console.log("Faça login")
    }
  }

  async function uploadToDrive() {
    try {
      // console.log(image)
      // const uri = image?.uri
      // console.log("Oi")
      //fazer um album
      // permitir aceesso do app à google photos api: https://console.developers.google.com/apis/api/photoslibrary.googleapis.com/overview?project=330310690010
      // criar usuário teste
      // const album = await googleApi.post('/albums',{
      //   "album": {
      //     "title": "fordasijasojfda"
      //   }}, {
      //   headers: {
      //     'Content-Type': 'application/json',
      //   }
      //   // "isWriteable": true
      // })
      // console.log(album.data.id)

      // const shareAlbum = await googleApi.post('/albums/'+album.data.id+':share',{},
      // {
      //   headers: {
      //     'Content-Type': 'application/json',
      //   }
      // })

      // console.log("Tudo bem?")
      
      // preciso acessar a photo, não só o uri
      // TODO: Falta só arrumar isso aqui mesmo
      // const bin = convertByte(utf8);
      // console.log(bin)
      // let your_bytes = Buffer.from(base64, "base64");
      // const response = await fetch(image.uri)
      // const blob = await response.blob()
      // const reader = new FileReader()
      // reader.readAsArrayBuffer()
      // var base64str = FileSystem.read .readFileSync('1.jpg', 'base64');
      // const blob = await new Promise((resolve, reject) => {
      //   const xhr = new XMLHttpRequest();
      //   xhr.onload = function () {
      //     resolve(xhr.response);
      //   };
      //   xhr.onerror = function (e) {
      //     reject(new TypeError("Network request failed"));
      //   };
      //   xhr.responseType = "blob";
      //   xhr.open("GET", image.uri, true);
      //   xhr.send(null);
      // });
      // // console.log(blob)
      // const blob = RFNS.readFile(image.uri, "base64").then(data => {
      //   // binary data
      //   console.log(data);
      //   return data
      // });
      // const getBlobFroUri = async (uri) => {
      //   const blob = await new Promise((resolve, reject) => {
      //     const xhr = new XMLHttpRequest();
      //     xhr.onload = function () {
      //       resolve(xhr.response);
      //     };
      //     xhr.onerror = function (e) {
      //       reject(new TypeError("Network request failed"));
      //     };
      //     xhr.responseType = "blob";
      //     xhr.open("GET", uri, true);
      //     xhr.send(null);
      //   });

      //   return blob;
      // };
      // const blob = await getBlobFroUri(image.uri);
      // const blob = await fetch(image.uri).blob();
      // console.log(blob)
      // const data = new FormData();
      // data.append("uploadFile", {
      //   "name": "filename",
      //   "type": image.type,
      //   "uri": image.uri
      // });
      // console.log(data)
      // const base64 = await FileSystem.readAsStringAsync(image.uri, { encoding: FileSystem.EncodingType.Base64 });
      // console.log(base64)

      // const getUploadToken = await googleApi.post('/uploads',{
      //     utf8,
      //   }, {
      //     headers: {
      //       'Content-Type': 'application/octet-stream',
      //       'X-Goog-Upload-File-Name': "name.jpg",
      //       'X-Goog-Upload-Protocol': 'raw',
      //       'X-Goog-Upload-Content-Type': 'image/jpeg'
      //     }
      //   })

      // const getUploadToken = await fetch('https://photoslibrary.googleapis.com/v1/uploads',{
      //   method: 'POST',
      //   body: base64,
      //   headers: {
      //     'Content-Type': 'application/octet-stream',
      //     // 'X-Goog-Upload-File-Name': "name.jpg",
      //     'X-Goog-Upload-Protocol': 'raw',
      //     'X-Goog-Upload-Content-Type': 'image/jpeg',
      //     'Authorization': 'Bearer ' + accessToken
      //   },
      // })
      // .then(response => response.json)
      // .then(json => console.log(json))
      // .catch(err => console.log(err));
        
      // blob.close();
      // console.log("Sim e você?",getUploadToken.data)
      // console.log("Sim e você?",getUploadToken._response)
      // console.log(getUploadToken)
      //upar imagem nesse album
      // const photo = await googleApi.post('/mediaItems:batchCreate',{
      //   "albumId": album.data.id,
      //   "newMediaItems": [
      //     {
      //       "description": "Event Photo",
      //       "simpleMediaItem": {
      //         "fileName": "filename",
      //         "uploadToken": getUploadToken["data"]
      //       }
      //     }
      //   ]
      // }) 
      // console.log("Também", photo._response.newMediaItemsResults)
      console.log(image)

      const base64 = await JSON.stringify(FileSystem.readAsStringAsync(image.uri, { encoding: 'base64' }));
      // GOOGLE DRIVE
      /**
       * Change Scopes on https://console.cloud.google.com/apis/credentials/consent?project=crested-pursuit-350121
       * Scopes: https://www.googleapis.com/auth/drive, https://www.googleapis.com/auth/drive.file, https://www.googleapis.com/auth/drive.appdata
       */
      //create folder
      const folder = await googleApi.post('/files',{
        "mimeType": "application/vnd.google-apps.folder",
        "name": "Desayuno1",
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
        // "isWriteable": true
      })
      const folder_id = folder.data.id;
      console.log(folder_id)

      //upload photo
      // const trys = await googleApiUpload.post('/files?uploadType=simple',{
      //   base64,
      //   // "mimeType": "image/jpeg",
      //   // "name": "Juve.jpg",
      //   // "parents": [folder_id]
      // }, {
      //   headers: {
      //     'Content-Type': 'image/jpeg',
      //   }
      //   // "isWriteable": true
      // })
      // console.log(trys)

      // const multipart = await  googleApiUpload.post('/files?uploadType=multipart',{
      //   "name": "Desayuno.jpg",
      //   "parents": [folder_id],
      //   "media": {
      //     "body": base64,
      //     "mimeType": "image/jpeg",
      //   }
      // }, {
      //   headers: {
      //     'Content-Type': 'application/json; charset=UTF-8',
      //   }
      // })
      // console.log(multipart)

      const first_step = await googleApiUpload.post('/files?uploadType=resumable',{
        "mimeType": "image/jpeg",
        "name": "Desayuno.jpg",
        "parents": [folder_id]
      }, {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        }
      })
      console.log(first_step.headers.location)
      
      let upload_route = first_step.headers.location;
      upload_route = upload_route.split('v3/')[1];
      
      let counter = 0
      while (counter < base64.length){
        counter += 56;
        const second_step = await googleApiUpload.put(upload_route,{
          base64
        }, {
          headers: {
            'Content-Type': 'image/jpeg',
            'Content-Lenght': 2000000,
          }
        })
        console.log(second_step)
      }
      


    } catch (err: any) {
      if (err.response) {
        console.log(err.response.data.error);

        // throwErrorMessage(err.response.data.error);
      } else {
        console.log(err)
      }
    }
  }

  async function logoutGoogle() {
    
  }


  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result);
    }
  };

  React.useEffect(() => {
    (async () => {
      const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(granted);
    })();
  }, []);

  if (hasGalleryPermission === false) {
    return (
      <Text>Acesso a galeria foi negado.</Text>
    )
  }

  return (
    <View style={styles.container}>
      <Text>app-photo-google-drive</Text>
      {image
        ?
        <View>
          <Image
            style={styles.image}
            source={{ uri: image.uri }}
          />

          <View style={styles.commands}>
            <TouchableOpacity onPress={handleRefresh} style={styles.button}>
              <FontAwesome name="refresh" size={24} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShare} style={styles.button}>
            <FontAwesome name="share-alt" size={24} color="#FFF" />
            </TouchableOpacity>
            {showUserInfo()} 
            <Button
              title={accessToken? "Get User Data":"Login"}
              onPress={accessToken ? getUserData: () => {promptAsync({showInRecents:true}) }}
            />
            {/* <Button
              title={accessToken? "Logout"}
              onPress={accessToken ? logoutGoogle: () => {promptAsync({showInRevents:true}) }}
            /> */}
          </View>
        </View>

        :
        <TouchableOpacity style={styles.button} onPress={() => pickImage()}>
          <FontAwesome name="picture-o" size={24} color="#FFF" />
        </TouchableOpacity>
      }
      <StatusBar style="auto" />
    </View>
  );
}


const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
    margin: 20,
    borderRadius: 10,
    height: 60,
    padding: 15,
    color: 'white'
  },
  image: {
    marginTop: 20,
    width: width * 0.9,
    height: width * 0.9,
    resizeMode: "cover",
    borderRadius: 10
  },
  commands: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
