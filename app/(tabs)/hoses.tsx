import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView,
} from 'react-native';
import { Colors } from '../../constants/Colors';

const HOSE_TYPES = [
  { name: 'SAE 100R1AT / EN 853 1SN', reinf: '1 wire braid',         temp: '-40°C to +100°C', sizes: 10 },
  { name: 'SAE 100R2AT / EN 853 2SN', reinf: '2 wire braid',         temp: '-40°C to +100°C', sizes: 9  },
  { name: 'SAE 100R3 / EN 854 R3',    reinf: '2 textile braid',      temp: '-40°C to +100°C', sizes: 7  },
  { name: 'SAE 100R6 / EN 854 R6',    reinf: '1 textile braid',      temp: '-40°C to +100°C', sizes: 7  },
  { name: 'SAE 100R7 / EN 855 R7',    reinf: 'Thermoplastic',        temp: '-40°C to +93°C',  sizes: 5  },
  { name: 'SAE 100R10 / EN 856 4SP',  reinf: '4 wire spiral',        temp: '-40°C to +100°C', sizes: 6  },
  { name: 'SAE 100R12 / EN 856 4SH',  reinf: '4 wire spiral heavy',  temp: '-40°C to +100°C', sizes: 7  },
  { name: 'SAE 100R13 / EN 856 R13',  reinf: '4/6 wire spiral',      temp: '-40°C to +121°C', sizes: 5  },
  { name: 'SAE 100R16',               reinf: 'Compact 1 wire braid', temp: '-40°C to +100°C', sizes: 6  },
  { name: 'EN 854 3TE',               reinf: '2 textile braid med',  temp: '-40°C to +100°C', sizes: 6  },
];

export default function HosesScreen() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hose Reference</Text>
        <Text style={styles.headerSub}>SAE / EN hydraulic hose specifications</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {HOSE_TYPES.map(h => (
          <TouchableOpacity
            key={h.name}
            style={[styles.row, selected === h.name && styles.rowSelected]}
            activeOpacity={0.7}
            onPress={() => setSelected(selected === h.name ? null : h.name)}
          >
            <View style={styles.rowLeft}>
              <Text style={styles.rowName}>{h.name}</Text>
              <Text style={styles.rowSub}>{h.reinf} · {h.temp}</Text>
            </View>
            <View style={styles.rowRight}>
              <Text style={styles.rowCount}>−{Math.abs(3)} to −32</Text>
              <Text style={styles.rowSub}>{h.sizes} sizes</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: Colors.bg },
  header:      { padding: 14, backgroundColor: Colors.surface, borderBottomWidth: 0.5, borderBottomColor: Colors.border },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  headerSub:   { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  content:     { padding: 12 },
  row:         { backgroundColor: Colors.card, borderRadius: 10, padding: 14, marginBottom: 8,
                 flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                 borderWidth: 0.5, borderColor: Colors.border },
  rowSelected: { borderColor: Colors.blue },
  rowLeft:     { flex: 1 },
  rowRight:    { alignItems: 'flex-end' },
  rowName:     { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, marginBottom: 3 },
  rowSub:      { fontSize: 11, color: Colors.textSecondary },
  rowCount:    { fontSize: 12, color: Colors.blue, fontWeight: '600' },
});
