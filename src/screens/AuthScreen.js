import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';
import { COLORS, GRADIENTS } from '../constants/colors';

const { width, height } = Dimensions.get('window');

export const AuthScreen = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signInWithGoogle, signUpWithEmail, signInWithEmail } = useAuth();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (isSignUp && !displayName) {
      Alert.alert('Error', 'Please enter a display name');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, displayName);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (error) {
      let errorMessage = 'Authentication failed';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email already in use';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'User not found';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password';
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={GRADIENTS.secondary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        {/* Background decorative circles */}
        <View style={styles.backgroundDecor}>
          <View style={[styles.decorCircle, styles.circle1]} />
          <View style={[styles.decorCircle, styles.circle2]} />
          <View style={[styles.decorCircle, styles.circle3]} />
        </View>

        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Title with enhanced styling */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>🧩</Text>
              <Text style={styles.titleHighlight}>Bizzle</Text>
              <View style={styles.titleUnderline} />
            </View>

            {/* Enhanced decorative elements */}
            <View style={styles.decorContainer}>
              <View style={styles.decorBox}>
                <Text style={styles.decorText}>
                  {isSignUp ? '✨ Create Your Account ✨' : '✨ Welcome Back ✨'}
                </Text>
              </View>
            </View>

            {/* Auth Form */}
            <View style={styles.formContainer}>
              <View style={styles.formCard}>
                {isSignUp && (
                  <TextInput
                    style={styles.input}
                    placeholder="Display Name"
                    placeholderTextColor={COLORS.light}
                    value={displayName}
                    onChangeText={setDisplayName}
                    autoCapitalize="words"
                  />
                )}

                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor={COLORS.light}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor={COLORS.light}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />

                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleEmailAuth}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={COLORS.gold ? [COLORS.gold, '#D97706'] : [COLORS.primary, COLORS.secondary]}
                    style={styles.buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    {loading ? (
                      <ActivityIndicator color={COLORS.darker} />
                    ) : (
                      <Text style={styles.primaryButtonText}>
                        {isSignUp ? '▶ Create Account' : '▶ Sign In'}
                      </Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity
                  style={styles.googleButton}
                  onPress={handleGoogleSignIn}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <View style={styles.googleButtonContent}>
                    <View style={styles.googleIconContainer}>
                      <Text style={styles.googleIcon}>G</Text>
                    </View>
                    <Text style={styles.googleButtonText}>Continue with Google</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.switchButton}
                  onPress={() => setIsSignUp(!isSignUp)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.switchText}>
                    {isSignUp 
                      ? 'Already have an account? Sign In' 
                      : "Don't have an account? Sign Up"
                    }
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Footer message */}
            <View style={styles.footer}>
              <View style={styles.footerCard}>
                <Text style={styles.footerText}>
                  Join the Bizzle adventure
                </Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darker,
  },
  backgroundDecor: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: width * 0.4,
    opacity: 0.1,
  },
  circle1: {
    width: width * 0.8,
    height: width * 0.8,
    top: -width * 0.2,
    right: -width * 0.2,
    backgroundColor: COLORS.white,
  },
  circle2: {
    width: width * 0.6,
    height: width * 0.6,
    bottom: height * 0.3,
    left: -width * 0.1,
    backgroundColor: COLORS.gold,
  },
  circle3: {
    width: width * 0.4,
    height: width * 0.4,
    top: height * 0.4,
    right: width * 0.1,
    backgroundColor: COLORS.accent,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 30,
    minHeight: height,
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    flex: 1,
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  titleHighlight: {
    fontSize: 48,
    fontWeight: '800',
    color: COLORS.gold,
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  titleUnderline: {
    width: 100,
    height: 4,
    backgroundColor: COLORS.gold,
    borderRadius: 2,
    marginTop: 8,
  },
  decorContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  decorBox: {
    backgroundColor: COLORS.white + '10',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.white + '20',
  },
  decorText: {
    fontSize: 16,
    color: COLORS.light,
    fontStyle: 'italic',
    letterSpacing: 2,
    fontWeight: '500',
  },
  formContainer: {
    marginBottom: 30,
  },
  formCard: {
    backgroundColor: COLORS.white + '15',
    borderRadius: 16,
    padding: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  input: {
    backgroundColor: COLORS.white + '10',
    borderWidth: 1,
    borderColor: COLORS.white + '30',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    color: COLORS.white,
    fontSize: 16,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 16,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.darker,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.white + '30',
  },
  dividerText: {
    color: COLORS.light,
    paddingHorizontal: 15,
    fontSize: 14,
    fontWeight: '600',
  },
  googleButton: {
    backgroundColor: COLORS.white + '20',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white + '40',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 16,
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4285F4',
  },
  googleButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  switchButton: {
    marginTop: 10,
  },
  switchText: {
    color: COLORS.gold,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerCard: {
    backgroundColor: COLORS.white + '10',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.white + '20',
  },
  footerText: {
    fontSize: 14,
    color: COLORS.light,
    textAlign: 'center',
    fontWeight: '500',
  },
});