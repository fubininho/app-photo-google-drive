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


export default function App() {

  const [image, setImage] = React.useState<null | ImagePicker.ImageInfo>(null);

  const [hasGalleryPermission, setHasGalleryPermission] = React.useState<null | boolean>(null);

  function handleRefresh() {
    setImage(null);
  }

  async function handleShare() {
    console.log("CODAR AQUI:");
    // image -> googleDrive;
    // CODAR AQUI:
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
