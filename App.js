
import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Keyboard} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFonts } from 'expo-font'
import { AlanSans_400Regular, AlanSans_700Bold } from '@expo-google-fonts/alan-sans'

export default function App() {
  const [tarefas, setTarefas] = useState([])
  const [input, setInput] = useState('')
  const [carregado, setCarregado] = useState(false)

  useEffect(() => {
    const recuperarTarefas = async () => {
      try {
        const tarefasSalvas = await AsyncStorage.getItem('tarefas')
        if (tarefasSalvas !== null) {
          setTarefas(JSON.parse(tarefasSalvas))
        }
      } catch (error) {
        alert('Erro ao recuperar tarefas!')
      }
      setCarregado(true)
    }

    recuperarTarefas()
  }, [])

  useEffect(() => {
    const salvarTarefas = async () => {
      try {
        await AsyncStorage.setItem(
          'tarefas',
          JSON.stringify(tarefas)
        )
      } catch (error) {
        alert('Erro ao salvar tarefas!')
      }
    }

    if (carregado) {
      salvarTarefas()
    }
  }, [tarefas, carregado])

  const adicionarTarefa = () => {
    if (input.trim() === '') {
      alert('Digite uma tarefa!')
      return
    }

    const novaTarefa = {
      id: Date.now().toString(),
      texto: input.trim(),
      concluida: false
    }
    setTarefas([...tarefas, novaTarefa])
    setInput('')
    Keyboard.dismiss()
  }

  const concluirTarefa = (id) => {
    const novasTarefas = tarefas.map((tarefa) => {
      if (tarefa.id === id) {
        return {
          ...tarefa,
          concluida: !tarefa.concluida
        }
      }
      return tarefa
    })
    setTarefas(novasTarefas)
  }
  const excluirTarefa = (id) => {
    const novasTarefas = tarefas.filter(
      (tarefa) => tarefa.id !== id
    )
    setTarefas(novasTarefas)
  }
  const renderizarTarefa = ({ item }) => {
    return (
      <View style={styles.tarefa}>
        <TouchableOpacity
          style={[
            styles.concluir,
            item.concluida && styles.concluirAtivo
          ]}
          onPress={() => concluirTarefa(item.id)}
        />

        <Text
          style={[
            styles.textoTarefa,
            item.concluida && styles.tarefaConcluida
          ]}
        >
          {item.texto}
        </Text>

        <TouchableOpacity
          style={styles.excluir}
          onPress={() => excluirTarefa(item.id)}
        >
          <Text style={styles.excluirTexto}>X</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Afazeres</Text>

      <View style={styles.inputView}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={(texto) => setInput(texto)}
          placeholder="Digite um afazer..."
          underlineColorAndroid="transparent"
          onSubmitEditing={adicionarTarefa}
        />

        <TouchableOpacity
          style={styles.botao}
          onPress={adicionarTarefa}
        >
          <Text style={styles.botaoTexto}>+</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.titleLista}>
        Minhas tarefas
      </Text>

      <FlatList
        data={tarefas}
        keyExtractor={(item) => item.id}
        renderItem={renderizarTarefa}
        ListEmptyComponent={
          <Text style={styles.vazio}>
            Nenhuma tarefa cadastrada.
          </Text>
        }
      />

      <Text style={styles.quantidade}>
        Total de tarefas: {tarefas.length}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    padding: 20,
    backgroundColor: '#F5F5F5'
  },

  title: {
    fontSize: 32,
    fontFamily: 'AlanSans_400Regular',
    textAlign: 'center',
    color: '#22222'
  },

  inputView: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  input: {
    flex: 1,
    height: 45,
    borderColor: '#000000',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#ffffff'
  },

  botao: {
    backgroundColor: '#0000ff',
    height: 45,
    width: 45,
    marginLeft: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },

  botaoTexto: {
    fontFamily: 'AlanSans_400Regular',
    color: '#ffffff',
    fontSize: 28
  },

  titleLista: {
    fontFamily: 'AlanSans_400Regular',
    marginTop: 25,
    marginBottom: 15,
    fontSize: 24,
    fontWeight: 'bold'
  },

  tarefa: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dddddd'
  },

  concluir: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: 'blue',
    backgroundColor: 'transparent'
  },

  concluirAtivo: {
    borderColor: '#22C55E',
    backgroundColor: '#22C55E'
  },

  textoTarefa: {
    fontFamily: 'AlanSans_400Regular',
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#222'
  },

  tarefaConcluida: {
    textDecorationLine: 'line-through',
    color: '#888888'
  },

  excluir: {
    backgroundColor: 'red',
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },

  excluirTexto: {
    fontFamily: 'AlanSans_400Regular',
    color: '#ffffff',
    fontWeight: 'bold'
  },

  vazio: {
    fontFamily: 'AlanSans_400Regular',
    textAlign: 'center',
    marginTop: 20,
    color: '#000',
    fontSize: 16
  },

  quantidade: {
    fontFamily: 'AlanSans_400Regular',
    marginTop: 15,
    marginBottom: 10,
    fontSize: 16,
    textAlign: 'center',
    color: '#000000'
  }
})
