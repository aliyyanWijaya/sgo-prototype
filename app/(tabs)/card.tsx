import { StyleSheet, View, Text } from 'react-native';

export default function CardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Card</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 24,
    fontWeight: '600',
    color: '#11181C',
  },
});
