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

// import * as Google from 'expo-google-sign-in';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {googleApi} from '../app-photo-google-drive/api/request';

export default function App() {

  const [image, setImage] = React.useState<null | ImagePicker.ImageInfo>(null);

  const [hasGalleryPermission, setHasGalleryPermission] = React.useState<null | boolean>(null);

  // Google
  const [accessToken, setAccessToken] = React.useState();
  const [userInfo, setUserInfo] = React.useState();
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '330310690010-1sftd7h176igv51umi1c76dcbbt9pbgv.apps.googleusercontent.com'
  });

  React.useEffect(() => {
    if (response?.type === 'success'){
      setAccessToken(response.authentication.accessToken)
    }
  }, [response])

  async function getUserData() {
    let userInfoResponse = await fetch("https://www.googleapis.com/userinfo/v2/me",{
      headers: { Authorization: `Bearer ${accessToken}`}
    })

    userInfoResponse.json().then(data => {
      setUserInfo(data)
    })
  }

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
    // login
    // https://docs.expo.dev/guides/authentication/#google
    // Passo 1: criar app na google https://console.developers.google.com/apis/credentials
    // Passo 2: seguir os passos da documentação do expo https://docs.expo.dev/guides/authentication/#google
    // Enforces minimum scopes to ['openid', 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
    // const [request, response, promptAsync] = Google.useAuthRequest({
    //   expoClientId: '330310690010-1sftd7h176igv51umi1c76dcbbt9pbgv.apps.googleusercontent.com'
    // });
    // console.log(response)

    // image -> googleDrive;
    // CODAR AQUI:
  }

  // async function uploadToDrive() {
  //   try {
  //     // const uri = Platform.OS === 'android' ? route.params.image : route.params.image.replace('file://', '');
  //     //logar o usurio no google
  //     const accessToken = await loginGoogle();
  //     await AsyncStorage.setItem('google_access_token', accessToken);

  //     //fazer um album
  //     const album = await googleApi.post('/albums',{
  //       "album": {
  //         "title": "new-album-title"
  //       }                
  //     })

  //     // preciso acessar a photo, não só o uri
  //     const getUploadToken = (photo) => {
  //       googleApi.post('/uploads',{
  //         photo
  //       }, {
  //         headers: {
  //           'Content-Type': 'application/octet-stream',
  //           'X-Goog-Upload-File-Name': "name",
  //           'X-Goog-Upload-Protocol': 'raw'
  //         }
  //       })
  //     }

  //     //upar imagem nesse album
  //     const photo = await googleApi.post('/mediaItems:batchCreate',{
  //       "albumId": album["id"],
  //       "newMediaItems": [
  //         {
  //           "description": "Event Photo",
  //           "simpleMediaItem": {
  //             "uploadToken": getUploadToken
  //           }
  //         }
  //       ]
  //     })


      
  //   } catch (err: any) {
  //     if (err.response) {
  //       console.log(err.response);

  //       // throwErrorMessage(err.response.data.error);
  //     } else {
  //       console.log(err)
  //     }
  //   }
  // }

  // async function loginGoogle() {
  //   // First- obtain access token from Expo's Google API
  //   // Falta fazer a configuração para o login https://developers.google.com/photos/library/guides/get-started
  //   // qual é o config
  //   const { type, accessToken, user } = await Google.logInAsync({
  //     clientId: "android_client_id",
  //     scopes: ['profile', 'email'],
  //   });

  //   if (type === 'success') {
  //     // Then you can use the Google REST API
  //     return accessToken;
  //     // let userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
  //     //   headers: { Authorization: Bearer ${accessToken} },
  //     // });
  //   }
  // }


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
              onPress={accessToken ? getUserData: () => {promptAsync({showInRevents:true}) }}
            />
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
