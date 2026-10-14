import React, { ReactNode } from 'react';
import { Modal, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius } from '../../theme/tokens';

interface SheetProps {
  visible: boolean;
  onDismiss: () => void;
  children: ReactNode;
  /**
   * Floating sheets sit 12pt off every edge and round all four corners;
   * docked sheets are flush to the bottom and round only the top.
   */
  variant?: 'floating' | 'docked';
  /** Docked sheets like Edit Profile only close via their own cancel action. */
  dismissOnScrim?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
}

export function Sheet({
  visible,
  onDismiss,
  children,
  variant = 'floating',
  dismissOnScrim = true,
  contentStyle,
}: SheetProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onDismiss}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="dismiss"
        onPress={dismissOnScrim ? onDismiss : undefined}
        style={[styles.scrim, variant === 'floating' ? styles.scrimFloating : null]}
      >
        <Pressable
          // Swallows taps so pressing inside the sheet never reaches the scrim.
          onPress={() => {}}
          style={[styles.sheet, variant === 'floating' ? styles.floating : styles.docked, contentStyle]}
        >
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

/** Centered confirmation dialog, used by delete account. */
export function Dialog({ visible, onDismiss, children }: { visible: boolean; onDismiss: () => void; children: ReactNode }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={styles.dialogScrim}>
        <View style={styles.dialog}>{children}</View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: { flex: 1, backgroundColor: colors.scrim, justifyContent: 'flex-end' },
  scrimFloating: { padding: 12 },
  sheet: { width: '100%', backgroundColor: colors.offWhite },
  floating: { borderRadius: radius.sheet, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 22 },
  docked: {
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 38,
  },
  dialogScrim: {
    flex: 1,
    backgroundColor: colors.scrimStrong,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 36,
  },
  dialog: {
    backgroundColor: colors.offWhite,
    borderRadius: radius.sheetSm,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 18,
    gap: 10,
  },
});
