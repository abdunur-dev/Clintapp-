import '@expo/metro-runtime';
import { renderRootComponent } from 'expo-router/build/renderRootComponent';
import { LoadSkiaWeb } from '@shopify/react-native-skia/lib/module/web';
import CreateApp from './App';
import './global.css';

LoadSkiaWeb().then(async () => {
  renderRootComponent(CreateApp);
});