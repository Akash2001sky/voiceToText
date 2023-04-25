import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {Component} from 'react';
import Voice from '@react-native-community/voice';
import database from '@react-native-firebase/database';
interface Istate {
  recognized: string;
  pitch: string;
  error: string;
  end: string;
  result: string;
  isLoading: boolean;
  name: string;
  updateToDb: string;
  DbData: {
    voice: string;
  }[];
}
interface Iprops {}
export class VoiceText extends Component<Iprops, Istate> {
  constructor(props: Iprops) {
    super(props);
    this.state = {
      recognized: '',
      pitch: '',
      error: '',
      end: '',
      result: '',
      isLoading: false,
      name: '',
      updateToDb: '',
      DbData: [],
    };
    Voice.onSpeechStart = this.onSpeechStarted.bind(this);
    Voice.onSpeechResults = this.speechResultsHandler.bind(this);
    Voice.onSpeechEnd = this.speechEndHandler.bind(this);
  }
  componentDidMount(): void {
    const reference = database().ref('/User');
    reference.on('value', snapshot => {
      console.log(Object.values(snapshot.val() || {}), '=============');
      this.setState({DbData: Object.values(snapshot.val() || {})});
    });
  }

  componentWillUnmount() {
    // Stop voice recognition when component unmounts
    Voice.destroy().then(Voice.removeAllListeners);
  }

  onSpeechStarted(e:any) {
    this.setState({isLoading: true});
    // this.setState({ recognized: e.value });
    console.log('speechStart successful', e);
  }

  speechResultsHandler(e: any) {
    this.setState({result: e.value[0]});
  }

  speechEndHandler(e: any) {
    this.setState({isLoading: false});

    this.setState({end: e});
  }

  async startRecognizing() {
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  }

  async stopRecognizing() {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  }

  clear = () => {
    this.setState({result: ''});
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        {/* <Text style={{marginBottom: 20}}>{this.state.result}</Text> */}
        <TextInput
          placeholder="Speak something..."
          style={styles.textInput}
          value={this.state.result}
        />
        <TouchableOpacity
          onPress={() => this.startRecognizing()}
          style={styles.BtnStart}>
          {this.state.isLoading ? (
            <ActivityIndicator size="large" color="white" />
          ) : (
            <Text style={{color: '#ffffff'}}>Start</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.setState({isLoading: false});
            this.stopRecognizing();
          }}
          style={styles.BtnStop}>
          <Text style={{color: '#ffffff'}}>Stop</Text>
        </TouchableOpacity>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity
            onPress={() => this.clear()}
            style={styles.BtnClear}>
            <Text style={{color: '#ffffff'}}>clear</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.BtnUpdate}
            onPress={() => {
              const newReference = database().ref('/User').push();
              if (this.state.result.length > 1) {
                newReference
                  .set({
                    voice: this.state.result,
                  })
                  .then(() => console.log('Data updated.'));
                this.setState({result: ''});
              } else {
                Alert.alert('you dont speak');
              }

              this.setState({result: ''});
            }}>
            <Text style={{color: '#ffffff'}}>UpdateToDB</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.BtnCleardb}
            onPress={async () => {
              await database().ref('/User').remove();
            }}>
            <Text style={{color: '#ffffff'}}>Clear DB</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={this.state.DbData}
          renderItem={({item, index}) => {
            return (
              <View>
                <Text>{item.voice}</Text>
              </View>
            );
          }}
        />
      </View>
    );
  }
}

export default VoiceText;
const styles=StyleSheet.create({
  mainContainer:{flex: 1, justifyContent: 'center', padding: 20},
  textInput:{
    height: 100,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
  BtnStart:{
    backgroundColor: '#000000',
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  BtnStop:{
    backgroundColor: '#e93a28',
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  BtnClear:{
    backgroundColor: '#e93a28',
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    width: 100,
  },
  BtnUpdate:{
    backgroundColor: '#007ec6',
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    width: 100,
  },
  BtnCleardb:{
    backgroundColor: '#e93a28',
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    width: 100,
  }


})
