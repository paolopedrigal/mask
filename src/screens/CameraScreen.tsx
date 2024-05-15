import { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Camera, CameraType, FlashMode } from "expo-camera";
import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";
import { TouchableOpacity } from "react-native-gesture-handler";
import { CameraScreenProps, HomeProps } from "@_types/NavigationTypes";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HeaderBackButton } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";

export default function CameraScreen({ route, navigation }: CameraScreenProps) {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean>();
  const [image, setImage] = useState<string>();
  const [facing, setFacing] = useState<CameraType>(CameraType.back);
  const [flash, setFlash] = useState<FlashMode>(FlashMode.off);
  const cameraRef = useRef<Camera>(null);
  const insets = useSafeAreaInsets();

  const homeNavigation = useNavigation<HomeProps["navigation"]>();

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status == "granted");
    })();
  });

  const takePicture = async () => {
    if (cameraRef && cameraRef.current) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        setImage(data.uri);
      } catch (error: any) {
        console.error("Error with CameraScreen.tsx:", error.message);
      }
    }
  };

  const flipCamera = useCallback(() => {
    return facing == CameraType.front
      ? setFacing(CameraType.back)
      : setFacing(CameraType.front);
  }, [facing]);

  if (hasCameraPermission === false) {
    return <Text>Has no camera permissions</Text>;
  }

  if (image) return <Image source={{ uri: image }} style={{ flex: 1 }} />;
  else
    return (
      <Camera
        ref={cameraRef}
        type={facing}
        flashMode={flash}
        autoFocus={true}
        style={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          flex: 1,
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
            }}
          >
            <View style={{ flex: 1 }}>
              <TouchableOpacity onPress={() => navigation.replace("EditCard")}>
                <Text
                  style={{
                    color: "#636363",
                    padding: 25,
                    fontFamily: "Inter-Regular",
                    fontSize: 16,
                  }}
                >
                  Skip
                </Text>
              </TouchableOpacity>
            </View>
            <HeaderBackButton
              onPress={() => homeNavigation.navigate("Home")}
              labelVisible={false}
              tintColor="white"
              style={{
                marginRight: 20,
                transform: [
                  { scaleX: -1 }, //horizontal
                ],
              }}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Image
            source={require("@assets/icons/camera-roll-icon.png")}
            style={{
              width: 30,
              height: 30,
            }}
          />
          <View
            style={{
              marginBottom: 20,
              borderWidth: 5,
              borderColor: "#FFFFFF",
              borderRadius: 100,
            }}
          >
            <View
              style={{
                borderWidth: 2,
                borderColor: "#000000",
                borderRadius: 100,
              }}
            >
              <TouchableOpacity onPress={takePicture}>
                <View
                  style={{
                    opacity: 0.4,
                    borderRadius: 100,
                    width: 50,
                    height: 50,
                    backgroundColor: "#FFFFFF",
                  }}
                ></View>
              </TouchableOpacity>
            </View>
          </View>
          <Pressable onPress={flipCamera}>
            <Image
              source={require("@assets/icons/flip-camera-icon.png")}
              style={{
                width: 30,
                height: 30,
              }}
            />
          </Pressable>
        </View>
      </Camera>
    );
}
