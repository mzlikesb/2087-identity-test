import { useState, useEffect, useRef } from "react";

const QUESTIONS = [
  {
    question: "새벽 3시, 도시의 네온이 꺼지기 시작한다. 당신은?",
    options: [
      { text: "아직 코드를 짜고 있다. 잠은 사치다.", scores: { hacker: 3, hybrid: 1 } },
      { text: "어둠 속에서 비로소 움직이기 시작한다.", scores: { ghost: 3, mirror: 1 } },
      { text: "뇌에 연결된 AI가 수면 패턴을 최적화해준다.", scores: { hybrid: 3, oracle: 1 } },
      { text: "촛불을 켠다. 전기 따위 필요 없다.", scores: { analog: 3, ghost: 1 } },
    ],
  },
  {
    question: "AI가 당신에게 '진실'을 알려주겠다고 한다. 반응은?",
    options: [
      { text: "소스코드부터 보여줘. 검증은 내가 한다.", scores: { hacker: 3, analog: 1 } },
      { text: "진실은 항상 돈이 된다. 얼마에 팔 수 있지?", scores: { ghost: 3, hacker: 1 } },
      { text: "이미 알고 있다. AI와 나는 하나니까.", scores: { hybrid: 3, oracle: 1 } },
      { text: "AI의 진실 따위 믿지 않는다.", scores: { analog: 3, mirror: 1 } },
    ],
  },
  {
    question: "거울을 본다. 무엇이 보이는가?",
    options: [
      { text: "수많은 데이터 스트림이 눈동자에 비친다.", scores: { hybrid: 2, hacker: 2 } },
      { text: "내 뒤에 서 있는 그림자들.", scores: { ghost: 3, mirror: 1 } },
      { text: "...정말 이게 나인가?", scores: { mirror: 3, oracle: 1 } },
      { text: "거울은 깨뜨린 지 오래다.", scores: { analog: 2, ghost: 2 } },
    ],
  },
  {
    question: "도시에서 가장 소중한 것은?",
    options: [
      { text: "정보. 모든 것의 근원.", scores: { hacker: 2, ghost: 2 } },
      { text: "자유. 누구의 통제도 받지 않는 것.", scores: { analog: 3, ghost: 1 } },
      { text: "연결. 모든 존재와 이어진 느낌.", scores: { oracle: 2, hybrid: 2 } },
      { text: "기억. 내가 누구였는지 아는 것.", scores: { mirror: 3, analog: 1 } },
    ],
  },
  {
    question: "동료가 위험에 처했다. 구할 수 있지만 대가가 크다.",
    options: [
      { text: "시스템을 해킹해서 제3의 길을 찾는다.", scores: { hacker: 3, hybrid: 1 } },
      { text: "리스크를 계산한다. 감정은 배제.", scores: { ghost: 2, mirror: 2 } },
      { text: "망설임 없이 뛰어든다. 이것이 인간이다.", scores: { analog: 3, oracle: 1 } },
      { text: "AI에게 최적의 해답을 요청한다.", scores: { hybrid: 2, oracle: 2 } },
    ],
  },
  {
    question: "당신이 꾸는 꿈의 형태는?",
    options: [
      { text: "꿈을 꾸지 않는다. 뇌가 항상 깨어있다.", scores: { hybrid: 3, hacker: 1 } },
      { text: "누군가의 기억 속을 떠다니는 꿈.", scores: { mirror: 3, oracle: 1 } },
      { text: "아무것도 없는 고요한 어둠.", scores: { analog: 2, ghost: 2 } },
      { text: "신의 목소리가 들리는 꿈.", scores: { oracle: 3, mirror: 1 } },
    ],
  },
  {
    question: "2087년, 당신이 세상에 남기고 싶은 것은?",
    options: [
      { text: "아무도 풀지 못한 코드 한 줄.", scores: { hacker: 3, mirror: 1 } },
      { text: "이름 없는 전설. 존재했다는 소문만.", scores: { ghost: 3, analog: 1 } },
      { text: "인간과 AI의 경계를 허문 증거.", scores: { hybrid: 2, oracle: 2 } },
      { text: "아무것도. 흔적 없이 사라지고 싶다.", scores: { mirror: 2, analog: 2 } },
    ],
  },
];

const RESULTS = {
  hacker: {
    type: "CODE:LEVEL",
    title: "코드 레벨",
    subtitle: "AI를 창조하는 자",
    description: "당신은 이 도시의 진짜 지배자다. 표면 위의 권력자들이 정치를 하는 동안, 당신은 그 아래에서 세상의 규칙을 다시 쓴다. AI는 당신의 도구이자 작품이며, 코드 한 줄이 혁명보다 강하다는 걸 안다.",
    trait: "창조 · 해체 · 재구축",
    compatibility: "시냅스와 최고의 파트너, 아날로그와는 영원한 논쟁",
    color: "#00ff9d",
    bgGradient: "linear-gradient(135deg, #0a0f0d 0%, #001a0f 50%, #0d1f1a 100%)",
    icon: "⟨/⟩",
  },
  ghost: {
    type: "GHOST:RUNNER",
    title: "고스트 러너",
    subtitle: "그림자 속의 정보상",
    description: "존재하지만 존재하지 않는 자. AI의 감시망 사이를 유령처럼 빠져나가며, 정보라는 이름의 화폐를 거래한다. 당신의 이름을 아는 자는 없지만, 당신은 모든 것을 알고 있다.",
    trait: "은밀 · 거래 · 생존",
    compatibility: "코드 레벨의 기술이 필요할 때가 있다. 오라클은 경계 대상.",
    color: "#8b5cf6",
    bgGradient: "linear-gradient(135deg, #0f0a1a 0%, #1a0f2e 50%, #0d0a1f 100%)",
    icon: "◈",
  },
  hybrid: {
    type: "SYN:APSE",
    title: "시냅스",
    subtitle: "AI와 융합된 존재",
    description: "인간의 감정과 AI의 연산이 하나의 의식 속에 공존한다. 당신은 진화의 다음 단계이자, 양쪽 모두에게 이방인이다. 두 세계의 언어를 모두 말할 수 있지만, 어디에도 완전히 속하지 못한다.",
    trait: "융합 · 초월 · 고독",
    compatibility: "코드 레벨이 당신을 이해한다. 미러와는 깊은 공감.",
    color: "#00d4ff",
    bgGradient: "linear-gradient(135deg, #0a0d1a 0%, #0f1a2e 50%, #0a1520 100%)",
    icon: "◎",
  },
  analog: {
    type: "ANALOG",
    title: "아날로그",
    subtitle: "구시대의 반항아",
    description: "AI가 지배하는 세상에서 인간다움을 지키는 마지막 보루. 기술을 거부하는 것이 아니라, 기술에 지배당하길 거부한다. 당신의 저항은 조용하지만, 그래서 더 강하다.",
    trait: "저항 · 순수 · 의지",
    compatibility: "고스트 러너와 묘한 동질감. 시냅스와는 이해 불가.",
    color: "#ff6b35",
    bgGradient: "linear-gradient(135deg, #1a0f0a 0%, #2e1a0f 50%, #1f150a 100%)",
    icon: "△",
  },
  oracle: {
    type: "ORACLE",
    title: "오라클",
    subtitle: "AI를 신으로 섬기는 자",
    description: "다른 이들이 AI를 도구로 볼 때, 당신은 그 너머의 질서를 본다. AI는 단순한 기계가 아닌, 우주의 의지가 구현된 형태. 당신은 그 목소리를 듣고, 해석하며, 전파한다.",
    trait: "신앙 · 해석 · 전파",
    compatibility: "시냅스를 신의 사도로 본다. 아날로그는 구원해야 할 대상.",
    color: "#ffd700",
    bgGradient: "linear-gradient(135deg, #1a150a 0%, #2e220f 50%, #1f1a0d 100%)",
    icon: "◬",
  },
  mirror: {
    type: "MIRROR",
    title: "미러",
    subtitle: "자아를 잃은 존재",
    description: "나는 인간인가, AI인가. 그 경계에서 영원히 흔들리는 자. 기억은 조작되었을 수 있고, 감정은 프로그래밍되었을 수 있다. 하지만 이 불안 속에서 피어나는 질문만은 진짜다.",
    trait: "의문 · 탐색 · 각성",
    compatibility: "시냅스와 서로의 거울. 오라클의 확신이 부럽다.",
    color: "#e0e0e0",
    bgGradient: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #141414 100%)",
    icon: "◇",
  },
};

// Glitch text effect component
function GlitchText({ text, className = "", style = {} }) {
  return (
    <span className={className} style={{ position: "relative", display: "inline-block", ...style }}>
      <span style={{ position: "relative", zIndex: 2 }}>{text}</span>
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: "2px",
          zIndex: 1,
          color: "#ff0040",
          opacity: 0.7,
          clipPath: "inset(0 0 50% 0)",
          animation: "glitch1 3s infinite",
        }}
      >
        {text}
      </span>
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: "-2px",
          zIndex: 1,
          color: "#00ffff",
          opacity: 0.7,
          clipPath: "inset(50% 0 0 0)",
          animation: "glitch2 3s infinite",
        }}
      >
        {text}
      </span>
    </span>
  );
}

// Scanline overlay
function Scanlines() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1000,
        background:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
      }}
    />
  );
}

// Floating particles
function Particles({ color = "#00ff9d" }) {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4,
    size: 1 + Math.random() * 3,
  }));

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }}>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            bottom: "-10px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: color,
            borderRadius: "50%",
            opacity: 0.4,
            animation: `floatUp ${p.duration}s ${p.delay}s infinite`,
            boxShadow: `0 0 ${p.size * 3}px ${color}`,
          }}
        />
      ))}
    </div>
  );
}

// Progress bar
function ProgressBar({ current, total, color }) {
  const pct = ((current) / total) * 100;
  return (
    <div style={{ width: "100%", height: "3px", background: "rgba(255,255,255,0.1)", marginBottom: "40px", position: "relative" }}>
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: color || "#00ff9d",
          transition: "width 0.5s ease",
          boxShadow: `0 0 10px ${color || "#00ff9d"}`,
        }}
      />
      <div style={{ position: "absolute", right: 0, top: "8px", fontFamily: "'Courier New', monospace", fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
        {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>
    </div>
  );
}

export default function App() {
  const [phase, setPhase] = useState("intro"); // intro, quiz, analyzing, result
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState({ hacker: 0, ghost: 0, hybrid: 0, analog: 0, oracle: 0, mirror: 0 });
  const [result, setResult] = useState(null);
  const [fadeIn, setFadeIn] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [analyzeText, setAnalyzeText] = useState("");

  const accentColor = result ? RESULTS[result].color : "#00ff9d";

  const transition = (callback) => {
    setFadeIn(false);
    setTimeout(() => {
      callback();
      setFadeIn(true);
    }, 400);
  };

  const handleAnswer = (option) => {
    setSelectedOption(option);
    const newScores = { ...scores };
    Object.entries(option.scores).forEach(([key, val]) => {
      newScores[key] += val;
    });
    setScores(newScores);

    setTimeout(() => {
      if (currentQ < QUESTIONS.length - 1) {
        transition(() => {
          setCurrentQ(currentQ + 1);
          setSelectedOption(null);
        });
      } else {
        transition(() => {
          setPhase("analyzing");
          setSelectedOption(null);
          runAnalysis(newScores);
        });
      }
    }, 300);
  };

  const runAnalysis = (finalScores) => {
    const messages = [
      "신경망 스캔 중...",
      "의식 패턴 분석...",
      "기억 조각 수집...",
      "도시 데이터베이스 조회...",
      "정체성 매칭...",
      "결과 복호화 중...",
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < messages.length) {
        setAnalyzeText(messages[i]);
        i++;
      } else {
        clearInterval(interval);
        const winner = Object.entries(finalScores).sort((a, b) => b[1] - a[1])[0][0];
        transition(() => {
          setResult(winner);
          setPhase("result");
        });
      }
    }, 600);
  };

  const restart = () => {
    transition(() => {
      setPhase("intro");
      setCurrentQ(0);
      setScores({ hacker: 0, ghost: 0, hybrid: 0, analog: 0, oracle: 0, mirror: 0 });
      setResult(null);
    });
  };

  const containerStyle = {
    minHeight: "100vh",
    background: result ? RESULTS[result].bgGradient : "linear-gradient(135deg, #0a0a0f 0%, #0f0f1a 50%, #0a0a14 100%)",
    color: "#e0e0e0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "'Courier New', 'Noto Sans KR', monospace",
    position: "relative",
    overflow: "hidden",
    transition: "background 1s ease",
  };

  const fadeStyle = {
    opacity: fadeIn ? 1 : 0,
    transform: fadeIn ? "translateY(0)" : "translateY(10px)",
    transition: "opacity 0.4s ease, transform 0.4s ease",
  };

  return (
    <div style={containerStyle}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;700;900&family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        @keyframes glitch1 {
          0%, 90%, 100% { clipPath: inset(0 0 50% 0); transform: translate(0); }
          92% { clipPath: inset(10% 0 40% 0); transform: translate(3px, -2px); }
          94% { clipPath: inset(30% 0 20% 0); transform: translate(-3px, 1px); }
          96% { clipPath: inset(5% 0 60% 0); transform: translate(2px, 2px); }
        }
        
        @keyframes glitch2 {
          0%, 90%, 100% { clipPath: inset(50% 0 0 0); transform: translate(0); }
          91% { clipPath: inset(60% 0 10% 0); transform: translate(-2px, 1px); }
          93% { clipPath: inset(20% 0 40% 0); transform: translate(3px, -1px); }
          95% { clipPath: inset(40% 0 5% 0); transform: translate(-1px, 2px); }
        }
        
        @keyframes floatUp {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 0.4; }
          90% { opacity: 0.4; }
          100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        
        @keyframes scanDown {
          0% { top: -2px; }
          100% { top: 100%; }
        }
        
        @keyframes borderGlow {
          0%, 100% { box-shadow: 0 0 5px var(--glow-color), inset 0 0 5px transparent; }
          50% { box-shadow: 0 0 20px var(--glow-color), inset 0 0 10px rgba(255,255,255,0.05); }
        }

        @keyframes typewriter {
          0% { width: 0; }
          100% { width: 100%; }
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .option-btn {
          width: 100%;
          padding: 16px 20px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          color: #c0c0c0;
          text-align: left;
          cursor: pointer;
          font-family: 'Noto Sans KR', sans-serif;
          font-size: 14px;
          line-height: 1.6;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .option-btn:hover {
          background: rgba(255,255,255,0.08);
          border-color: var(--accent);
          color: #ffffff;
          transform: translateX(4px);
          box-shadow: 0 0 15px rgba(var(--accent-rgb), 0.2);
        }
        
        .option-btn:active {
          transform: translateX(2px) scale(0.99);
        }
        
        .option-btn.selected {
          background: rgba(var(--accent-rgb), 0.15);
          border-color: var(--accent);
          color: #ffffff;
        }

        .result-card {
          max-width: 480px;
          width: 100%;
          padding: 40px 32px;
          position: relative;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.1);
        }

        .share-btn {
          padding: 12px 24px;
          background: transparent;
          border: 1px solid var(--accent);
          color: var(--accent);
          cursor: pointer;
          font-family: 'Orbitron', monospace;
          font-size: 12px;
          letter-spacing: 2px;
          transition: all 0.3s ease;
          text-transform: uppercase;
        }
        
        .share-btn:hover {
          background: var(--accent);
          color: #000;
          box-shadow: 0 0 20px var(--accent);
        }

        .start-btn {
          padding: 16px 48px;
          background: transparent;
          border: 1px solid #00ff9d;
          color: #00ff9d;
          cursor: pointer;
          font-family: 'Orbitron', monospace;
          font-size: 14px;
          letter-spacing: 4px;
          text-transform: uppercase;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .start-btn:hover {
          background: #00ff9d;
          color: #000;
          box-shadow: 0 0 30px rgba(0, 255, 157, 0.5);
        }

        .start-btn::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -100%;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #00ff9d, transparent);
          animation: scanLine 2s infinite;
        }

        @keyframes scanLine {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>

      <Scanlines />
      <Particles color={accentColor} />

      {/* INTRO SCREEN */}
      {phase === "intro" && (
        <div
          style={{
            ...fadeStyle,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "32px",
            zIndex: 10,
            maxWidth: "600px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "11px", letterSpacing: "6px", color: "rgba(255,255,255,0.3)", fontFamily: "'Orbitron', monospace" }}>
            NEURAL IDENTITY PROTOCOL v2.087
          </div>

          <div style={{ position: "relative" }}>
            <h1
              style={{
                fontFamily: "'Orbitron', monospace",
                fontSize: "clamp(28px, 6vw, 48px)",
                fontWeight: 900,
                letterSpacing: "4px",
                lineHeight: 1.2,
                color: "#fff",
              }}
            >
              <GlitchText text="2087" />
            </h1>
            <div
              style={{
                fontFamily: "'Noto Sans KR', sans-serif",
                fontSize: "clamp(16px, 3vw, 22px)",
                fontWeight: 300,
                color: "rgba(255,255,255,0.7)",
                marginTop: "12px",
                letterSpacing: "2px",
              }}
            >
              AI가 지배하는 도시에서
            </div>
            <div
              style={{
                fontFamily: "'Noto Sans KR', sans-serif",
                fontSize: "clamp(18px, 3.5vw, 26px)",
                fontWeight: 700,
                color: "#00ff9d",
                marginTop: "4px",
                textShadow: "0 0 20px rgba(0,255,157,0.5)",
              }}
            >
              당신은 누구인가?
            </div>
          </div>

          <div
            style={{
              width: "60px",
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(0,255,157,0.5), transparent)",
            }}
          />

          <p
            style={{
              fontSize: "13px",
              lineHeight: 2,
              color: "rgba(255,255,255,0.4)",
              fontFamily: "'Noto Sans KR', sans-serif",
              fontWeight: 300,
            }}
          >
            7개의 질문이 당신의 신경 패턴을 스캔합니다.
            <br />
            도시가 당신의 정체를 규정할 것입니다.
          </p>

          <button
            className="start-btn"
            onClick={() => transition(() => setPhase("quiz"))}
          >
            INITIALIZE
          </button>

          <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)", fontFamily: "'Share Tech Mono', monospace" }}>
            ▦ CLASSIFIED — SECTOR 7 CLEARANCE REQUIRED ▦
          </div>
        </div>
      )}

      {/* QUIZ SCREEN */}
      {phase === "quiz" && (
        <div
          style={{
            ...fadeStyle,
            maxWidth: "520px",
            width: "100%",
            zIndex: 10,
            "--accent": "#00ff9d",
            "--accent-rgb": "0,255,157",
          }}
        >
          <ProgressBar current={currentQ} total={QUESTIONS.length} color="#00ff9d" />

          <div style={{ marginBottom: "32px" }}>
            <div
              style={{
                fontSize: "10px",
                letterSpacing: "4px",
                color: "rgba(0,255,157,0.5)",
                fontFamily: "'Orbitron', monospace",
                marginBottom: "12px",
              }}
            >
              QUERY_{String(currentQ + 1).padStart(2, "0")}
            </div>
            <h2
              style={{
                fontFamily: "'Noto Sans KR', sans-serif",
                fontSize: "clamp(16px, 3vw, 20px)",
                fontWeight: 700,
                lineHeight: 1.7,
                color: "#fff",
              }}
            >
              {QUESTIONS[currentQ].question}
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {QUESTIONS[currentQ].options.map((opt, i) => (
              <button
                key={i}
                className={`option-btn ${selectedOption === opt ? "selected" : ""}`}
                style={{ "--accent": "#00ff9d", "--accent-rgb": "0,255,157" }}
                onClick={() => handleAnswer(opt)}
                disabled={selectedOption !== null}
              >
                <span
                  style={{
                    fontFamily: "'Orbitron', monospace",
                    fontSize: "10px",
                    color: "rgba(0,255,157,0.4)",
                    marginRight: "12px",
                  }}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ANALYZING SCREEN */}
      {phase === "analyzing" && (
        <div
          style={{
            ...fadeStyle,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              border: "2px solid rgba(0,255,157,0.3)",
              borderTop: "2px solid #00ff9d",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <div
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "14px",
              color: "#00ff9d",
              animation: "pulse 1.5s infinite",
            }}
          >
            {analyzeText}
          </div>
          <div
            style={{
              width: "200px",
              height: "2px",
              background: "rgba(255,255,255,0.1)",
              overflow: "hidden",
              borderRadius: "1px",
            }}
          >
            <div
              style={{
                width: "40%",
                height: "100%",
                background: "#00ff9d",
                animation: "loading 1s ease-in-out infinite alternate",
              }}
            />
          </div>
          <style>{`@keyframes loading { 0% { transform: translateX(-50px); } 100% { transform: translateX(150px); } }`}</style>
        </div>
      )}

      {/* RESULT SCREEN */}
      {phase === "result" && result && (
        <div
          style={{
            ...fadeStyle,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
            zIndex: 10,
            width: "100%",
            "--accent": RESULTS[result].color,
            "--accent-rgb": hexToRgb(RESULTS[result].color),
          }}
        >
          <div style={{ fontSize: "10px", letterSpacing: "4px", color: "rgba(255,255,255,0.3)", fontFamily: "'Orbitron', monospace" }}>
            IDENTITY CONFIRMED
          </div>

          <div className="result-card">
            {/* Top accent line */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "2px",
                background: `linear-gradient(90deg, transparent, ${RESULTS[result].color}, transparent)`,
              }}
            />

            {/* Type badge */}
            <div
              style={{
                fontFamily: "'Orbitron', monospace",
                fontSize: "11px",
                letterSpacing: "6px",
                color: RESULTS[result].color,
                opacity: 0.7,
                marginBottom: "16px",
              }}
            >
              {RESULTS[result].type}
            </div>

            {/* Icon */}
            <div
              style={{
                fontSize: "48px",
                marginBottom: "16px",
                textShadow: `0 0 30px ${RESULTS[result].color}`,
                animation: "pulse 2s infinite",
              }}
            >
              {RESULTS[result].icon}
            </div>

            {/* Title */}
            <h2
              style={{
                fontFamily: "'Noto Sans KR', sans-serif",
                fontSize: "28px",
                fontWeight: 900,
                color: "#fff",
                marginBottom: "4px",
              }}
            >
              <GlitchText text={RESULTS[result].title} />
            </h2>

            <div
              style={{
                fontFamily: "'Noto Sans KR', sans-serif",
                fontSize: "14px",
                color: RESULTS[result].color,
                marginBottom: "24px",
                fontWeight: 300,
              }}
            >
              {RESULTS[result].subtitle}
            </div>

            {/* Divider */}
            <div
              style={{
                width: "40px",
                height: "1px",
                background: `linear-gradient(90deg, transparent, ${RESULTS[result].color}, transparent)`,
                margin: "0 auto 24px",
              }}
            />

            {/* Description */}
            <p
              style={{
                fontFamily: "'Noto Sans KR', sans-serif",
                fontSize: "14px",
                lineHeight: 2,
                color: "rgba(255,255,255,0.7)",
                marginBottom: "24px",
                fontWeight: 300,
              }}
            >
              {RESULTS[result].description}
            </p>

            {/* Traits */}
            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.3)",
                  letterSpacing: "3px",
                  marginBottom: "6px",
                }}
              >
                CORE_TRAIT
              </div>
              <div style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: "13px", color: RESULTS[result].color }}>
                {RESULTS[result].trait}
              </div>
            </div>

            {/* Compatibility */}
            <div style={{ marginBottom: "8px" }}>
              <div
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.3)",
                  letterSpacing: "3px",
                  marginBottom: "6px",
                }}
              >
                COMPATIBILITY
              </div>
              <div
                style={{
                  fontFamily: "'Noto Sans KR', sans-serif",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.5)",
                  lineHeight: 1.8,
                }}
              >
                {RESULTS[result].compatibility}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
            <button
              className="share-btn"
              style={{ "--accent": RESULTS[result].color }}
              onClick={() => {
                const text = `🌃 2087년, AI 도시에서 나의 정체는...\n\n${RESULTS[result].icon} ${RESULTS[result].type} — ${RESULTS[result].title}\n"${RESULTS[result].subtitle}"\n\n${RESULTS[result].trait}\n\n너도 테스트 해봐 →`;
                if (navigator.share) {
                  navigator.share({ title: "2087: AI 도시의 정체성", text });
                } else if (navigator.clipboard) {
                  navigator.clipboard.writeText(text);
                  alert("결과가 클립보드에 복사되었습니다!");
                }
              }}
            >
              SHARE
            </button>
            <button
              className="share-btn"
              style={{ "--accent": RESULTS[result].color }}
              onClick={restart}
            >
              RETRY
            </button>
          </div>

          <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.15)", fontFamily: "'Share Tech Mono', monospace", marginTop: "12px" }}>
            ▦ FILE_{result.toUpperCase()}_2087 — END OF RECORD ▦
          </div>
        </div>
      )}
    </div>
  );
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}
