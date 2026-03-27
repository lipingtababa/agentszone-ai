import React, { type CSSProperties } from "react";
import { QRCodeSVG } from "qrcode.react";

export interface Person {
  name: string;
  nameCn?: string;
  title: string;
  subtitle?: string;
  photo?: string;
}

export type PosterStyle = "dark" | "minimal" | "glass";

export interface PosterData {
  forumTitle?: string;
  episodeNumber: number;
  title: string;
  description: string;
  contentItems: string[];
  guests: Person[];
  date: string;
  meetingId?: string;
  style?: PosterStyle;
}

interface Props {
  data: PosterData;
  scale?: number;
}

function numberToChinese(n: number): string {
  const chars = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
  if (n <= 10) return chars[n];
  if (n < 20) return "十" + (n % 10 === 0 ? "" : chars[n % 10]);
  if (n < 100) {
    const tens = Math.floor(n / 10);
    const ones = n % 10;
    return chars[tens] + "十" + (ones === 0 ? "" : chars[ones]);
  }
  return String(n);
}

const POSTER_W = 1080;
const POSTER_H = 1920;

export const PosterPreview: React.FC<Props> = ({ data, scale = 0.4 }) => {
  const {
    forumTitle = "Agents特区论坛",
    episodeNumber,
    title,
    description,
    contentItems,
    guests,
    date,
    meetingId,
    style = "dark",
  } = data;

  const episodeLabel = `第${numberToChinese(episodeNumber)}期`;
  const photoSize = guests.length === 1 ? 280 : guests.length === 2 ? 220 : 170;
  const titleLines = title.split("\n");

  if (style === "minimal") {
    return <MinimalPoster data={data} scale={scale} />;
  }

  if (style === "glass") {
    return <GlassPoster data={data} scale={scale} />;
  }

  // Dark style (original)
  const dots = [
    { x: "88%", y: "3%", size: 6, color: "rgba(255,100,120,0.7)" },
    { x: "75%", y: "5%", size: 4, color: "rgba(100,180,255,0.5)" },
    { x: "12%", y: "25%", size: 5, color: "rgba(255,200,100,0.4)" },
    { x: "6%", y: "45%", size: 4, color: "rgba(100,255,180,0.3)" },
    { x: "92%", y: "38%", size: 5, color: "rgba(255,100,200,0.4)" },
    { x: "8%", y: "62%", size: 3, color: "rgba(100,200,255,0.3)" },
    { x: "85%", y: "55%", size: 4, color: "rgba(255,180,100,0.35)" },
    { x: "15%", y: "78%", size: 3, color: "rgba(180,100,255,0.3)" },
    { x: "90%", y: "72%", size: 4, color: "rgba(100,255,200,0.25)" },
  ];

  return (
    <div
      style={{
        width: POSTER_W * scale,
        height: POSTER_H * scale,
        overflow: "hidden",
        borderRadius: 8,
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        flexShrink: 0,
      }}
    >
      <div
        id="poster-canvas"
        style={{
          width: POSTER_W,
          height: POSTER_H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          position: "relative",
          fontFamily:
            "'Noto Serif SC', 'Source Han Serif SC', 'STSongti', 'SimSun', 'Georgia', serif",
          overflow: "hidden",
        }}
      >
        {/* Background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(170deg, #0a2a5e 0%, #0e3a6e 20%, #0a2a5e 40%, #061845 65%, #041238 100%)",
          }}
        />

        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -80,
            width: 500,
            height: 500,
            background:
              "radial-gradient(circle, rgba(60,120,200,0.3) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Dots */}
        {dots.map((dot, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: dot.size,
              height: dot.size,
              borderRadius: "50%",
              backgroundColor: dot.color,
              left: dot.x,
              top: dot.y,
            }}
          />
        ))}

        {/* Tech grid lines */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.06 }}>
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#4dc4ff" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Circuit lines */}
        <svg style={{ position: "absolute", right: 0, top: "20%", width: "30%", height: "60%", opacity: 0.08 }}>
          <path d="M 100 0 L 100 80 L 60 80 L 60 160 L 100 160 L 100 240 L 20 240" fill="none" stroke="#4dc4ff" strokeWidth="2"/>
          <circle cx="100" cy="80" r="4" fill="#4dc4ff"/>
          <circle cx="60" cy="160" r="4" fill="#4dc4ff"/>
          <circle cx="100" cy="240" r="4" fill="#4dc4ff"/>
          <path d="M 0 300 L 40 300 L 40 380 L 80 380" fill="none" stroke="#6b8eff" strokeWidth="1.5"/>
        </svg>

        {/* Data flow particles */}
        <div style={{ position: "absolute", left: "5%", top: "15%", width: 3, height: 3, borderRadius: "50%", backgroundColor: "#4dc4ff", boxShadow: "0 0 10px #4dc4ff" }} />
        <div style={{ position: "absolute", left: "12%", top: "35%", width: 2, height: 2, borderRadius: "50%", backgroundColor: "#6b8eff", boxShadow: "0 0 8px #6b8eff" }} />
        <div style={{ position: "absolute", left: "8%", top: "55%", width: 4, height: 4, borderRadius: "50%", backgroundColor: "#4dc4ff", boxShadow: "0 0 12px #4dc4ff" }} />
        <div style={{ position: "absolute", right: "25%", bottom: "30%", width: 2, height: 2, borderRadius: "50%", backgroundColor: "#ff9d4d", boxShadow: "0 0 8px #ff9d4d" }} />
        <div style={{ position: "absolute", right: "30%", bottom: "45%", width: 3, height: 3, borderRadius: "50%", backgroundColor: "#4dc4ff", boxShadow: "0 0 10px #4dc4ff" }} />

        {/* Hexagon pattern */}
        <svg style={{ position: "absolute", left: "3%", bottom: "10%", width: "15%", height: "25%", opacity: 0.05 }}>
          <polygon points="30,0 60,15 60,45 30,60 0,45 0,15" fill="none" stroke="#4dc4ff" strokeWidth="1"/>
          <polygon points="30,40 60,55 60,85 30,100 0,85 0,55" fill="none" stroke="#4dc4ff" strokeWidth="1"/>
          <polygon points="90,20 120,35 120,65 90,80 60,65 60,35" fill="none" stroke="#6b8eff" strokeWidth="1"/>
        </svg>

        {/* Tech ring / orbit */}
        <svg style={{ position: "absolute", right: "8%", top: "15%", width: "20%", height: "20%", opacity: 0.12 }}>
          <circle cx="80" cy="80" r="60" fill="none" stroke="#4dc4ff" strokeWidth="1.5" strokeDasharray="8 4"/>
          <circle cx="80" cy="80" r="45" fill="none" stroke="#6b8eff" strokeWidth="1"/>
          <circle cx="80" cy="20" r="5" fill="#4dc4ff"/>
          <circle cx="140" cy="80" r="4" fill="#6b8eff"/>
          <circle cx="80" cy="80" r="6" fill="none" stroke="#ff9d4d" strokeWidth="1.5"/>
        </svg>

        {/* Floating triangles */}
        <svg style={{ position: "absolute", left: "6%", top: "25%", width: "8%", height: "8%", opacity: 0.08 }}>
          <polygon points="40,0 80,70 0,70" fill="none" stroke="#4dc4ff" strokeWidth="1.5"/>
        </svg>
        <svg style={{ position: "absolute", right: "15%", bottom: "20%", width: "6%", height: "6%", opacity: 0.06 }}>
          <polygon points="30,0 60,52 0,52" fill="none" stroke="#6b8eff" strokeWidth="1.5"/>
        </svg>

        {/* Diamond shapes */}
        <svg style={{ position: "absolute", right: "5%", top: "50%", width: "5%", height: "8%", opacity: 0.08 }}>
          <polygon points="30,0 60,30 30,60 0,30" fill="none" stroke="#4dc4ff" strokeWidth="1.5"/>
        </svg>

        {/* Star field */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {[...Array(20)].map((_, i) => (
            <div key={i} style={{
              position: "absolute",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.5)",
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }} />
          ))}
        </div>

        <style>{`
          @keyframes twinkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
        `}</style>

        {/* Content */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            padding: "52px 60px 48px",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 32,
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 12,
                background: "linear-gradient(135deg, rgba(77,196,255,0.3), rgba(107,142,255,0.2))",
                border: "1px solid rgba(77,196,255,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 20px rgba(77,196,255,0.2)",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4dc4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6"/>
                <polyline points="8 6 2 12 8 18"/>
                <line x1="12" y1="2" x2="12" y2="22" stroke="#6b8eff" strokeWidth="1.5"/>
              </svg>
            </div>
            <span
              style={{
                fontSize: 56,
                fontWeight: 800,
                background: "linear-gradient(90deg, #ff9d4d, #ffc87d)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "0.1em",
                filter: "drop-shadow(0 2px 16px rgba(255,157,77,0.4))",
              }}
            >
              {forumTitle}——{episodeLabel}
            </span>
          </div>

          {/* Title */}
          <div style={{ marginBottom: 30, marginTop: 80 }}>
            {titleLines.map((line, i) => (
              <div
                key={i}
                style={{
                  fontSize: 180,
                  fontWeight: 900,
                  color: "#ffffff",
                  lineHeight: 1.1,
                  letterSpacing: "0em",
                  fontFamily: "'Noto Serif SC', 'Source Han Serif SC', serif",
                  textShadow: "0 2px 20px rgba(0,0,0,0.3)",
                }}
              >
                {line}
              </div>
            ))}
          </div>

          {/* Quote */}
          <div
            style={{
              position: "relative",
              background: "rgba(10,40,100,0.55)",
              borderRadius: 20,
              padding: "28px 40px",
              marginBottom: 32,
              marginTop: 120,
              border: "none",
              boxShadow: "inset 0 0 60px rgba(77,196,255,0.05)",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: 6,
                left: 18,
                fontSize: 80,
                color: "rgba(100,180,255,0.4)",
                fontFamily: "Georgia, serif",
                lineHeight: 1,
                fontWeight: 700,
              }}
            >
              {"\u201C"}
            </span>
            <div
              style={{
                fontSize: 42,
                color: "#e8f0ff",
                lineHeight: 1.7,
                fontWeight: 600,
                fontStyle: "italic",
                letterSpacing: "0.02em",
              }}
            >
              {description}
            </div>
            <span
              style={{
                position: "absolute",
                bottom: -16,
                right: 24,
                fontSize: 72,
                color: "rgba(100,180,255,0.35)",
                fontFamily: "Georgia, serif",
                lineHeight: 1,
                fontWeight: 700,
              }}
            >
              {"\u201D"}
            </span>
          </div>

          {/* Guests */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: guests.length <= 2 ? 60 : 40,
              marginBottom: 36,
              alignItems: guests.length === 1 ? "center" : "flex-start",
              flexDirection: guests.length === 1 ? "column" : "row",
              paddingTop: guests.length > 1 ? 16 : 0,
            }}
          >
            {guests.map((guest, i) => (
              <PersonCard key={i} person={guest} photoSize={photoSize} />
            ))}
          </div>

          {/* Content items */}
          <div style={{
            marginBottom: 8,
            marginTop: 10,
            padding: "16px 20px",
          }}>
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                background: "linear-gradient(90deg, #4dc4ff, #6b9eff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              letterSpacing: "0.3em",
              marginBottom: 14,
            }}
            >
              <span
                style={{
                  background: "linear-gradient(90deg, #ffd700, #ffaa00)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 12px rgba(255,180,0,0.5))",
                }}
              >
              本期内容
              </span>
            </div>
            {contentItems.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: "linear-gradient(135deg, #4dc4ff, #6b8eff)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 800,
                    color: "#ffffff",
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
                <span
                  style={{
                    fontSize: 28,
                    color: "#e8f0ff",
                    lineHeight: 1.5,
                    fontWeight: 500,
                    letterSpacing: "0.01em",
                    fontFamily: "'Noto Serif SC', 'Source Han Serif SC', serif",
                  }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div
            style={{
              marginTop: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: 6,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, #4ade80, #22c55e)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 16px rgba(74,222,128,0.4)",
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <span
                style={{
                  fontSize: 36,
                  fontWeight: 700,
                  color: "#ffffff",
                  letterSpacing: "0.05em",
                }}
              >
                {date}
              </span>
            </div>
            {meetingId && (
              <div
                style={{ display: "flex", alignItems: "flex-end", gap: 14 }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      width: 140,
                      height: 140,
                      borderRadius: 10,
                      overflow: "hidden",
                      background: "#ffffff",
                      padding: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <QRCodeSVG
                      value={`https://meeting.tencent.com/dm/${meetingId.replace(/\s/g, "")}`}
                      size={120}
                      level="M"
                    />
                  </div>
                  <div
                    style={{
                      fontSize: 24,
                      color: "rgba(210,218,255,0.7)",
                      fontWeight: 500,
                    }}
                  >
                    腾讯会议
                  </div>
                  <div
                    style={{
                      fontSize: 34,
                      fontWeight: 700,
                      color: "#ffffff",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {meetingId}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const PersonCard: React.FC<{
  person: Person;
  photoSize: number;
}> = ({ person, photoSize }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 16,
    }}
  >
    <div
      style={{
        width: photoSize,
        height: photoSize,
        borderRadius: "50%",
        overflow: "hidden",
        border: "3px solid rgba(255,255,255,0.15)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      }}
    >
      {person.photo ? (
        <img
          src={person.photo}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
          }}
        />
      ) : (
        <div
          style={{
            width: photoSize,
            height: photoSize,
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, rgba(100,140,255,0.3), rgba(180,100,255,0.3))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: 22, color: "rgba(255,255,255,0.4)" }}>
            Guest
          </span>
        </div>
      )}
    </div>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
      }}
    >
      <div style={{
        fontSize: 38,
        fontWeight: 700,
        background: "linear-gradient(90deg, #ff9d4d, #ffc87d)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        letterSpacing: "0.1em",
      }}>
        {person.name}
        {person.nameCn && (
          <span style={{ color: "#ffc87d" }}> {person.nameCn}</span>
        )}
      </div>
      <div style={{
        fontSize: 22,
        color: "#d8e8ff",
        textAlign: "center",
        letterSpacing: "0.05em",
        fontWeight: 500,
      }}>
        {person.title}
      </div>
      {person.subtitle && (
        <div style={{
          fontSize: 20,
          color: "#eef4ff",
          textAlign: "center",
          letterSpacing: "0.03em",
          marginTop: 4,
        }}>
          {person.subtitle}
        </div>
      )}
    </div>
  </div>
);

// ==================== Minimal Style Poster ====================

const MinimalPoster: React.FC<Props> = ({ data, scale = 0.4 }) => {
  const {
    forumTitle = "Agents特区论坛",
    episodeNumber,
    title,
    description,
    contentItems,
    guests,
    date,
    meetingId,
  } = data;

  const episodeLabel = `第${numberToChinese(episodeNumber)}期`;
  const photoSize = guests.length === 1 ? 260 : guests.length === 2 ? 200 : 160;
  const titleLines = title.split("\n");

  return (
    <div
      style={{
        width: POSTER_W * scale,
        height: POSTER_H * scale,
        overflow: "hidden",
        borderRadius: 8,
        boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
        flexShrink: 0,
      }}
    >
      <div
        id="poster-canvas"
        style={{
          width: POSTER_W,
          height: POSTER_H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          position: "relative",
          fontFamily:
            "'PingFang SC', 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif",
          overflow: "hidden",
          background: "#fafafa",
        }}
      >
        {/* Flowing curves background */}
        <svg
          viewBox="0 0 1080 1920"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        >
          {/* Main flowing curve 1 */}
          <path
            d="M-100 400 Q 300 200 540 500 T 1180 300"
            fill="none"
            stroke="rgba(200,210,230,0.15)"
            strokeWidth="120"
            strokeLinecap="round"
          />
          {/* Main flowing curve 2 */}
          <path
            d="M-50 800 Q 400 600 700 900 T 1200 700"
            fill="none"
            stroke="rgba(180,195,220,0.12)"
            strokeWidth="80"
            strokeLinecap="round"
          />
          {/* Accent curve */}
          <path
            d="M1080 1200 Q 700 1000 400 1300 T -100 1100"
            fill="none"
            stroke="rgba(100,140,200,0.08)"
            strokeWidth="150"
            strokeLinecap="round"
          />
          {/* Bottom curves */}
          <path
            d="M0 1600 Q 540 1400 1080 1700"
            fill="none"
            stroke="rgba(200,210,230,0.1)"
            strokeWidth="100"
            strokeLinecap="round"
          />
          <path
            d="M-50 1800 Q 300 1600 600 1850 T 1150 1750"
            fill="none"
            stroke="rgba(180,195,220,0.08)"
            strokeWidth="60"
            strokeLinecap="round"
          />
          {/* Top right flowing accent - replaces hard circle */}
          <path
            d="M1300 -100 Q 900 100 750 400 T 500 800"
            fill="none"
            stroke="rgba(100,140,200,0.06)"
            strokeWidth="200"
            strokeLinecap="round"
          />
          <path
            d="M1400 50 Q 1000 200 850 500 T 600 900"
            fill="none"
            stroke="rgba(180,195,220,0.05)"
            strokeWidth="120"
            strokeLinecap="round"
          />
          {/* Subtle geometric accent */}
          <circle cx="150" cy="1500" r="250" fill="rgba(100,140,200,0.03)" />

          {/* Champagne gold accent lines - following the curves */}
          <path
            d="M-80 380 Q 320 180 560 480 T 1160 280"
            fill="none"
            stroke="rgba(212,175,55,0.12)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M-30 780 Q 420 580 720 880 T 1180 680"
            fill="none"
            stroke="rgba(212,175,55,0.08)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M1060 1180 Q 680 980 380 1280 T -80 1080"
            fill="none"
            stroke="rgba(212,175,55,0.06)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M20 1580 Q 560 1380 1060 1680"
            fill="none"
            stroke="rgba(212,175,55,0.1)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Champagne gold dots */}
          <circle cx="540" cy="500" r="4" fill="rgba(212,175,55,0.15)" />
          <circle cx="700" cy="900" r="3" fill="rgba(212,175,55,0.12)" />
          <circle cx="400" cy="1300" r="5" fill="rgba(212,175,55,0.1)" />
          <circle cx="540" cy="1700" r="3.5" fill="rgba(212,175,55,0.12)" />
          <circle cx="750" cy="400" r="3" fill="rgba(212,175,55,0.08)" />
        </svg>

        {/* Content */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            padding: "64px 72px 56px",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              marginBottom: 48,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: "linear-gradient(135deg, #3b5998, #1a237e)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(26,35,126,0.25)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 3,
                  alignItems: "flex-end",
                  height: 22,
                }}
              >
                <div
                  style={{
                    width: 5,
                    height: 10,
                    borderRadius: 2,
                    background: "#fff",
                  }}
                />
                <div
                  style={{
                    width: 5,
                    height: 18,
                    borderRadius: 2,
                    background: "rgba(255,255,255,0.8)",
                  }}
                />
                <div
                  style={{
                    width: 5,
                    height: 13,
                    borderRadius: 2,
                    background: "rgba(255,255,255,0.6)",
                  }}
                />
              </div>
            </div>
            <span
              style={{
                fontSize: 26,
                fontWeight: 600,
                color: "#1a237e",
                letterSpacing: "0.04em",
              }}
            >
              {forumTitle} · {episodeLabel}
            </span>
          </div>

          {/* Title */}
          <div style={{ marginBottom: 40 }}>
            {titleLines.map((line, i) => (
              <div
                key={i}
                style={{
                  fontSize: 80,
                  fontWeight: 800,
                  color: "#1a1a2e",
                  lineHeight: 1.12,
                  letterSpacing: "-0.01em",
                }}
              >
                {line}
              </div>
            ))}
          </div>

          {/* Quote */}
          <div
            style={{
              position: "relative",
              background: "#ffffff",
              borderRadius: 24,
              padding: "32px 44px",
              marginBottom: 40,
              boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
              border: "1px solid rgba(200,210,230,0.3)",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: 8,
                left: 20,
                fontSize: 64,
                color: "rgba(100,140,200,0.18)",
                fontFamily: "Georgia, serif",
                lineHeight: 1,
                fontWeight: 700,
              }}
            >
              {"\u201C"}
            </span>
            <div
              style={{
                fontSize: 36,
                color: "#2d3a4a",
                lineHeight: 1.75,
                fontWeight: 500,
                letterSpacing: "0.02em",
                fontFamily: "'Noto Serif SC', 'Source Han Serif SC', Georgia, serif",
              }}
            >
              {description}
            </div>
            <span
              style={{
                position: "absolute",
                bottom: -8,
                right: 28,
                fontSize: 64,
                color: "rgba(100,140,200,0.18)",
                fontFamily: "Georgia, serif",
                lineHeight: 1,
                fontWeight: 700,
              }}
            >
              {"\u201D"}
            </span>
          </div>

          {/* Guests */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: guests.length <= 2 ? 70 : 45,
              marginBottom: 44,
              alignItems: guests.length === 1 ? "center" : "flex-start",
              flexDirection: guests.length === 1 ? "column" : "row",
              paddingTop: guests.length > 1 ? 20 : 0,
            }}
          >
            {guests.map((guest, i) => (
              <MinimalPersonCard key={i} person={guest} photoSize={photoSize} />
            ))}
          </div>

          {/* Content items */}
          <div style={{ marginBottom: 40, marginTop: "auto" }}>
            <div
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: "#1a237e",
                letterSpacing: "0.2em",
                marginBottom: 26,
              }}
            >
              本 期 内 容
            </div>
            {contentItems.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 16,
                  marginBottom: 20,
                }}
              >
                <span
                  style={{
                    fontSize: 22,
                    color: "#1a237e",
                    lineHeight: 1.5,
                    flexShrink: 0,
                  }}
                >
                  ●
                </span>
                <span
                  style={{
                    fontSize: 28,
                    color: "#333",
                    lineHeight: 1.6,
                  }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div
            style={{
              marginTop: "auto",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              borderTop: "1px solid rgba(200,210,230,0.4)",
              paddingTop: 28,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: "#4caf50",
                }}
              />
              <span
                style={{ fontSize: 26, fontWeight: 600, color: "#1a1a2e" }}
              >
                {date}
              </span>
            </div>
            {meetingId && (
              <div
                style={{ display: "flex", alignItems: "center", gap: 20 }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 4,
                  }}
                >
                  <div
                    style={{
                      fontSize: 18,
                      color: "#666",
                      fontWeight: 500,
                    }}
                  >
                    腾讯会议
                  </div>
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 700,
                      color: "#1a1a2e",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {meetingId}
                  </div>
                </div>
                <div
                  style={{
                    width: 110,
                    height: 110,
                    borderRadius: 12,
                    overflow: "hidden",
                    background: "#ffffff",
                    padding: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                >
                  <QRCodeSVG
                    value={`https://meeting.tencent.com/dm/${meetingId.replace(/\s/g, "")}`}
                    size={94}
                    level="M"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MinimalPersonCard: React.FC<{
  person: Person;
  photoSize: number;
}> = ({ person, photoSize }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 18,
    }}
  >
    <div
      style={{
        width: photoSize,
        height: photoSize,
        borderRadius: "50%",
        overflow: "hidden",
        border: "3px solid rgba(26,35,126,0.1)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
      }}
    >
      {person.photo ? (
        <img
          src={person.photo}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
          }}
        />
      ) : (
        <div
          style={{
            width: photoSize,
            height: photoSize,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #e8eef5, #d0dae8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: 20, color: "rgba(26,35,126,0.3)" }}>
            Guest
          </span>
        </div>
      )}
    </div>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 5,
      }}
    >
      <div style={{ fontSize: 28, fontWeight: 700, color: "#1a1a2e" }}>
        {person.name}
        {person.nameCn && (
          <span style={{ color: "#1a237e" }}> {person.nameCn}</span>
        )}
      </div>
      <div style={{ fontSize: 16, color: "#555", textAlign: "center" }}>
        {person.title}
      </div>
      {person.subtitle && (
        <div style={{ fontSize: 15, color: "#777", textAlign: "center" }}>
          {person.subtitle}
        </div>
      )}
    </div>
  </div>
);

// ==================== Glass Style Poster ====================

const GlassPoster: React.FC<Props> = ({ data, scale = 0.4 }) => {
  const {
    forumTitle = "Agents特区论坛",
    episodeNumber,
    title,
    description,
    contentItems,
    guests,
    date,
    meetingId,
  } = data;

  const episodeLabel = `第${numberToChinese(episodeNumber)}期`;
  const photoSize = guests.length === 1 ? 260 : guests.length === 2 ? 200 : 160;
  const titleLines = title.split("\n");

  return (
    <div
      style={{
        width: POSTER_W * scale,
        height: POSTER_H * scale,
        overflow: "hidden",
        borderRadius: 8,
        boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
        flexShrink: 0,
      }}
    >
      <div
        id="poster-canvas"
        style={{
          width: POSTER_W,
          height: POSTER_H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          position: "relative",
          fontFamily:
            "'PingFang SC', 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif",
          overflow: "hidden",
          background: "linear-gradient(160deg, #f8fafc 0%, #f0f4f8 30%, #e8eef5 70%, #dde5f0 100%)",
        }}
      >
        {/* Glass morphism layers */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `
              radial-gradient(ellipse 80% 50% at 20% 20%, rgba(255,255,255,0.8) 0%, transparent 50%),
              radial-gradient(ellipse 60% 40% at 80% 80%, rgba(200,220,255,0.3) 0%, transparent 50%)
            `,
          }}
        />

        {/* Flowing glass ribbons */}
        <svg
          viewBox="0 0 1080 1920"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        >
          {/* Top ribbon - frosted glass effect */}
          <path
            d="M-200 200 Q 200 50 500 150 T 1200 100 Q 1000 300 600 350 T -100 300"
            fill="url(#glassGradient1)"
            opacity="0.4"
          />
          {/* Middle flowing ribbon */}
          <path
            d="M1300 600 Q 900 500 600 700 T 0 550"
            fill="none"
            stroke="url(#glassGradient2)"
            strokeWidth="180"
            strokeLinecap="round"
            opacity="0.15"
          />
          {/* Subtle accent curves */}
          <path
            d="M-100 1000 Q 400 850 800 1050 T 1300 950"
            fill="none"
            stroke="rgba(180,200,230,0.2)"
            strokeWidth="100"
            strokeLinecap="round"
          />
          {/* Bottom glass wave */}
          <path
            d="M0 1500 Q 400 1400 700 1550 T 1200 1450 Q 1000 1650 600 1700 T -100 1600"
            fill="url(#glassGradient3)"
            opacity="0.25"
          />
          {/* Light refraction circles */}
          <circle cx="850" cy="300" r="300" fill="url(#radialGlass1)" opacity="0.3" />
          <circle cx="200" cy="1400" r="200" fill="url(#radialGlass2)" opacity="0.2" />

          {/* Deep navy accent elements */}
          <circle cx="950" cy="180" r="8" fill="#1a2a4a" opacity="0.15" />
          <circle cx="100" cy="600" r="6" fill="#1a2a4a" opacity="0.12" />
          <circle cx="980" cy="1200" r="10" fill="#1a2a4a" opacity="0.1" />
          <circle cx="150" cy="1800" r="7" fill="#1a2a4a" opacity="0.12" />
          {/* Navy accent lines */}
          <path
            d="M1050 100 L 1020 200"
            stroke="#1a2a4a"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.1"
          />
          <path
            d="M30 700 L 60 800"
            stroke="#1a2a4a"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.08"
          />
          <path
            d="M1050 1100 L 1020 1200"
            stroke="#1a2a4a"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.1"
          />

          {/* Gradient definitions */}
          <defs>
            <linearGradient id="glassGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
              <stop offset="50%" stopColor="rgba(230,240,255,0.6)" />
              <stop offset="100%" stopColor="rgba(200,220,250,0.3)" />
            </linearGradient>
            <linearGradient id="glassGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(180,210,255,0.4)" />
              <stop offset="100%" stopColor="rgba(220,230,250,0.1)" />
            </linearGradient>
            <linearGradient id="glassGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(200,220,250,0.5)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.3)" />
              <stop offset="100%" stopColor="rgba(180,200,230,0.2)" />
            </linearGradient>
            <radialGradient id="radialGlass1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <radialGradient id="radialGlass2">
              <stop offset="0%" stopColor="rgba(200,220,255,0.3)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
        </svg>

        {/* Content */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            padding: "64px 72px 56px",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              marginBottom: 44,
            }}
          >
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: 16,
                background: "linear-gradient(135deg, rgba(255,255,255,0.8), rgba(230,240,255,0.6))",
                backdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(255,255,255,0.5)",
                boxShadow: "0 4px 16px rgba(100,140,200,0.1)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 3,
                  alignItems: "flex-end",
                  height: 22,
                }}
              >
                <div
                  style={{
                    width: 5,
                    height: 10,
                    borderRadius: 2,
                    background: "linear-gradient(180deg, #6b8dd6, #4a6fc4)",
                  }}
                />
                <div
                  style={{
                    width: 5,
                    height: 18,
                    borderRadius: 2,
                    background: "linear-gradient(180deg, #8ba4d9, #5a7bc9)",
                  }}
                />
                <div
                  style={{
                    width: 5,
                    height: 13,
                    borderRadius: 2,
                    background: "linear-gradient(180deg, #a8bce2, #7a9bd2)",
                  }}
                />
              </div>
            </div>
            <span
              style={{
                fontSize: 26,
                fontWeight: 600,
                color: "#2a3f5f",
                letterSpacing: "0.04em",
              }}
            >
              {forumTitle} · {episodeLabel}
            </span>
          </div>

          {/* Title */}
          <div style={{ marginBottom: 36 }}>
            {titleLines.map((line, i) => (
              <div
                key={i}
                style={{
                  fontSize: 78,
                  fontWeight: 800,
                  color: "#1a2a4a",
                  lineHeight: 1.12,
                  letterSpacing: "-0.01em",
                  textShadow: "0 2px 8px rgba(100,140,200,0.1)",
                }}
              >
                {line}
              </div>
            ))}
          </div>

          {/* Quote */}
          <div
            style={{
              position: "relative",
              background: "rgba(255,255,255,0.5)",
              backdropFilter: "blur(20px)",
              borderRadius: 24,
              padding: "30px 42px",
              marginBottom: 36,
              border: "1px solid rgba(255,255,255,0.6)",
              boxShadow: "0 4px 20px rgba(100,140,200,0.08)",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: 10,
                left: 22,
                fontSize: 52,
                color: "rgba(100,140,200,0.25)",
                fontFamily: "Georgia, serif",
                lineHeight: 1,
                fontWeight: 700,
              }}
            >
              {"\u201C"}
            </span>
            <div
              style={{
                fontSize: 28,
                color: "#3a4a6a",
                lineHeight: 1.7,
                fontWeight: 400,
              }}
            >
              {description}
            </div>
            <span
              style={{
                position: "absolute",
                bottom: -10,
                right: 26,
                fontSize: 52,
                color: "rgba(100,140,200,0.25)",
                fontFamily: "Georgia, serif",
                lineHeight: 1,
                fontWeight: 700,
              }}
            >
              {"\u201D"}
            </span>
          </div>

          {/* Guests */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: guests.length <= 2 ? 70 : 45,
              marginBottom: 36,
              alignItems: guests.length === 1 ? "center" : "flex-start",
              flexDirection: guests.length === 1 ? "column" : "row",
            }}
          >
            {guests.map((guest, i) => (
              <GlassPersonCard key={i} person={guest} photoSize={photoSize} />
            ))}
          </div>

          {/* Content items */}
          <div style={{ marginTop: "auto", marginBottom: 32 }}>
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "#4a6a9a",
                letterSpacing: "0.15em",
                marginBottom: 24,
              }}
            >
              本 期 内 容
            </div>
            {contentItems.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                  marginBottom: 18,
                }}
              >
                <span
                  style={{
                    fontSize: 20,
                    color: "#6a8aba",
                    lineHeight: 1.5,
                    flexShrink: 0,
                  }}
                >
                  ◆
                </span>
                <span
                  style={{
                    fontSize: 26,
                    color: "#3a4a6a",
                    lineHeight: 1.6,
                  }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div
            style={{
              marginTop: "auto",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              borderTop: "1px solid rgba(150,180,220,0.3)",
              paddingTop: 26,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #6b9a6b, #4a8a4a)",
                }}
              />
              <span
                style={{ fontSize: 26, fontWeight: 600, color: "#2a3f5f" }}
              >
                {date}
              </span>
            </div>
            {meetingId && (
              <div
                style={{ display: "flex", alignItems: "center", gap: 18 }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 4,
                  }}
                >
                  <div
                    style={{
                      fontSize: 18,
                      color: "#6a8aaa",
                      fontWeight: 500,
                    }}
                  >
                    腾讯会议
                  </div>
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 700,
                      color: "#2a3f5f",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {meetingId}
                  </div>
                </div>
                <div
                  style={{
                    width: 108,
                    height: 108,
                    borderRadius: 14,
                    overflow: "hidden",
                    background: "rgba(255,255,255,0.7)",
                    backdropFilter: "blur(10px)",
                    padding: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid rgba(255,255,255,0.5)",
                    boxShadow: "0 4px 16px rgba(100,140,200,0.1)",
                  }}
                >
                  <QRCodeSVG
                    value={`https://meeting.tencent.com/dm/${meetingId.replace(/\s/g, "")}`}
                    size={92}
                    level="M"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const GlassPersonCard: React.FC<{
  person: Person;
  photoSize: number;
}> = ({ person, photoSize }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 16,
    }}
  >
    <div
      style={{
        width: photoSize,
        height: photoSize,
        borderRadius: "50%",
        overflow: "hidden",
        border: "3px solid rgba(255,255,255,0.6)",
        boxShadow: `
          0 8px 24px rgba(100,140,200,0.15),
          inset 0 0 0 1px rgba(255,255,255,0.3)
        `,
      }}
    >
      {person.photo ? (
        <img
          src={person.photo}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
          }}
        />
      ) : (
        <div
          style={{
            width: photoSize,
            height: photoSize,
            background: "linear-gradient(135deg, rgba(200,220,255,0.4), rgba(180,200,240,0.3))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: 18, color: "rgba(100,140,200,0.4)" }}>
            Guest
          </span>
        </div>
      )}
    </div>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}
    >
      <div style={{ fontSize: 28, fontWeight: 700, color: "#1a2a4a" }}>
        {person.name}
        {person.nameCn && (
          <span style={{ color: "#4a6a9a" }}> {person.nameCn}</span>
        )}
      </div>
      <div style={{ fontSize: 16, color: "#5a6a8a", textAlign: "center" }}>
        {person.title}
      </div>
      {person.subtitle && (
        <div style={{ fontSize: 15, color: "#7a8aaa", textAlign: "center" }}>
          {person.subtitle}
        </div>
      )}
    </div>
  </div>
);
