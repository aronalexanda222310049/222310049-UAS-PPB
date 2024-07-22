import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const OnBoardScreen = () => {
  const navigation = useNavigation();

  const handleStartPress = () => {
    navigation.navigate('Lokasi'); 
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/warning.png')} style={styles.image} />
      <Text style={styles.heading}>Ayo Segera Berlindung!</Text>
      <Text style={styles.text}>Dapatkan informasi terkini seputar bencana alam. Lindungi diri Anda dan keluarga tersayang Anda!</Text>
      <TouchableOpacity style={styles.button} onPress={handleStartPress}>
        <Text style={styles.buttonText}>Mulai</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    margin: 30,
  },
  button: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: 300,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold', 
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 0,
  },
});

export default OnBoardScreen;
