import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    TextInput, 
    Button, 
    StyleSheet, 
    Image, 
    TouchableOpacity, 
    Alert 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const AdminScreen = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [categoryType, setCategoryType] = useState('mens'); // Default category
    const [formData, setFormData] = useState({
        category_id: '',
        platform_name: '',
        price: '',
        product_link: '',
        description: '',
    });
    const [image, setImage] = useState(null);

    const baseUrl = "http://192.168.111.187/teefinder/";

    // Fetch categories and platforms
    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${baseUrl}?category_type=${categoryType}`);
            const data = await response.json();
            if (data.status === 'success') {
                setCategories(data.data);
            } else {
                Alert.alert('Error', data.message);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    // Upload platform
    const handleUploadPlatform = async () => {
        const { category_id, platform_name, price, product_link, description } = formData;

        if (!category_id || !platform_name || !price) {
            Alert.alert('Error', 'All required fields must be filled');
            return;
        }

        const uploadData = new FormData();
        uploadData.append('category_id', category_id);
        uploadData.append('platform_name', platform_name);
        uploadData.append('price', price);
        uploadData.append('product_link', product_link);
        uploadData.append('description', description);

        if (image) {
            const fileName = image.uri.split('/').pop();
            const fileType = fileName.split('.').pop();
            uploadData.append('image', {
                uri: image.uri,
                name: fileName,
                type: `image/${fileType}`,
            });
        }

        try {
            const response = await fetch(baseUrl, {
                method: 'POST',
                body: uploadData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const data = await response.json();
            if (data.status === 'success') {
                Alert.alert('Success', data.message);
                fetchCategories(); // Refresh the list
            } else {
                Alert.alert('Error', data.message);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to upload platform');
        }
    };

    // Pick an image
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0]);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [categoryType]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Admin Screen</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Category ID"
                    value={formData.category_id}
                    onChangeText={(value) => setFormData({ ...formData, category_id: value })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Platform Name"
                    value={formData.platform_name}
                    onChangeText={(value) => setFormData({ ...formData, platform_name: value })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Price"
                    keyboardType="numeric"
                    value={formData.price}
                    onChangeText={(value) => setFormData({ ...formData, price: value })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Product Link"
                    value={formData.product_link}
                    onChangeText={(value) => setFormData({ ...formData, product_link: value })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Description"
                    value={formData.description}
                    onChangeText={(value) => setFormData({ ...formData, description: value })}
                />
                <Button title="Pick Image" onPress={pickImage} />
                {image && <Image source={{ uri: image.uri }} style={styles.image} />}
                <Button title="Upload Platform" onPress={handleUploadPlatform} />
            </View>

            <Text style={styles.sectionTitle}>Categories and Platforms</Text>
            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <FlatList
                    data={categories}
                    keyExtractor={(item) => item.category_id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.category}>
                            <Text style={styles.categoryName}>{item.category_name}</Text>
                            <FlatList
                                data={item.platforms}
                                keyExtractor={(platform) => platform.platform_id.toString()}
                                renderItem={({ item: platform }) => (
                                    <View style={styles.platform}>
                                        <Text>{platform.platform_name}</Text>
                                        <Text>Price: ${platform.price}</Text>
                                        <Image source={{ uri: platform.platform_image }} style={styles.platformImage} />
                                    </View>
                                )}
                            />
                        </View>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    category: {
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    categoryName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    platform: {
        marginTop: 10,
    },
    platformImage: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    image: {
        width: 100,
        height: 100,
        marginTop: 10,
    },
});

export default AdminScreen;
