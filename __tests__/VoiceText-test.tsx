import {fireEvent, render} from '@testing-library/react-native';
import VoiceText from '../component/VoiceText';
import Voice from '@react-native-community/voice';
jest.mock('@react-native-community/voice')

test('Voice component starts and stops correctly', async () => {
    const { getByText } = render(<VoiceText />);
    const buttonStart = getByText('Start');
    const buttonStop = getByText('Stop');

    fireEvent.press(buttonStart);
  
    expect(Voice.start).toHaveBeenCalled();
  
    fireEvent.press(buttonStop);
  
    expect(Voice.stop).toHaveBeenCalled();
  });
  