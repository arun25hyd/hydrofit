import { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView, ScrollView, ActivityIndicator,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { getHoseTypes, getHoseSizes } from '../../db/queries';

type HoseEntry = {
  hose_name: string; reinforcement: string; tube_material: string;
  temp_range: string; application: string; dash_size: number;
  id_mm: number; id_inch: string; od_mm: number;
  wp_bar: number; wp_psi: number; bp_bar: number;
  min_bend_radius_mm: number; safety_factor: number;
};

const DASH_TO_INCH: Record<number, string> = {
  [-3]: '3/16"', [-4]: '1/4"', [-5]: '5/16"', [-6]: '3/8"',
  [-8]: '1/2"', [-10]: '5/8"', [-12]: '3/4"', [-16]: '1"',
  [-20]: '1-1/4"', [-24]: '1-1/2"', [-32]: '2"',
  [-40]: '2-1/2"', [-48]: '3"',
};

export default function HosesScreen() {
  const [types, setTypes] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>('');
  const [sizes, setSizes] = useState<HoseEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHoseTypes().then(async t => {
      setTypes(t);
      if (t.length > 0) {
        setSelected(t[0]);
        const rows = await getHoseSizes(t[0]);
        setSizes(rows as HoseEntry[]);
      }
      setLoading(false);
    });
  }, []);

  async function selectType(t: string) {
    setSelected(t);
    const rows = await getHoseSizes(t);
    setSizes(rows as HoseEntry[]);
  }

  const selectedInfo = sizes[0] ?? null;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hose Reference</Text>
        <Text style={styles.headerSub}>SAE / EN hydraulic hose specifications</Text>
      </View>

      {loading ? (
        <View style={styles.center}><ActivityIndicator color={Colors.blue} /></View>
      ) : (
        <FlatList
          data={sizes}
          keyExtractor={item => `${item.hose_name}-${item.dash_size}`}
          ListHeaderComponent={() => (
            <View>
              {/* Hose type selector */}
              <Text style={styles.sectionLabel}>HOSE STANDARD</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.typeRow}>
                {types.map(t => (
                  <TouchableOpacity key={t}
                    style={[styles.typeChip, selected === t && styles.typeChipActive]}
                    onPress={() => selectType(t)}>
                    <Text style={[styles.typeChipText, selected === t && styles.typeChipTextActive]}
                      numberOfLines={2}>
                      {t.replace(' — ', '\n')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Hose info card */}
              {selectedInfo && (
                <View style={styles.infoCard}>
                  <Text style={styles.infoName}>{selectedInfo.hose_name}</Text>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Reinforcement</Text>
                    <Text style={styles.infoVal}>{selectedInfo.reinforcement}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Temperature</Text>
                    <Text style={styles.infoVal}>{selectedInfo.temp_range}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Application</Text>
                    <Text style={styles.infoVal}>{selectedInfo.application}</Text>
                  </View>
                </View>
              )}
              <Text style={styles.sectionLabel}>PRESSURE RATINGS BY DASH SIZE</Text>
              {/* Column headers */}
              <View style={styles.tableHeader}>
                <Text style={[styles.col, styles.colDash]}>Dash</Text>
                <Text style={[styles.col, styles.colID]}>ID</Text>
                <Text style={[styles.col, styles.colOD]}>OD</Text>
                <Text style={[styles.col, styles.colWP]}>WP bar</Text>
                <Text style={[styles.col, styles.colBP]}>BP bar</Text>
                <Text style={[styles.col, styles.colBR]}>BR mm</Text>
              </View>
            </View>
          )}
          renderItem={({ item, index }) => (
            <View style={[styles.tableRow, index % 2 === 0 && styles.tableRowAlt]}>
              <Text style={[styles.col, styles.colDash, styles.cellDash]}>
                {item.dash_size}{'\n'}
                <Text style={styles.cellInch}>{DASH_TO_INCH[item.dash_size] ?? ''}</Text>
              </Text>
              <Text style={[styles.col, styles.colID, styles.cellVal]}>{item.id_mm}mm</Text>
              <Text style={[styles.col, styles.colOD, styles.cellVal]}>{item.od_mm}mm</Text>
              <Text style={[styles.col, styles.colWP, styles.cellWP]}>{item.wp_bar}</Text>
              <Text style={[styles.col, styles.colBP, styles.cellVal]}>{item.bp_bar}</Text>
              <Text style={[styles.col, styles.colBR, styles.cellVal]}>{item.min_bend_radius_mm}</Text>
            </View>
          )}
          ListFooterComponent={() => <View style={{ height: 30 }} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:              { flex: 1, backgroundColor: Colors.bg },
  header:            { padding: 14, backgroundColor: Colors.surface,
                       borderBottomWidth: 0.5, borderBottomColor: Colors.border },
  headerTitle:       { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  headerSub:         { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  center:            { flex: 1, alignItems: 'center', justifyContent: 'center' },
  sectionLabel:      { fontSize: 10, fontWeight: '600', color: Colors.textMuted,
                       letterSpacing: 0.8, marginTop: 12, marginBottom: 8, paddingHorizontal: 14 },
  typeRow:           { paddingHorizontal: 14, paddingBottom: 4 },
  typeChip:          { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10,
                       borderWidth: 0.5, borderColor: Colors.border,
                       backgroundColor: Colors.card, marginRight: 8, maxWidth: 150 },
  typeChipActive:    { backgroundColor: Colors.blue, borderColor: Colors.blue },
  typeChipText:      { fontSize: 11, color: Colors.textSecondary },
  typeChipTextActive:{ color: '#fff', fontWeight: '600' },
  infoCard:          { marginHorizontal: 14, backgroundColor: Colors.card, borderRadius: 10,
                       padding: 12, borderWidth: 0.5, borderColor: Colors.border, marginBottom: 4 },
  infoName:          { fontSize: 13, fontWeight: '700', color: Colors.blue, marginBottom: 8 },
  infoRow:           { flexDirection: 'row', marginBottom: 4 },
  infoLabel:         { fontSize: 11, color: Colors.textMuted, width: 100 },
  infoVal:           { fontSize: 11, color: Colors.textSecondary, flex: 1 },
  tableHeader:       { flexDirection: 'row', paddingHorizontal: 14, paddingVertical: 8,
                       backgroundColor: Colors.blue + '30', marginBottom: 2 },
  tableRow:          { flexDirection: 'row', paddingHorizontal: 14, paddingVertical: 10 },
  tableRowAlt:       { backgroundColor: Colors.surface },
  col:               { fontSize: 12 },
  colDash:           { width: 52, color: Colors.textPrimary, fontWeight: '600' },
  colID:             { width: 50, color: Colors.textSecondary },
  colOD:             { width: 50, color: Colors.textSecondary },
  colWP:             { width: 54 },
  colBP:             { width: 54, color: Colors.textSecondary },
  colBR:             { flex: 1, color: Colors.textSecondary },
  cellDash:          { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  cellInch:          { fontSize: 10, color: Colors.textMuted, fontWeight: '400' },
  cellVal:           { color: Colors.textSecondary },
  cellWP:            { color: Colors.orange, fontWeight: '700' },
});
