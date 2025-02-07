import { HeaderBackButton } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { CARD_BORDER_RADIUS, CARD_HEIGHT } from "@theme/card";
import { CameraScreenProps, HomeProps } from "@ts/types/navigation";
import { CameraView, CameraType, FlashMode } from "expo-camera";
import { Image } from "expo-image";
import { manipulateAsync, FlipType, SaveFormat } from "expo-image-manipulator";
import { useCameraPermissions } from "expo-image-picker";
import { useCallback, useRef, useState } from "react";
import { Button, Pressable, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CameraScreen({ route, navigation }: CameraScreenProps) {
  const [image, setImage] = useState<{ uri: string; base64: string }>();
  const [facing, setFacing] = useState<CameraType>("front");
  const [flash, setFlash] = useState<FlashMode>("off");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const insets = useSafeAreaInsets();

  const homeNavigation = useNavigation<HomeProps["navigation"]>();

  const takePicture = async () => {
    if (cameraRef && cameraRef.current) {
      try {
        // let photo = await cameraRef.current.takePictureAsync({
        //   base64: true,
        //   isImageMirror: CameraType.front === facing,
        // });

        let photo = await cameraRef.current.takePictureAsync({ base64: true });

        if (photo) {
          if (facing === "front") {
            photo = await manipulateAsync(
              photo.uri,
              [{ rotate: 180 }, { flip: FlipType.Vertical }],
              { compress: 1, format: SaveFormat.JPEG, base64: true }
            );
          }
          setImage({ uri: photo.uri, base64: photo.base64 as string });
          navigation.replace("EditCard", {
            image: { uri: photo.uri, base64: photo.base64 as string },
          });
        }
      } catch (error: any) {
        console.error("Error with CameraScreen.tsx:", error.message);
      }
    }
  };

  const flipCamera = useCallback(() => {
    return facing == "front" ? setFacing("back") : setFacing("front");
  }, [facing]);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View>
        <Text>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  if (image)
    return (
      <Image
        source={{ uri: image.uri }}
        style={{
          paddingLeft: insets.left,
          paddingRight: insets.right,
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "rgba(0,0,0, 0.60)",
            flex: 1,
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              paddingBottom: 20,
            }}
          >
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                onPress={() =>
                  navigation.replace("EditCard", { image: undefined })
                }
              >
                <Text
                  style={{
                    color: "#636363",
                    paddingLeft: 25,
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
            height: CARD_HEIGHT,
            width: "100%",
            borderRadius: CARD_BORDER_RADIUS,
            borderWidth: 1,
            borderColor: "#FFFFFF",
          }}
        ></View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            width: "100%",
            backgroundColor: "rgba(0,0,0, 0.60)",
            paddingBottom: insets.bottom,
            flex: 1,
          }}
        >
          <Pressable onPress={() => setImage(undefined)}>
            <Image
              source={require("@assets/icons/trash-icon.png")}
              style={{
                width: 38,
                height: 38,
              }}
            />
          </Pressable>
          <Pressable
            onPress={() => navigation.replace("EditCard", { image: image })}
          >
            <Image
              source={require("@assets/icons/image-ok-icon.png")}
              style={{
                width: 38,
                height: 38,
              }}
            />
          </Pressable>
        </View>
      </Image>
    );
  else
    return (
      <CameraView
        ref={cameraRef}
        facing={facing}
        flash={flash}
        style={{
          paddingLeft: insets.left,
          paddingRight: insets.right,
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "rgba(0,0,0, 0.60)",
            flex: 1,
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              paddingBottom: 20,
            }}
          >
            <View
              style={{
                flex: 1,
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  navigation.replace("EditCard", { image: undefined })
                }
              >
                <Text
                  style={{
                    color: "#636363",
                    paddingLeft: 25,
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
            height: CARD_HEIGHT,
            width: "100%",
            borderRadius: CARD_BORDER_RADIUS,
            borderWidth: 1,
            borderColor: "#FFFFFF",
          }}
        ></View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            width: "100%",
            backgroundColor: "rgba(0,0,0, 0.60)",
            paddingBottom: insets.bottom,
            flex: 1,
          }}
        >
          <Image
            source={require("@assets/icons/camera-roll-icon.png")}
            style={{
              width: 30,
              height: 30,
            }}
          />
          <TouchableOpacity onPress={takePicture}>
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
                <View
                  style={{
                    opacity: 0.4,
                    borderRadius: 100,
                    width: 50,
                    height: 50,
                    backgroundColor: "#FFFFFF",
                  }}
                ></View>
              </View>
            </View>
          </TouchableOpacity>
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
      </CameraView>
    );
}
