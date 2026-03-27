import React, { useState, useCallback, useEffect } from "react";
import { PosterPreview, type PosterData, type Person, type PosterStyle } from "./PosterPreview";

import { toPng } from "html-to-image";

const defaultData: PosterData = {
  forumTitle: "Agents特区论坛",
  episodeNumber: 18,
  title: "AI客服分享",
  description:
    "深入探讨AI客服的业务背景、LLM时代AI客服的解决方案以及在LLM时代AI客服领域仍遗留的问题。",
  contentItems: [
    "AI客服业务背景和前LLM时代的问题",
    "LLM时代AI客服的解决方案",
    "AI客服在LLM时代下仍遗留的问题",
  ],
  guests: [
    {
      name: "陈浩",
      title: "架构师，研发系吉普赛人，现客服行业从业者",
      subtitle: "曾从事金融、政务、财务、云计算、电商等行业",
    },
  ],
  date: "2026.03.28 (周六) 20:00-21:30",
  meetingId: "700 360 080",
  style: "dark" as PosterStyle,
};

export const PosterGenerator: React.FC = () => {
  const [data, setData] = useState<PosterData>(defaultData);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const patch: Partial<PosterData> = {};

    const ep = params.get("ep");
    if (ep) patch.episodeNumber = parseInt(ep) || defaultData.episodeNumber;

    const title = params.get("title");
    if (title) patch.title = title.replace(/\\n/g, "\n");

    const desc = params.get("desc");
    if (desc) patch.description = desc;

    const items = params.get("items");
    if (items) patch.contentItems = items.split("|").filter((s) => s.trim());

    const date = params.get("date");
    if (date) {
      const display = isoToDisplay(date);
      if (display) patch.date = display;
    }

    const meetingId = params.get("meetingId");
    if (meetingId) patch.meetingId = meetingId;

    const guestParams = params.getAll("guest");
    if (guestParams.length > 0) {
      patch.guests = guestParams.map((g) => {
        const [name, nameCn, title, subtitle] = g.split(";");
        const person: Person = { name: name || "", title: title || "" };
        if (nameCn) person.nameCn = nameCn;
        if (subtitle) person.subtitle = subtitle;
        return person;
      });
    }

    if (Object.keys(patch).length > 0) {
      setData((d) => ({ ...d, ...patch }));
    }
  }, []);

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
        {/* Style switcher */}
        <div>
          <label style={labelStyle}>海报风格</label>
          <div
            style={{
              display: "flex",
              gap: 8,
            }}
          >
            <button
              onClick={() => update({ style: "dark" })}
              style={{
                flex: 1,
                padding: "10px 8px",
                borderRadius: 8,
                border: data.style === "dark" ? "2px solid #6b5ce7" : "1px solid var(--color-surface-border)",
                background: data.style === "dark" ? "linear-gradient(135deg, #2a1a5e, #1e1565)" : "var(--color-surface)",
                color: data.style === "dark" ? "#fff" : "var(--color-text-primary)",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
              深色科技
            </button>
            <button
              onClick={() => update({ style: "minimal" })}
              style={{
                flex: 1,
                padding: "10px 8px",
                borderRadius: 8,
                border: data.style === "minimal" ? "2px solid #1a237e" : "1px solid var(--color-surface-border)",
                background: data.style === "minimal" ? "#f5f5f5" : "var(--color-surface)",
                color: data.style === "minimal" ? "#1a237e" : "var(--color-text-primary)",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
              极简流线
            </button>
            <button
              onClick={() => update({ style: "glass" })}
              style={{
                flex: 1,
                padding: "10px 8px",
                borderRadius: 8,
                border: data.style === "glass" ? "2px solid #4a6a9a" : "1px solid var(--color-surface-border)",
                background: data.style === "glass" ? "linear-gradient(135deg, rgba(200,220,255,0.3), rgba(230,240,250,0.5))" : "var(--color-surface)",
                color: data.style === "glass" ? "#2a3f5f" : "var(--color-text-primary)",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </svg>
              玻璃光影
            </button>
          </div>
        </div>

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
                const display = isoToDisplay(v);
                if (display) update({ date: display });
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

function isoToDisplay(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  const dayNames = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  const day = dayNames[d.getDay()];
  return `${yyyy}.${mm}.${dd} (${day}) ${hh}:${mi}`;
}

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
