# ☁️ CLOUDINARY SETUP - FOLLOW THESE EXACT STEPS

## 🎯 Total Time: 5 Minutes | Difficulty: Easy

---

## 📍 **STEP 1: CREATE ACCOUNT** (2 minutes)

### **1.1 Open Browser**
- Go to: **https://cloudinary.com/users/register/free**

### **1.2 Sign Up**
Fill in the form:
```
✉️ Email: your-email@gmail.com
🔑 Password: (create strong password)
👤 First Name: Your name
👤 Last Name: Your last name
🏢 Company: Nurvi Jewels
```

### **1.3 Select Plan**
- Choose: **FREE** (0 USD/month)
- Click: **SIGN UP FOR FREE**

### **1.4 Verify Email**
- Check your email inbox
- Click the verification link
- Wait to be redirected to dashboard

---

## 📍 **STEP 2: GET CLOUD NAME** (30 seconds)

### **2.1 On Dashboard**
You'll see a white box at the top that says:

```
☁️ Product Environment Credentials

Cloud Name: dxxxxxxxxx  [📋 Copy]
API Key: 123456789012345
API Secret: **********************
```

### **2.2 Copy Cloud Name**
- Click the **📋 Copy** icon next to **Cloud Name**
- Paste in Notepad: `dxxxxxxxxx`
- **This is your cloud name!**

Example cloud names:
- `dnabcxyz`
- `dm12345abc`
- `dnurvijewels`

---

## 📍 **STEP 3: CREATE UPLOAD PRESET** (1 minute)

### **3.1 Open Settings**
- Look at **left sidebar**
- Click the **⚙️ gear icon** at the bottom
- It says "Settings"

### **3.2 Go to Upload Tab**
- At the top of Settings page
- Click **"Upload"** tab

### **3.3 Find Upload Presets Section**
- Scroll down the page
- Find section titled **"Upload presets"**
- Click **"Add upload preset"** link

### **3.4 Configure Preset**
A form opens. Fill in **EXACTLY** like this:

```
📝 Upload preset name: nurvi-jewels

🔓 Signing Mode: [Dropdown]
   Click it → Select "Unsigned" ⚠️ MUST BE UNSIGNED!

📁 Folder: nurvi-jewels

(Leave all other fields as default - don't change anything else)
```

### **3.5 Save Preset**
- Click **"Save"** button at the top right
- You'll see message: "Upload preset saved"
- Your preset now appears in the list

### **3.6 Verify**
You should see:
```
✅ nurvi-jewels (Unsigned)
```

**IMPORTANT:** It MUST say **(Unsigned)** next to it!

---

## 📍 **STEP 4: ADD TO VERCEL** (2 minutes)

### **4.1 Open Vercel**
- New tab: **https://vercel.com/dashboard**
- Login if needed

### **4.2 Find Your Project**
- You'll see your projects listed
- Find: **"nurvijewel"** or **"nurvi-jewels"**
- Click on it

### **4.3 Go to Settings**
- Click **"Settings"** tab at the top
- In left sidebar, click **"Environment Variables"**

### **4.4 Add Variable 1 - Cloud Name**

Click **"Add New"** button:

```
📝 Name: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

📝 Value: (paste your cloud name from Step 2)
        Example: dxxxxxxxxx

✅ Environments:
   [✓] Production
   [✓] Preview
   [✓] Development
   (Check all 3 boxes)
```

Click **"Save"**

### **4.5 Add Variable 2 - Upload Preset**

Click **"Add New"** again:

```
📝 Name: NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

📝 Value: nurvi-jewels

✅ Environments:
   [✓] Production
   [✓] Preview  
   [✓] Development
   (Check all 3 boxes)
```

Click **"Save"**

### **4.6 Verify Both Variables Added**

You should now see in the list:
```
✅ NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = dxxxxxxxxx
✅ NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET = nurvi-jewels
```

---

## 📍 **STEP 5: DEPLOY TO VERCEL** (1 minute)

Now let's deploy the code:

<function_calls>
<invoke name="run_terminal_cmd">
<parameter name="command">cd D:\NurviJewels; git add -A
