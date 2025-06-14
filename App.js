import React, { useState, createContext, useContext, useEffect } from 'react';
import {
  View, Text, TextInput, Image, TouchableOpacity, FlatList,
  StyleSheet, Alert, ScrollView
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { supabase } from "../../Bruno/app-delivery/src/lib/supabase";

const Stack = createStackNavigator();


//Contexto Global do Carrinho
const CarrinhoContext = createContext();

const CarrinhoProvider = ({ children }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [total, setTotal] = useState(0);

  const addItem = (item) => {
    setSelectedItems((prev) => [...prev, item]);
    setTotal((prev) => prev + item.price);
  };

  const removeItem = (index) => {
    const item = selectedItems[index];
    const newItems = [...selectedItems];
    newItems.splice(index, 1);
    setSelectedItems(newItems);
    setTotal((prev) => prev - item.price);
  };

  const clearCart = () => {
    setSelectedItems([]);
    setTotal(0);
  };

  return (
    <CarrinhoContext.Provider value={{ selectedItems, total, addItem, removeItem, clearCart }}>
      {children}
    </CarrinhoContext.Provider>
  );
};

const useCarrinho = () => useContext(CarrinhoContext);


//Lista de Produtos
const products = [
  { id: '1', name: 'Coxinha', price: 5, image: 'https://static.itdg.com.br/images/auto-auto/52b96f7095b56f027799bbe66dfd9532/coxinha-crocante.jpg' },
  { id: '2', name: 'Batatinha Frita', price: 7, image: 'https://img.cdndsgni.com/preview/11098398.jpg' },
  { id: '3', name: 'Refrigerante', price: 4, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqAgnJaWI8dk9bqJ4hXiNKaIzV-oDCvgOrbQ&s' },
];

let pedidosRealizados = [];


//Login
function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setEmail('');
    setPassword('');
  }, []);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert('Erro de login', 'Email ou senha incorretos.');
      return;
    }

    setEmail('');
    setPassword('');
    navigation.navigate('Menu');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Criar conta</Text>
      </TouchableOpacity>
    </View>
  );
}


//Cadastro
function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const handleRegister = async () => {
    if (!email || !password || !name || !address || !phone) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: email,
      password: password
    });

    if (error) {
      Alert.alert('Erro', 'Erro ao cadastrar. Tente novamente.');
      return;
    }

    Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <TextInput placeholder="Nome" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Endereço" value={address} onChangeText={setAddress} style={styles.input} />
      <TextInput placeholder="Telefone" value={phone} onChangeText={setPhone} style={styles.input} keyboardType="phone-pad" />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}


//Menu de Produtos
function MenuScreen({ navigation }) {
  const { addItem, clearCart } = useCarrinho();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    clearCart();
    navigation.navigate('Login');
  };

  const handleSelect = (item) => {
    addItem(item);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escolha seu lanche</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.productItem} onPress={() => handleSelect(item)}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <Text>{item.name} - R${item.price}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Resumo')}>
        <Text style={styles.buttonText}>Próximo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#555' }]}
        onPress={() => navigation.navigate('Pedidos')}>
        <Text style={styles.buttonText}>Meus Pedidos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: 'gray' }]}
        onPress={handleLogout}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}


//Tela Resumo do Pedido
function ResumoScreen({ navigation }) {
  const { selectedItems, total, removeItem } = useCarrinho();

  const handlePagamento = () => {
    if (selectedItems.length === 0) {
      Alert.alert('Atenção', 'Seu carrinho está vazio.');
      return;
    }

    navigation.navigate('Pagamento');
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.productItem}>
      <Text>{item.name} - R${item.price}</Text>
      <TouchableOpacity onPress={() => removeItem(index)}>
        <Text style={{ color: 'red' }}>Remover</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumo do Pedido</Text>
      {selectedItems.length === 0 ? (
        <Text style={{ textAlign: 'center' }}>Nenhum item no carrinho.</Text>
      ) : (
        <FlatList
          data={selectedItems}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
        />
      )}
      <Text style={styles.total}>Total: R${total}</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          selectedItems.length === 0 && { backgroundColor: '#ccc' }
        ]}
        onPress={handlePagamento}
        disabled={selectedItems.length === 0}>
        <Text style={styles.buttonText}>Pagamento</Text>
      </TouchableOpacity>
    </View>
  );
}


//Pagamento
function PagamentoScreen({ navigation }) {
  const { selectedItems, total, clearCart } = useCarrinho();

  const finalizar = (pagamento) => {
    pedidosRealizados.push({
      id: Date.now().toString(),
      itens: selectedItems,
      total: total,
      pagamento: pagamento,
      data: new Date().toLocaleString()
    });

    clearCart();
    navigation.navigate('Finalizacao');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forma de Pagamento</Text>
      {['Cartão de Crédito', 'PIX', 'Dinheiro'].map((tipo) => (
        <TouchableOpacity
          key={tipo}
          style={styles.button}
          onPress={() => finalizar(tipo)}>
          <Text style={styles.buttonText}>{tipo}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}


//Finalização
function FinalizacaoScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pagamento Realizado!</Text>
      <Text style={{ textAlign: 'center', marginVertical: 20 }}>
        Seu pedido foi finalizado com sucesso. Obrigado por comprar conosco!
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Menu')}>
        <Text style={styles.buttonText}>Voltar ao Menu</Text>
      </TouchableOpacity>
    </View>
  );
}


//Tela Meus Pedidos
function PedidosScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Meus Pedidos</Text>
      {pedidosRealizados.length === 0 ? (
        <Text style={{ textAlign: 'center' }}>Nenhum pedido realizado.</Text>
      ) : (
        pedidosRealizados.map((pedido) => (
          <View key={pedido.id} style={styles.pedidoCard}>
            <Text style={{ fontWeight: 'bold' }}>Pedido #{pedido.id}</Text>
            <Text>Data: {pedido.data}</Text>
            {pedido.itens.map((item, index) => (
              <Text key={index}>- {item.name} (R${item.price})</Text>
            ))}
            <Text>Total: R${pedido.total}</Text>
            <Text>Pagamento: {pedido.pagamento}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}


//App Principal
export default function App() {
  return (
    <CarrinhoProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Menu" component={MenuScreen} />
          <Stack.Screen name="Resumo" component={ResumoScreen} />
          <Stack.Screen name="Pagamento" component={PagamentoScreen} />
          <Stack.Screen name="Finalizacao" component={FinalizacaoScreen} />
          <Stack.Screen name="Pedidos" component={PedidosScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </CarrinhoProvider>
  );
}


//Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    borderColor: '#ccc'
  },
  button: {
    backgroundColor: '#E02041',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 5
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ddd'
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8
  },
  total: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  link: {
    marginTop: 10,
    color: '#E02041',
    textAlign: 'center'
  },
  pedidoCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f9f9f9'
  }
});
