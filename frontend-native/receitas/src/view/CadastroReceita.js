import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Image } from 'react-native';
import { TextInput, Button, Text, Menu, Provider, Divider, Chip } from 'react-native-paper';
import { useUserContext } from '../auth/UserContext.js';
import { useNavigation } from '@react-navigation/native';
import Notification from '../util/Notificacao.js';
import axios from 'axios';

const CadastroReceita = () => {
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [ingredientes, setIngredientes] = useState([]);
    const [selectedIngredientes, setSelectedIngredientes] = useState([]);
    const [idsSelecionados, setIdsSelecionados] = useState([]);
    const [menuVisible, setMenuVisible] = useState(false);
    const [nomeIngredientesSelecionados, setNomeIngredientes] = useState("");
    const notification = Notification();
    const navigation = useNavigation();
    const { user } = useUserContext();
    const apiUrl = "http://54.145.167.97/api";

    const salvarReceita = async () => {
        const url = `${apiUrl}/receita`;
        const data = {
            nome: nome,
            descricao: descricao,
            usuarioId: user.id,
            ingredientesIds: idsSelecionados
        };

        try {
            const response = await axios.post(url, data);
            console.log('Requisição POST bem-sucedida');
            console.log('Resposta do servidor:', response.data);

            notification.show("Receita cadastrada com sucesso!")

            setTimeout(() => {
                navigation.navigate('Home');
            }, 2000);
        } catch (error) {
            console.error('Falha na requisição:', error);
        }
    };

    const limparCampos = () => {
        setNome('');
        setDescricao('');
        setSelectedIngredientes([]);
        setNomeIngredientes("");
    };

    const buscaTodosIngredientes = async () => {
        let url = `${apiUrl}/ingrediente`;

        try {
            const response = await axios.get(url);
            setIngredientes(response.data.$values);
        } catch (error) {
            console.error('Falha na requisição:', error);
        }
    };

    const showMenu = () => setMenuVisible(true);

    const hideMenu = () => setMenuVisible(false);

    const handleIngredientPress = (ingrediente) => {
        if (selectedIngredientes.includes(ingrediente)) {
            setSelectedIngredientes(
                selectedIngredientes.filter((selected) => selected !== ingrediente)
            );

            const nomes = selectedIngredientes.map((ingrediente) => ingrediente.nome).join(' - ');
            setNomeIngredientes(nomes);
            console.log('ingredientes selecionados: ' + nomes);

            let ids = selectedIngredientes.map((ingrediente) => ingrediente.id);
            setIdsSelecionados(ids);
            console.log('ingredientes ids: ' + idsSelecionados);
        } else {
            setSelectedIngredientes([...selectedIngredientes, ingrediente]);
        }
    };

    useEffect(() => {
        if (user === undefined || user === null) {
            notification.show("Usuario não autenticado, realize o login.")

            setTimeout(() => {
                navigation.navigate('Login');
            }, 1500);

            return;
        }

        console.log(user);

        try {
            buscaTodosIngredientes();
        } catch (error) {
            console.error(error);
        }
    }, []);

    return (
        <Provider>
            <View style={styles.container}>
                <Image
                    source={require('../img/food_icon.png')}
                    style={styles.logo}
                />
                <Text style={styles.title}>Cadastro Receita:</Text>
                <TextInput
                    label="Nome"
                    value={nome}
                    onChangeText={(text) => setNome(text)}
                    style={styles.input}
                    theme={{ colors: { primary: 'black' } }}
                />
                <TextInput
                    label="Descrição"
                    value={descricao}
                    onChangeText={(text) => setDescricao(text)}
                    style={styles.input}
                    theme={{ colors: { primary: 'black' } }}
                />

                <Menu
                    visible={menuVisible}
                    onDismiss={hideMenu}
                    anchor={
                        <Button onPress={showMenu} style={styles.input} mode="outlined">
                            {selectedIngredientes.length === 0
                                ? 'Selecionar Ingredientes'
                                : `Ingredientes Selecionados: ${selectedIngredientes.length}`}
                        </Button>
                    }
                >
                    {ingredientes.map((ingrediente) => (
                        <React.Fragment key={ingrediente.nome}>
                            <Menu.Item
                                onPress={() => handleIngredientPress(ingrediente)}
                                title={ingrediente.nome}
                                status={selectedIngredientes.includes(ingrediente) ? 'checked' : 'unchecked'}
                                style={{ color: 'black', fontWeight: 'bold', paddingVertical: 8 }}
                            />
                            <Divider />
                        </React.Fragment>
                    ))}
                </Menu>

                {selectedIngredientes.map((ingrediente) => (
                    <Chip
                        key={ingrediente.id}

                        style={styles.chip}
                    >
                        {ingrediente.nome}
                    </Chip>
                ))}

                <Button onPress={salvarReceita} mode="contained" style={styles.button}>
                    Salvar
                </Button>
                <Button onPress={limparCampos} mode="outlined" style={styles.button}>
                    Limpar Campos
                </Button>
            </View>
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 35,
        color: 'black',
    },
    input: {
        marginBottom: 8,
        backgroundColor: '#f5f5f5',
    },
    button: {
        marginTop: 16,
    },
    logo: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginBottom: 16,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
    },
    chip: {
        margin: 4,
    },
});

export default CadastroReceita;
