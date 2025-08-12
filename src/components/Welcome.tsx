import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import logo from "../assets/logo.png";

interface WelcomeProps {
  onSendSuggestedMessage: (message: string) => void;
}

// إضافة مكون الكتابة التدريجية
const TypewriterText = ({
  text,
  delay = 0,
}: {
  text: string;
  delay?: number;
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      if (currentIndex < text.length) {
        const timeout = setTimeout(() => {
          setDisplayedText((prev) => prev + text[currentIndex]);
          setCurrentIndex((prev) => prev + 1);
        }, 30); // سرعة الكتابة أسرع (كانت 100ms أصبحت 30ms)

        return () => clearTimeout(timeout);
      }
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [currentIndex, text, delay]);

  return (
    <span>
      {displayedText}
      {currentIndex < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block"
        >
          |
        </motion.span>
      )}
    </span>
  );
};

// Matrix Rain Effect Component
const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars =
      "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    const charArray = chars.split("");

    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#0F0";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        ctx.fillStyle = `rgba(16, 185, 129, ${Math.random() * 0.8 + 0.2})`;
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);
    return () => clearInterval(interval);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 opacity-20" />;
};

// Neural Network Animation
const NeuralNetwork = () => {
  // استخدام useMemo لضمان عدم إعادة إنشاء nodes في كل render
  const nodes = useMemo(() => {
    const timestamp = Date.now();
    return Array.from({ length: 30 }, (_, i) => ({
      id: `neural-node-${timestamp}-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
    }));
  }, []);

  // استخدام useMemo للconnections أيضاً
  const connections = useMemo(() => {
    const timestamp = Date.now();
    const connectionList: Array<{
      key: string;
      node1: (typeof nodes)[0];
      node2: (typeof nodes)[0];
      distance: number;
    }> = [];

    nodes.forEach((node, i) => {
      nodes.slice(i + 1).forEach((targetNode, j) => {
        const distance = Math.sqrt(
          Math.pow(node.x - targetNode.x, 2) +
            Math.pow(node.y - targetNode.y, 2)
        );
        if (distance < 25) {
          connectionList.push({
            key: `neural-connection-${timestamp}-${i}-${j}`,
            node1: node,
            node2: targetNode,
            distance,
          });
        }
      });
    });

    return connectionList;
  }, [nodes]);

  return (
    <div className="absolute inset-0 overflow-hidden opacity-30">
      <svg width="100%" height="100%" className="absolute inset-0">
        {/* Neural Connections */}
        {connections.map((connection) => (
          <motion.line
            key={connection.key}
            x1={`${connection.node1.x}%`}
            y1={`${connection.node1.y}%`}
            x2={`${connection.node2.x}%`}
            y2={`${connection.node2.y}%`}
            stroke="url(#neuralGradient)"
            strokeWidth="1"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Neural Nodes */}
        {nodes.map((node) => (
          <motion.circle
            key={node.id}
            cx={`${node.x}%`}
            cy={`${node.y}%`}
            r={node.size}
            fill="url(#nodeGradient)"
            initial={{ scale: 0 }}
            animate={{
              scale: [0.5, 1.5, 0.5],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        <defs>
          <linearGradient
            id="neuralGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
            <stop offset="50%" stopColor="#06d6a0" stopOpacity="1" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="nodeGradient">
            <stop offset="0%" stopColor="#06d6a0" />
            <stop offset="100%" stopColor="#10b981" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
};

// لوجو محسن مع الصورة الأصلية
const SimpleLogo = () => {
  return (
    <motion.div
      className="relative mb-12 flex justify-center"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 1,
        ease: "easeOut",
        delay: 0.3,
      }}
    >
      {/* حاوي اللوجو الرئيسي */}
      <div className="relative w-32 h-32">
        {/* خلفية متوهجة */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/30 via-green-400/20 to-emerald-600/30 rounded-3xl blur-xl"></div>

        {/* الحاوي الرئيسي للوجو */}
        <div className="relative w-full h-full bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-700 rounded-3xl shadow-2xl shadow-emerald-500/40 flex items-center justify-center border border-emerald-400/30 overflow-hidden">
          {/* إضاءة علوية */}
          <div className="absolute top-3 left-3 w-10 h-10 bg-gradient-to-br from-white/30 to-transparent rounded-2xl"></div>

          {/* صورة اللوجو الأصلية */}
          <img
            src={logo}
            alt="Pro Traders Group"
            className="w-20 h-20 relative z-10 drop-shadow-lg object-contain"
          />

          {/* ظل سفلي */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/20 to-transparent rounded-b-3xl"></div>
        </div>
      </div>
    </motion.div>
  );
};

// الصناديق المحسنة والبسيطة
const SimpleCard = ({
  message,
  index,
  onSendSuggestedMessage,
  delay = 0,
  uniqueId,
}: {
  message: string;
  index: number;
  onSendSuggestedMessage: (message: string) => void;
  delay?: number;
  uniqueId: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      key={`card-wrapper-${uniqueId}`}
      className="group"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: delay,
        duration: 0.5,
        ease: "easeOut",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.button
        onClick={() => onSendSuggestedMessage(message)}
        className="relative w-full h-24 p-6 text-center transition-all duration-300 rounded-2xl bg-gray-900/70 backdrop-blur-sm border border-gray-700/50 hover:border-emerald-500/60 shadow-lg hover:shadow-xl hover:shadow-emerald-500/20 flex items-center justify-between"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* أيقونة AI بسيطة */}
        <div className="flex-shrink-0 ml-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-emerald-500/30 transition-all duration-300">
            <span className="text-white text-sm font-bold">AI</span>
          </div>
        </div>

        {/* محتوى النص */}
        <div className="flex-1">
          <span className="text-lg font-medium text-gray-100 group-hover:text-white transition-colors duration-300">
            {message}
          </span>
        </div>

        {/* خط التمييز السفلي */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-green-400 rounded-full"
          initial={{ width: 0 }}
          animate={isHovered ? { width: "100%" } : { width: 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.button>
    </motion.div>
  );
};

export const Welcome: React.FC<WelcomeProps> = ({ onSendSuggestedMessage }) => {
  const { t } = useLanguage();
  const [textVisible, setTextVisible] = useState(false);

  // إنشاء timestamp فريد للكومبوننت
  const componentId = useMemo(
    () => `welcome-${Date.now()}-${Math.random()}`,
    []
  );

  const suggestedMessages = [
    t?.welcome?.suggestedMessages?.tradingStrategies || "استراتيجيات التداول",
    t?.welcome?.suggestedMessages?.marketAnalysis || "تحليل السوق",
    t?.welcome?.suggestedMessages?.technicalTools || "الأدوات التقنية",
    t?.welcome?.suggestedMessages?.riskManagement || "إدارة المخاطر",
  ];

  // إنشاء جزيئات مع مفاتيح فريدة
  const particles = useMemo(() => {
    const timestamp = Date.now();
    return Array.from({ length: 50 }, (_, i) => ({
      id: `particle-${componentId}-${timestamp}-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      animation: {
        scale: [0, 1, 0],
        opacity: [0, 1, 0],
        x: [0, (Math.random() - 0.5) * 100],
        y: [0, (Math.random() - 0.5) * 100],
      },
      transition: {
        duration: 6 + Math.random() * 4,
        repeat: Infinity,
        delay: Math.random() * 3,
      },
    }));
  }, [componentId]);

  useEffect(() => {
    const timer = setTimeout(() => setTextVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="welcome-container relative min-h-screen overflow-hidden">
      {/* خلفيات متدرجة */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-emerald-950"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 via-transparent to-cyan-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.15),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(6,214,160,0.1),transparent_50%)]"></div>

      {/* Matrix Rain */}
      <MatrixRain />

      {/* Neural Network */}
      <NeuralNetwork />

      {/* شبكة هندسية */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(16,185,129,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16,185,129,0.3) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="welcome-content relative z-10 flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", damping: 15 }}
          className="text-center w-full max-w-6xl"
        >
          {/* اللوجو المحسن */}
          <SimpleLogo />

          {/* العنوان الرئيسي */}
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6 relative leading-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.01, duration: 0.5 }}
          >
            <span className="bg-gradient-to-r from-white via-emerald-100 to-white bg-clip-text text-transparent filter drop-shadow-lg">
              <TypewriterText
                text="مرحباً بك في Pro Traders Group"
                delay={5}
              />
            </span>
          </motion.h1>

          {/* العنوان الفرعي */}
          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-16 max-w-2xl mx-auto leading-relaxed font-light"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.6 }} // قللت من 4.5 إلى 2.2
          >
            {t?.welcome?.subtitle || "مساعد التداول الذكي الخاص بك"}
          </motion.p>

          {/* الصناديق المحسنة */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.8, duration: 0.6 }} // قللت من 5.0 إلى 2.8
            className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto"
          >
            {suggestedMessages.map((message, index) => (
              <SimpleCard
                key={`suggested-card-${componentId}-${index}`}
                message={message}
                index={index}
                onSendSuggestedMessage={onSendSuggestedMessage}
                delay={3.0 + index * 0.1} // قللت من 5.2 إلى 3.0
                uniqueId={`${componentId}-${index}`}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* جزيئات كمية */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-emerald-400/60 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={particle.animation}
            transition={particle.transition}
          />
        ))}
      </div>
    </div>
  );
};
