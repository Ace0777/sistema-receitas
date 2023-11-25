import React, { useState, useContext } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useUserContext } from '../auth/UserContext.js';
import Toast from 'react-native-toast-message';
import axios from 'axios';

const apiUrl = "http://54.145.167.97/api";

const LoginScreen = () => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const { user, updateUser } = useUserContext();

  const handleLogin = async () => {
		const url = `${apiUrl}/usuario/login`;
		const data = {
			email: email,
			senha: password,
		};

		try {
			const response = await axios.post(url, data);

			console.log('Resposta do servidor:', response.data);

			if (response.status === 200) {
				const userInfo = {
					id: response.data.id,
					nome: response.data.nome,
					email: response.data.email,
					profile: response.data.profile
				}

        Toast.show({
          type: 'success',
          text1: 'Sucesso',
          text2: 'Login realizado com sucesso',
        });

				updateUser(userInfo);
			}

			setTimeout(() => {

        navigation.navigate('Principal');
			}, 2000);


		} catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro, usuario não encontrado!',
        text2: 'Usuario não encontrado, tente novamente.',
      });
			console.error('Falha na requisição:', error);
		}
    console.log('Email:', email);
    console.log('Senha:', password);
  };
  return (
    <View style={styles.container}>
      <Image
        source={require('../img/food_icon.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Receitas</Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={styles.input}
      />
      <TextInput
        label="Senha"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        style={styles.input}
      />

      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Entrar
      </Button>

      <Text style={styles.signupText}>Não tem uma conta? Cadastre-se</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 35,
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
  },
  signupText: {
    marginTop: 16,
    textAlign: 'center',
    color: 'blue',
  },
});

export default LoginScreen;
