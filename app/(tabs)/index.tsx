import React, { useEffect, useState } from "react";
import { StyleSheet, Button, View, Text, TextInput, Alert, FlatList, TouchableOpacity, Image } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import * as Location from "expo-location";

const App: React.FC = () => {
  const [statusInput, setStatusInput] = useState("");
  const [filteredStatuses, setFilteredStatuses] = useState<string[]>([]);
  const [showList, setShowList] = useState(false);

  const [nomePlanta, setNomePlanta] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [dataCriacao, setDataCriacao] = useState("");
  const [dataEdicao, setDataEdicao] = useState("");
  const [latitude, setLatitude] = useState<string | null>(null);
  const [longitude, setLongitude] = useState<string | null>(null);

  const statuses = [
    'Sementeira', 'Germinação', 'Vegetativo', 'Floração', 'Frutificação',
    'Saudável', 'Doente', 'Pragas', 'Seca', 'Excesso de água',
    'Nutrientes', 'Colheita', 'Pós-colheita', 'Morta'
  ];

  // 🔄 **Captura e salva localização automaticamente a cada 1 minuto**
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     fetchLocation(true);
  //   }, 60000);

  //   return () => clearInterval(interval);
  // }, []);

  const handleStatusChange = (text: string) => {
    setStatusInput(text);
    if (text) {
      const filtered = statuses.filter((status) =>
        status.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredStatuses(filtered);
      setShowList(true);
    } else {
      setShowList(false);
    }
  };

  const handleStatusSelect = (status: string) => {
    setStatusInput(status);       // Mostra o valor selecionado no TextInput
    setSelectedStatus(status);    // Salva a opção selecionada
    setShowList(false);           // Fecha a lista após seleção
  };

  const fetchLocation = async (): Promise<void> => {
    try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Erro", "Permissão para acessar localização foi negada");
            return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = currentLocation.coords;

        setLatitude(latitude.toString());
        setLongitude(longitude.toString());
    } catch (error: any) {
        Alert.alert("Erro", `Erro ao buscar localização: ${error.message}`);
    }
};

  

  const sendLocationToBackend = async (isEditing = false, id = null) => {
    if (!nomePlanta || !selectedStatus || !latitude || !longitude || latitude === "" || longitude === "" || !selectedStatus) {
      Alert.alert("Erro", "Preencha todos os campos antes de salvar.");
      return;
    }

    try {
      const url = `http://ip:9000/salvar-plantacao${id ? `/${id}` : ""}`;
      const method = id ? "PATCH" : "POST";


      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planta: nomePlanta,
          status: selectedStatus,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || "Erro desconhecido ao salvar a plantação.");
      }

      Alert.alert("Sucesso", `Plantação ${isEditing ? "atualizada" : "salva"} com sucesso!`);
    } catch (error) {
      Alert.alert("Erro", `Falha ao enviar dados: ${error}`);
    }
  };


  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View>
          <Image source={{ uri: 'assets:/images:/plantations.jpeg' }}
            style={{ width: 50, height: 50 }} />
          <Text style={styles.title}>PLANTAÇÃO</Text>

          <TextInput
            style={styles.input}
            placeholder="Nome da planta"
            value={nomePlanta}
            onChangeText={setNomePlanta} />

          {/*Inserir e mandar Status da Planta */}
          <TextInput
            style={styles.input}
            placeholder="Status da plantação"
            value={statusInput}
            onChangeText={handleStatusChange}
            onFocus={() => setShowList(true)}
          />

          {showList && (
            <FlatList
              data={filteredStatuses.length > 0 ? filteredStatuses : statuses}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    item === selectedStatus && styles.selectedOption, 
                  ]}
                  onPress={() => handleStatusSelect(item)}
                >
                  <Text style={item === selectedStatus ? styles.selectedText : undefined}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              style={styles.list}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Data de criação"
            onChangeText={setDataCriacao}
          />

          <TextInput
            style={styles.input}
            value={dataEdicao}
            onChangeText={setDataEdicao}
            placeholder="Data da atualização"
          />


          <View style={{ display: 'none' }}>
            {latitude !== null && (
              <TextInput
                style={styles.input}
                value={latitude}
                placeholder="Latitude"
                editable={false} 
              />
            )}
            {longitude !== null && (
              <TextInput
                style={styles.input}
                value={longitude}
                placeholder="Longitude"
                editable={false} 
              />
            )}
          </View>


          <Button
            title="Salvar"
            onPress={() => {
              fetchLocation(); // Busca a localização
              sendLocationToBackend(false); // Salva os dados
            }}
          />

          <Button
            title="Editar"
            onPress={() => sendLocationToBackend(true)}
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
  input: {
    height: 50,
    margin: 12,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  list: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginHorizontal: 12,
    maxHeight: 150,
  },
  option: {
    padding: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  selectedOption: {
    backgroundColor: '#e0f7fa',
  },
  selectedText: {
    fontWeight: 'bold',
    color: '#00796b',
  },
});

export default App;
