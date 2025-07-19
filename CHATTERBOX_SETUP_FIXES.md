# Chatterbox Setup Fixes

This document describes the fixes applied to ensure Chatterbox works correctly with the OneClick Subtitles Generator setup process.

## Issues Fixed

### 1. Unicode Encoding Error
**Problem**: Windows console couldn't display Unicode checkmark characters (✓/✗) in `chatterbox/api.py`, causing `UnicodeEncodeError`.

**Solution**: Replace Unicode characters with ASCII text:
- `✓ TTS model loaded successfully` → `[SUCCESS] TTS model loaded successfully`
- `✗ Failed to load TTS model: {e}` → `[ERROR] Failed to load TTS model: {e}`
- `✓ VC model loaded successfully` → `[SUCCESS] VC model loaded successfully`
- `✗ Failed to load VC model: {e}` → `[ERROR] Failed to load VC model: {e}`

### 2. Model Loading Issues
**Problem**: `model_path.json` pointed to non-existent local model files (`t3_models/ja_34000.safetensors`), causing size mismatch errors.

**Solution**: Disable `model_path.json` by renaming it to `model_path.json.disabled`. This forces the system to use the default `ChatterboxTTS.from_pretrained()` method which automatically downloads correct models from Hugging Face.

### 3. Import Path Issues
**Problem**: The editable package installation created incorrect paths in the `.pth` file, preventing proper imports.

**Solution**: Fix the `.pth` file to point to the correct directory structure (`chatterbox/chatterbox` instead of `chatterbox/chatterbox/chatterbox`).

## Automated Integration

These fixes are now automatically applied during the setup process in `setup-narration.js`:

### Function: `applyChatterboxFixes()`
```javascript
function applyChatterboxFixes() {
    // Fix 1: Unicode encoding in chatterbox/api.py
    // Fix 2: Disable model_path.json
    // Fix 3: Fix .pth file import paths
}
```

### Integration Point
The fixes are applied after Chatterbox installation in the setup script:
```javascript
// After Chatterbox installation
console.log('\n🔧 Applying Chatterbox compatibility fixes...');
applyChatterboxFixes();
console.log('✅ Chatterbox compatibility fixes applied.');
```

## Testing

### Manual Testing
Run the test script to verify fixes:
```bash
npm run test:setup-fixes
```

### Import Testing
Test that Chatterbox imports work correctly:
```bash
uv run --python .venv python -c "from chatterbox.tts import ChatterboxTTS; from chatterbox.vc import ChatterboxVC; print('[SUCCESS] Imports work')"
```

## Setup Scripts Updated

The following setup scripts now include these fixes:
- `setup-narration.js` - Main setup script called by `npm run install:all`
- `OSG_installer_Windows.bat` - Windows batch installer (calls setup-narration.js)
- `OSG_installer.sh` - Linux/Mac shell installer (calls setup-narration.js)
- `OSG_installer_Windows_preview.bat` - Preview installer (calls setup-narration.js)

## Latest Fix: PyTorch/torchvision Compatibility (2025-07-19)

### Issue Fixed
- **Error**: `RuntimeError: operator torchvision::nms does not exist`
- **Cause**: Version mismatch between PyTorch and torchvision during Chatterbox installation
- **Impact**: Chatterbox API service failed to start, preventing voice cloning features

### Solution Applied
1. **Version Pinning**: Install specific compatible versions:
   - PyTorch: 2.7.0 (with appropriate CUDA suffix for GPU)
   - torchvision: 0.22.0 (compatible with PyTorch 2.7.0)
   - torchaudio: 2.7.0

2. **Installation Order**:
   - Install PyTorch/torchvision first with version pinning
   - Install Chatterbox dependencies separately (non-PyTorch deps)
   - Install Chatterbox package with `--no-deps` to prevent version conflicts

3. **Validation**: Added compatibility checks to detect torchvision::nms errors early

4. **Index Consistency**: Use CUDA 12.8 index for all PyTorch packages (matches Chatterbox expectations)

5. **Command Correction**: Removed incorrect `dev:uv` command, ensured `dev:cuda` (used by installer) works properly

## Requirements

### Shared Virtual Environment
- Both F5-TTS and Chatterbox use the same `.venv` with CUDA PyTorch
- PyTorch version: 2.7.0+cu128 (compatible with both projects)
- torchvision version: 0.22.0+cu128 (prevents nms operator errors)
- Saves storage space by sharing dependencies

### GPU Support
- NVIDIA GPU with recent drivers (no separate CUDA installation needed)
- PyTorch includes bundled CUDA runtime libraries
- Tested with RTX 4070, Driver 572.16, CUDA 12.8

## Verification

After setup completion, verify:
1. ✅ No Unicode encoding errors in console output
2. ✅ Chatterbox API starts successfully on port 3011
3. ✅ F5-TTS service starts successfully on port 3006
4. ✅ Both services use CUDA acceleration
5. ✅ Frontend accessible at http://localhost:3008

## Troubleshooting

If issues persist after setup:
1. Run `npm run test:setup-fixes` to check fix status
2. Manually apply fixes if needed:
   - Edit `chatterbox/api.py` to replace Unicode characters
   - Rename `chatterbox/chatterbox/model_path.json` to `.disabled`
   - Check `.venv/Lib/site-packages/__editable__.chatterbox*.pth` file paths
3. Restart the application with `npm run dev:cuda`

## Notes

- The `chatterbox/chatterbox` directory is a submodule and should not be edited
- All fixes are applied to files outside the submodule or to generated files
- The setup process is idempotent - can be run multiple times safely
- Model downloads happen automatically from Hugging Face on first run
