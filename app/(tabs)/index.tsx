import React, { useEffect, useState } from "react";
import { StyleSheet, Button, View, Text, TextInput, Alert, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import * as Location from "expo-location";

const App: React.FC = () => {
  const [latitude, setLatitude] = useState<string | null>(null);
  const [longitude, setLongitude] = useState<string | null>(null);
  const [statusInput, setStatusInput] = useState("");
  const [filteredStatuses, setFilteredStatuses] = useState<string[]>([]);
  const [showList, setShowList] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [nomePlanta, setNomePlanta] = useState("");
  const [statusPlanta, setStatusPlanta] = useState("");
  const [dataCriacao, setDataCriacao] = useState("");
  const [dataEdicao, setDataEdicao] = useState("");

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

  const fetchLocation = async (autoSave: boolean = false): Promise<void> => {
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

      if (autoSave) {
        sendLocationToBackend(latitude.toString(), longitude.toString());
      } else {
        Alert.alert("Localização Atual", `Latitude: ${latitude}\nLongitude: ${longitude}`);
      }
    } catch (error: any) {
      Alert.alert("Erro", `Erro ao buscar localização: ${error.message}`);
    }
  };

  const sendLocationToBackend = async (latitude: string | null, longitude: string | null): Promise<void> => {
    if (latitude === null || longitude === null) {
      Alert.alert("Erro", "Coordenadas inválidas");
      return;
    }

    try {
      const response = await fetch("http://ip:9000/salvar-localizacao", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ latitude, longitude, status: selectedStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || "Erro desconhecido ao salvar localização");
      }

      Alert.alert("Sucesso", `Localização e status "${selectedStatus}" salvos com sucesso!`);
    } catch (error: any) {
      Alert.alert("Erro", `Falha ao enviar localização: ${error.message}`);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View>
          <Text style={styles.title}>PLANTAÇÃO</Text>

          {/* planta: {type: String, required: true }, // Nome da planta
          // status: {type: String, required: true }, // Status da plantação
          // createdAt: {type: Date, default: Date.now } // Data de criação automática
          // criar um data de atualização Date toda vez que edita, só será salvo se for edição
          // latitude: {type: String, required: true }, // Coordenada geográfica
          // longitude: {type: String, required: true }, // Coordenada geográfica */}

          {/*Inserir e mandar nome da Planta */}

          
          <TextInput
            style={styles.input}
            placeholder="Nome da planta"
          />

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
                    item === selectedStatus && styles.selectedOption, // Aplica o estilo selecionado
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

          {/*Inserir e mandar Data de criação da Planta */}
          <TextInput
            style={styles.input}
            placeholder="Data de criação"
          />

          {/*Inserir e mandar Data de atualização da Planta toda ver que editar*/}

          <TextInput
            style={styles.input}
            placeholder="Data da atualização"
          />

          {/*Inserir e mandar latitude e longitude vai ser como um input interno*/}

          <Button title="BUSCAR" onPress={() => fetchLocation(false)} />
          <Button
            title="SALVAR LOCALIZAÇÃO"
            onPress={() => sendLocationToBackend(latitude, longitude)}
          />

          <Button title="Salvar"></Button>
          <Button title="Editar"></Button>

          <TextInput
            style={styles.input}
            placeholder="Nome da planta"
          />

                    {/* planta: {type: String, required: true }, // Nome da planta
          // status: {type: String, required: true }, // Status da plantação
          // createdAt: {type: Date, default: Date.now } // Data de criação automática
          // criar um data de atualização Date toda vez que edita, só será salvo se for edição
          // latitude: {type: String, required: true }, // Coordenada geográfica
          // longitude: {type: String, required: true }, // Coordenada geográfica */}

          <Text>Nome da Planta:</Text>
          <TextInput 
          style={styles.input}
            placeholder="Nome da planta"
          
          value={nomePlanta} onChangeText={setNomePlanta}  />

          <Text>Status da Planta:</Text>
          <TextInput value={statusPlanta} onChangeText={setStatusPlanta} style={{ borderWidth: 1, marginBottom: 10 }} />

          <Text>Data de criação:</Text>
          <TextInput value={dataCriacao} onChangeText={setDataCriacao} style={{ borderWidth: 1, marginBottom: 10 }} />

          <Text>Data de edição:</Text>
          <TextInput value={dataEdicao} onChangeText={setDataEdicao} style={{ borderWidth: 1, marginBottom: 10 }} />

          <Text>Latitude e longitude:</Text>


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
