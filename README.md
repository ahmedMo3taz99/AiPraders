# Pro Traders Group - React Frontend

واجهة مستخدم حديثة لشات بوت التداول الذكي مبني بـ React و TypeScript.

## 🚀 المميزات

- ✅ واجهة مستخدم حديثة ومتجاوبة
- ✅ نظام تسجيل دخول وتسجيل مستخدمين
- ✅ تسجيل دخول بجوجل
- ✅ شات بوت ذكي للتداول
- ✅ حفظ المحادثات والرسائل المفضلة
- ✅ تصدير المحادثات
- ✅ دعم اللغة العربية والإنجليزية
- ✅ نظام إدارة الحالة المتقدم
- ✅ معالجة أخطاء محسنة
- ✅ نظام logging متقدم

## 🛠️ التقنيات المستخدمة

- **React 18** - مكتبة واجهة المستخدم
- **TypeScript** - لكتابة كود آمن ومنظم
- **Tailwind CSS** - إطار عمل CSS للتصميم السريع
- **Framer Motion** - مكتبة الانيميشن
- **Vite** - أداة البناء السريعة
- **Lucide React** - أيقونات جميلة

## 📦 التثبيت والتشغيل

### المتطلبات

- Node.js 16+
- npm أو yarn

### خطوات التثبيت

1. **تثبيت التبعيات:**
```bash
npm install
```

2. **إعداد ملفات البيئة:**
```bash
# إنشاء ملف .env الأساسي
npm run setup:env

# أو إنشاء جميع ملفات البيئة
npm run setup:all
```

3. **تعديل ملف .env:**
```bash
# افتح ملف .env وقم بتعديل المتغيرات
nano .env
```

4. **تشغيل التطبيق:**
```bash
npm run dev
```

5. **فتح المتصفح:**
```
http://localhost:3000
```

## 🔧 إعداد ملفات البيئة

### ملفات البيئة المتاحة

- `env.example` - الملف الأساسي
- `env.local.example` - للبيئة المحلية
- `env.staging.example` - للبيئة التجريبية
- `env.production.example` - للإنتاج

### إنشاء ملفات البيئة

```bash
# إنشاء ملف .env أساسي
npm run setup:env

# إنشاء ملف .env.local للبيئة المحلية
npm run setup:env:local

# إنشاء ملف .env.staging للبيئة التجريبية
npm run setup:env:staging

# إنشاء ملف .env.production للإنتاج
npm run setup:env:production

# إنشاء جميع الملفات
npm run setup:all
```

### المتغيرات البيئية المهمة

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000

# App Configuration
VITE_APP_NAME="Pro Traders Group"
VITE_APP_VERSION="1.0.0"

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key

# Feature Flags
VITE_ENABLE_GOOGLE_LOGIN=true
VITE_ENABLE_REGISTRATION=true
VITE_ENABLE_CHATBOT=true

# Development
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug
```

## 📁 هيكل المشروع

```
chatbot-frontend/
├── public/                 # الملفات العامة
├── src/
│   ├── components/         # مكونات React
│   │   ├── auth/          # مكونات المصادقة
│   │   ├── chat/          # مكونات الشات بوت
│   │   └── ui/            # مكونات واجهة المستخدم
│   ├── contexts/          # React Contexts
│   ├── hooks/             # Custom Hooks
│   ├── types/             # TypeScript Types
│   ├── utils/             # Utility Functions
│   ├── config/            # إعدادات التطبيق
│   ├── App.tsx            # المكون الرئيسي
│   └── main.tsx           # نقطة البداية
├── env.example            # مثال ملف البيئة
├── env.local.example      # مثال البيئة المحلية
├── env.staging.example    # مثال البيئة التجريبية
├── env.production.example # مثال بيئة الإنتاج
├── vite.config.ts         # إعدادات Vite
├── tailwind.config.js     # إعدادات Tailwind
└── package.json           # تبعيات المشروع
```

## 🎨 التصميم

### الألوان المستخدمة

- **الخلفية الرئيسية:** `#141824`
- **الخلفية الثانوية:** `#1e293b`
- **الأخضر:** `#10a37f`
- **النص الأساسي:** `#f8fafc`
- **النص الثانوي:** `#94a3b8`

### المكونات

- **Auth Components** - تسجيل الدخول والتسجيل
- **Chat Components** - واجهة الشات بوت
- **UI Components** - مكونات واجهة المستخدم العامة

## 🔌 API Integration

### Authentication APIs

```typescript
import { authAPI } from '../utils/api';

// تسجيل مستخدم جديد
const result = await authAPI.register({
  name: 'اسم المستخدم',
  email: 'user@example.com',
  password: 'password123',
  password_confirmation: 'password123'
});

// تسجيل دخول
const result = await authAPI.login({
  email: 'user@example.com',
  password: 'password123'
});
```

### ChatBot APIs

```typescript
import { chatBotAPI } from '../utils/api';

// إرسال رسالة
const result = await chatBotAPI.sendMessage(token, {
  message: 'مرحبا، كيف حالك؟'
});

// جلب تاريخ المحادثات
const history = await chatBotAPI.getHistory(token);
```

## 🧪 الاختبار

```bash
# تشغيل الاختبارات
npm test

# تشغيل الاختبارات مع التغطية
npm run test:coverage

# تشغيل الاختبارات في وضع المراقبة
npm run test:watch
```

## 📦 البناء

```bash
# بناء للإنتاج
npm run build

# معاينة البناء
npm run preview

# بناء للبيئة التجريبية
npm run build:staging

# بناء للبيئة المحلية
npm run build:local
```

## 🚀 النشر

### Netlify

```bash
# بناء المشروع
npm run build

# رفع مجلد dist إلى Netlify
```

### Vercel

```bash
# ربط المشروع بـ Vercel
vercel

# النشر
vercel --prod
```

## 🔍 استكشاف الأخطاء

### مشاكل شائعة

1. **خطأ في الاتصال بالـ API**
   - تأكد من تشغيل Laravel server
   - تحقق من `VITE_API_BASE_URL` في ملف `.env`

2. **خطأ في CORS**
   - تأكد من إعدادات الـ proxy في `vite.config.ts`
   - تحقق من إعدادات CORS في Laravel

3. **خطأ في المتغيرات البيئية**
   - تأكد من أن جميع المتغيرات تبدأ بـ `VITE_`
   - أعد تشغيل الـ development server

### سجلات الأخطاء

```bash
# عرض سجلات التطبيق
npm run dev

# عرض سجلات البناء
npm run build
```

## 🤝 المساهمة

1. Fork المشروع
2. إنشاء branch جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push إلى الـ branch (`git push origin feature/amazing-feature`)
5. فتح Pull Request

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT.

## 📞 الدعم

للدعم والمساعدة، يرجى التواصل معنا عبر:
- البريد الإلكتروني: support@protradersgroup.com
- الموقع: https://protradersgroup.com

---

**Pro Traders Group** - منصة التداول المتقدمة 🚀 