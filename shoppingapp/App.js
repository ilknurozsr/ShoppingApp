import { StyleSheet, Text, View, TextInput,TouchableOpacity,FlatList } from 'react-native';
import React,{useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [products, setProducts] = useState([]);

  
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const storedProducts = await AsyncStorage.getItem('products');
        if (storedProducts) setProducts(JSON.parse(storedProducts));
      } catch (e) {
        console.log('Yüklenemedi', e);
      }
    };
    loadProducts();
  }, []);

  
  const saveProducts = async (products) => {
    try {
      await AsyncStorage.setItem('products', JSON.stringify(products));
    } catch (e) {
      console.log('Kaydedilemedi', e);
    }
  };

  
  const handleAddProduct = () => {
    if (productName.trim() === '' || price.trim() === '' || quantity.trim() === '') {
      return;
    }

    const newProduct = {
      id: Date.now().toString(),
      name: productName,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      completed: false, 
    };

    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    saveProducts(updatedProducts);

    setProductName('');
    setPrice('');
    setQuantity('');
  };

  
  const getTotal = () => {
    return products.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  
  const toggleCompleted = (id) => {
    const updatedProducts = products.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setProducts(updatedProducts);
    saveProducts(updatedProducts);
  };

  const deleteProduct=(id)=>{
    const updatedProducts=products.filter(item=>item.id!==id);
    setProducts(updatedProducts);
    saveProducts(updatedProducts);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Alışveriş Listesi 🛒</Text>
      
      <TextInput
      placeholder='Ürün adı'
      style={styles.input}
      value={productName}
      onChangeText={setProductName}
      />

      <TextInput
      placeholder='Fiyat'
      style={styles.input}
      keyboardType='numeric'
      value={price}
      onChangeText={setPrice}
      />

      <TextInput
      placeholder='Adet'
      style={styles.input}
      keyboardType='numeric'
      value={quantity}
      onChangeText={setQuantity}
      />

      <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
         <Text style={styles.buttonText}>Ekle</Text>
      </TouchableOpacity>

      <FlatList
      data={products}
      keyExtractor={(item)=>item.id}
      renderItem={({item})=>(
        <View style={styles.listItem}>
         <Text style={item.completed ? styles.completedText : styles.normalText}>
          {item.name} - {item.price}₺ x {item.quantity}
          </Text>

         <TouchableOpacity onPress={()=> toggleCompleted(item.id)}>
           <Text style={{color:'blue'}}>{item.completed ? "Geri Al" : "Tamamlandı"}</Text>
         </TouchableOpacity>

         <TouchableOpacity onPress={()=> deleteProduct(item.id)}>
          <Text style={{color:'red', marginLeft:15}}>Sil</Text>
         </TouchableOpacity>
        </View>
      )}
      />
      <Text style={styles.totalText}>Toplam:{getTotal()} ₺</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1, padding:20, marginTop:40},
  title:{fontSize:22, fontWeight:'bold', marginBottom:20, textAlign:'center'},
  input:{borderWidth:1, borderColor:'#ccc', padding:10, marginBottom:10, borderRadius:10},
  button:{backgroundColor:'green', padding:12, borderRadius:5, marginBottom:20, marginLeft:70, marginRight:70},
  buttonText:{color:'white', textAlign:'center', fontWeight:'bold'},
  totalText:{fontSize:18, fontWeight:'bold', marginTop:20},
  normalText:{fontSize:16},
  completedText:{fontSize:16, textDecorationLine:'line-through', color:'gray'},
  listItem:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    padding:10,
    borderBottomWidth:1,
    borderBottomColor:'#ddd'
  },
});
