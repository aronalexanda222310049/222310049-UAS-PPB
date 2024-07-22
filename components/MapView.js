import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button, Linking, Alert } from 'react-native';

const MapViewScreen = ({ route, navigation }) => {
  const { location } = route.params;

  useEffect(() => {
    if (location) {
      const url = `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;
      Linking.canOpenURL(url)
        .then((supported) => {
          if (supported) {
            Linking.openURL(url);
            navigation.goBack(); 
          } else {
            Alert.alert('Error', 'Unable to open Google Maps');
          }
        })
        .catch((err) => console.error('An error occurred', err));
    }
  }, [location, navigation]);

  return (
    <View style={styles.container}>
      <Text>Membuka Google Maps</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MapViewScreen;
