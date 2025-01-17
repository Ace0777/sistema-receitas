import React, { useState, useEffect } from 'react';
import { Input, Button, Row, Col, Card, Space, Typography, message, Affix, Modal, Form, Select } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, LikeOutlined, DeleteOutlined, BookOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from 'axios';

const { Option } = Select;

const apiUrl = "http://54.145.167.97/api";

const TelaPrincipal = () => {
  const [receitas, setReceitas] = useState([]);
  const [valorPesquisa, setValorPesquisa] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [receitaSelecionada, setReceitaSelecionada] = useState(null);
  const [ingredientesSelecionadosEdit, setIngredientesSelecionadosEdit] = useState([]);
  const [ingredientesSelecionadosInts, setIngredientesSelecionadosInts] = useState([]);
  const [nomeReceita, setNomeReceita] = useState('');
  const [descricaoReceita, setDescricaoReceita] = useState('');
  const [usuarioLogado, setUsuarioLogado] = useState({});

  const buscaTodasReceitas = async () => {
    let url = `${apiUrl}/receita`;

    try {
      const response = await axios.get(url);
      setReceitas(response.data.$values);
    } catch (error) {
      console.error('Falha na requisição:', error);
    }
  };

  const buscaTodasReceitasNome = async (nome) => {
    let url = `${apiUrl}/receita/nome/${nome}`;

    if (nome === '') {
      url = `${apiUrl}/receita`;
    }

    try {
      const response = await axios.get(url);
      setReceitas(response.data.$values);
    } catch (error) {
      console.error('Falha na requisição:', error);
    }
  };

  const buscaTodasReceitasUser = async (id) => {
    let url = `${apiUrl}/receita/usuario/${id}`;
    try {
      const response = await axios.get(url);
      setReceitas(response.data.$values);
    } catch (error) {
      console.error('Falha na requisição:', error);
    }
  };

  const buscaTodosIngredientes = async () => {
    let url = `${apiUrl}/ingrediente`;

    try {
      const response = await axios.get(url);
      setIngredientesSelecionadosEdit(response.data.$values);
    } catch (error) {
      console.error('Falha na requisição:', error);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleEditar = (receita) => {
    setReceitaSelecionada(receita);
    console.log(receita)
    buscaTodosIngredientes()
    console.log(receita.ingredientes.$values)
    setNomeReceita(receita.nome)
    setDescricaoReceita(receita.descricao)
    showModal();
  };

  const handleChange = (values) => {
    setIngredientesSelecionadosInts(values)
    console.log(ingredientesSelecionadosInts)
  };

  const handleEditFormSubmit = async (values) => {
    try {
      const url = `${apiUrl}/receita/${receitaSelecionada.id}`;
      console.log(receitaSelecionada)

      const data = {
        nome: nomeReceita,
        descricao: descricaoReceita,
        ingredientesIds: ingredientesSelecionadosInts
      }

      await axios.put(url, data);
      window.location.reload();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Falha ao atualizar a receita:', error);
    }
  };

  const handleCurtir = async (id) => {
    try {
      const url = `${apiUrl}/receita/curtidas/${id}`;

      await axios.patch(url,);
      message.success(`Você curtiu uma receita!`);

      buscaTodasReceitas();
      
    } catch (error) {
      console.error('Falha ao curtir a receita:', error);
      message.error(`Curtir ${id}`);
    }
  };

  const handleExcluir = async (id) => {
    try {
      const url = `${apiUrl}/receita/${id}`;

      await axios.delete(url,);
      message.success(`Receita excluída!`);
      setTimeout(() => {

        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error('Falha ao excluir a receita:', error);
      message.error(`Excluir ${id}`);
    }
  };

  const handleInputChange = (event) => {
    const novoValor = event.target.value;
    setValorPesquisa(novoValor);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('usuario'))

    if (user === undefined || user === null) {
      message.error(`Usuario não autenticado`);

      setTimeout(() => {

        window.location.href = '/login';
      }, 1500);

      return;
    }

    console.log(user)
    setUsuarioLogado(user)
    buscaTodasReceitas();
  }, []);

  const handleLogout = () => {
    Modal.confirm({
      title: 'Confirmar saída',
      content: 'Tem certeza que deseja sair?',
      onOk: () => {
        localStorage.clear();
        //sessionStorage.clear();
        window.location.href = '/login';
      },
      onCancel: () => {

      },
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <Affix offsetTop={20} style={{ position: 'absolute', left: 20, top: 20 }}>
        <Space>
        <Button type="default" onClick={handleLogout} danger>
          Sair
        </Button>
        <Button type="default" onClick={()=>buscaTodasReceitasUser(usuarioLogado.id)} icon={<BookOutlined />}>
          Minhas Receitas
        </Button>
        </Space>
      </Affix>
      <Row justify="end" gutter={16}>
        <Col>
          <Button type="primary" icon={<PlusOutlined />}>
            <Link to="/CadastroIngrediente">Cadastrar Ingrediente</Link>
          </Button>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />}>
            <Link to="/CadastroReceita">Cadastrar Receita</Link>
          </Button>
        </Col>
      </Row>
      <Typography.Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>
        Receitas da comunidade
      </Typography.Title>
      <Row justify="center" style={{ marginTop: '40px' }}>
        <Col span={12}>
          <Input
            placeholder="Pesquisar receitas..."
            size="large"
            value={valorPesquisa}
            onChange={handleInputChange}
            prefix={<SearchOutlined />}
          />
        </Col>
        <Col span={2}>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            size="large"
            style={{ marginLeft: '10px' }}
            onClick={() => buscaTodasReceitasNome(valorPesquisa)}
          >
            Pesquisar
          </Button>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: '20px' }}>
        {receitas.map((receita, index) => (
          <Col span={6} key={index}>
            <Card>
              <Typography.Title level={3} style={{ marginTop: '10px' }}>
                {receita.nome}
              </Typography.Title>
              <Typography.Paragraph level={3} style={{ marginTop: '10px' }}>
                {receita.descricao}
              </Typography.Paragraph>
              <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                <Button
                  type="default"
                  icon={<EditOutlined />}
                  onClick={() => handleEditar(receita)}
                  disabled={usuarioLogado.profile !== 'ADM' && usuarioLogado.id !== receita.usuarioId }
                >
                  Editar
                </Button>
                <Button
                  type="default"
                  icon={<LikeOutlined />}
                  onClick={() => handleCurtir(receita.id)}
                >
                  {' ' + receita.curtidas}
                </Button>
                <Button
                  type="default"
                  icon={<DeleteOutlined />}
                  onClick={() => handleExcluir(receita.id)}
                  disabled={usuarioLogado.profile !== 'ADM' && usuarioLogado.id !== receita.usuarioId }
                >
                  Excluir
                </Button>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title="Editar Receita"
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setReceitaSelecionada(null);
        }}
        footer={null}
      >
        <Form
          name="editForm"
          onFinish={handleEditFormSubmit}
        >
          <Form.Item
            label="Nome da Receita"
            name="nome"
            initialValue={receitaSelecionada?.nome}
            rules={[{ required: true, message: 'Por favor, insira o nome da receita!' }]}
          >
            <Input value={nomeReceita} onChange={(e) => setNomeReceita(e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Descrição"
            name="descricao"
            initialValue={receitaSelecionada?.descricao}
            rules={[{ required: true, message: 'Por favor, insira a descrição da receita!' }]}
          >
            <Input value={descricaoReceita} onChange={(e) => setDescricaoReceita(e.target.value)}/>
          </Form.Item>
          <Form.Item
            label="Ingredientes"
            name="ingredientes"

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
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Salvar
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default TelaPrincipal;
