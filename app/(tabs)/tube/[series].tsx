import { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../../constants/Colors';
import { getTubeFittingTypes, getTubeFittingsByOD } from '../../../db/queries';

const SERIES_META: Record<string, { label: string; desc: string; maxBar: number }> = {
  DIN24_L: { label: 'DIN 24° — Series L', desc: 'Light series · DIN 2353 / ISO 8434-1', maxBar: 400 },
  DIN24_S: { label: 'DIN 24° — Series S', desc: 'Heavy series · DIN 2353 / ISO 8434-1', maxBar: 630 },
};

// Dimension definitions for DIN 24° tube fittings
const DIM_DEFS_DIN = [
  { key: 'dim_L_mm',  label: 'L',  name: 'Overall length (nut tightened)', unit: 'mm', critical: false },
  { key: 'dim_L1_mm', label: 'L1', name: 'Length — nut extended',           unit: 'mm', critical: false },
  { key: 'dim_i_mm',  label: 'i',  name: 'Insert depth (tube into fitting)', unit: 'mm', critical: true  },
  { key: 'dim_T_mm',  label: 'T',  name: 'Thread engagement length',         unit: 'mm', critical: false },
  { key: 'dim_D2_mm', label: 'D2', name: 'Tube bore / pilot inner diameter', unit: 'mm', critical: false },
  { key: 'dim_S1_mm', label: 'S1', name: 'Body hex across flats (AF)',       unit: 'mm', critical: false },
  { key: 'dim_S2_mm', label: 'S2', name: 'Union nut hex across flats (AF)',  unit: 'mm', critical: false },
];

const DIN_ASSEMBLY_NOTES = [
  'Cut tube square — perpendicular cut, deburr inside and outside.',
  'Insert tube fully into fitting body until it bottoms.',
  'Hand-tighten union nut, then turn 1.5 turns with wrench (first assembly only).',
  'Mark nut and body before final torque — verify rotation after make-up.',
  'Reassembly: snug + ¼ turn only — cutting ring is already set.',
  'Never re-use a compressed or cracked cutting ring.',
  'Do NOT mix L-series and S-series fittings — wall thickness differs.',
];

type TubeFitting = {
  fitting_type: string; series: string; thread_standard: string;
  tube_od_mm: number; pressure_rating_bar: number; thread_size: string;
  dim_T_mm: number; dim_D2_mm: number; dim_i_mm: number;
  dim_L_mm: number; dim_L1_mm: number; dim_L2_mm: number;
  dim_S1_mm: number; dim_S2_mm: number; torque_Nm: number;
};

export default function TubeSeriesScreen() {
  const { series } = useLocalSearchParams<{ series: string }>();
  const router = useRouter();
  const meta = SERIES_META[series] ?? SERIES_META['DIN24_L'];
  const dbSeries = series === 'DIN24_S' ? 'S' : 'L';

  const [types, setTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState('');
  const [fittings, setFittings] = useState<TubeFitting[]>([]);
  const [selectedFitting, setSelectedFitting] = useState<TubeFitting | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTubeFittingTypes().then(async t => {
      setTypes(t);
      if (t.length > 0) {
        setSelectedType(t[0]);
        const rows = await getTubeFittingsByOD(t[0], dbSeries) as TubeFitting[];
        setFittings(rows);
        if (rows.length > 0) setSelectedFitting(rows[0]);
      }
      setLoading(false);
    });
  }, [series]);

  async function selectType(t: string) {
    setSelectedType(t);
    const rows = await getTubeFittingsByOD(t, dbSeries) as TubeFitting[];
    setFittings(rows);
    setSelectedFitting(rows.length > 0 ? rows[0] : null);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={[styles.header, { borderBottomColor: Colors.orange }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>{meta.label}</Text>
          <Text style={styles.headerSub}>{meta.desc} · max {meta.maxBar} bar</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}><ActivityIndicator color={Colors.orange} /></View>
      ) : (
        <FlatList
          data={fittings}
          keyExtractor={(item, index) => `${item.tube_od_mm}-${item.thread_size}-${index}`}
          ListHeaderComponent={() => (
            <View>
              {/* Fitting type selector */}
              <Text style={styles.sectionLabel}>FITTING CONFIGURATION</Text>
              <FlatList
                horizontal data={types} keyExtractor={t => t}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.typeRow}
                renderItem={({ item: t }) => (
                  <TouchableOpacity
                    style={[styles.typeChip, selectedType === t && styles.typeChipActive]}
                    onPress={() => selectType(t)}
                  >
                    <Text style={[styles.typeChipText, selectedType === t && styles.typeChipTextActive]}>
                      {t}
                    </Text>
                  </TouchableOpacity>
                )}
              />
              <Text style={styles.sectionLabel}>TUBE OD — SELECT SIZE</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.sizeRow, selectedFitting?.tube_od_mm === item.tube_od_mm
                && selectedFitting?.thread_size === item.thread_size && styles.sizeRowActive]}
              onPress={() => setSelectedFitting(item)}
              activeOpacity={0.7}
            >
              <View style={styles.sizeLeft}>
                <Text style={styles.sizeOD}>{item.tube_od_mm} mm OD</Text>
                <Text style={styles.sizeThread}>{item.thread_standard} {item.thread_size}</Text>
              </View>
              <Text style={styles.sizeBar}>{item.pressure_rating_bar} bar</Text>
            </TouchableOpacity>
          )}

          ListFooterComponent={() => selectedFitting ? (
            <View style={styles.detailSection}>
              <Text style={styles.sectionLabel}>DIMENSIONS — {selectedFitting.tube_od_mm}mm OD · {selectedFitting.thread_size}</Text>
              <View style={styles.dimGrid}>
                {DIM_DEFS_DIN.map(d => {
                  const val = (selectedFitting as any)[d.key];
                  if (!val) return null;
                  return (
                    <View key={d.key} style={[styles.dimBlock,
                      d.critical && { borderLeftColor: Colors.orange }]}>
                      <Text style={[styles.dimLetter, d.critical && { color: Colors.orange }]}>
                        {d.label}
                      </Text>
                      <Text style={styles.dimName}>{d.name}</Text>
                      <Text style={styles.dimVal}>{val.toFixed(1)} mm</Text>
                    </View>
                  );
                })}
                {selectedFitting.torque_Nm ? (
                  <View style={styles.dimBlock}>
                    <Text style={styles.dimLetter}>Tq</Text>
                    <Text style={styles.dimName}>Assembly torque (first make-up)</Text>
                    <Text style={styles.dimVal}>{selectedFitting.torque_Nm.toFixed(0)} N·m</Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.notesCard}>
                <Text style={styles.notesTitle}>DIN 24° cutting ring assembly</Text>
                {DIN_ASSEMBLY_NOTES.map((n, i) => (
                  <Text key={i} style={styles.noteItem}>• {n}</Text>
                ))}
              </View>
              <View style={{ height: 30 }} />
            </View>
          ) : null}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:              { flex: 1, backgroundColor: Colors.bg },
  header:            { flexDirection: 'row', alignItems: 'center', padding: 14,
                       backgroundColor: Colors.surface, borderBottomWidth: 2, gap: 10 },
  backBtn:           { width: 32, height: 32, alignItems: 'center', justifyContent: 'center',
                       backgroundColor: Colors.card, borderRadius: 8 },
  backArrow:         { fontSize: 22, lineHeight: 26, fontWeight: '600', color: Colors.orange },
  headerText:        { flex: 1 },
  headerTitle:       { fontSize: 15, fontWeight: '700', color: Colors.orange },
  headerSub:         { fontSize: 11, color: Colors.textMuted, marginTop: 1 },
  center:            { flex: 1, alignItems: 'center', justifyContent: 'center' },
  sectionLabel:      { fontSize: 10, fontWeight: '600', color: Colors.textMuted,
                       letterSpacing: 0.8, marginTop: 14, marginBottom: 8, paddingHorizontal: 14 },
  typeRow:           { paddingHorizontal: 14 },
  typeChip:          { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 18,
                       borderWidth: 0.5, borderColor: Colors.border,
                       backgroundColor: Colors.card, marginRight: 8 },
  typeChipActive:    { backgroundColor: Colors.orange, borderColor: Colors.orange },
  typeChipText:      { fontSize: 11, color: Colors.textSecondary },
  typeChipTextActive:{ color: '#fff', fontWeight: '600' },
  sizeRow:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                       marginHorizontal: 14, marginBottom: 6, backgroundColor: Colors.card,
                       borderRadius: 10, padding: 12,
                       borderWidth: 0.5, borderColor: Colors.border },
  sizeRowActive:     { borderColor: Colors.orange },
  sizeLeft:          { flex: 1 },
  sizeOD:            { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  sizeThread:        { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  sizeBar:           { fontSize: 13, fontWeight: '600', color: Colors.orange },
  detailSection:     { paddingHorizontal: 0 },
  dimGrid:           { flexDirection: 'row', flexWrap: 'wrap', gap: 8,
                       paddingHorizontal: 14, marginBottom: 4 },
  dimBlock:          { width: '47%', backgroundColor: Colors.card, borderRadius: 10,
                       padding: 12, borderLeftWidth: 3, borderLeftColor: Colors.blue,
                       borderWidth: 0.5, borderColor: Colors.border },
  dimLetter:         { fontSize: 20, fontWeight: '700', color: Colors.blue },
  dimName:           { fontSize: 10, color: Colors.textSecondary, marginTop: 2, marginBottom: 4 },
  dimVal:            { fontSize: 14, color: Colors.textPrimary, fontWeight: '600' },
  notesCard:         { marginHorizontal: 14, backgroundColor: Colors.card, borderRadius: 10,
                       padding: 14, borderWidth: 0.5, borderColor: Colors.border, marginTop: 8 },
  notesTitle:        { fontSize: 12, color: Colors.orange, fontWeight: '700', marginBottom: 8 },
  noteItem:          { fontSize: 12, color: Colors.textSecondary, marginBottom: 5, lineHeight: 18 },
});
