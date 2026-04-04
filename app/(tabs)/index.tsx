import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';

const STANDARDS = [
  { key: 'JIC',        label: 'JIC 37°',         sub: '37° flare · SAE J514',    count: 482,  color: Colors.jic   },
  { key: 'ORFS',       label: 'ORFS / Seal-Lok',  sub: 'O-ring face seal · SAE J1453', count: 368, color: Colors.orfs  },
  { key: 'NPTF',       label: 'NPTF Pipe',        sub: 'Tapered dry seal · ANSI B1.20.3', count: 205, color: Colors.nptf  },
  { key: 'SAE45',      label: 'SAE 45°',          sub: '45° flare · SAE J512',    count: 130,  color: Colors.sae45 },
  { key: 'BSPP',       label: 'BSPP',             sub: 'Parallel Whitworth · ISO 228', count: 83, color: Colors.bspp  },
  { key: 'Flange',     label: 'SAE Flange',       sub: 'Code 61 / 62',            count: 188,  color: Colors.flange},
];

const TUBE_TYPES = [
  { key: 'DIN24_L',   label: 'DIN 24° — Series L', sub: 'Light · max 400 bar · 6–42mm OD', count: 172, color: Colors.din24 },
  { key: 'DIN24_S',   label: 'DIN 24° — Series S', sub: 'Heavy · max 630 bar · 6–38mm OD', count: 112, color: Colors.din24 },
];

export default function FittingsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>HydroFit</Text>
        <View style={styles.offlineBadge}>
          <Text style={styles.offlineText}>OFFLINE</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search thread, size, type..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Section: Flexible Hose Fittings */}
        <Text style={styles.sectionLabel}>FLEXIBLE HOSE FITTINGS — CRIMPED</Text>
        <View style={styles.grid}>
          {STANDARDS.map(std => (
            <TouchableOpacity
              key={std.key}
              style={[styles.tile, { borderLeftColor: std.color }]}
              activeOpacity={0.7}
              onPress={() => router.push({ pathname: '/fittings/[standard]', params: { standard: std.key } })}
            >
              <Text style={[styles.tileTitle, { color: std.color }]}>{std.label}</Text>
              <Text style={styles.tileSub}>{std.sub}</Text>
              <Text style={styles.tileCount}>{std.count} entries</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Section: Rigid Tube Fittings */}
        <Text style={styles.sectionLabel}>RIGID TUBE FITTINGS — CUTTING RING</Text>
        <View style={styles.grid}>
          {TUBE_TYPES.map(t => (
            <TouchableOpacity
              key={t.key}
              style={[styles.tile, { borderLeftColor: t.color }]}
              activeOpacity={0.7}
              onPress={() => router.push({ pathname: '/(tabs)/tube/[series]', params: { series: t.key } })}
            >
              <Text style={[styles.tileTitle, { color: t.color }]}>{t.label}</Text>
              <Text style={styles.tileSub}>{t.sub}</Text>
              <Text style={styles.tileCount}>{t.count} entries</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: Colors.bg },
  header:        { flexDirection: 'row', alignItems: 'center', padding: 14, paddingTop: 8,
                   backgroundColor: '#0a0e14', gap: 10 },
  logo:          { fontSize: 20, fontWeight: '700', color: Colors.orange, letterSpacing: 1 },
  offlineBadge:  { backgroundColor: Colors.blue, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  offlineText:   { fontSize: 9, color: '#e8f0fb', fontWeight: '700', letterSpacing: 0.5 },
  searchRow:     { paddingHorizontal: 14, paddingVertical: 8, backgroundColor: Colors.surface },
  searchInput:   { backgroundColor: Colors.card, borderRadius: 10, paddingHorizontal: 14,
                   paddingVertical: 10, color: Colors.textPrimary, fontSize: 14,
                   borderWidth: 0.5, borderColor: Colors.border },
  scroll:        { flex: 1 },
  scrollContent: { padding: 14 },
  sectionLabel:  { fontSize: 10, fontWeight: '600', color: Colors.textMuted, letterSpacing: 0.8,
                   marginTop: 8, marginBottom: 10 },
  grid:          { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 8 },
  tile:          { width: '47%', backgroundColor: Colors.card, borderRadius: 12,
                   padding: 14, borderLeftWidth: 3, borderWidth: 0.5, borderColor: Colors.border },
  tileTitle:     { fontSize: 13, fontWeight: '700', marginBottom: 3 },
  tileSub:       { fontSize: 10, color: Colors.textSecondary, lineHeight: 14, marginBottom: 6 },
  tileCount:     { fontSize: 10, color: Colors.textMuted },
  bottomSpacer:  { height: 30 },
});
