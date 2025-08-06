# SecurePINGen 🔐

**SecurePINGen** is a browser-based PIN code generator designed to create secure and unpredictable 4-digit PINs using machine learning. It leverages ONNX models in JavaScript to provide instant PIN difficulty estimation and generation.

---

## 🔍 Features

- Generate secure 4-digit PIN codes
- On-the-fly prediction of PIN "strength" using a trained ML model
- Lightweight, fast, and works directly in the browser
- No external server required – privacy-friendly
- Based on ONNX Runtime Web (WASM backend)

---

## 🧠 Model

The model is trained using scikit-learn and exported to ONNX format using `skl2onnx`. The browser uses `onnxruntime-web` to load and run the model. Input format to the model is a set of numerical features extracted from the PIN digits.
