import React, { useEffect, useState } from "react";
import { StyleSheet, Button, View, Text, Alert } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import * as Location from "expo-location";


const App: React.FC = () => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  // Captura e salva localização automaticamente a cada 1 minuto
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLocation(true);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Função para capturar localização
  const fetchLocation = async (autoSave: boolean = false): Promise<void> => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Erro", "Permissão para acessar localização foi negada");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;

      setLatitude(latitude);
      setLongitude(longitude);

      if (autoSave) {
        sendLocationToBackend(latitude, longitude);
      } else {
        Alert.alert("Localização Atual", `Latitude: ${latitude}\nLongitude: ${longitude}`);
      }
    } catch (error: any) {
      Alert.alert("Erro", `Erro ao buscar localização: ${error.message}`);
    }
  };

  // Função para enviar localização para o backend
  //Enviar conforme projeto Turismo
  const sendLocationToBackend = async (latitude: number | null, longitude: number | null): Promise<void> => {
    if (latitude === null || longitude === null) {
      Alert.alert("Erro", "Coordenadas inválidas");
      return;
    }


  
    try {
      const response = await fetch("http://192.168.15.40:9000/salvar-localizacao", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ latitude, longitude }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.erro || "Erro desconhecido ao salvar localização");
      }
  
      Alert.alert("Sucesso", data.mensagem);
    } catch (error: any) {
      Alert.alert("Erro", `Falha ao enviar localização: ${error.message}`);
    }
  };
  
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View>
        <Text style={styles.title}>Plantação</Text>
          <Text style={styles.title}>PEGA LOCALIZAÇÃO</Text>
          <Text style={styles.subtitle}>Vai ser inputs aqui</Text>
          <Text style={styles.subtitle}>Nome da planta</Text>
          <Text style={styles.subtitle}>Status da plantação(status'Sementeira', 'Germinação', 'Vegetativo', 'Floração', 'Frutificação', 'Saudável', 'Doente', 'Pragas', 'Seca', 'Excesso de água', 'Nutrientes', 'Colheita', 'Pós-colheita', 'Morta')</Text>
          <Text style={styles.subtitle}>Coordenada geografica aqui</Text>
          <Text style={styles.subtitle}>DAta de criação</Text>


          <Button title="BUSCAR" onPress={() => fetchLocation(false)} />
          <Button
            title="SALVAR LOCALIZAÇÃO"
            onPress={() => sendLocationToBackend(latitude, longitude)}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 16,
  },
  title: {
    textAlign: "center",
    marginVertical: 8,
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    textAlign: "center",
    marginVertical: 8,
    fontSize: 16,
  },
});

export default App;
