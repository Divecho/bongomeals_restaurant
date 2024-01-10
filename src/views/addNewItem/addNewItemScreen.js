import React, { useState, useEffect } from "react";
import { SafeAreaView, View, FlatList, ScrollView, Dimensions, TextInput, StatusBar, TouchableOpacity, StyleSheet, Text } from "react-native";
import { useNavigation, CommonActions } from '@react-navigation/native';
import axios from 'axios';
import { api_url, get_categories, restaurant_add_item, item_image_upload } from '../../config/Constants';
import { Colors, Fonts, Sizes } from "../../assets/css/Colors";
import Icon, { Icons } from "../../components/Icons";

import { Menu, MenuItem } from 'react-native-material-menu';
import { Loader } from '../../components/Loader';
import ImageUpload from "../../components/Image";
import RNFetchBlob from "rn-fetch-blob";

const { width, height } = Dimensions.get('window');


//const categoryList = ['Fast Food', 'Starter', 'Main Course', 'Dessert'];
const foodTypeList = [{ id: '1', label: 'Veg' }, { id: '2', label: 'Non Veg' }, { id: '3', label: 'Egg' }];
const foodTagList = [{ id: '1', label: 'Best seller' }, { id: '2', label: 'Must try' }];

const options = {
    title: 'Select a photo',
    takePhotoButtonTitle: 'Take a photo',
    chooseFromLibraryButtonTitle: 'Choose from gallery',
    base64: true,
    quality: 1,
    maxWidth: 500,
    maxHeight: 500,
};

const AddNewItemScreen = () => {

    const navigation = useNavigation();
    const [categoryList, setCategoryList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            await get_admin_categories();
        });
        return unsubscribe;
    }, []);

    const get_admin_categories = async () => {
        //setLoading(true);
        await axios({
            method: 'get',
            url: api_url + get_categories
        })
            .then(async response => {
                // console.log(response);
                await setLoading(false);
                setCategoryList(response.data.result);
            })
            .catch(error => {
                setLoading(false);
                alert('Sorry something went wrong h 3')
            });
    }

    const [state, setState] = useState({
        itemImage: false,
        foodName: null,
        selectedItemCategory: null,
        itemPrice: null,
        preparationTime: null,
        selectedFoodType: null,
        selectedFoodTag: null,
        servesValue: null,
        description: null,
        showCategoryOptions: false,
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const {
        itemImage,
        foodName,
        selectedItemCategory,
        itemPrice,
        preparationTime,
        selectedFoodType,
        selectedFoodTag,
        servesValue,
        description,
        showCategoryOptions,
    } = state;

    const add_Item = async () => {
        await setLoading(true);
        if (!description || !servesValue || !selectedFoodTag || !selectedFoodType || !preparationTime
            || !itemPrice || !selectedItemCategory || !foodName || !itemImage) {
            alert("Fill All the fields");
            return true;
        }

        RNFetchBlob.fetch('POST', api_url + item_image_upload, {
            'Content-Type': 'multipart/form-data',
        }, [
            {
                name: 'item_image',
                filename: itemImage.data.fileName,
                data: itemImage.base64
            }
        ]).then(async (resp) => {
            await setLoading(false);
            let data = await JSON.parse(resp.data);
            if (data.result) {
                await insertItemData(data.result);
                // await setProfileTimer(false);
                // await setTimeout(function () { setProfileTimer(true) }, 20000)
            }
        }).catch((err) => {
            setLoading(false);
            alert('Error on while upload try again later.')
        })

    }

    const insertItemData = async (image) => {
        const data = {
            restaurant_id: global.id,
            item_description: description,
            serves: servesValue,
            item_tag: selectedFoodTag,
            food_type: selectedFoodType,
            item_image: image,
            preparation_time: preparationTime,
            base_price: itemPrice,
            category_id: selectedItemCategory.id,
            item_name: foodName,
            is_recommand_tag: 1,
            in_stock: 1
        }
        
        await axios({
            method: 'post',
            url: api_url + restaurant_add_item,
            data: data,
        })
            .then(async response => {
                setLoading(false);
                if (response.data.result) {
                    console.log("data_response");
                    navigation.navigate('Menu');
                }
            })
            .catch(error => {
                setLoading(false);
                alert(error)
            });
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1 }}>
                {header()}
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Loader visible={loading} />
                    <ImageUpload image='' onPress={(value) => updateState({ itemImage: value })} />
                    {itemNameInfo()}
                    {itemCategoryInfo()}
                    {itemPriceAndOfferPriceInfo()}
                    {foodTypeInfo()}
                    {foodTagInfo()}
                    {servesInfo()}
                    {/* {specifictionsInfo()} */}
                    {descriptionInfo()}
                    {cancelAndSaveButton()}
                </ScrollView>
            </View>
        </SafeAreaView>
    )

    function cancelAndSaveButton() {
        return (
            <View style={styles.cancelAndSaveButtonWrapStyle}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => navigation.pop()}
                    style={{
                        ...styles.cancelAndSaveButtonStyle,
                        marginRight: Sizes.fixPadding - 2.0,
                    }}
                >
                    <Text style={{ ...Fonts.primaryColor15Bold }}>
                        Cancel
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => add_Item()}
                    style={{
                        ...styles.cancelAndSaveButtonStyle,
                        marginLeft: Sizes.fixPadding - 2.0,
                        backgroundColor: Colors.primaryColor,
                    }}
                >
                    <Text style={{ ...Fonts.whiteColor15Bold }}>
                        Save
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    function descriptionInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <Text style={{ ...Fonts.blackColor14SemiBold }}>
                    Description
                </Text>
                <TextInput
                    placeholder="Write Some Description About Item..."
                    placeholderTextColor={Colors.grayColor}
                    value={description}
                    onChangeText={(value) => updateState({ description: value })}
                    multiline
                    numberOfLines={5}
                    style={{ ...styles.textFieldWrapStyle }}
                    textAlignVertical="top"
                    cursorColor={Colors.primaryColor}
                />
            </View>
        )
    }

    function servesInfo() {
        return (
            <View style={{ marginBottom: Sizes.fixPadding - 5.0, marginTop: Sizes.fixPadding * 2.0, marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <Text style={{ marginBottom: Sizes.fixPadding, ...Fonts.blackColor14SemiBold }}>
                    Add Serves
                </Text>
                <View style={styles.specificationWrapStyle}>
                    <TextInput
                        value={servesValue}
                        onChangeText={(value) => updateState({ servesValue: value })}
                        placeholder={"Add Serves"}
                        placeholderTextColor={Colors.grayColor}
                        style={{ ...Fonts.grayColor14Medium, flex: 1, }}
                        cursorColor={Colors.primaryColor}
                    />
                </View>
            </View>
        )
    }

    function foodTypeInfo() {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => updateState({ selectedFoodType: item.id })}
                style={{
                    backgroundColor: selectedFoodType == item.id ? Colors.primaryColor : Colors.whiteColor,
                    ...styles.foodTypeWrapStyle,
                }}>
                <Text style={selectedFoodType == item.id ? { ...Fonts.whiteColor12SemiBold } : { ...Fonts.grayColor12Regular }}>
                    {item.label}
                </Text>
            </TouchableOpacity>
        )
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <Text style={{ marginBottom: Sizes.fixPadding, ...Fonts.blackColor14SemiBold }}>
                    Food Type
                </Text>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={foodTypeList}
                    keyExtractor={(item, index) => `${index}`}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingHorizontal: Sizes.fixPadding - 8.0, paddingBottom: Sizes.fixPadding - 8.0, }}
                />
            </View>
        )
    }

    function foodTagInfo() {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => updateState({ selectedFoodTag: item.id })}
                style={{
                    backgroundColor: selectedFoodTag == item.id ? Colors.primaryColor : Colors.whiteColor,
                    ...styles.foodTypeWrapStyle,
                }}>
                <Text style={selectedFoodTag == item.id ? { ...Fonts.whiteColor12SemiBold } : { ...Fonts.grayColor12Regular }}>
                    {item.label}
                </Text>
            </TouchableOpacity>
        )
        return (
            <View style={{ marginTop: Sizes.fixPadding * 2.0, marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <Text style={{ marginBottom: Sizes.fixPadding, ...Fonts.blackColor14SemiBold }}>
                    Food Tag
                </Text>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={foodTagList}
                    keyExtractor={(item, index) => `${index}`}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingHorizontal: Sizes.fixPadding - 8.0, paddingBottom: Sizes.fixPadding - 8.0, }}
                />
            </View>
        )
    }

    function itemPriceAndOfferPriceInfo() {
        return (
            <View style={{ margin: Sizes.fixPadding * 2.0, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 110.0, marginRight: Sizes.fixPadding * 2.0, }}>
                    <Text style={{ ...Fonts.blackColor14SemiBold }}>
                        Item Price
                    </Text>
                    <TextInput
                        value={itemPrice}
                        onChangeText={(value) => updateState({ itemPrice: value })}
                        keyboardType="numeric"
                        placeholder="eg. ₹6.00"
                        placeholderTextColor={Colors.grayColor}
                        style={{ ...styles.textFieldWrapStyle }}
                        cursorColor={Colors.primaryColor}
                    />
                </View>
                <View style={{ width: 110.0, }}>
                    <Text style={{ ...Fonts.blackColor14SemiBold }}>
                        Preparation Time
                    </Text>
                    <TextInput
                        value={preparationTime}
                        onChangeText={(value) => updateState({ preparationTime: value })}
                        keyboardType="numeric"
                        placeholder="eg. 30"
                        placeholderTextColor={Colors.grayColor}
                        style={{ ...styles.textFieldWrapStyle }}
                        cursorColor={Colors.primaryColor}
                    />
                </View>
            </View >
        )
    }

    function itemCategoryInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <Text style={{ ...Fonts.blackColor14SemiBold }}>
                    Item Category
                </Text>
                <Menu
                    visible={showCategoryOptions}
                    style={{ width: '90%', paddingTop: Sizes.fixPadding, maxHeight: 300 }}
                    anchor={
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => updateState({ showCategoryOptions: true })}
                            style={styles.itemCategoryWrapStyle}
                        >
                            <Text style={{ flex: 1, ...Fonts.grayColor14Medium }}>
                                {selectedItemCategory
                                    ?
                                    selectedItemCategory?.category_name
                                    :
                                    'eg. Fast Food'
                                }
                            </Text>
                            <Icon type={Icons.MaterialIcons} name="keyboard-arrow-down" color={Colors.grayColor} />
                        </TouchableOpacity>
                    }
                    onRequestClose={() => updateState({ showCategoryOptions: false })}
                >
                    <ScrollView showsHorizontalScrollIndicator={false} >
                        {
                            categoryList.map((item, index) => (
                                <MenuItem
                                    key={`${index}`}
                                    textStyle={{ ...Fonts.grayColor14Medium }}
                                    onPress={() => {
                                        updateState({ selectedItemCategory: item, showCategoryOptions: false })
                                    }}
                                >
                                    {item.category_name}
                                </MenuItem>
                            ))
                        }
                    </ScrollView>
                </Menu>
            </View>
        )
    }

    function itemNameInfo() {
        return (
            <View style={{ margin: Sizes.fixPadding * 2.0, }}>
                <Text style={{ ...Fonts.blackColor14SemiBold }}>
                    Item Name
                </Text>
                <TextInput
                    placeholder="eg. Sandwich"
                    placeholderTextColor={Colors.grayColor}
                    value={foodName}
                    onChangeText={(text) => updateState({ foodName: text })}
                    selectionColor={Colors.primaryColor}
                    style={styles.textFieldWrapStyle}
                    cursorColor={Colors.primaryColor}
                />
            </View>
        )
    }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <TouchableOpacity
                    onPress={() => navigation.pop()}
                >
                    <Icon type={Icons.MaterialIcons} name="arrow-back-ios" color={Colors.blackColor} />
                </TouchableOpacity>

                <Text style={{ marginLeft: Sizes.fixPadding - 5.0, flex: 1, ...Fonts.blackColor18SemiBold }}>
                    Add New Item
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerWrapStyle: {
        margin: Sizes.fixPadding * 2.0,
        flexDirection: 'row',
        alignItems: 'center',
    },
    addCategoryImageWrapStyle: {
        marginTop: Sizes.fixPadding,
        width: width * 0.18,
        height: height * 0.09,
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding - 5.0,
        elevation: 4.0,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: Sizes.fixPadding * 2.0,
    },
    bottomSheetStyle: {
        backgroundColor: Colors.whiteColor,
        paddingHorizontal: Sizes.fixPadding * 2.0,
        paddingBottom: Sizes.fixPadding * 2.0,
        paddingTop: Sizes.fixPadding + 5.0,
    },
    textFieldWrapStyle: {
        ...Fonts.grayColor14Medium,
        backgroundColor: Colors.whiteColor,
        elevation: 3.0,
        borderRadius: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding - 3.0,
        paddingHorizontal: Sizes.fixPadding,
        marginTop: Sizes.fixPadding,
    },
    itemCategoryWrapStyle: {
        marginTop: Sizes.fixPadding,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.whiteColor,
        elevation: 3.0,
        paddingVertical: Sizes.fixPadding,
        borderRadius: Sizes.fixPadding,
        paddingHorizontal: Sizes.fixPadding,
    },
    foodTypeWrapStyle: {
        paddingVertical: Sizes.fixPadding + 4.0,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Sizes.fixPadding,
        elevation: 2.0,
        width: 110.0,
        marginRight: Sizes.fixPadding * 2.0,
    },
    specificationWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.whiteColor,
        elevation: 2.0, borderRadius: Sizes.fixPadding,
        paddingHorizontal: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding - 3.0,
        marginBottom: Sizes.fixPadding + 5.0,
    },
    cancelAndSaveButtonWrapStyle: {
        marginVertical: Sizes.fixPadding * 3.5,
        marginHorizontal: Sizes.fixPadding * 7.0,
        flexDirection: 'row',
        alignItems: 'center'
    },
    cancelAndSaveButtonStyle: {
        flex: 1,
        borderColor: Colors.primaryColor,
        borderWidth: 1.0,
        paddingVertical: Sizes.fixPadding,
        borderRadius: Sizes.fixPadding,
        alignItems: 'center', justifyContent: 'center',
    },
});

export default AddNewItemScreen;