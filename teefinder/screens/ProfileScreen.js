import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  BackHandler,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

// Get device dimensions for responsive styling
const { width, height } = Dimensions.get("window");

const ProfileScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const backAction = () => {
      if (navigation.canGoBack()) {
        navigation.goBack();
        return true; // prevent default back action
      }
      return false; // allow default behavior if can't go back
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Cleanup on component unmount
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()} // Navigate back to the previous screen
        >
          <Text style={styles.closeText}>X</Text>
        </TouchableOpacity>
        <Image
          source={{ uri: "https://via.placeholder.com/100" }} // Replace with a real image link
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>XXXXXXXX</Text>
        <Text style={styles.profileEmail}>Loremipsum@email.com</Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("MyProfile", { email: "Loremipsum@email.com" })} // Navigate to MyProfileScreen
        >
          <Text style={styles.menuIcon}>👤</Text>
          <Text style={styles.menuText}>My Profile</Text>
        </TouchableOpacity>

        {/* Navigate to ContactUsScreen */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("ContactUs")}
        >
          <Text style={styles.menuIcon}>📞</Text>
          <Text style={styles.menuText}>Contact Us</Text>
        </TouchableOpacity>

        {/* Navigate to FAQScreen */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("FAQScreen")} // Navigate to FAQScreen
        >
          <Text style={styles.menuIcon}>❓</Text>
          <Text style={styles.menuText}>Help & FAQs</Text>
        </TouchableOpacity>
      </View>

      {/* Log Out */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => navigation.navigate("LoginScreen")} // Navigate to LoginScreen on logout
      >
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFD700", // Yellow background color
    paddingTop: height * 0.05, // 5% of the screen height
    paddingHorizontal: width * 0.05, // 5% of the screen width
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  closeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: height * 0.05, // 5% of the screen height
  },
  profileImage: {
    width: width * 0.25, // 25% of the screen width
    height: width * 0.25,
    borderRadius: (width * 0.25) / 2, // Circle shape
    marginBottom: height * 0.02, // 2% of the screen height
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  profileEmail: {
    fontSize: 14,
    color: "#555",
  },
  menu: {
    marginVertical: height * 0.02, // 2% of the screen height
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: height * 0.02, // 2% of the screen height
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  menuIcon: {
    fontSize: 18,
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    color: "#000",
  },
  logoutButton: {
    marginTop: height * 0.03, // 3% of the screen height
    alignSelf: "center",
  },
  logoutText: {
    fontSize: 16,
    color: "#FF0000", // Red logout text
  },
});

export default ProfileScreen;
