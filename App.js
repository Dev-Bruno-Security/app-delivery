import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

// Lista de produtos disponíveis
const products = [
  { id: '1', name: 'Coxinha', price: 5, image: 'https://static.itdg.com.br/images/auto-auto/52b96f7095b56f027799bbe66dfd9532/coxinha-crocante.jpg'},
  { id: '2', name: 'Batatinha Frita', price: 7, image: 'https://img.cdndsgni.com/preview/11098398.jpg' },
  { id: '3', name: 'Refrigerante', price: 4, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqAgnJaWI8dk9bqJ4hXiNKaIzV-oDCvgOrbQ&s' },
];

// Tela de login com validação simples dos campos
function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    navigation.navigate('Menu');
  };

  return (
    <View style={styles.container}>
      {/* Logo carregada localmente */}
      
      <Text style={styles.title}>Login</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}><Text style={styles.link}>Criar conta</Text></TouchableOpacity>
    </View>
  );
}

// Tela de cadastro de novo usuário
function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Menu')}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}

// Tela com lista de produtos para selecionar
function MenuScreen({ navigation }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [total, setTotal] = useState(0);

  const handleSelect = (item) => {
    setSelectedItems([...selectedItems, item]);
    setTotal(total + item.price);
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
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Resumo', { selectedItems, setSelectedItems, total, setTotal })}>
        <Text style={styles.buttonText}>Próximo</Text>
      </TouchableOpacity>
    </View>
  );
}

// Tela com o resumo do pedido e opção de remover itens
function ResumoScreen({ navigation, route }) {
  const { selectedItems, setSelectedItems, total, setTotal } = route.params;

  const handleRemove = (index) => {
    const removedItem = selectedItems[index];
    const newItems = [...selectedItems];
    newItems.splice(index, 1);
    setSelectedItems(newItems);
    setTotal(total - removedItem.price);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumo do Pedido</Text>
      {selectedItems.map((item, index) => (
        <View key={index} style={styles.productItem}>
          <Text>{item.name} - R${item.price}</Text>
          <TouchableOpacity onPress={() => handleRemove(index)}>
            <Text style={{ color: 'red' }}>Remover</Text>
          </TouchableOpacity>
        </View>
      ))}
      <Text style={styles.total}>Total: R${total}</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Pagamento', { total })}>
        <Text style={styles.buttonText}>Pagamento</Text>
      </TouchableOpacity>
    </View>
  );
}

// Tela para escolha do método de pagamento
function PagamentoScreen({ navigation, route }) {
  const { total } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forma de Pagamento</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Finalizacao')}><Text style={styles.buttonText}>Cartão de Crédito</Text></TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Finalizacao')}><Text style={styles.buttonText}>PIX</Text></TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Finalizacao')}><Text style={styles.buttonText}>Dinheiro</Text></TouchableOpacity>
    </View>
  );
}

// Tela final confirmando o pagamento
function FinalizacaoScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pagamento Realizado!</Text>
      <Text style={{ textAlign: 'center', marginVertical: 20 }}>Seu pedido foi finalizado com sucesso. Obrigado por comprar conosco!</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.popToTop()}>
        <Text style={styles.buttonText}>Voltar ao Início</Text>
      </TouchableOpacity>
    </View>
  );
}

// Navegação principal do aplicativo
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen name="Resumo" component={ResumoScreen} />
        <Stack.Screen name="Pagamento" component={PagamentoScreen} />
        <Stack.Screen name="Finalizacao" component={FinalizacaoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Estilos usados em todas as telas
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 50
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
  }
});
