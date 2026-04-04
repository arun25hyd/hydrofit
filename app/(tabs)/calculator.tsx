import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, SafeAreaView,
} from 'react-native';
import { Colors } from '../../constants/Colors';

export default function CalculatorScreen() {
  const [totalLen, setTotalLen] = useState('');
  const [b1, setB1] = useState('');
  const [b2, setB2] = useState('');
  const [result, setResult] = useState<number | null>(null);

  function calcCutLength() {
    const L = parseFloat(totalLen);
    const B1 = parseFloat(b1);
    const B2 = parseFloat(b2);
    if (!isNaN(L) && !isNaN(B1) && !isNaN(B2)) {
      setResult(L - B1 - B2);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hose Cut Length</Text>
        <Text style={styles.headerSub}>CL = Assembly length − B₁ − B₂</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Assembly dimensions (mm)</Text>

          <Text style={styles.label}>Total assembly length (mm)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="e.g. 500"
            placeholderTextColor={Colors.textMuted}
            value={totalLen}
            onChangeText={setTotalLen}
          />

          <Text style={styles.label}>Fitting B dim — End 1 (mm)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="e.g. 32"
            placeholderTextColor={Colors.textMuted}
            value={b1}
            onChangeText={setB1}
          />

          <Text style={styles.label}>Fitting B dim — End 2 (mm)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="e.g. 32"
            placeholderTextColor={Colors.textMuted}
            value={b2}
            onChangeText={setB2}
          />

          <TouchableOpacity style={styles.btn} onPress={calcCutLength} activeOpacity={0.8}>
            <Text style={styles.btnText}>Calculate</Text>
          </TouchableOpacity>

          {result !== null && (
            <View style={styles.result}>
              <Text style={styles.resultLabel}>Hose cut length</Text>
              <Text style={styles.resultValue}>{result.toFixed(1)} mm</Text>
              <Text style={styles.resultSub}>{(result / 25.4).toFixed(2)} inches</Text>
            </View>
          )}
        </View>

        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>Assembly notes</Text>
          <Text style={styles.noteText}>• Cut hose square — perpendicular, no burrs</Text>
          <Text style={styles.noteText}>• Insert fully until hose bottoms in shell</Text>
          <Text style={styles.noteText}>• Verify through sight hole before crimping</Text>
          <Text style={styles.noteText}>• Check crimp diameter with go/no-go gauge</Text>
          <Text style={styles.noteText}>• Proof test at 1.5× WP before installation</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: Colors.bg },
  header:      { padding: 14, backgroundColor: Colors.surface,
                 borderBottomWidth: 0.5, borderBottomColor: Colors.border },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  headerSub:   { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  content:     { padding: 14 },
  card:        { backgroundColor: Colors.card, borderRadius: 12, padding: 16,
                 borderWidth: 0.5, borderColor: Colors.border, marginBottom: 14 },
  cardTitle:   { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginBottom: 14 },
  label:       { fontSize: 12, color: Colors.textSecondary, marginBottom: 5 },
  input:       { backgroundColor: Colors.surface, borderRadius: 8, borderWidth: 0.5,
                 borderColor: Colors.border, padding: 12, color: Colors.textPrimary,
                 fontSize: 16, marginBottom: 14 },
  btn:         { backgroundColor: Colors.blue, borderRadius: 10, padding: 14,
                 alignItems: 'center', marginTop: 4 },
  btnText:     { color: '#fff', fontSize: 15, fontWeight: '700' },
  result:      { marginTop: 16, padding: 14, backgroundColor: Colors.surface,
                 borderRadius: 10, alignItems: 'center', borderWidth: 0.5,
                 borderColor: Colors.orange },
  resultLabel: { fontSize: 12, color: Colors.textMuted, marginBottom: 4 },
  resultValue: { fontSize: 32, fontWeight: '700', color: Colors.orange },
  resultSub:   { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  noteCard:    { backgroundColor: Colors.card, borderRadius: 12, padding: 16,
                 borderWidth: 0.5, borderColor: Colors.border },
  noteTitle:   { fontSize: 13, fontWeight: '600', color: Colors.orange, marginBottom: 10 },
  noteText:    { fontSize: 12, color: Colors.textSecondary, marginBottom: 5, lineHeight: 18 },
});
