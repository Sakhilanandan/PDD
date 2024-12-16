import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Dimensions,
  ActivityIndicator,
  Image,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

const { width, height } = Dimensions.get('window');

const AdminScreen = () => {
  const [categories, setCategories] = useState([]);
  const [gender, setGender] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [addItemVisible, setAddItemVisible] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: '',
    image: null,
    rate: '',
    platforms: [{ name: '', link: '', price: '', image: null }],
  });

  useEffect(() => {
    if (gender) {
      fetchCategories(gender);
    }
  }, [gender]);

  const fetchCategories = async (selectedGender) => {
    setIsLoading(true);
    setError(null);
    const fetchCategories = async (selectedGender) => {
      try {
        const response = await fetch(`http://192.168.111.187/teefinder/manage_categories.php?category_type=${selectedGender}`);
        const data = await response.json();
        
        if (data.status === 'success') {
          setCategories(data.data); // Set categories in state
        } else {
          setError(data.message || 'Failed to fetch categories.');
        }
      } catch (error) {
        setError('Network error. Please try again.');
      }
    };
  };    
  const handleGenderSelection = (selectedGender) => {
    setGender(selectedGender);
    setSelectedCategory(null);
    setAddItemVisible(false);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setAddItemVisible(true);
  };

  const handleAddPlatform = () => {
    setProductDetails((prevState) => ({
      ...prevState,
      platforms: [...prevState.platforms, { name: '', link: '', price: '', image: null }],
    }));
  };

  const handleInputChange = (field, value, index = null) => {
    if (index === null) {
      setProductDetails((prevState) => ({ ...prevState, [field]: value }));
    } else {
      const updatedPlatforms = [...productDetails.platforms];
      updatedPlatforms[index][field] = value;
      setProductDetails((prevState) => ({ ...prevState, platforms: updatedPlatforms }));
    }
  };

  const handleImagePicker = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.5 }, (response) => {
      if (response.didCancel) {
        console.log('User canceled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        setProductDetails((prevState) => ({
          ...prevState,
          image: response.assets[0].uri, // Save the image URI
        }));
      }
    });
  };

  const handlePlatformImagePicker = (index) => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.5 }, (response) => {
      if (response.didCancel) {
        console.log('User canceled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const updatedPlatforms = [...productDetails.platforms];
        updatedPlatforms[index].image = response.assets[0].uri;
        setProductDetails((prevState) => ({ ...prevState, platforms: updatedPlatforms }));
      }
    });
  };

  const handleAddItem = async () => {
    if (!productDetails.name || !productDetails.rate || !productDetails.image || !productDetails.platforms.length) {
      Alert.alert('Error', 'Please fill all the fields.');
      return;
    }

    const formData = new FormData();
    formData.append('name', productDetails.name);
    formData.append('description', ''); // Optional description field
    formData.append('rate', productDetails.rate);
    formData.append('category_id', selectedCategory.category_id);

    // Append product image
    formData.append('image', {
      uri: productDetails.image,
      type: 'image/jpeg',
      name: 'product_image.jpg',
    });

    // Add platforms
    productDetails.platforms.forEach((platform, index) => {
      formData.append(`platforms[${index}][name]`, platform.name);
      formData.append(`platforms[${index}][link]`, platform.link);
      formData.append(`platforms[${index}][price]`, platform.price);
      
      if (platform.image) {
        formData.append(`platform_image_${index}`, {
          uri: platform.image,
          type: 'image/jpeg',
          name: `platform_image_${index}.jpg`,
        });
      }
    });

    try {
      setIsLoading(true);

      const response = await fetch('http://192.168.111.187/teefinder/manage_categories.php', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.status === 'success') {
        Alert.alert('Success', 'Product added successfully!');
        setProductDetails({
          name: '',
          image: null,
          rate: '',
          platforms: [{ name: '', link: '', price: '', image: null }],
        });
        setAddItemVisible(false);
      } else {
        Alert.alert('Error', result.message || 'Failed to add product.');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity onPress={() => handleCategoryClick(item)} style={styles.categoryContainer}>
      <Text style={styles.categoryText}>{item.category_name}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={[1]} // Dummy data to ensure the FlatList renders at least one item
      keyExtractor={(item) => item.toString()}
      ListHeaderComponent={
        <>
          <Text style={styles.title}>Admin Dashboard</Text>

          <View style={styles.radioGroup}>
            {['mens', 'womens'].map((g) => (
              <TouchableOpacity
                key={g}
                onPress={() => handleGenderSelection(g)}
                style={[styles.radioButton, gender === g && styles.selectedRadio]}
              >
                <Text style={[styles.radioText, gender === g && styles.selectedRadioText]}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" color="#007bff" />
          ) : (
            <View>
              {error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : gender ? (
                <FlatList
                  data={categories}
                  keyExtractor={(item, index) =>
                    item?.category_id ? item.category_id.toString() : index.toString()
                  }
                  renderItem={renderCategory}
                  ListEmptyComponent={<Text style={styles.emptyText}>No categories available.</Text>}
                />
              ) : (
                <Text style={styles.emptyText}>Select a gender to view categories.</Text>
              )}
            </View>
          )}

          {addItemVisible && (
            <View style={styles.addItemContainer}>
              <Text style={styles.sectionTitle}>Add Item to {selectedCategory?.category_name}</Text>

              <Text style={styles.label}>Product Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter product name (e.g., Stylish T-Shirt)"
                value={productDetails.name}
                onChangeText={(text) => handleInputChange('name', text)}
              />

              <Text style={styles.label}>Upload Product Image</Text>
              <TouchableOpacity onPress={handleImagePicker} style={styles.uploadButton}>
                <Text style={styles.uploadButtonText}>Pick Image</Text>
              </TouchableOpacity>
              {productDetails.image && (
                <Image source={{ uri: productDetails.image }} style={styles.imagePreview} />
              )}

              <Text style={styles.label}>Platform Details</Text>

              {productDetails.platforms.map((platform, index) => (
                <View key={index} style={styles.platformContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder={`Platform Name (e.g., Steam)`}
                    value={platform.name}
                    onChangeText={(text) => handleInputChange('name', text, index)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder={`Platform Link (e.g., URL)`}
                    value={platform.link}
                    onChangeText={(text) => handleInputChange('link', text, index)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder={`Platform Price (e.g., $49.99)`}
                    value={platform.price}
                    onChangeText={(text) => handleInputChange('price', text, index)}
                  />

                  <TouchableOpacity onPress={() => handlePlatformImagePicker(index)} style={styles.uploadButton}>
                    <Text style={styles.uploadButtonText}>Pick Platform Image</Text>
                  </TouchableOpacity>
                  {platform.image && (
                    <Image source={{ uri: platform.image }} style={styles.imagePreview} />
                  )}
                </View>
              ))}

              <TouchableOpacity onPress={handleAddPlatform} style={styles.addButton}>
                <Text style={styles.addButtonText}>Add Another Platform</Text>
              </TouchableOpacity>

              <Text style={styles.label}>Product Rate</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter product rate (e.g., $19.99)"
                value={productDetails.rate}
                onChangeText={(text) => handleInputChange('rate', text)}
              />

              <TouchableOpacity onPress={handleAddItem} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Submit Product</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      }
    />
  );
};

const styles = StyleSheet.create({
  categoryContainer: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: width - 40, // Set the width using screen width
    alignSelf: 'center',
  },
  categoryText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  radioButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginHorizontal: 10,
  },
  selectedRadio: {
    backgroundColor: '#007bff',
  },
  radioText: {
    fontSize: 16,
    color: '#007bff',
  },
  selectedRadioText: {
    color: '#fff',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: 'gray',
  },
  addItemContainer: {
    padding: 20,
    backgroundColor: '#ffffff',
    marginTop: 20,
    borderRadius: 5,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  uploadButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  uploadButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  imagePreview: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginTop: 10,
  },
  platformContainer: {
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default AdminScreen;
