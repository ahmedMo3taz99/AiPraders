#!/bin/bash

# Pro Traders Group - Environment Setup Script
# This script creates environment files for the React frontend

echo "🚀 Pro Traders Group - Environment Setup"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to create environment file
create_env_file() {
    local source_file=$1
    local target_file=$2
    local description=$3
    
    if [ -f "$target_file" ]; then
        echo -e "${YELLOW}⚠️  ملف $target_file موجود بالفعل${NC}"
        read -p "هل تريد استبداله؟ (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${BLUE}⏭️  تم تخطي $target_file${NC}"
            return
        fi
    fi
    
    if cp "$source_file" "$target_file"; then
        echo -e "${GREEN}✅ تم إنشاء $target_file بنجاح${NC}"
        echo -e "${BLUE}📝 $description${NC}"
    else
        echo -e "${RED}❌ فشل في إنشاء $target_file${NC}"
    fi
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ يجب تشغيل هذا السكريبت من مجلد chatbot-frontend${NC}"
    exit 1
fi

echo -e "${BLUE}📁 إنشاء ملفات البيئة...${NC}"

# Create .env file
create_env_file "env.example" ".env" "الملف الأساسي للبيئة"

# Create .env.local file
create_env_file "env.local.example" ".env.local" "ملف البيئة المحلية"

# Create .env.staging file
create_env_file "env.staging.example" ".env.staging" "ملف البيئة التجريبية"

# Create .env.production file
create_env_file "env.production.example" ".env.production" "ملف بيئة الإنتاج"

echo ""
echo -e "${GREEN}🎉 تم إنشاء جميع ملفات البيئة بنجاح!${NC}"
echo ""
echo -e "${BLUE}📋 الخطوات التالية:${NC}"
echo "1. قم بتعديل ملف .env حسب احتياجاتك"
echo "2. أضف مفاتيح API الخاصة بك"
echo "3. شغل 'npm run dev' لبدء التطوير"
echo ""
echo -e "${YELLOW}⚠️  تذكر: لا تضع ملفات .env في Git${NC}"
echo ""
echo -e "${GREEN}🚀 جاهز للبدء!${NC}" 