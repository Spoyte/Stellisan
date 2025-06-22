#!/bin/bash

# Build script for Stellisan smart contracts

echo "Building Stellisan smart contracts..."

# Check if Rust is installed
if ! command -v rustc &> /dev/null; then
    echo "Error: Rust is not installed. Please install Rust first:"
    echo "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
    exit 1
fi

# Check if cargo is available
if ! command -v cargo &> /dev/null; then
    echo "Error: Cargo is not found. Please ensure Rust is properly installed."
    exit 1
fi

# Add wasm32-unknown-unknown target if not already added
echo "Checking for wasm32-unknown-unknown target..."
if ! rustup target list | grep -q "wasm32-unknown-unknown (installed)"; then
    echo "Installing wasm32-unknown-unknown target..."
    rustup target add wasm32-unknown-unknown
fi

# Clean previous builds
echo "Cleaning previous builds..."
cargo clean

# Update dependencies
echo "Updating dependencies..."
cargo update

# Build all contracts
echo "Building contracts..."
cargo build --target wasm32-unknown-unknown --release

if [ $? -eq 0 ]; then
    echo "Build successful!"
    echo "Contract binaries are located in target/wasm32-unknown-unknown/release/"
    ls -la target/wasm32-unknown-unknown/release/*.wasm 2>/dev/null
else
    echo "Build failed. Please check the error messages above."
    exit 1
fi 