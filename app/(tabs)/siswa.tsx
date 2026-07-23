import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
  FlatList, TextInput, Modal, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useStudents } from '@/hooks/useStudents';
import { useAlert } from '@/template';
import { Colors, Spacing, Radius, FontSize, FontWeight, Shadow } from '@/constants/theme';
import { AvatarCircle } from '@/components';
import { Student, Teacher } from '@/types';

type TabType = 'siswa' | 'guru';

export default function SiswaScreen() {
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();
  const { students, teachers, classes, addStudent, removeStudent } = useStudents();

  const [activeTab, setActiveTab] = useState<TabType>('siswa');
  const [filterClass, setFilterClass] = useState('Semua');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [newNama, setNewNama] = useState('');
  const [newNis, setNewNis] = useState('');
  const [newKelas, setNewKelas] = useState(classes[0]?.id || '7A');
  const [newGender, setNewGender] = useState<'L' | 'P'>('L');
  const [newWali, setNewWali] = useState('');
  const [newNoWali, setNewNoWali] = useState('');

  const classFilters = ['Semua', ...classes.map(c => c.id)];

  const filteredStudents = useMemo(() => {
    let res = filterClass === 'Semua' ? students : students.filter(s => s.kelas === filterClass);
    if (search.trim()) {
      const q = search.toLowerCase();
      res = res.filter(s => s.nama.toLowerCase().includes(q) || s.nis.includes(q));
    }
    return res;
  }, [students, filterClass, search]);

  const filteredTeachers = useMemo(() => {
    if (!search.trim()) return teachers;
    const q = search.toLowerCase();
    return teachers.filter(t => t.nama.toLowerCase().includes(q) || t.mapel.toLowerCase().includes(q));
  }, [teachers, search]);

  const handleDelete = (id: string, nama: string) => {
    showAlert('Hapus Siswa', `Yakin hapus ${nama}?`, [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus', style: 'destructive', onPress: () => removeStudent(id) },
    ]);
  };

  const handleAdd = () => {
    if (!newNama.trim() || !newNis.trim()) {
      showAlert('Perhatian', 'Nama dan NIS wajib diisi');
      return;
    }
    addStudent({ nama: newNama.trim(), nis: newNis.trim(), kelas: newKelas, gender: newGender, waliMurid: newWali.trim() || 'Orang Tua', noWali: newNoWali.trim() || '-' });
    setNewNama(''); setNewNis(''); setNewWali(''); setNewNoWali('');
    setShowModal(false);
    showAlert('Berhasil', 'Siswa berhasil ditambahkan');
  };

  const renderStudent = ({ item }: { item: Student }) => (
    <View style={styles.card}>
      <AvatarCircle name={item.nama} size={44} fontSize={14} />
      <View style={styles.cardInfo}>
        <Text style={styles.cardName}>{item.nama}</Text>
        <Text style={styles.cardSub}>NIS: {item.nis} · Kelas {item.kelas}</Text>
        <Text style={styles.cardSub}>Wali: {item.waliMurid}</Text>
      </View>
      <View style={[styles.genderBadge, { backgroundColor: item.gender === 'L' ? Colors.izinBg : Colors.sakitBg }]}>
        <Text style={[styles.genderTxt, { color: item.gender === 'L' ? Colors.izin : Colors.sakit }]}>{item.gender}</Text>
      </View>
      <Pressable onPress={() => handleDelete(item.id, item.nama)} hitSlop={8}>
        <MaterialIcons name="delete-outline" size={22} color={Colors.alpha} />
      </Pressable>
    </View>
  );

  const renderTeacher = ({ item }: { item: Teacher }) => (
    <View style={styles.card}>
      <AvatarCircle name={item.nama} size={44} fontSize={14} />
      <View style={styles.cardInfo}>
        <Text style={styles.cardName}>{item.nama}</Text>
        <Text style={styles.cardSub}>{item.mapel}</Text>
        <Text style={styles.cardSub}>{item.jabatan}</Text>
      </View>
      {item.kelasWali ? (
        <View style={[styles.genderBadge, { backgroundColor: Colors.primaryPale }]}>
          <Text style={[styles.genderTxt, { color: Colors.primary }]}>{item.kelasWali}</Text>
        </View>
      ) : null}
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Data Siswa &amp; Guru</Text>
        <View style={styles.tabSwitch}>
          {(['siswa', 'guru'] as TabType[]).map(tab => (
            <Pressable key={tab} style={[styles.tabBtn, activeTab === tab && styles.tabBtnOn]} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabBtnTxt, activeTab === tab && styles.tabBtnTxtOn]}>
                {tab === 'siswa' ? `Siswa (${students.length})` : `Guru (${teachers.length})`}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={20} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder={activeTab === 'siswa' ? 'Cari nama atau NIS...' : 'Cari nama atau mapel...'}
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <Pressable onPress={() => setSearch('')} hitSlop={8}>
              <MaterialIcons name="close" size={18} color={Colors.textMuted} />
            </Pressable>
          ) : null}
        </View>
      </View>

      {activeTab === 'siswa' ? (
        <View style={styles.filterWrap}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
            {classFilters.map(c => (
              <Pressable key={c} style={[styles.chip, filterClass === c && styles.chipOn]} onPress={() => setFilterClass(c)}>
                <Text style={[styles.chipTxt, filterClass === c && styles.chipTxtOn]}>{c}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ) : null}

      {activeTab === 'siswa' ? (
        <FlatList
          data={filteredStudents}
          keyExtractor={i => i.id}
          renderItem={renderStudent}
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
          ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
          ListEmptyComponent={() => (
            <View style={styles.empty}>
              <MaterialIcons name="people" size={48} color={Colors.border} />
              <Text style={styles.emptyTxt}>Tidak ada siswa ditemukan</Text>
            </View>
          )}
        />
      ) : (
        <FlatList
          data={filteredTeachers}
          keyExtractor={i => i.id}
          renderItem={renderTeacher}
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
          ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
          ListEmptyComponent={() => (
            <View style={styles.empty}>
              <MaterialIcons name="school" size={48} color={Colors.border} />
              <Text style={styles.emptyTxt}>Tidak ada guru ditemukan</Text>
            </View>
          )}
        />
      )}

      {activeTab === 'siswa' ? (
        <Pressable style={[styles.fab, { bottom: insets.bottom + 88 }]} onPress={() => setShowModal(true)}>
          <MaterialIcons name="add" size={26} color={Colors.textOnPrimary} />
        </Pressable>
      ) : null}

      <Modal visible={showModal} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={[styles.modalBox, { paddingBottom: insets.bottom + Spacing.md }]}>
            <View style={styles.modalHead}>
              <Text style={styles.modalTitle}>Tambah Siswa Baru</Text>
              <Pressable onPress={() => setShowModal(false)} hitSlop={8}>
                <MaterialIcons name="close" size={24} color={Colors.textSecondary} />
              </Pressable>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Nama Lengkap *</Text>
              <TextInput style={styles.input} placeholder="Masukkan nama lengkap" placeholderTextColor={Colors.textMuted} value={newNama} onChangeText={setNewNama} />
              <Text style={styles.label}>NIS *</Text>
              <TextInput style={styles.input} placeholder="Nomor Induk Siswa" placeholderTextColor={Colors.textMuted} value={newNis} onChangeText={setNewNis} keyboardType="numeric" />
              <Text style={styles.label}>Kelas</Text>
              <View style={styles.optionRow}>
                {classes.map(c => (
                  <Pressable key={c.id} style={[styles.opt, newKelas === c.id && styles.optOn]} onPress={() => setNewKelas(c.id)}>
                    <Text style={[styles.optTxt, newKelas === c.id && styles.optTxtOn]}>{c.id}</Text>
                  </Pressable>
                ))}
              </View>
              <Text style={styles.label}>Jenis Kelamin</Text>
              <View style={styles.optionRow}>
                {(['L', 'P'] as const).map(g => (
                  <Pressable key={g} style={[styles.opt, newGender === g && styles.optOn]} onPress={() => setNewGender(g)}>
                    <Text style={[styles.optTxt, newGender === g && styles.optTxtOn]}>{g === 'L' ? 'Laki-laki' : 'Perempuan'}</Text>
                  </Pressable>
                ))}
              </View>
              <Text style={styles.label}>Nama Wali Murid</Text>
              <TextInput style={styles.input} placeholder="Nama orang tua / wali" placeholderTextColor={Colors.textMuted} value={newWali} onChangeText={setNewWali} />
              <Text style={styles.label}>No. WhatsApp Wali</Text>
              <TextInput style={styles.input} placeholder="08xxxxxxxxxx" placeholderTextColor={Colors.textMuted} value={newNoWali} onChangeText={setNewNoWali} keyboardType="phone-pad" />
              <Pressable style={({ pressed }) => [styles.addBtn, pressed && { opacity: 0.9 }]} onPress={handleAdd}>
                <Text style={styles.addBtnTxt}>Tambah Siswa</Text>
              </Pressable>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.md, paddingTop: Spacing.sm, paddingBottom: Spacing.md },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textOnPrimary, marginBottom: Spacing.sm },
  tabSwitch: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: Radius.md, padding: 3 },
  tabBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: Radius.sm },
  tabBtnOn: { backgroundColor: Colors.surface },
  tabBtnTxt: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: 'rgba(255,255,255,0.7)' },
  tabBtnTxtOn: { color: Colors.primary, fontWeight: FontWeight.semibold },
  searchWrap: { backgroundColor: Colors.surface, padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.background, borderRadius: Radius.md, paddingHorizontal: Spacing.sm, paddingVertical: 10, gap: Spacing.sm },
  searchInput: { flex: 1, fontSize: FontSize.md, color: Colors.textPrimary, padding: 0 },
  filterWrap: { backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  filterContent: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, gap: Spacing.xs },
  chip: { paddingHorizontal: Spacing.md, paddingVertical: 7, borderRadius: Radius.full, backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.border, marginRight: Spacing.xs },
  chipOn: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipTxt: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.textSecondary },
  chipTxtOn: { color: Colors.textOnPrimary },
  list: { padding: Spacing.md },
  empty: { alignItems: 'center', paddingVertical: 60, gap: Spacing.md },
  emptyTxt: { fontSize: FontSize.md, color: Colors.textMuted },
  card: { backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, ...Shadow.sm },
  cardInfo: { flex: 1 },
  cardName: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary, marginBottom: 2 },
  cardSub: { fontSize: FontSize.xs, color: Colors.textSecondary },
  genderBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.sm },
  genderTxt: { fontSize: FontSize.xs, fontWeight: FontWeight.bold },
  fab: { position: 'absolute', right: Spacing.md, width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', ...Shadow.lg },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: Colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '92%', padding: Spacing.lg },
  modalHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  modalTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  label: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.textSecondary, marginBottom: Spacing.xs, marginTop: Spacing.sm },
  input: { borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, fontSize: FontSize.md, color: Colors.textPrimary, backgroundColor: Colors.surfaceAlt },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  opt: { paddingHorizontal: Spacing.md, paddingVertical: 8, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surfaceAlt },
  optOn: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  optTxt: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.textSecondary },
  optTxtOn: { color: Colors.textOnPrimary },
  addBtn: { backgroundColor: Colors.primary, borderRadius: Radius.md, paddingVertical: Spacing.md, alignItems: 'center', marginTop: Spacing.lg, marginBottom: Spacing.md },
  addBtnTxt: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textOnPrimary },
});
