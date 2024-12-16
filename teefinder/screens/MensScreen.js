import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Linking,
  BackHandler,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

const categories = [
  { id: '1', name: 'Oversized', icon: 'https://via.placeholder.com/60' },
  { id: '2', name: 'Polo', icon: 'https://via.placeholder.com/60' },
  { id: '3', name: 'Hoodies', icon: 'https://via.placeholder.com/60' },
  { id: '4', name: 'Sleeves', icon: 'https://via.placeholder.com/60' },
  { id: '5', name: 'Full Sleeves', icon: 'https://via.placeholder.com/60' },
  { id: '6', name: 'Round Neck', icon: 'https://via.placeholder.com/60' },
  { id: '7', name: 'V Neck', icon: 'https://via.placeholder.com/60' },
  { id: '8', name: 'Raglan', icon: 'https://via.placeholder.com/60' },
  { id: '9', name: 'Henley Collar', icon: 'https://via.placeholder.com/60' },
  { id: '10', name: 'Half Sleeves', icon: 'https://via.placeholder.com/60' },
];

const products = [
  {
    id: '1',
    name: 'Wild West Man Solid V Neck Cotton Blend Black T-Shirt',
    rates: [
      { store: 'Flipkart', price: '₹314', link: 'https://www.flipkart.com' },
      { store: 'Amazon', price: '₹299', link: 'https://www.amazon.com' },
      { store: 'Ajio', price: '₹329', link: 'https://www.ajio.com' },
    ],
    image: 'https://via.placeholder.com/100',
  },
  {
    id: '2',
    name: 'Ocean Beauty Fashion Half Sleeve Round Neck T-Shirt',
    rates: [
      { store: 'Flipkart', price: '₹259', link: 'https://www.flipkart.com' },
      { store: 'Amazon', price: '₹249', link: 'https://www.amazon.com' },
      { store: 'Snapdeal', price: '₹279', link: 'https://www.snapdeal.com' },
    ],
    image: 'https://via.placeholder.com/100',
  },
  {
    id: '3',
    name: 'BULLMER Tribal Printed Oversized Cotton T-Shirt',
    rates: [
      { store: 'Myntra', price: '₹449', link: 'https://dl.flipkart.com/s/6jBvUqNNNN' },
      { store: 'Ajio', price: 'Out of stock', link: 'https://www.ajio.com' },
      { store: 'Flipkart', price: '₹469', link: 'https://www.flipkart.com' },
    ],
    image: 'https://via.placeholder.com/100',
  },
];
const MensScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const backAction = () => {
      if (navigation.canGoBack()) {
        navigation.goBack();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  const navigateToDetails = (product) => {
    navigation.navigate('DetailsScreen', { product });
  };

  const openMenuScreen = () => {
    navigation.navigate('MenuScreen'); // Navigate to the MenuScreen
  };
  const openSearchScreen = () => {
    navigation.navigate('SearchScreen');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={openMenuScreen}>
            <Icon name="menu-outline" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.logoText}>TEEFINDER</Text>
          <TouchableOpacity style={{ flex: 2 }} onPress={openSearchScreen}>
            <TextInput
              style={styles.searchBar}
              placeholder="Search"
              placeholderTextColor="#ccc"
              editable={false} // Disable editing to make it act as a button
            />
            </TouchableOpacity>
        </View>

        <View style={styles.categoryContainer}>
          <View style={styles.categoryRow}>
            {categories.slice(0, 5).map((category) => (
              <TouchableOpacity key={category.id} style={styles.categoryItem}>
                <Image source={{ uri: category.icon }} style={styles.categoryIcon} />
                <Text style={styles.categoryText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.categoryRow}>
            {categories.slice(5, 10).map((category) => (
              <TouchableOpacity key={category.id} style={styles.categoryItem}>
                <Image source={{ uri: category.icon }} style={styles.categoryIcon} />
                <Text style={styles.categoryText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>All Items</Text>
          <TouchableOpacity style={styles.filterButton} onPress={() => navigation.navigate('FilterScreen')}>
            <Icon name="filter-outline" size={20} color="#333" />
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.productGrid}>
          {products.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.productCard}
              onPress={() => navigateToDetails(item)}
            >
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <Text style={styles.productName}>{item.name}</Text>
              <View style={styles.ratesContainer}>
                {item.rates.map((rate, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.rateLink}
                    onPress={() => Linking.openURL(rate.link)}
                  >
                    <Text style={styles.storeName}>{rate.store}:</Text>
                    <Text style={styles.productPrice}>{rate.price}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("HomeScreen")}
        >
          <Icon name="home-outline" size={24} color="#fff" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Favorites")}
        >
          <Icon name="heart-outline" size={24} color="#fff" />
          <Text style={styles.navText}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("ProfileScreen")}
        >
          <Icon name="person-outline" size={24} color="#fff" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffcc33',
  },
  scrollContainer: {
    paddingBottom: height * 0.08, // To leave space for bottom navigation
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0056b3',
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.02,
  },
  logoText: {
    flex: 1,
    fontSize: width * 0.045, // Responsive font size
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: width * 0.02,
    paddingHorizontal: width * 0.025,
    height: height * 0.05,
  },
  categoryContainer: {
    paddingHorizontal: width * 0.03,
    marginVertical: height * 0.015,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.015,
  },
  categoryItem: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: width * 0.02,
  },
  categoryIcon: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: (width * 0.15) / 2,
    backgroundColor: '#fff',
  },
  categoryText: {
    fontSize: width * 0.03,
    marginTop: height * 0.01,
    color: '#333',
    textAlign: 'center',
  },
  filterSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.03,
    marginVertical: height * 0.015,
  },
  sectionTitle: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterText: {
    marginLeft: width * 0.02,
    fontSize: width * 0.035,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.03,
  },
  productCard: {
    width: (width - width * 0.1) / 2, // Two columns with padding adjustment
    backgroundColor: '#fff',
    borderRadius: width * 0.025,
    padding: width * 0.025,
    marginBottom: height * 0.02,
    alignItems: 'center',
  },
  productImage: {
    width: (width - width * 0.25) / 2, // Adjusted for column layout
    height: (height - height * 0.75) / 2, // Adjust height accordingly
    borderRadius: width * 0.02,
    marginBottom: height * 0.01,
  },
  productName: {
    fontSize: width * 0.035,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  ratesContainer: {
    marginTop: height * 0.015,
  },
  storeName: {
    fontSize: width * 0.03,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: width * 0.03,
    color: '#333',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#0056b3',
    height: height * 0.08,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: width * 0.03,
    color: '#fff',
  },
});


export default MensScreen;
