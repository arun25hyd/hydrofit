import { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../../constants/Colors';
import { getFittingTypes } from '../../../db/queries';

const STANDARD_META: Record<string, { label: string; color: string; ref: string }> = {
  JIC:    { label: 'JIC 37° Flare', color: Colors.jic,    ref: 'SAE J514' },
  ORFS:   { label: 'ORFS / Seal-Lok', color: Colors.orfs, ref: 'SAE J1453' },
  NPTF:   { label: 'NPTF Pipe',    color: Colors.nptf,    ref: 'ANSI B1.20.3' },
  SAE45:  { label: 'SAE 45° Flare', color: Colors.sae45,  ref: 'SAE J512' },
  BSPP:   { label: 'BSPP',         color: Colors.bspp,    ref: 'ISO 228' },
  Flange: { label: 'SAE Flange',   color: Colors.flange,  ref: 'SAE J518' },
};

// Which dim labels each orientation uses — shown as preview on the list row
const DIM_PREVIEW: Record<string, string> = {
  rigid:    'A · H · B',
  swivel:   'A · W · B',
  elbow:    'A · E · W · B',
  bulkhead: 'A · H · B',
  flange:   'A · F · B',
  tube_o:   'A · D · W · B',
};

function getDimPreview(orientation: string, end_style: string): string {
  if (end_style === 'bulkhead') return DIM_PREVIEW.bulkhead;
  if (end_style === 'flange')   return DIM_PREVIEW.flange;
  if (end_style?.includes('tube')) return DIM_PREVIEW.tube_o;
  if (orientation?.includes('elbow')) return DIM_PREVIEW.elbow;
  if (orientation === 'swivel') return DIM_PREVIEW.swivel;
  return DIM_PREVIEW.rigid;
}

type FittingRow = {
  fitting_type: string;
  orientation: string;
  end_style: string;
};

export default function StandardScreen() {
  const { standard } = useLocalSearchParams<{ standard: string }>();
  const router = useRouter();
  const meta = STANDARD_META[standard] ?? { label: standard, color: Colors.blue, ref: '' };
  const [fittings, setFittings] = useState<FittingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFittingTypes(standard).then(rows => {
      setFittings(rows as FittingRow[]);
      setLoading(false);
    });
  }, [standard]);

  function openDetail(fittingType: string, orientation: string) {
    router.push({
      pathname: '/(tabs)/fittings/detail',
      params: { standard, fittingType, orientation },
    });
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: meta.color }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={[styles.backArrow, { color: meta.color }]}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={[styles.headerTitle, { color: meta.color }]}>{meta.label}</Text>
          <Text style={styles.headerRef}>{meta.ref}</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={meta.color} />
        </View>
      ) : (
        <FlatList
          data={fittings}
          keyExtractor={item => item.fitting_type}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.row}
              activeOpacity={0.7}
              onPress={() => openDetail(item.fitting_type, item.orientation)}
            >
              <View style={styles.rowLeft}>
                <Text style={styles.rowTitle}>{item.fitting_type}</Text>
                <Text style={styles.rowDims}>
                  Dims: {getDimPreview(item.orientation, item.end_style)}
                </Text>
              </View>
              <Text style={[styles.rowArrow, { color: meta.color }]}>›</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: Colors.bg },
  header:      { flexDirection: 'row', alignItems: 'center', padding: 14,
                 backgroundColor: Colors.surface, borderBottomWidth: 2, gap: 10 },
  backBtn:     { width: 32, height: 32, alignItems: 'center', justifyContent: 'center',
                 backgroundColor: Colors.card, borderRadius: 8 },
  backArrow:   { fontSize: 22, lineHeight: 26, fontWeight: '600' },
  headerText:  { flex: 1 },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  headerRef:   { fontSize: 11, color: Colors.textMuted, marginTop: 1 },
  center:      { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list:        { padding: 12 },
  row:         { backgroundColor: Colors.card, borderRadius: 10, padding: 14,
                 marginBottom: 8, flexDirection: 'row', alignItems: 'center',
                 borderWidth: 0.5, borderColor: Colors.border },
  rowLeft:     { flex: 1 },
  rowTitle:    { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, marginBottom: 4 },
  rowDims:     { fontSize: 11, color: Colors.textMuted },
  rowArrow:    { fontSize: 22, fontWeight: '300' },
});
