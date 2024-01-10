import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Dimensions, Text } from 'react-native';
import { Colors, Fonts, Sizes } from "../assets/css/Colors";
import Icon, { Icons } from './Icons';
import * as ImagePicker from "react-native-image-picker";
import ImgToBase64 from 'react-native-image-base64';
const { width, height } = Dimensions.get('window');

const options = {
    title: 'Select a photo',
    takePhotoButtonTitle: 'Take a photo',
    chooseFromLibraryButtonTitle: 'Choose from gallery',
    base64: true,
    quality: 1,
    maxWidth: 500,
    maxHeight: 500,
};

const ImageUpload = (props) => {
    const [profile_image, setProfileImage] = useState("");
    const [profile_timer, setProfileTimer] = useState(true);
    //console.log("profile_image ", profile_image)
    const select_photo = async () => {
        if (profile_timer) {
            ImagePicker.launchImageLibrary(options, async (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                } else {
                    const source = await response.assets[0];
                    //await props.onPress(source);
                    await ImgToBase64.getBase64String(response.assets[0].uri)
                        .then(async base64String => {
                            await props.onPress({data: response.assets[0], base64: base64String});
                            //await profileimageupdate(base64String);
                            await setProfileImage(response.assets[0].uri);
                        }
                        )
                        .catch(err => console.log(err));
                }
            });
        } else {
            alert('Please try after 20 seconds');
        }
    }

    // const profileimageupdate = async (img_data) => {
    //     await setLoading(true);
    //     RNFetchBlob.fetch('POST', api_url + save_profile_picture, {
    //         'Content-Type': 'multipart/form-data',
    //     }, [
    //         {
    //             name: 'image',
    //             filename: 'image.png',
    //             type: 'image/png',
    //             data: img_data
    //         }
    //     ]).then(async (resp) => {
    //         await setLoading(false);
    //         let data = await JSON.parse(resp.data);
    //         if (data.result) {
    //             //await image_upload(data.result);
    //             await setProfileTimer(false);
    //             await setTimeout(function () { setProfileTimer(true) }, 20000)
    //         }
    //     }).catch((err) => {
    //         setLoading(false);
    //         alert('Error on while upload try again later.')
    //     })
    // }

    // const image_upload = async (data) => {
    //     setLoading(true);
    //     await axios({
    //         method: 'post',
    //         url: api_url + profile_picture_update,
    //         data: { id: global.id, restaurant_image: data }
    //     })
    //         .then(async response => {
    //             setLoading(false);
    //             console.log(response)
    //             if (response.data.status == 1) {
    //                 alert("Update Successfully")
    //             } else {
    //                 alert(response.data.message)
    //             }
    //         })
    //         .catch(error => {
    //             setLoading(false);
    //             alert("Sorry something went wrong")
    //         });
    // }

    return (
        <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, }}>
            <Text style={{...Fonts.blackColor14SemiBold}}>Upload Image</Text>
            <TouchableOpacity onPress={select_photo.bind(this)} style={styles.box}>
                <View onPress={select_photo.bind(this)} style={styles.profile} >
                    {!profile_image && !props.image ?
                        <Icon type={Icons.MaterialIcons} name="add-a-photo" color={Colors.blackColor} />
                        :
                        <Image style={{ height: height * 0.09, width: width * 0.18, flex: 1, borderRadius: 50 }} source={{ uri: profile_image ? profile_image : props.image }} />
                    }
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    box: {
        width: 100,
        borderRadius: 60
    },
    profile: {
        marginTop: Sizes.fixPadding,
        width: width * 0.18,
        height: height * 0.09,
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding - 5.0,
        elevation: 4.0,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default ImageUpload;
