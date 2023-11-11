import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, Upload, message, Select, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
const { Option } = Select;

const CadastroReceita = () => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [ingredientes, setIngredientes] = useState([]);
  const [novoIngrediente, setNovoIngrediente] = useState('');
  const [ingredientesSelecionadosEdit, setIngredientesSelecionadosEdit] = useState([]);
  const [ingredientesSelecionadosInts, setIngredientesSelecionadosInts] = useState([]);

  const handleNomeChange = (e) => {
    setNome(e.target.value);
  };

  const handleDescricaoChange = (e) => {
    setDescricao(e.target.value);
  };

  const handleIngredienteChange = (e) => {
    setNovoIngrediente(e.target.value);
  };

  const handleAdicionarIngrediente = () => {
    if (novoIngrediente) {
      setIngredientes([...ingredientes, novoIngrediente]);
      setNovoIngrediente('');
    }
  };

  const buscaTodosIngredientes = async () => {
    let url = `https://localhost:7007/api/ingrediente`;

    try {
      const response = await axios.get(url);
      setIngredientesSelecionadosEdit(response.data.$values);
    } catch (error) {
      console.error('Falha na requisição:', error);
    }
  };

  useEffect(() => {
    buscaTodosIngredientes();
  }, []);


  const handleChange = (values) => {
    setIngredientesSelecionadosInts(values)
    console.log(ingredientesSelecionadosInts)
  };


  const onFinish = async (values) => {
    console.log('Valores do formulário:', values);
    const url = 'https://localhost:7007/api/receita';
    const data = {
      nome: nome,
      descricao: descricao,
      usuarioId: 1,
      ingredientesIds: ingredientesSelecionadosInts
    };

    try {
      const response = await axios.post(url, data);
      console.log('Requisição POST bem-sucedida');
      console.log('Resposta do servidor:', response.data);


      notification.success({
        message: 'Cadastro realizado com sucesso!',
        description: 'Receita cadastrada com sucesso.',
      });


      setTimeout(() => {

        window.location.href = '/principal';
      }, 2000);

    } catch (error) {
      console.error('Falha na requisição:', error);
    }
  };



  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
      <Col span={8}>
        <h2 style={{ textAlign: 'center', fontSize: '24px' }}>Cadastro de Receita</h2>
        <Form name="cadastro">
          <Form.Item label="Nome">
            <Input value={nome} onChange={handleNomeChange} />
          </Form.Item>

          <Form.Item label="Descrição">
            <Input.TextArea
              value={descricao}
              onChange={handleDescricaoChange}
              autoSize={{ minRows: 3, maxRows: 6 }}
            />
          </Form.Item>

          <Form.Item
            label="Ingredientes"
            

          >
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Selecione"
              onChange={handleChange}
            >
              {ingredientesSelecionadosEdit.map((ingrediente) => (
                <Option key={ingrediente.nome} value={ingrediente.id}>
                  {ingrediente.nome}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="">
            <Row gutter={16} align="middle">
              <Col span={12} style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <Button type="primary" onClick={onFinish} style={{ marginTop: '10px' }}>
                  Cadastrar Receita
                </Button>
                <Button type="primary" style={{ marginTop: "10px" }}>
                  <Link to="/principal">Voltar</Link>
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default CadastroReceita;
