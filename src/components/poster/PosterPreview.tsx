import React, { type CSSProperties } from "react";
import { QRCodeSVG } from "qrcode.react";

export interface Person {
  name: string;
  nameCn?: string;
  title: string;
  subtitle?: string;
  photo?: string;
}

export interface PosterData {
  forumTitle?: string;
  episodeNumber: number;
  title: string;
  description: string;
  contentItems: string[];
  guests: Person[];
  date: string;
  meetingId?: string;
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
  } = data;

  const episodeLabel = `第${numberToChinese(episodeNumber)}期`;
  const photoSize = guests.length === 1 ? 280 : guests.length === 2 ? 220 : 170;
  const titleLines = title.split("\n");

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
            "'PingFang SC', 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(170deg, #2a1a5e 0%, #1e1565 20%, #191060 40%, #14104a 65%, #0e0c38 100%)",
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
              "radial-gradient(circle, rgba(100,60,200,0.25) 0%, transparent 70%)",
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
                borderRadius: 16,
                background: "rgba(255,255,255,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 4,
                  alignItems: "flex-end",
                  height: 26,
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 11,
                    borderRadius: 2,
                    background: "linear-gradient(180deg, #ff6b9d, #c44dff)",
                  }}
                />
                <div
                  style={{
                    width: 6,
                    height: 20,
                    borderRadius: 2,
                    background: "linear-gradient(180deg, #6b8eff, #4dc4ff)",
                  }}
                />
                <div
                  style={{
                    width: 6,
                    height: 15,
                    borderRadius: 2,
                    background: "linear-gradient(180deg, #ff6b9d, #ff9d4d)",
                  }}
                />
              </div>
            </div>
            <span
              style={{
                fontSize: 28,
                fontWeight: 600,
                color: "#ff9d4d",
                letterSpacing: "0.03em",
              }}
            >
              {forumTitle}——{episodeLabel}
            </span>
          </div>

          {/* Title */}
          <div style={{ marginBottom: 30 }}>
            {titleLines.map((line, i) => (
              <div
                key={i}
                style={{
                  fontSize: 88,
                  fontWeight: 900,
                  color: "#ffffff",
                  lineHeight: 1.15,
                  letterSpacing: "0.02em",
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
              background: "rgba(80,120,220,0.12)",
              borderRadius: 20,
              padding: "28px 40px",
              marginBottom: 32,
            }}
          >
            <span
              style={{
                position: "absolute",
                top: 6,
                left: 18,
                fontSize: 64,
                color: "rgba(100,180,255,0.45)",
                fontFamily: "Georgia, serif",
                lineHeight: 1,
                fontWeight: 700,
              }}
            >
              {"\u201C"}
            </span>
            <div
              style={{
                fontSize: 34,
                color: "rgba(210,218,255,0.9)",
                lineHeight: 1.7,
                fontWeight: 400,
              }}
            >
              {description}
            </div>
            <span
              style={{
                position: "absolute",
                bottom: -12,
                right: 24,
                fontSize: 64,
                color: "rgba(100,180,255,0.45)",
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
          <div style={{ marginBottom: 36, marginTop: "auto" }}>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#ff9d4d",
                letterSpacing: "0.2em",
                marginBottom: 20,
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
                  gap: 12,
                  marginBottom: 14,
                }}
              >
                <span
                  style={{
                    fontSize: 20,
                    color: "#ff9d4d",
                    lineHeight: 1.5,
                    flexShrink: 0,
                  }}
                >
                  ●
                </span>
                <span
                  style={{
                    fontSize: 22,
                    color: "rgba(210,218,255,0.85)",
                    lineHeight: 1.5,
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
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: 24,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: "#4ade80",
                }}
              />
              <span
                style={{ fontSize: 26, fontWeight: 700, color: "#ffffff" }}
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
                      fontSize: 20,
                      color: "rgba(210,218,255,0.6)",
                      fontWeight: 500,
                    }}
                  >
                    腾讯会议
                  </div>
                  <div
                    style={{
                      fontSize: 30,
                      fontWeight: 700,
                      color: "#ffffff",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {meetingId}
                  </div>
                </div>
                <div
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 10,
                    overflow: "hidden",
                    background: "#ffffff",
                    padding: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <QRCodeSVG
                    value={`https://meeting.tencent.com/dm/${meetingId.replace(/\s/g, "")}`}
                    size={104}
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
        gap: 4,
      }}
    >
      <div style={{ fontSize: 30, fontWeight: 700, color: "#ffffff" }}>
        {person.name}
        {person.nameCn && (
          <span style={{ color: "#ff9d4d" }}> {person.nameCn}</span>
        )}
      </div>
      <div style={{ fontSize: 17, color: "rgba(210,218,255,0.65)", textAlign: "center" }}>
        {person.title}
      </div>
      {person.subtitle && (
        <div style={{ fontSize: 16, color: "rgba(210,218,255,0.5)", textAlign: "center" }}>
          {person.subtitle}
        </div>
      )}
    </div>
  </div>
);
