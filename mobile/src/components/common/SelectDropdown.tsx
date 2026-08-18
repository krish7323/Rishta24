import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';

interface Option {
  label: string;
  value: string;
}

interface SelectDropdownProps {
  label?: string;
  value?: string;
  options: (Option | string)[];
  placeholder?: string;
  onSelect: (value: string) => void;
  error?: string;
}

export const SelectDropdown: React.FC<SelectDropdownProps> = ({
  label,
  value,
  options,
  placeholder = 'Select option',
  onSelect,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const normalizedOptions: Option[] = options.map((opt) =>
    typeof opt === 'string' ? { label: opt, value: opt } : opt
  );

  const selectedLabel = normalizedOptions.find((o) => o.value === value)?.label || value;

  const filtered = normalizedOptions.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {label && <Text style={[typography.caption, styles.label]}>{label}</Text>}

      <TouchableOpacity
        style={[styles.selector, !!error && styles.errorBorder]}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.8}
      >
        <Text
          style={[
            typography.body,
            { color: selectedLabel ? colors.textPrimary : colors.textMuted },
          ]}
        >
          {selectedLabel || placeholder}
        </Text>
        <Text style={{ color: colors.primary, fontSize: 16 }}>▼</Text>
      </TouchableOpacity>

      {error && <Text style={[typography.small, styles.errorText]}>{error}</Text>}

      <Modal visible={isOpen} animationType="slide" transparent>
        <SafeAreaView style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={typography.h3}>{label || placeholder}</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Text style={[typography.button, { color: colors.primary }]}>Done</Text>
              </TouchableOpacity>
            </View>

            {normalizedOptions.length > 8 && (
              <TextInput
                placeholder="Search..."
                value={search}
                onChangeText={setSearch}
                style={styles.searchInput}
                placeholderTextColor={colors.textMuted}
              />
            )}

            <FlatList
              data={filtered}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const isSelected = item.value === value;
                return (
                  <TouchableOpacity
                    style={[styles.optionItem, isSelected && styles.selectedOption]}
                    onPress={() => {
                      onSelect(item.value);
                      setIsOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        typography.body,
                        isSelected && { color: colors.primary, fontWeight: '700' },
                      ]}
                    >
                      {item.label}
                    </Text>
                    {isSelected && <Text style={{ color: colors.primary, fontWeight: 'bold' }}>✓</Text>}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    width: '100%',
  },
  label: {
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    minHeight: 50,
  },
  errorBorder: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    marginTop: spacing.xxs,
    marginLeft: spacing.xs,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(30, 10, 18, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    padding: spacing.xl,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  searchInput: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  selectedOption: {
    backgroundColor: colors.primarySubtle,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
  },
});
