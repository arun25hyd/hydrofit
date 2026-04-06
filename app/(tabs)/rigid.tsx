import { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView, Image, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';

const SECTIONS = [
  {
    key: 'ORFS',
    label: 'Seal-Lok ORFS',
    standard: 'SAE J1453 · O-Ring Face Seal',
    color: Colors.orfs,
    fittings: [
      { key: 'orfs_union', name: 'Union', desc: 'Straight · both ends ORFS', img: require('../../assets/images/fittings/orfs_union.jpg') },
      { key: 'orfs_union_mmhex', name: 'Union mm Hex', desc: 'Straight · metric hex · ORFS', img: require('../../assets/images/fittings/orfs_union_mmhex.jpg') },
      { key: 'orfs_bulkhead', name: 'Bulkhead Union', desc: 'Panel mount · ORFS both ends', img: require('../../assets/images/fittings/orfs_bulkhead.jpg') },
      { key: 'orfs_bulkhead_mmhex', name: 'Bulkhead mm Hex', desc: 'Panel mount · metric hex', img: require('../../assets/images/fittings/orfs_bulkhead_mmhex.jpg') },
      { key: 'orfs_sae_orb', name: 'ORFS / SAE-ORB', desc: 'ORFS × O-Ring Boss adaptor', img: require('../../assets/images/fittings/orfs_sae_orb.jpg') },
      { key: 'orfs_nptf', name: 'ORFS / NPTF', desc: 'ORFS × NPTF pipe thread', img: require('../../assets/images/fittings/orfs_nptf.jpg') },
      { key: 'orfs_swivel_union', name: 'Swivel Union', desc: 'Swivel × ORFS straight', img: require('../../assets/images/fittings/orfs_swivel_union.jpg') },
      { key: 'orfs_swivel_sae', name: 'Swivel / SAE-ORB', desc: 'Swivel × SAE-ORB adaptor', img: require('../../assets/images/fittings/orfs_swivel_sae.jpg') },
    ],
  },
  {
    key: 'JIC',
    label: 'Triple-Lok JIC 37°',
    standard: 'SAE J514 · 37° Flare',
    color: Colors.jic,
    fittings: [
      { key: 'jic_union', name: 'Union', desc: 'Straight · both ends JIC 37°', img: require('../../assets/images/fittings/jic_union.jpg') },
      { key: 'jic_sae_orb', name: 'JIC / SAE-ORB', desc: '37° flare × O-Ring Boss', img: require('../../assets/images/fittings/jic_sae_orb.jpg') },
      { key: 'jic_nptf_straight', name: 'JIC / NPTF', desc: '37° flare × NPTF pipe', img: require('../../assets/images/fittings/jic_nptf_straight.jpg') },
      { key: 'jic_union_elbow', name: 'Union Elbow 90°', desc: 'JIC × JIC · 90 degree', img: require('../../assets/images/fittings/jic_union_elbow.jpg') },
      { key: 'jic_swivel_elbow', name: 'Swivel Elbow 90°', desc: 'JIC swivel · 90 degree', img: require('../../assets/images/fittings/jic_swivel_elbow.jpg') },
      { key: 'jic_nptf_elbow', name: 'NPTF Elbow 90°', desc: 'JIC × NPTF · 90 degree', img: require('../../assets/images/fittings/jic_nptf_elbow.jpg') },
      { key: 'jic_union_tee', name: 'Union Tee', desc: 'JIC × JIC × JIC run tee', img: require('../../assets/images/fittings/jic_union_tee.jpg') },
      { key: 'jic_swivel_run_tee', name: 'Swivel Run Tee', desc: 'JIC swivel × run tee', img: require('../../assets/images/fittings/jic_swivel_run_tee.jpg') },
    ],
  },
  {
    key: 'BSP',
    label: 'K4 BSP Adapters',
    standard: 'ISO 228 · 60° Cone · BSPP',
    color: Colors.bspp,
    fittings: [
      { key: 'bsp_union', name: 'Union', desc: 'Straight · both ends BSP 60°', img: require('../../assets/images/fittings/bsp_union.jpg') },
      { key: 'bsp_bulkhead_union', name: 'Bulkhead Union', desc: 'Panel mount · both ends BSP', img: require('../../assets/images/fittings/bsp_bulkhead_union.jpg') },
      { key: 'bsp_60cone_swivel', name: '60° Swivel', desc: 'BSP × BSP swivel', img: require('../../assets/images/fittings/bsp_60cone_swivel.jpg') },
      { key: 'bsp_swivel_union', name: 'Swivel Union', desc: 'BSP swivel × BSP straight', img: require('../../assets/images/fittings/bsp_swivel_union.jpg') },
      { key: 'bsp_60cone_nptf', name: 'BSP / NPTF', desc: '60° cone × NPTF pipe', img: require('../../assets/images/fittings/bsp_60cone_nptf.jpg') },
      { key: 'bsp_60cone_bspt', name: 'BSP / BSPT', desc: 'Parallel × tapered BSP', img: require('../../assets/images/fittings/bsp_60cone_bspt.jpg') },
      { key: 'bsp_60cone_bspp', name: 'BSP / BSPP', desc: 'BSP parallel adaptor', img: require('../../assets/images/fittings/bsp_60cone_bspp.jpg') },
      { key: 'bsp_60cone_metric', name: 'BSP / Metric', desc: '60° cone × metric thread', img: require('../../assets/images/fittings/bsp_60cone_metric.jpg') },
      { key: 'bsp_union_elbow', name: 'Union Elbow 90°', desc: 'BSP × BSP · 90 degree', img: require('../../assets/images/fittings/bsp_union_elbow.jpg') },
      { key: 'bsp_swivel_elbow', name: 'Swivel Elbow 90°', desc: 'BSP swivel · 90 degree', img: require('../../assets/images/fittings/bsp_swivel_elbow.jpg') },
      { key: 'bsp_union_tee', name: 'Union Tee', desc: 'BSP × BSP × BSP run tee', img: require('../../assets/images/fittings/bsp_union_tee.jpg') },
      { key: 'bsp_branch_tee', name: 'Branch Tee', desc: 'BSP swivel branch tee', img: require('../../assets/images/fittings/bsp_branch_tee.jpg') },
      { key: 'bsp_run_tee', name: 'Run Tee', desc: 'BSP swivel run tee', img: require('../../assets/images/fittings/bsp_run_tee.jpg') },
      { key: 'bsp_hex_plug', name: 'Hex Plug', desc: 'BSP male hex head plug', img: require('../../assets/images/fittings/bsp_hex_plug.jpg') },
      { key: 'bsp_cap', name: 'Cap', desc: 'BSP female cap', img: require('../../assets/images/fittings/bsp_cap.jpg') },
    ],
  },
];

export default function RigidFittingsScreen() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('ORFS');

  const currentSection = SECTIONS.find(s => s.key === activeSection)!;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rigid Fittings</Text>
        <Text style={styles.headerSub}>Adaptors · Unions · Elbows · Tees · Plugs</Text>
      </View>

      {/* Section tab selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabRow}
        contentContainerStyle={styles.tabContent}
      >
        {SECTIONS.map(s => (
          <TouchableOpacity
            key={s.key}
            style={[styles.sectionTab, activeSection === s.key && { backgroundColor: s.color, borderColor: s.color }]}
            onPress={() => setActiveSection(s.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.sectionTabText, activeSection === s.key && { color: '#fff' }]}>{s.label}</Text>
            <Text style={[styles.sectionTabStd, activeSection === s.key && { color: 'rgba(255,255,255,0.7)' }]}>{s.standard}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Fitting grid */}
      <FlatList
        data={currentSection.fittings}
        keyExtractor={item => item.key}
        numColumns={2}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <View style={[styles.card, { borderLeftColor: currentSection.color }]}>
            <Image source={item.img} style={styles.img} resizeMode="contain" />
            <Text style={[styles.cardName, { color: currentSection.color }]}>{item.name}</Text>
            <Text style={styles.cardDesc}>{item.desc}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: Colors.bg },
  header:        { padding: 14, paddingBottom: 8, backgroundColor: Colors.surface,
                   borderBottomWidth: 0.5, borderBottomColor: Colors.border },
  headerTitle:   { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  headerSub:     { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  tabRow:        { maxHeight: 64, borderBottomWidth: 0.5, borderBottomColor: Colors.border },
  tabContent:    { paddingHorizontal: 12, paddingVertical: 8, gap: 8 },
  sectionTab:    { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10,
                   borderWidth: 0.5, borderColor: Colors.border, backgroundColor: Colors.card },
  sectionTabText:{ fontSize: 12, fontWeight: '700', color: Colors.textPrimary },
  sectionTabStd: { fontSize: 9, color: Colors.textMuted, marginTop: 1 },
  grid:          { padding: 10, gap: 8 },
  card:          { flex: 1, margin: 4, backgroundColor: Colors.card, borderRadius: 10,
                   borderWidth: 0.5, borderColor: Colors.border, borderLeftWidth: 3,
                   padding: 10, alignItems: 'center' },
  img:           { width: '100%', height: 90, marginBottom: 6, backgroundColor: '#fff',
                   borderRadius: 6 },
  cardName:      { fontSize: 12, fontWeight: '700', textAlign: 'center', marginBottom: 3 },
  cardDesc:      { fontSize: 9, color: Colors.textMuted, textAlign: 'center', lineHeight: 13 },
});
