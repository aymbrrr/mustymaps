import React, { useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { CHART_FIRST_HOUR, hourLabel, miniBarColor } from '../domain/busyness';
import { colors, fonts } from '../theme/tokens';
import { Text } from './ui/Text';

const DETAIL_CHART_HEIGHT = 104;
const MINI_CHART_HEIGHT = 40;
const BAR_ANIMATION_MS = 300;
/** Axis ticks under the detail chart: 7a 10a 1p 4p 7p 11p. */
const DETAIL_AXIS_HOURS = [7, 10, 13, 16, 19, 23];

function AnimatedBar({
  height,
  color,
  cornerRadius,
  animate,
}: {
  height: number;
  color: string;
  cornerRadius: number;
  animate: boolean;
}) {
  const [value] = useState(() => new Animated.Value(height));

  useEffect(() => {
    if (!animate) {
      value.setValue(height);
      return;
    }
    Animated.timing(value, {
      toValue: height,
      duration: BAR_ANIMATION_MS,
      // Height is a layout property, so it cannot run on the native driver.
      useNativeDriver: false,
    }).start();
  }, [animate, height, value]);

  return (
    <Animated.View style={{ width: '100%', height: value, borderRadius: cornerRadius, backgroundColor: color }} />
  );
}

/** 40pt-tall read-only curve on the map's expanded spot bar. */
export function MiniHourlyChart({ hourlyBusy, nowIndex }: { hourlyBusy: number[]; nowIndex: number }) {
  return (
    <View style={styles.miniWrap}>
      <View style={styles.miniBars}>
        {hourlyBusy.map((occupancy, index) => (
          <View key={index} style={styles.barSlot}>
            <View
              style={{
                width: '100%',
                height: Math.max(4, occupancy * 0.4),
                borderRadius: 3,
                backgroundColor: miniBarColor(index, nowIndex),
              }}
            />
          </View>
        ))}
      </View>
      <View style={styles.miniAxis}>
        <Text style={styles.axisLabel}>7a</Text>
        <Text style={[styles.axisLabel, styles.axisNow]}>now</Text>
        <Text style={styles.axisLabel}>11p</Text>
      </View>
    </View>
  );
}

interface HourlyChartProps {
  curve: number[];
  selectedHour: number;
  nowIndex: number;
  /** Only today's chart highlights the current hour. */
  isToday: boolean;
  onSelectHour: (hour: number) => void;
  animate?: boolean;
}

/** 104pt-tall interactive curve on the location detail screen. */
export function HourlyChart({
  curve,
  selectedHour,
  nowIndex,
  isToday,
  onSelectHour,
  animate = true,
}: HourlyChartProps) {
  return (
    <>
      <View style={styles.detailBars}>
        {curve.map((occupancy, index) => {
          const color =
            index === selectedHour
              ? colors.polyGreen
              : isToday && index === nowIndex
                ? colors.barNow
                : colors.serenity;
          return (
            <Pressable
              key={index}
              accessibilityRole="button"
              accessibilityLabel={`${hourLabel(CHART_FIRST_HOUR + index)} busyness`}
              onPress={() => onSelectHour(index)}
              style={styles.detailBarSlot}
            >
              <AnimatedBar
                height={Math.max(6, occupancy)}
                color={color}
                cornerRadius={5}
                animate={animate}
              />
            </Pressable>
          );
        })}
      </View>
      <View style={styles.detailAxis}>
        {DETAIL_AXIS_HOURS.map((hour) => (
          <Text key={hour} style={styles.axisLabel}>
            {hourLabel(hour)}
          </Text>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  miniWrap: { flex: 1, gap: 5 },
  miniBars: { flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: MINI_CHART_HEIGHT },
  barSlot: { flex: 1, justifyContent: 'flex-end' },
  miniAxis: { flexDirection: 'row', justifyContent: 'space-between' },
  detailBars: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: DETAIL_CHART_HEIGHT },
  detailBarSlot: { flex: 1, height: '100%', justifyContent: 'flex-end' },
  detailAxis: { flexDirection: 'row', justifyContent: 'space-between', marginTop: -6 },
  axisLabel: { fontSize: 11, color: colors.sealGrey },
  axisNow: { fontFamily: fonts.semibold, color: colors.polyGreen },
});
