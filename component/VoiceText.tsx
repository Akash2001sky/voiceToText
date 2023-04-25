import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
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

  onSpeechStarted(e: string) {
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
      <View style={{flex: 1, justifyContent: 'center', padding: 20}}>
        {/* <Text style={{marginBottom: 20}}>{this.state.result}</Text> */}
        <TextInput
          placeholder="Speak something..."
          style={{
            height: 100,
            borderWidth: 1,
            borderRadius: 10,
            marginBottom: 10,
          }}
          value={this.state.result}
        />
        <TouchableOpacity
          onPress={() => this.startRecognizing()}
          style={{
            backgroundColor: '#000000',
            height: 30,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
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
          style={{
            backgroundColor: '#e93a28',
            height: 30,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: 10,
          }}>
          <Text style={{color: '#ffffff'}}>Stop</Text>
        </TouchableOpacity>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity
            onPress={() => this.clear()}
            style={{
              backgroundColor: '#e93a28',
              height: 30,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 10,
              width: 100,
            }}>
            <Text style={{color: '#ffffff'}}>clear</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#007ec6',
              height: 30,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 10,
              width: 100,
            }}
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
            style={{
              backgroundColor: '#e93a28',
              height: 30,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 10,
              width: 100,
            }}
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
