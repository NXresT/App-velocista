import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Keyboard,
} from 'react-native';

const App = () => {
  const [numeroVelocista, setNumeroVelocista] = useState('');
  const [milissegundos, setMilissegundos] = useState(0);
  const [running, setRunning] = useState(false);
  const [tempos, setTempos] = useState([]);
  const [startTime, setStartTime] = useState(0);

  useEffect(() => {
    let interval;

    const updateTime = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      setMilissegundos(elapsed);

      if (running) {
        interval = requestAnimationFrame(updateTime);
      } else {
        cancelAnimationFrame(interval);
      }
    };

    if (running) {
      interval = requestAnimationFrame(updateTime);
    }

    return () => cancelAnimationFrame(interval);
  }, [running, startTime]);

  const iniciarCronometro = () => {
    setStartTime(Date.now());
    setRunning(true);
  };

  const pararCronometro = () => {
    setRunning(false);
  };

  const registrarVelocista = () => {
    if (numeroVelocista.trim() === '') return;
    const minutos = Math.floor((milissegundos / 60000) % 60);
    const segundos = Math.floor((milissegundos / 1000) % 60);
    const ms = milissegundos % 1000;
    const tempoAtual = `${minutos.toString().padStart(2, '0')}:${segundos
      .toString()
      .padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
    setTempos([...tempos, { numero: numeroVelocista, tempo: tempoAtual }]);
    setNumeroVelocista('');
    Keyboard.dismiss(); // Esconder o teclado ao registrar o tempo
  };

  const resetarCronometro = () => {
    setRunning(false);
    setMilissegundos(0);
    setStartTime(0);
    setTempos([]);
  };

  const formatarTempo = () => {
    const minutos = Math.floor((milissegundos / 60000) % 60);
    const segundos = Math.floor((milissegundos / 1000) % 60);
    const ms = milissegundos % 1000;
    return `${minutos.toString().padStart(2, '0')}:${segundos
      .toString()
      .padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Número do Velocista:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={numeroVelocista}
        onChangeText={setNumeroVelocista}
        maxLength={4}
        onSubmitEditing={registrarVelocista}
      />
      <TouchableOpacity style={styles.button} onPress={iniciarCronometro}>
        <Text style={styles.buttonText}>Iniciar Corrida</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={registrarVelocista}>
        <Text style={styles.buttonText}>Registrar Velocista</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={pararCronometro}>
        <Text style={styles.buttonText}>Parar Cronômetro</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={resetarCronometro}>
        <Text style={styles.buttonText}>Resetar Cronômetro</Text>
      </TouchableOpacity>
      <Text style={styles.tempo}>{formatarTempo()}</Text>
      <FlatList
        data={tempos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>Velocista {item.numero} </Text>
            <Text style={styles.itemTime}>{item.tempo}</Text>
          </View>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    paddingTop: 75,
    backgroundColor: '#f0f0f0',
  },
  label: {
    fontSize: 20,
    marginBottom: 12,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    width: '80%',
    textAlign: 'center',
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  tempo: {
    fontSize: 32,
    color: '#6200ee',
    marginVertical: 20,
  },
  list: {
    width: '100%',
    paddingHorizontal: '10%',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  itemText: {
    fontSize: 18,
    color: '#333',
  },
  itemTime: {
    fontSize: 18,
    color: '#6200ee',
  },
});

export default App;
