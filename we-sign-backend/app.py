from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import base64
import cv2
from tensorflow.keras.models import load_model
import mediapipe as mp
import threading
from collections import deque
import time


app = Flask(__name__)
CORS(app)


# ---------- Configuration ----------
MODEL_PATH = "C:/xampp/htdocs/CAPSTONE/WeSign-Front-end/we-sign-backend/model.h5"
ACTIONS = np.array(['hello', 'thanks', 'iloveyou'])  # must match training order
SEQUENCE_LEN = 30
MIN_SEQ_FOR_PREDICT = 10
OVERLAP_AFTER_PREDICT = 10

# Confidence thresholds (lowered for debugging)
DETECT_THRESHOLD = 0.40    # lowered from 0.60 to see more predictions
LOCK_THRESHOLD = 0.85      # lowered from 0.95 for easier locking
STABLE_FRAMES = 3          # reduced from 4 for faster response

# Motion detection
MIN_LANDMARK_NONZERO = 50
MOTION_THRESHOLD = 1e-4


# ---------- Load Model ----------
print("🔄 Loading model...")
try:
    model = load_model(MODEL_PATH)
    print(f"✅ Model loaded successfully from {MODEL_PATH}")
    print(f"   Model input shape: {model.input_shape}")
    print(f"   Model output shape: {model.output_shape}")
except Exception as e:
    print(f"❌ Failed to load model: {e}")
    exit(1)


# ---------- Mediapipe Setup ----------
mp_holistic = mp.solutions.holistic
holistic = mp_holistic.Holistic(
    static_image_mode=False,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)


# ---------- Global State ----------
sequence = []
sequence_lock = threading.Lock()

pred_buffer = deque(maxlen=STABLE_FRAMES)
conf_buffer = deque(maxlen=STABLE_FRAMES)
pred_buffer_lock = threading.Lock()

locked_prediction = None
locked_confidence = 0.0
stable_prediction = None
stable_confidence = 0.0

frame_count = 0  # for debugging


# ---------- Extract Keypoints ----------
def extract_keypoints(results):
    """
    Extract and flatten all landmarks into a single vector.
    Must match training preprocessing exactly!
    """
    # Pose: 33 landmarks × 4 values (x, y, z, visibility) = 132
    pose = np.array([[res.x, res.y, res.z, res.visibility]
                     for res in results.pose_landmarks.landmark]).flatten() \
           if results.pose_landmarks else np.zeros(33 * 4)
    
    # Face: 468 landmarks × 3 values (x, y, z) = 1404
    face = np.array([[res.x, res.y, res.z]
                     for res in results.face_landmarks.landmark]).flatten() \
           if results.face_landmarks else np.zeros(468 * 3)
    
    # Left hand: 21 landmarks × 3 values = 63
    lh = np.array([[res.x, res.y, res.z]
                   for res in results.left_hand_landmarks.landmark]).flatten() \
         if results.left_hand_landmarks else np.zeros(21 * 3)
    
    # Right hand: 21 landmarks × 3 values = 63
    rh = np.array([[res.x, res.y, res.z]
                   for res in results.right_hand_landmarks.landmark]).flatten() \
         if results.right_hand_landmarks else np.zeros(21 * 3)
    
    keypoints = np.concatenate([pose, face, lh, rh]).astype(np.float32)
    
    # ⚠️ IMPORTANT: If you normalized during training, apply same normalization here!
    # Example (uncomment and adjust if needed):
    # keypoints = (keypoints - TRAIN_MEAN) / TRAIN_STD
    
    return keypoints  # Should be length 1662


def frame_has_enough_keypoints(keypoints):
    """Check if frame has meaningful landmark data."""
    return np.count_nonzero(keypoints) >= MIN_LANDMARK_NONZERO


# ---------- Main Prediction Endpoint ----------
@app.route("/predict", methods=["POST"])
def predict():
    global sequence, locked_prediction, locked_confidence, stable_prediction, stable_confidence, frame_count
    
    frame_count += 1
    
    try:
        # Return locked result immediately if already locked
        if locked_prediction is not None:
            return jsonify({
                "prediction": locked_prediction,
                "confidence": float(locked_confidence),
                "locked": True,
                "progress": len(sequence)
            })
        
        # Get image from request
        data = request.get_json()
        if not data or "image" not in data:
            return jsonify({"error": "No image provided"}), 400
        
        # Decode base64 image
        image_data = base64.b64decode(data["image"])
        npimg = np.frombuffer(image_data, np.uint8)
        frame = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
        
        if frame is None:
            return jsonify({"error": "Could not decode image"}), 400
        
        # Process with Mediapipe
        image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = holistic.process(image_rgb)
        
        # Check for hand landmarks
        has_hands = results.left_hand_landmarks or results.right_hand_landmarks
        
        if not has_hands:
            with pred_buffer_lock:
                pred_buffer.clear()
                conf_buffer.clear()
            return jsonify({
                "prediction": "No hands detected",
                "confidence": 0.0,
                "locked": False,
                "progress": len(sequence)
            })
        
        # Extract keypoints
        keypoints = extract_keypoints(results)
        
        # Debug: Log keypoint stats every 10 frames
        if frame_count % 10 == 0:
            print(f"🔍 Frame {frame_count}: keypoints shape={keypoints.shape}, "
                  f"nonzero={np.count_nonzero(keypoints)}, "
                  f"mean={np.mean(keypoints):.4f}, std={np.std(keypoints):.4f}")
        
        # Check if frame has enough data
        if not frame_has_enough_keypoints(keypoints):
            with pred_buffer_lock:
                pred_buffer.clear()
                conf_buffer.clear()
            return jsonify({
                "prediction": "Insufficient landmarks",
                "confidence": 0.0,
                "locked": False,
                "progress": len(sequence)
            })
        
        # Motion detection: skip if too similar to last frame
        with sequence_lock:
            if len(sequence) > 0:
                last = sequence[-1]
                diff = np.mean(np.abs(last - keypoints))
                
                if diff < MOTION_THRESHOLD:
                    # No motion, skip this frame
                    return jsonify({
                        "prediction": "No motion detected",
                        "confidence": 0.0,
                        "locked": False,
                        "progress": len(sequence)
                    })
            
            # Add to sequence
            sequence.append(keypoints)
            if len(sequence) > SEQUENCE_LEN:
                sequence = sequence[-SEQUENCE_LEN:]
            seq_len = len(sequence)
        
        # Need minimum frames for prediction
        if seq_len < MIN_SEQ_FOR_PREDICT:
            return jsonify({
                "prediction": f"Collecting frames ({seq_len}/{MIN_SEQ_FOR_PREDICT})",
                "confidence": 0.0,
                "locked": False,
                "progress": seq_len
            })
        
        # Prepare input for model
        input_seq = sequence[-SEQUENCE_LEN:]
        
        # Pad if necessary (should match training)
        while len(input_seq) < SEQUENCE_LEN:
            input_seq.insert(0, input_seq[0])  # pad with first frame
        
        seq_array = np.expand_dims(input_seq, axis=0)  # Shape: (1, 30, 1662)
        
        # Model prediction
        predictions = model.predict(seq_array, verbose=0)[0]  # Shape: (3,)
        
        # Get predicted class
        class_idx = int(np.argmax(predictions))
        pred_label = ACTIONS[class_idx]
        confidence = float(predictions[class_idx])
        
        # 🔥 CRITICAL DEBUG: Log raw model output
        print(f"📊 Frame {frame_count} | Raw predictions: {np.array2string(predictions, precision=4)} "
              f"| Predicted: {pred_label} ({confidence:.4f})")
        
        # Update prediction buffers
        with pred_buffer_lock:
            pred_buffer.append(pred_label)
            conf_buffer.append(confidence)
            
            # Find most common prediction in buffer
            if len(pred_buffer) > 0:
                most_common = max(set(pred_buffer), key=pred_buffer.count)
                matching_confs = [c for (lbl, c) in zip(pred_buffer, conf_buffer) if lbl == most_common]
                avg_conf = np.mean(matching_confs) if matching_confs else 0.0
                
                # Update stable prediction (2+ consistent frames)
                if pred_buffer.count(most_common) >= 2:
                    stable_prediction = most_common
                    stable_confidence = avg_conf
                
                # Lock if stable across all buffer frames with high confidence
                if pred_buffer.count(most_common) >= STABLE_FRAMES and avg_conf >= LOCK_THRESHOLD:
                    if locked_prediction != most_common:
                        locked_prediction = most_common
                        locked_confidence = avg_conf
                        print(f"🔒 LOCKED: {locked_prediction} (confidence: {locked_confidence:.4f})")
            else:
                avg_conf = confidence
        
        # Keep overlap frames after prediction
        with sequence_lock:
            sequence = sequence[-OVERLAP_AFTER_PREDICT:]
        
        # Determine response
        response_pred = stable_prediction or pred_label
        response_conf = stable_confidence or avg_conf
        
        # Filter low confidence predictions
        if response_conf < DETECT_THRESHOLD:
            return jsonify({
                "prediction": "Low confidence",
                "confidence": float(response_conf),
                "locked": False,
                "progress": seq_len
            })
        
        # Return prediction
        return jsonify({
            "prediction": response_pred,
            "confidence": float(response_conf),
            "locked": locked_prediction is not None,
            "progress": seq_len
        })
    
    except Exception as e:
        print(f"❌ Error in /predict: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ---------- Reset Endpoint ----------
@app.route("/reset", methods=["POST"])
def reset():
    global sequence, pred_buffer, conf_buffer, locked_prediction, locked_confidence, stable_prediction, stable_confidence, frame_count
    
    with sequence_lock:
        sequence.clear()
    
    with pred_buffer_lock:
        pred_buffer.clear()
        conf_buffer.clear()
    
    locked_prediction = None
    locked_confidence = 0.0
    stable_prediction = None
    stable_confidence = 0.0
    frame_count = 0
    
    print("🔄 System reset completed")
    
    return jsonify({"message": "Reset successful"})


# ---------- Health Check ----------
@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "running",
        "model_loaded": model is not None,
        "actions": ACTIONS.tolist(),
        "sequence_length": SEQUENCE_LEN
    })


# ---------- Run Server ----------
if __name__ == "__main__":
    print("=" * 60)
    print("✅ WeSign Backend Server Starting...")
    print(f"   Actions: {ACTIONS.tolist()}")
    print(f"   Sequence Length: {SEQUENCE_LEN}")
    print(f"   Detection Threshold: {DETECT_THRESHOLD}")
    print(f"   Lock Threshold: {LOCK_THRESHOLD}")
    print("=" * 60)
    app.run(host="0.0.0.0", port=5000, debug=True, use_reloader=False)
