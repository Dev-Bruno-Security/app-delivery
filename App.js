import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const products = [
  { id: '1', name: 'Coxinha', price: 5 },
  { id: '2', name: 'Batatinha Frita', price: 7 },
  { id: '3', name: 'Refrigerante', price: 4 },
];

export default function App() {
  const [screen, setScreen] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [total, setTotal] = useState(0);

  const handleSelect = (item) => {
    setSelectedItems([...selectedItems, item]);
    setTotal(total + item.price);
  };

  const renderLogin = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Button title="Entrar" onPress={() => setScreen('menu')} />
      <TouchableOpacity onPress={() => setScreen('register')}><Text style={styles.link}>Criar conta</Text></TouchableOpacity>
    </View>
  );

  const renderRegister = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Button title="Cadastrar" onPress={() => setScreen('menu')} />
    </View>
  );

  const renderMenu = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Escolha seu lanche</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => handleSelect(item)}>
            <Text>{item.name} - R${item.price}</Text>
          </TouchableOpacity>
        )}
      />
      <Button title="Próximo" onPress={() => setScreen('resumo')} />
    </View>
  );

  const renderResumo = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Resumo do Pedido</Text>
      {selectedItems.map((item, index) => (
        <Text key={index}>{item.name} - R${item.price}</Text>
      ))}
      <Text style={styles.total}>Total: R${total}</Text>
      <Button title="Pagamento" onPress={() => setScreen('pagamento')} />
    </View>
  );

  const renderPagamento = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Forma de Pagamento</Text>
      <TouchableOpacity style={styles.item}><Text>Cartão de Crédito</Text></TouchableOpacity>
      <TouchableOpacity style={styles.item}><Text>PIX</Text></TouchableOpacity>
      <TouchableOpacity style={styles.item}><Text>Dinheiro</Text></TouchableOpacity>
      <Text style={{ marginTop: 20 }}>Pedido Finalizado! Obrigado!</Text>
    </View>
  );

  switch (screen) {
    case 'login': return renderLogin();
    case 'register': return renderRegister();
    case 'menu': return renderMenu();
    case 'resumo': return renderResumo();
    case 'pagamento': return renderPagamento();
    default: return renderLogin();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center'
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5
  },
  item: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10
  },
  total: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold'
  },
  link: {
    marginTop: 10,
    color: 'blue',
    textAlign: 'center'
  }
});
