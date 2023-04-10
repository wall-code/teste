import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import traduzirDescricao from "./tradutor";

export default function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [isFloodingPossible, setIsFloodingPossible] = useState(false);

  const API_KEY = "8b9cc5b51779efe2f79a395394bd2f3f";
  const API_URL = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&units=metric&q=`;

  const handleSearch = async () => {
    try {
      const response = await axios.get(API_URL + city);
      const data = response.data;

      setWeatherData(data);

      // Verifica se a previsão do tempo indica possibilidade de alagamento
      if (data.rain && data.rain["1h"] && data.rain["1h"] > 10) {
        setIsFloodingPossible(true);
      } else if (data.snow && data.snow["1h"] && data.snow["1h"] > 10) {
        setIsFloodingPossible(true);
      } else if (data.main.humidity > 80) {
        setIsFloodingPossible(true);
      } else {
        setIsFloodingPossible(false);
      }
    } catch (error) {
      console.error(error);
      if (error.response.status === 404) {
        alert("a cidade não existe");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Previsão do tempo</Text>
      <TextInput
        style={styles.input}
        value={city}
        onChangeText={setCity}
        placeholder="Digite o nome da cidade"
      />
      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Pesquisar</Text>
      </TouchableOpacity>
      {weatherData && (
        <View style={styles.weatherInfo}>
          <Text
            style={styles.weatherText}
          >{`Cidade: ${weatherData.name}`}</Text>
          <Text
            style={styles.weatherText}
          >{`Temperatura: ${weatherData.main.temp}°C`}</Text>
          <Text style={styles.weatherText}>{`Tempo: ${traduzirDescricao(
            weatherData.weather[0].description
          )}`}</Text>
          {isFloodingPossible && (
            <Text style={styles.warningText}>Possibilidade de alagamento!</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  image: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: "100%",
  },
  button: {
    backgroundColor: "blue",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  weatherInfo: {
    marginTop: 20,
    alignItems: "center",
  },
  weatherText: {
    fontSize: 18,
    marginBottom: 5,
  },
  warningText: {
    fontSize: 20,
  },
});
