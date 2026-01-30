# Moodly 🌱 — Daily Mood Tracker  
*A quiet space to notice how you feel — without judgment.*

**Moodly** is a simple, intuitive, and visually engaging web app to **track your daily mood**, optionally add notes, and reflect on your feelings.

The app can be used **locally** or **deployed to the cloud using AWS CloudFormation with an EC2 instance**.  
All mood data is stored locally in your browser using `localStorage`.

---

## 🌟 Features

- Select your mood from **5 expressive emojis**: 😄 🙂 😐 😢 😡  
- **Add optional notes** for context or reflection  
- **One mood per day** - saving again updates today’s entry  
- **Mood-based background themes**  
- **Dark mode toggle** with saved preference  
- **Mood history** with date, emoji, and notes  
- **Daily streak tracking**  
- **Mood statistics**:
  - Most frequent mood  
  - Total days tracked  
- Calm animations & micro-interactions:
  - Emoji bounce effect  
  - Button press feedback  
  - Subtle card transitions  
- Friendly empty-state guidance and thoughtful acknowledgement interactions  

---

## 🛠 Tech Stack

- **HTML5**  
- **CSS3** (animations, gradients, shadows)  
- **Vanilla JavaScript**  
- **localStorage**  
- **AWS EC2**  
- **AWS CloudFormation**

---

## 🚀 Running Locally

No setup required.

1. Clone the repository:
   ```bash
   git clone https://github.com/InfX2243/moodly.git
   ```
2. Open `index.html` in your browser  
3. Start tracking your mood 🌱

---

## ☁️ AWS Cloud Deployment (CloudFormation + EC2)

Moodly includes an **AWS CloudFormation template** that deploys the app on an **EC2 instance** using a **user data script** to automatically set up and serve the application.

---

### 📂 Deployment Directory

```
aws_cloudformation_deploy/
├── ec2_template.json
└── ec2_userdata.sh
```

---

### 🧱 AWS Resources Created

The CloudFormation stack provisions:

- **Amazon EC2 instance**
  - Hosts the Moodly web app
  - Serves the app over HTTP
- **Security Group**
  - Allows inbound HTTP traffic (port 80)
- **IAM role / permissions**
  - Required for EC2 and CloudFormation operations

---

### ⚙️ How Deployment Works

- `ec2_template.json`
  - Defines the EC2 instance and security group
- `ec2_userdata.sh`
  - Runs automatically when the EC2 instance starts
  - Installs required packages (e.g., web server)
  - Copies Moodly files
  - Configures the server to host the app

Once the instance is running, the app becomes accessible via the **EC2 public IP or DNS**.

---

### ▶️ Deploying Using AWS CloudFormation

#### Prerequisites

- An AWS account  

#### Deployment Steps

1. Login to your AWS Account and find AWS CloudFormation service.

2. Use the JSON template to create a CloudFormation stack.

3. After the stack creation is completed, check the **output** section of the stack for website URL.

Your Moodly app is now live on AWS ☁️🌍

---

## 📈 Stats & Tracking

Moodly automatically tracks:

- **Daily streak** — consecutive days logged  
- **Most frequent mood**  
- **Total days tracked**

These insights help you observe emotional patterns over time.

---

## 🌱 Future Improvements

- Mood charts & visualizations  
- Export data as **CSV / JSON**  
- Weekly & monthly summaries  
- Improved mobile responsiveness  
- Custom mood color themes  
- Reminders & notifications  
- Mood trend insights  
- Archive old entries  

---

## 👤 Author

**InfX2243**

---

> Moodly is designed as a calm, judgment-free space.  
> Your data stays with you 🌱
