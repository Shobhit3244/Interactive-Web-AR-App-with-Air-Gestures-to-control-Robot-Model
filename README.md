# Dobot Magician AR - Interactive Control System

## 🚀 Project Overview

An interactive Augmented Reality application for visualizing and controlling the Dobot Magician robotic arm using hand gestures and marker-based tracking.

### Features
- ✅ Marker-based AR tracking
- ✅ Two control modes: Joint Control & Inverse Kinematics
- ✅ Air pinch and drag hand gesture interaction
- ✅ Real-time hand tracking with MediaPipe
- ✅ Minimalistic, modern UI
- ✅ Mobile-responsive design
- ✅ Local network deployment (laptop server → mobile client)

---

## 📋 Prerequisites

### Software Required
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **Modern web browser** - Chrome/Safari (mobile)
- **3D Model Converter** - [FabConvert](https://www.fabconvert.com/) or Blender

### Hardware
- Laptop (Windows/Mac/Linux)
- Smartphone with camera
- WiFi network
- Printed AR marker (or second screen)

---

## 📁 Project Structure

```
dobot-ar-project/
│
├── index.html              # Main AR application
├── marker.png              # AR marker image (generated)
├── marker.pdf              # Printable marker
├── README.md               # This file
│
├── models/
│   └── dobot_magician.glb  # Your 3D model (PLACE HERE)
│
├── js/
│   ├── hands.js            # Hand tracking module
│   └── ik-solver.js        # Inverse kinematics solver
│
└── css/
    └── style.css           # UI styling
```

---

## 🛠️ Setup Instructions

### Step 1: Convert Your STEP File to GLB

**Option A: Online Converter (Easiest)**
1. Go to https://www.fabconvert.com/ or https://imagetostl.com/convert/file/stp/to/glb
2. Upload your Dobot Magician STEP file
3. Download the converted GLB file
4. Rename it to `dobot_magician.glb`
5. Place in `models/` folder

**Option B: Using Blender**
1. Download and install [Blender](https://www.blender.org/download/)
2. Install CAD Import addon
3. File → Import → STEP (.stp/.step)
4. Select your file
5. File → Export → glTF 2.0 (.glb)
6. Settings: Format = GLB, +Y Up checked
7. Save as `dobot_magician.glb` in `models/` folder

### Step 2: Install Dependencies

```bash
# Open terminal/command prompt
cd path/to/dobot-ar-project

# Install http-server globally (one-time)
npm install -g http-server
```

### Step 3: Start the Server

```bash
# From project directory
http-server -p 8080

# You'll see output like:
# Available on:
#   http://192.168.1.XXX:8080    ← Use this IP
#   http://127.0.0.1:8080
```

### Step 4: Find Your Laptop's IP Address

**Windows:**
```bash
ipconfig
# Look for "IPv4 Address" (e.g., 192.168.1.105)
```

**Mac/Linux:**
```bash
ifconfig
# or
ip addr show
# Look for inet address (e.g., 192.168.1.105)
```

### Step 5: Access from Mobile

1. **Connect your phone to the SAME WiFi** as laptop
2. Open Chrome browser on mobile
3. Navigate to: `http://YOUR_LAPTOP_IP:8080`
   - Example: `http://192.168.1.105:8080`
4. Allow camera permissions when prompted
5. Point camera at the printed marker

---

## 🎯 How to Use

### Control Modes

#### **Joint Control Mode** 🎯
1. Tap "Joint Control" button
2. Glowing cyan rings appear on each joint
3. **Air pinch** (thumb + index finger) near a ring
4. **Drag in the air** to rotate that specific joint
5. Release pinch to deselect

#### **IK Control Mode** 🤏
1. Tap "IK Control" button
2. Rings disappear
3. **Air pinch** anywhere on the robot arm
4. **Drag in 3D space** to move the end effector
5. All joints automatically adjust to reach target position

### Status Panel
- **Mode:** Current control mode
- **Hand Detected:** Whether your hand is visible
- **Pinch Active:** Whether you're currently pinching

---

## 🖨️ Printing the AR Marker

1. Open `marker.png` or `marker.pdf`
2. Print on white paper (A4 or Letter size)
3. Ensure high contrast and no smudging
4. Place on flat surface with good lighting
5. Alternatively, display on a second screen

**Important:** Keep the marker flat and well-lit for best tracking.

---

## 🐛 Troubleshooting

### Problem: Can't access from mobile
**Solution:**
- Ensure laptop and phone are on SAME WiFi network
- Check firewall isn't blocking port 8080
- Try disabling VPN on either device
- Use IP from `ipconfig`/`ifconfig`, not localhost

### Problem: Model doesn't appear
**Solution:**
- Verify `dobot_magician.glb` is in `models/` folder
- Check browser console (F12) for errors
- Ensure GLB file is valid (test in [glTF Viewer](https://gltf-viewer.donmccurdy.com/))
- Try refreshing the page

### Problem: Hand tracking not working
**Solution:**
- Ensure camera permissions granted
- Use good lighting
- Keep hand clearly visible
- Try Chrome browser (best MediaPipe support)
- Check browser console for MediaPipe errors

### Problem: AR marker not detected
**Solution:**
- Print marker larger (full A4/Letter page)
- Improve lighting (avoid shadows)
- Keep marker flat and parallel to camera
- Move camera closer (20-50cm distance)
- Ensure high contrast print quality

### Problem: Laggy performance
**Solution:**
- Close other apps on phone
- Use newer phone model (better GPU)
- Reduce MediaPipe `modelComplexity` in `hands.js`:
  ```javascript
  handsInstance.setOptions({
      modelComplexity: 0, // Change from 1 to 0
  });
  ```

---

## 🔧 Customization

### Adjust Joint Ring Size
In `index.html`, find `createJointRings()`:
```javascript
const ringGeometry = new THREE.TorusGeometry(0.03, 0.005, 16, 32);
// Change 0.03 to larger/smaller value
```

### Change Ring Colors
```javascript
const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff, // Change hex color
});
```

### Adjust Pinch Sensitivity
In `hands.js`, modify:
```javascript
isPinching = pinchDistance < 0.05; // Change threshold
```

### Modify IK Iterations
In `ik-solver.js`:
```javascript
this.iterations = 10; // Increase for accuracy (slower)
```

---

## 📱 Recommended Testing Setup

1. **Laptop:** Place on stable surface running server
2. **Marker:** Print and place on flat surface with good lighting
3. **Distance:** 20-50cm between phone camera and marker
4. **Environment:** Well-lit room, avoid direct sunlight
5. **Network:** Both devices on 5GHz WiFi for best performance

---

## 🎨 UI Color Scheme

The app uses a modern minimalist theme with:
- **Primary:** Cyan (#00ffff)
- **Secondary:** Magenta (#ff00ff)
- **Background:** Dark transparent (#000000 85% opacity)
- **Text:** White (#ffffff)

Modify in `css/style.css` under `:root` variables.

---

## 📚 Technologies Used

- **Three.js** - 3D rendering engine
- **AR.js** - Marker-based AR tracking
- **MediaPipe Hands** - Real-time hand gesture detection
- **GLTFLoader** - 3D model loading
- **Vanilla JavaScript** - No heavy frameworks for better performance

---

## 🚦 Performance Tips

1. Use **GLB format** (not GLTF with separate files)
2. Optimize 3D model (reduce polygon count if laggy)
3. Use **wired network** for laptop if WiFi unstable
4. Close background apps on mobile
5. Test on newer devices for better GPU performance

---

## 📝 Notes

- **Hand tracking** requires good lighting and clear hand visibility
- **First load** may take 10-20 seconds to download MediaPipe models
- **Camera permissions** must be granted for AR and hand tracking
- **HTTPS not required** for localhost/local network
- Model joint structure may need adjustment based on your STEP file

---

## 🤝 Support

If you encounter issues:

1. Check browser console (F12 → Console tab) for errors
2. Verify all files are in correct folders
3. Test with different lighting conditions
4. Try on different mobile devices
5. Ensure 3D model is properly converted

---

## ✅ Quick Checklist

Before starting:
- [ ] Node.js installed
- [ ] STEP file converted to GLB
- [ ] GLB file in `models/` folder named `dobot_magician.glb`
- [ ] Server running (`http-server -p 8080`)
- [ ] Laptop IP address identified
- [ ] Phone on same WiFi network
- [ ] AR marker printed and ready
- [ ] Camera permissions will be granted

---

## 🎉 Success Criteria

You'll know it's working when:
1. ✅ Loading screen appears then disappears
2. ✅ Camera view shows
3. ✅ Point at marker → 3D model appears
4. ✅ Hand status shows "Yes" when hand visible
5. ✅ Pinch gesture detected → "Pinch Active: Yes"
6. ✅ Rings glow in Joint Mode
7. ✅ Joints rotate when dragging

---

**Version:** 1.0  
**Last Updated:** November 2025  
**Author:** AR Development Team  

Good luck with your interactive AR project! 🚀🤖