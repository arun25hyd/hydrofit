import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';

function TabIcon({
  focused,
  label,
  icon,
}: {
  focused: boolean;
  label: string;
  icon: string;
}) {
  return (
    <View style={styles.tabItem}>
      <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>
        {icon}
      </Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Fittings" icon="⬡" />
          ),
        }}
      />
      <Tabs.Screen
        name="rigid"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Rigid" icon="⬢" />
          ),
        }}
      />
      <Tabs.Screen
        name="hoses"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Hoses" icon="⌇" />
          ),
        }}
      />
      <Tabs.Screen
        name="calculator"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Calc" icon="⊞" />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Settings" icon="⚙" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#0d1117',
    borderTopColor: '#1e293b',
    borderTopWidth: 0.5,
    height: 60,
    paddingBottom: 4,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
  },
  tabIcon: {
    fontSize: 18,
    color: '#64748b',
  },
  tabIconActive: {
    color: '#f97316',
  },
  tabLabel: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
  },
  tabLabelActive: {
    color: '#f97316',
    fontWeight: '600',
  },
});
