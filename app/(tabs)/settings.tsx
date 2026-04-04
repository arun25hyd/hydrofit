import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { Colors } from '../../constants/Colors';

const INFO_ROWS = [
  { label: 'App', value: 'HydroFit v1.0.0' },
  { label: 'Data', value: 'Fully offline — no internet required' },
  { label: 'Hose fittings', value: '1,456 entries · 10 standards' },
  { label: 'Tube fittings', value: '284 entries · DIN 24° L/S series' },
  { label: 'Hose specs', value: '80 entries · SAE 100R1–R17 / EN 853–856' },
  { label: 'Standards', value: 'JIC · ORFS · NPTF · SAE 45° · BSPP · Flange · DIN 24°' },
];

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>App information</Text>
          {INFO_ROWS.map(row => (
            <View key={row.label} style={styles.row}>
              <Text style={styles.rowLabel}>{row.label}</Text>
              <Text style={styles.rowValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Standards reference</Text>
          <Text style={styles.note}>
            All dimension data sourced from published ISO, SAE, DIN and EN standards.
            Working pressures are guidance values — always verify against the actual
            rated assembly for your application.
          </Text>
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
  content:     { padding: 14 },
  card:        { backgroundColor: Colors.card, borderRadius: 12, padding: 16,
                 borderWidth: 0.5, borderColor: Colors.border, marginBottom: 14 },
  cardTitle:   { fontSize: 13, fontWeight: '600', color: Colors.orange,
                 marginBottom: 12, letterSpacing: 0.3 },
  row:         { flexDirection: 'row', justifyContent: 'space-between',
                 paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: Colors.border },
  rowLabel:    { fontSize: 13, color: Colors.textSecondary, flex: 1 },
  rowValue:    { fontSize: 13, color: Colors.textPrimary, flex: 2, textAlign: 'right' },
  note:        { fontSize: 12, color: Colors.textSecondary, lineHeight: 18 },
});
