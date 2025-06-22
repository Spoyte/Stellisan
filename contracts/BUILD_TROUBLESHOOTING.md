# Build Troubleshooting Guide

## Fixing the `arbitrary` crate errors

The errors you're seeing are due to a version mismatch between `stellar-xdr` and the `arbitrary` crate. Here's how to fix them:

### Solution 1: Update Soroban SDK (Already Applied)

I've already updated the `soroban-sdk` version in `Cargo.toml` from `20.0.0` to `20.5.0`, which should resolve the compatibility issues.

### Solution 2: Manual Build Steps

1. **Ensure Rust is installed:**
   ```bash
   # Check if Rust is installed
   rustc --version
   
   # If not installed, run:
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   source $HOME/.cargo/env
   ```

2. **Add the WASM target:**
   ```bash
   rustup target add wasm32-unknown-unknown
   ```

3. **Clean and rebuild:**
   ```bash
   cd contracts/
   cargo clean
   cargo update
   cargo build --target wasm32-unknown-unknown --release
   ```

### Solution 3: Force Dependency Resolution

If you still see errors, try adding explicit dependency overrides in `contracts/Cargo.toml`:

```toml
[workspace.dependencies]
soroban-sdk = "20.5.0"

# Add these if needed:
[patch.crates-io]
stellar-xdr = "20.1.0"
arbitrary = "1.3.2"
```

### Solution 4: Alternative SDK Version

If issues persist, try using a different SDK version:

```toml
[workspace.dependencies]
soroban-sdk = "21.0.0"
```

### Common Issues and Fixes

1. **"cannot find type `MaxRecursionReached`"**
   - This is fixed by updating to soroban-sdk 20.5.0 or later

2. **"cannot find method `try_size_hint`"**
   - Same fix as above

3. **Build fails with no output**
   - Ensure Rust toolchain is properly installed
   - Check that `.cargo/bin` is in your PATH
   - Try: `source $HOME/.cargo/env`

4. **WASM target not found**
   - Run: `rustup target add wasm32-unknown-unknown`

### Quick Build Script

Use the provided `build.sh` script:

```bash
cd contracts/
chmod +x build.sh
./build.sh
```

### Verifying the Fix

After building successfully, you should see:
- No `arbitrary` crate errors
- `.wasm` files in `target/wasm32-unknown-unknown/release/`
- Each contract (user_profile, correction_market, reputation_rewards, lingo_token) should have a corresponding `.wasm` file

### Still Having Issues?

1. Check your Rust version: `rustc --version` (should be 1.70.0 or later)
2. Update Rust: `rustup update`
3. Clear all caches: `rm -rf target/ && rm Cargo.lock`
4. Try building a single contract first:
   ```bash
   cd user-profile/
   cargo build --target wasm32-unknown-unknown --release
   ```

If you continue to have issues, please share:
- Your Rust version (`rustc --version`)
- The exact error output
- Your operating system 