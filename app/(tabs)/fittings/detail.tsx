import { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../../constants/Colors';
import { getFittingDetail, getThreadSizes } from '../../../db/queries';

// Dimension definitions — what each label means for a crimped hose fitting
const DIM_DEFS: Record<string, { name: string; desc: string; unit: string; critical?: boolean }> = {
  A: { name: 'Overall length',       desc: 'Total length from hose end to connection end. Used for routing and clearance checks.', unit: 'inch / mm' },
  B: { name: 'Cutoff allowance',     desc: 'Hose insert depth into shell. CL = Assembly length − B₁ − B₂', unit: 'inch / mm', critical: true },
  H: { name: 'Hex / wrench size',    desc: 'Across-flats of fitting hex. Wrench size for make-up and torquing.', unit: 'inch AF' },
  E: { name: 'Elbow offset / drop',  desc: 'Centre-to-end on elbow fittings. Combined with A for total envelope.', unit: 'inch / mm' },
  W: { name: 'Swivel nut AF',        desc: 'Across-flats of swivel nut. Socket size for holding body during assembly.', unit: 'inch AF' },
  C: { name: 'Nut extension',        desc: 'Length nut extends beyond shell. Use B+C for full cut-off allowance on swivel fittings.', unit: 'inch / mm' },
  D: { name: 'Pilot tube OD',        desc: 'Outside diameter of pilot tube. Must match tube OD for sleeve fit.', unit: 'inch / mm' },
  F: { name: 'Flange face',          desc: 'Flange face or bolt hole spacing. Match SAE Code 61/62 flange port.', unit: 'inch / mm' },
};

const ASSEMBLY_NOTES: Record<string, string[]> = {
  JIC:    ['37° cone is the sealing surface — inspect for pitting or scratches.','No PTFE tape or sealant — metal-to-metal seal at cone.','FFFT method: hand-tighten to snug, then ¼–½ turn with wrench.'],
  ORFS:   ['Inspect O-ring for cuts or flat spots before assembly.','Lubricate O-ring with clean system fluid — never dry assemble.','Hand-tighten until O-ring contacts face, then torque to spec.','If leaking: replace O-ring — do not re-torque.'],
  NPTF:   ['NPTF seals by thread interference — no sealant required.','If connecting to NPT port: apply PTFE tape or anaerobic sealant.','Engage 2–3 threads by hand before applying wrench.'],
  SAE45:  ['45° cone seat — NOT interchangeable with JIC 37°.','Single notch on hex nut identifies SAE 45° fitting.','Metal-to-metal seal at cone — no sealant required.'],
  BSPP:   ['Parallel thread — sealing element required at cone or face.','60° cone: metal-to-metal seal. Flat seat: bonded seal (replace each disassembly).','Do not rely on thread engagement for sealing.'],
  Flange: ['Match Code 61 or 62 bolt pattern before installation.','Torque clamp bolts evenly in cross sequence.','O-ring must be fully seated in groove — no twist or pinch.'],
};

const CRIMP_NOTES = [
  'Cut hose square — perpendicular, no burrs or angled cuts.',
  'Insert hose fully until it bottoms in the shell.',
  'Verify insertion through sight hole before crimping.',
  'Check crimp diameter with go/no-go gauge after crimping.',
  'Proof test at 1.5× working pressure before installation.',
];

function getDimsForFitting(fitting: any): string[] {
  const o = fitting?.orientation ?? '';
  const e = fitting?.end_style ?? '';
  const dims: string[] = ['A'];
  if (fitting?.dim_E_inch) dims.push('E');
  if (fitting?.dim_C_inch) dims.push('C');
  if (fitting?.dim_H_inch) dims.push('H');
  if (fitting?.dim_W_inch) dims.push('W');
  if (fitting?.dim_D_inch) dims.push('D');
  dims.push('B');
  return dims;
}

function inToMm(val: number | null): string {
  if (!val) return '—';
  return `${val.toFixed(2)}" / ${(val * 25.4).toFixed(1)} mm`;
}

export default function DetailScreen() {
  const { standard, fittingType, orientation } = useLocalSearchParams<{
    standard: string; fittingType: string; orientation: string;
  }>();
  const router = useRouter();
  const [threads, setThreads] = useState<string[]>([]);
  const [selectedThread, setSelectedThread] = useState('');
  const [fitting, setFitting] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getThreadSizes(standard, fittingType).then(async sizes => {
      setThreads(sizes);
      if (sizes.length > 0) {
        setSelectedThread(sizes[0]);
        const detail = await getFittingDetail(standard, fittingType, sizes[0]);
        setFitting(detail);
      }
      setLoading(false);
    });
  }, [standard, fittingType]);

  async function selectThread(t: string) {
    setSelectedThread(t);
    const detail = await getFittingDetail(standard, fittingType, t);
    setFitting(detail);
  }

  const dims = getDimsForFitting(fitting);
  const stdColor = (Colors as any)[standard?.toLowerCase()] ?? Colors.blue;
  const notes = ASSEMBLY_NOTES[standard] ?? [];

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: stdColor }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={[styles.backArrow, { color: stdColor }]}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={[styles.headerStd, { color: stdColor }]}>{standard}</Text>
          <Text style={styles.headerType} numberOfLines={2}>{fittingType}</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}><ActivityIndicator color={stdColor} /></View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>

          {/* Thread size selector */}
          <Text style={styles.sectionLabel}>THREAD SIZE</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.threadRow}>
            {threads.map(t => (
              <TouchableOpacity
                key={t}
                style={[styles.threadChip, selectedThread === t && { backgroundColor: stdColor, borderColor: stdColor }]}
                onPress={() => selectThread(t)}
              >
                <Text style={[styles.threadChipText, selectedThread === t && { color: '#fff' }]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Crimp diagram */}
          <Text style={styles.sectionLabel}>CRIMP ASSEMBLY DIAGRAM</Text>
          <View style={styles.diagramCard}>
            <CrimpDiagram stdColor={stdColor} hasElbow={orientation?.includes('elbow')} />
          </View>

          {/* Dimension blocks */}
          <Text style={styles.sectionLabel}>DIMENSIONS</Text>
          <View style={styles.dimGrid}>
            {dims.map(letter => {
              const def = DIM_DEFS[letter];
              if (!def) return null;
              const rawKey = `dim_${letter}_inch`;
              const val = fitting?.[rawKey] ?? null;
              return (
                <View key={letter} style={[styles.dimBlock,
                  def.critical && { borderLeftColor: Colors.orange }]}>
                  <Text style={[styles.dimLetter,
                    def.critical ? { color: Colors.orange } : { color: stdColor }]}>
                    {letter}
                  </Text>
                  <Text style={styles.dimName}>{def.name}</Text>
                  <Text style={styles.dimVal}>{inToMm(val)}</Text>
                  <Text style={styles.dimDesc}>{def.desc}</Text>
                  {def.critical && (
                    <View style={styles.critTag}>
                      <Text style={styles.critTagText}>CRIMP CRITICAL</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          {/* Hose ID */}
          {fitting?.hose_id_inch ? (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Compatible hose ID</Text>
              <Text style={styles.infoVal}>{fitting.hose_id_inch}"</Text>
            </View>
          ) : null}

          {/* Cut length formula */}
          <View style={styles.formulaCard}>
            <Text style={styles.formulaTitle}>Cut length formula</Text>
            <Text style={styles.formulaText}>CL = Assembly length − B₁ − B₂</Text>
            <Text style={styles.formulaSub}>Subtract B dimension from both fitting ends</Text>
          </View>

          {/* Assembly notes */}
          {notes.length > 0 && (
            <View style={styles.notesCard}>
              <Text style={styles.notesTitle}>{standard} assembly notes</Text>
              {notes.map((n, i) => (
                <Text key={i} style={styles.noteItem}>• {n}</Text>
              ))}
            </View>
          )}

          {/* Crimp notes */}
          <View style={styles.notesCard}>
            <Text style={styles.notesTitle}>Crimp assembly checklist</Text>
            {CRIMP_NOTES.map((n, i) => (
              <Text key={i} style={styles.noteItem}>• {n}</Text>
            ))}
          </View>

          <View style={{ height: 30 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// Inline SVG-style crimp diagram using React Native views
function CrimpDiagram({ stdColor, hasElbow }: { stdColor: string; hasElbow: boolean }) {
  return (
    <View style={diagram.wrap}>
      {/* Hose body */}
      <View style={diagram.hose}>
        <Text style={diagram.hoseLabel}>HOSE</Text>
      </View>
      {/* Crimp shell */}
      <View style={[diagram.shell, { borderColor: stdColor }]}>
        <View style={diagram.crimpLines}>
          {[0,1,2,3].map(i => (
            <View key={i} style={[diagram.crimpLine, { backgroundColor: Colors.orange }]} />
          ))}
        </View>
        <Text style={[diagram.shellLabel, { color: stdColor }]}>CRIMP SHELL</Text>
      </View>
      {/* Nipple / body */}
      <View style={[diagram.nipple, { backgroundColor: stdColor + '40', borderColor: stdColor }]}>
        <Text style={[diagram.nippleLabel, { color: stdColor }]}>
          {hasElbow ? 'ELBOW' : 'NIPPLE'}
        </Text>
      </View>
      {/* Dimension labels row */}
      <View style={diagram.labelRow}>
        <Text style={diagram.labelB}>← B →</Text>
        <Text style={diagram.labelA}>←────── A ──────→</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: Colors.bg },
  header:        { flexDirection: 'row', alignItems: 'center', padding: 14,
                   backgroundColor: Colors.surface, borderBottomWidth: 2, gap: 10 },
  backBtn:       { width: 32, height: 32, alignItems: 'center', justifyContent: 'center',
                   backgroundColor: Colors.card, borderRadius: 8 },
  backArrow:     { fontSize: 22, lineHeight: 26, fontWeight: '600' },
  headerText:    { flex: 1 },
  headerStd:     { fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
  headerType:    { fontSize: 14, color: Colors.textPrimary, fontWeight: '600', marginTop: 1 },
  center:        { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll:        { padding: 14 },
  sectionLabel:  { fontSize: 10, fontWeight: '600', color: Colors.textMuted,
                   letterSpacing: 0.8, marginTop: 14, marginBottom: 8 },
  threadRow:     { marginBottom: 4 },
  threadChip:    { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
                   borderWidth: 0.5, borderColor: Colors.border, marginRight: 8,
                   backgroundColor: Colors.card },
  threadChipText:{ fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  diagramCard:   { backgroundColor: Colors.surface, borderRadius: 12, padding: 14,
                   borderWidth: 0.5, borderColor: Colors.border, marginBottom: 4 },
  dimGrid:       { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  dimBlock:      { width: '47%', backgroundColor: Colors.card, borderRadius: 10, padding: 12,
                   borderLeftWidth: 3, borderLeftColor: Colors.blue,
                   borderWidth: 0.5, borderColor: Colors.border },
  dimLetter:     { fontSize: 24, fontWeight: '700', lineHeight: 28 },
  dimName:       { fontSize: 11, color: Colors.textSecondary, marginTop: 2, marginBottom: 4 },
  dimVal:        { fontSize: 13, color: Colors.textPrimary, fontWeight: '600', marginBottom: 4 },
  dimDesc:       { fontSize: 10, color: Colors.textMuted, lineHeight: 14 },
  critTag:       { marginTop: 6, backgroundColor: Colors.orangeDim,
                   borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2,
                   alignSelf: 'flex-start' },
  critTagText:   { fontSize: 8, color: Colors.orange, fontWeight: '700', letterSpacing: 0.5 },
  infoRow:       { flexDirection: 'row', justifyContent: 'space-between',
                   backgroundColor: Colors.card, borderRadius: 8, padding: 12,
                   marginBottom: 8, borderWidth: 0.5, borderColor: Colors.border },
  infoLabel:     { fontSize: 13, color: Colors.textSecondary },
  infoVal:       { fontSize: 13, color: Colors.textPrimary, fontWeight: '600' },
  formulaCard:   { backgroundColor: Colors.card, borderRadius: 10, padding: 14,
                   borderLeftWidth: 3, borderLeftColor: Colors.orange,
                   borderWidth: 0.5, borderColor: Colors.border, marginBottom: 10 },
  formulaTitle:  { fontSize: 11, color: Colors.orange, fontWeight: '700',
                   letterSpacing: 0.5, marginBottom: 6 },
  formulaText:   { fontSize: 15, color: Colors.textPrimary, fontWeight: '600' },
  formulaSub:    { fontSize: 11, color: Colors.textMuted, marginTop: 3 },
  notesCard:     { backgroundColor: Colors.card, borderRadius: 10, padding: 14,
                   borderWidth: 0.5, borderColor: Colors.border, marginBottom: 10 },
  notesTitle:    { fontSize: 12, color: Colors.blue, fontWeight: '700',
                   marginBottom: 8, letterSpacing: 0.3 },
  noteItem:      { fontSize: 12, color: Colors.textSecondary, marginBottom: 5, lineHeight: 18 },
});

const diagram = StyleSheet.create({
  wrap:       { flexDirection: 'row', alignItems: 'center', height: 80, position: 'relative' },
  hose:       { width: 80, height: 44, backgroundColor: Colors.card,
                borderWidth: 0.5, borderColor: Colors.border, borderRadius: 4,
                alignItems: 'center', justifyContent: 'center' },
  hoseLabel:  { fontSize: 9, color: Colors.textMuted, fontWeight: '600' },
  shell:      { width: 70, height: 54, borderWidth: 1.5, borderRadius: 4,
                alignItems: 'center', justifyContent: 'center',
                backgroundColor: Colors.surface, overflow: 'hidden' },
  crimpLines: { position: 'absolute', flexDirection: 'row', gap: 8, top: 0, bottom: 0,
                alignItems: 'center', paddingHorizontal: 6 },
  crimpLine:  { width: 1.5, height: 54, opacity: 0.5 },
  shellLabel: { fontSize: 8, fontWeight: '700', zIndex: 1 },
  nipple:     { flex: 1, height: 40, borderWidth: 1, borderRadius: 4,
                alignItems: 'center', justifyContent: 'center' },
  nippleLabel:{ fontSize: 9, fontWeight: '700' },
  labelRow:   { position: 'absolute', bottom: -2, left: 0, right: 0,
                flexDirection: 'row', justifyContent: 'space-between' },
  labelB:     { fontSize: 9, color: Colors.orange, fontWeight: '700' },
  labelA:     { fontSize: 9, color: Colors.textMuted, fontWeight: '600' },
});
