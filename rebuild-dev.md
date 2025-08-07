# Development Build Instructions

Since we added the `react-native-share` plugin to app.json, you need to rebuild your development build for the sharing functionality to work properly.

## Steps to rebuild:

1. **Install EAS CLI** (if not already installed):
   ```bash
   npm install -g @expo/eas-cli
   ```

2. **Login to Expo**:
   ```bash
   eas login
   ```

3. **Build development client**:
   ```bash
   eas build --profile development --platform android
   # or for iOS:
   eas build --profile development --platform ios
   ```

4. **Install the new development build** on your device

## Alternative: Local development build

If you prefer to build locally:

```bash
npx expo run:android
# or
npx expo run:ios
```

## Why this is needed:

- `react-native-share` requires native code compilation
- Expo Go doesn't support this library
- Development builds include all the native dependencies

## Testing the fix:

After rebuilding, the sharing functionality should work properly with:
- Image sharing to messaging apps
- Email sharing with attachments
- Social media sharing
- Fallback text sharing for unsupported apps