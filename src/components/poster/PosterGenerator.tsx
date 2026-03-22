import React, { useState, useCallback } from "react";
import { PosterPreview, type PosterData, type Person } from "./PosterPreview";

import { toPng } from "html-to-image";

const defaultData: PosterData = {
  forumTitle: "Agents特区论坛",
  episodeNumber: 17,
  title: "跨境电商行业的\nSOP改造Skill\n机遇和挑战",
  description:
    "当AI席卷而来，特别是OpenClaw开启全民养虾之后，跨境行业如何迎接变化？纯干货分享SOP转向Skill之后如何改造，借鉴经验进行其他行业赋能。",
  contentItems: [
    "跨境行业中如何进行SOP到Skill的改造？",
    "跨境行业Skill改造中的问题和实战经验分享",
    "未来Agent时代各行业该何去何从？",
  ],
  guests: [
    {
      name: "Axton Wang",
      nameCn: "王帅辉",
      title: "10+年互联网架构师，跨境AI从业者",
      subtitle: "日耗费10亿Token",
    },
  ],
  date: "2026.03.22 (周日) 20:00",
  meetingId: "740 886 774",
};

export const PosterGenerator: React.FC = () => {
  const [data, setData] = useState<PosterData>(defaultData);
  const [downloading, setDownloading] = useState(false);

  const update = useCallback(
    (patch: Partial<PosterData>) => setData((d) => ({ ...d, ...patch })),
    []
  );

  const updateGuest = useCallback(
    (index: number, patch: Partial<Person>) =>
      setData((d) => ({
        ...d,
        guests: d.guests.map((g, i) => (i === index ? { ...g, ...patch } : g)),
      })),
    []
  );

  const addGuest = useCallback(
    () =>
      setData((d) => ({
        ...d,
        guests: [...d.guests, { name: "", title: "" }],
      })),
    []
  );

  const removeGuest = useCallback(
    (index: number) =>
      setData((d) => ({
        ...d,
        guests: d.guests.filter((_, i) => i !== index),
      })),
    []
  );

  const handleGuestPhoto = useCallback(
    (index: number, file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateGuest(index, { photo: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    },
    [updateGuest]
  );

  const handleDownload = useCallback(async () => {
    const el = document.getElementById("poster-canvas");
    if (!el) return;
    setDownloading(true);
    try {
      // Remove scale transform to capture at full 1080x1920
      const origTransform = el.style.transform;
      el.style.transform = "none";
      const url = await toPng(el, {
        width: 1080,
        height: 1920,
        pixelRatio: 1,
        cacheBust: true,
      });
      el.style.transform = origTransform;
      const link = document.createElement("a");
      link.download = `poster-ep${data.episodeNumber}.png`;
      link.href = url;
      link.click();
    } catch (err) {
      console.error("Failed to generate poster:", err);
    } finally {
      setDownloading(false);
    }
  }, [data.episodeNumber]);

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid var(--color-surface-border)",
    background: "var(--color-surface)",
    color: "var(--color-text-primary)",
    fontSize: 14,
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 13,
    fontWeight: 500,
    color: "var(--color-text-muted)",
    marginBottom: 4,
  };

  return (
    <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
      {/* Form */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          maxHeight: "85vh",
          overflowY: "auto",
          paddingRight: 8,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* 期数 */}
        <div>
          <label style={labelStyle}>期数</label>
          <input
            style={{ ...inputStyle, width: 100 }}
            type="number"
            min={1}
            value={data.episodeNumber}
            onChange={(e) =>
              update({ episodeNumber: parseInt(e.target.value) || 1 })
            }
          />
        </div>

        {/* 大标题 */}
        <div>
          <label style={labelStyle}>大标题（换行用 \n）</label>
          <input
            style={inputStyle}
            value={data.title.replace(/\n/g, "\\n")}
            onChange={(e) =>
              update({ title: e.target.value.replace(/\\n/g, "\n") })
            }
          />
        </div>

        {/* 内容简介 */}
        <div>
          <label style={labelStyle}>内容简介</label>
          <textarea
            style={{ ...inputStyle, resize: "vertical" }}
            rows={3}
            value={data.description}
            onChange={(e) => update({ description: e.target.value })}
          />
        </div>

        {/* 本期内容 */}
        <div>
          <label style={labelStyle}>本期内容（每行一条）</label>
          <textarea
            style={{ ...inputStyle, resize: "vertical" }}
            rows={4}
            placeholder={"跨境行业中如何进行SOP到Skill的改造？\n跨境行业Skill改造中的问题和实战经验分享\n未来Agent时代各行业该何去何从？"}
            value={data.contentItems.join("\n")}
            onChange={(e) =>
              update({
                contentItems: e.target.value
                  .split("\n")
                  .filter((l) => l.trim()),
              })
            }
          />
        </div>

        {/* 嘉宾 */}
        {data.guests.map((guest, i) => (
          <fieldset
            key={i}
            style={{
              border: "1px solid var(--color-surface-border)",
              borderRadius: 10,
              padding: 16,
              position: "relative",
            }}
          >
            <legend
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--color-text-primary)",
                padding: "0 8px",
              }}
            >
              嘉宾 {data.guests.length > 1 ? i + 1 : ""}
            </legend>
            {data.guests.length > 1 && (
              <button
                onClick={() => removeGuest(i)}
                style={{
                  position: "absolute",
                  top: -10,
                  right: 10,
                  background: "none",
                  border: "none",
                  color: "var(--color-text-muted)",
                  cursor: "pointer",
                  fontSize: 16,
                }}
                title="删除嘉宾"
              >
                ✕
              </button>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <label style={labelStyle}>照片</label>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {guest.photo && (
                    <img
                      src={guest.photo}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        objectFit: "cover",
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    style={inputStyle}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleGuestPhoto(i, f);
                    }}
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>简介（每行一条信息）</label>
                <textarea
                  style={{ ...inputStyle, resize: "vertical" }}
                  rows={4}
                  placeholder={"Axton Wang 王帅辉\n10+年互联网架构师，跨境AI从业者\n日耗费10亿Token"}
                  value={personToText(guest)}
                  onChange={(e) => {
                    const p = textToPerson(e.target.value);
                    updateGuest(i, p);
                  }}
                />
                <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
                  第一行：姓名（英文名 中文名），后续行：简介
                </span>
              </div>
            </div>
          </fieldset>
        ))}
        <button
          onClick={addGuest}
          style={{
            background: "none",
            border: "1px dashed var(--color-surface-border)",
            borderRadius: 10,
            padding: "10px",
            color: "var(--color-text-muted)",
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          + 添加嘉宾
        </button>

        {/* 时间 */}
        <div>
          <label style={labelStyle}>时间</label>
          <input
            type="datetime-local"
            style={inputStyle}
            value={dateToLocal(data.date)}
            onChange={(e) => {
              const v = e.target.value;
              if (v) {
                const d = new Date(v);
                const yyyy = d.getFullYear();
                const mm = String(d.getMonth() + 1).padStart(2, "0");
                const dd = String(d.getDate()).padStart(2, "0");
                const hh = String(d.getHours()).padStart(2, "0");
                const mi = String(d.getMinutes()).padStart(2, "0");
                const dayNames = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
                const day = dayNames[d.getDay()];
                update({ date: `${yyyy}.${mm}.${dd} (${day}) ${hh}:${mi}` });
              }
            }}
          />
        </div>

        {/* 腾讯会议 */}
        <div>
          <label style={labelStyle}>腾讯会议号码</label>
          <input
            style={inputStyle}
            value={data.meetingId || ""}
            onChange={(e) =>
              update({ meetingId: e.target.value || undefined })
            }
          />
          <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
            二维码将根据会议号自动生成
          </span>
        </div>

        {/* Download */}
        <button
          onClick={handleDownload}
          disabled={downloading}
          style={{
            width: "100%",
            padding: "12px 24px",
            borderRadius: 10,
            border: "none",
            background: downloading
              ? "var(--color-text-muted)"
              : "linear-gradient(135deg, #6b5ce7, #a855f7)",
            color: "#ffffff",
            fontSize: 16,
            fontWeight: 600,
            cursor: downloading ? "not-allowed" : "pointer",
            marginBottom: 24,
          }}
        >
          {downloading ? "生成中..." : "下载海报 PNG"}
        </button>
      </div>

      {/* Preview */}
      <div style={{ position: "sticky", top: 20, flexShrink: 0, maxHeight: "90vh", overflow: "auto" }}>
        <PosterPreview data={data} scale={0.32} />
      </div>
    </div>
  );
};

function textToPerson(text: string) {
  const lines = text.split("\n").filter((l) => l.trim());
  const nameLine = lines[0] || "";
  const parts = nameLine.trim().split(/\s+/);
  let name = nameLine.trim();
  let nameCn: string | undefined;
  const hasCjk = /[\u4e00-\u9fff]/.test(nameLine);
  const hasLatin = /[a-zA-Z]/.test(nameLine);
  if (hasCjk && hasLatin && parts.length >= 2) {
    const latinParts: string[] = [];
    const cjkParts: string[] = [];
    for (const p of parts) {
      if (/[\u4e00-\u9fff]/.test(p)) {
        cjkParts.push(p);
      } else {
        latinParts.push(p);
      }
    }
    if (latinParts.length > 0 && cjkParts.length > 0) {
      name = latinParts.join(" ");
      nameCn = cjkParts.join("");
    }
  }
  return {
    name,
    nameCn,
    title: lines[1] || "",
    subtitle: lines.slice(2).join("\n") || undefined,
  };
}

function dateToLocal(display: string): string {
  const m = display.match(/(\d{4})\.(\d{2})\.(\d{2}).*?(\d{2}):(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}`;
  return "";
}

function personToText(person: Person): string {
  const nameLine = person.nameCn
    ? `${person.name} ${person.nameCn}`
    : person.name;
  const lines = [nameLine, person.title];
  if (person.subtitle) lines.push(person.subtitle);
  return lines.join("\n");
}

export default PosterGenerator;
