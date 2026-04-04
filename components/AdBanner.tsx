import { View, StyleSheet, Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

// Use test ID during development — replace with real unit ID before production build
const BANNER_ID = __DEV__
  ? TestIds.BANNER
  : Platform.select({
      android: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX', // replace before release
      default: TestIds.BANNER,
    }) ?? TestIds.BANNER;

export function AdBanner() {
  return (
    <View style={styles.container}>
      <BannerAd
        unitId={BANNER_ID}
        size={BannerAdSize.BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#0a0e14',
    paddingVertical: 4,
  },
});
