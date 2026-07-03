import { StyleSheet, View, Text } from 'react-native';

export default function WhatsOnScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>What's On</Text>
      <Text style={styles.sub}>Coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F0EB',
  },
  label: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  sub: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
  },
});
