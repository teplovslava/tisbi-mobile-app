import * as LocalAuthentication from 'expo-local-authentication';

async function authenticate(login:string) {
  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      // console.log('No biometric hardware available');
      return false;
    }

    const supportedAuthTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
    if (supportedAuthTypes.length === 0) {
      // console.log('No biometric authentication methods are supported');
      return false;
    }

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
      // console.log('No biometric authentication methods are enrolled');
      return false;
    }

    let promptMessage = 'Authenticate';
    if (supportedAuthTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      promptMessage = `Authenticate with FaceID ${login}`;
    } else if (supportedAuthTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      promptMessage = `Authenticate with TouchID ${login}`;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      fallbackLabel: 'Use Passcode',
    });

    if (result.success) {
      // console.log('Authenticated successfully');
      return true;
    } else {
      // console.log('Authentication failed');
      return false;
    }
  } catch (error) {
    // console.error('An error occurred during authentication', error);
    return false;
  }
}

export default authenticate;
