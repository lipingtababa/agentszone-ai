import React, { useState, useCallback } from "react";
import { PosterPreview, type PosterData } from "./PosterPreview";
import { toPng } from "html-to-image";

const defaultData: PosterData = {
  forumTitle: "Agents特区论坛",
  episodeNumber: 17,
  title: "跨境电商行业的\nSOP改造Skill\n机遇和挑战",
  description:
    "当AI席卷而来，特别是OpenClaw开启全民养虾之后，跨境行业如何迎接变化？纯干货分享SOP转向Skill之后如何改造，借鉴经验进行其他行业赋能。",
  contentItems: [
    { tag: "SOP→Skill", text: "跨境行业中如何进行SOP到Skill的改造？" },
    { tag: "经验分享", text: "跨境行业Skill改造中的问题和实战经验分享" },
    { tag: "未来展望", text: "未来Agent时代各行业该何去何从？" },
  ],
  speaker: {
    name: "Axton Wang",
    nameCn: "王帅辉",
    title: "10+年互联网架构师，跨境AI从业者",
    subtitle: "日耗费10亿Token",
  },
  date: "2026.03.22 (周日)",
  timezones:
    "北京 CST 20:00-21:30 | 欧洲 CET 13:00-14:30 | 美东 EDT 08:00-09:30 | 美西 PDT 05:00-06:30",
  meetingId: "740 886 774",
};

export const PosterGenerator: React.FC = () => {
  const [data, setData] = useState<PosterData>(defaultData);
  const [hasHost, setHasHost] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const update = useCallback(
    (patch: Partial<PosterData>) => setData((d) => ({ ...d, ...patch })),
    []
  );

  const handlePhotoUpload = useCallback(
    (target: "speaker" | "host", file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        if (target === "speaker") {
          setData((d) => ({ ...d, speaker: { ...d.speaker, photo: url } }));
        } else {
          setData((d) => ({
            ...d,
            host: { ...(d.host || { name: "", title: "" }), photo: url },
          }));
        }
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const handleQrUpload = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        update({ meetingQrCode: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    },
    [update]
  );

  const handleDownload = useCallback(async () => {
    const el = document.getElementById("poster-canvas");
    if (!el) return;
    setDownloading(true);
    try {
      const url = await toPng(el, {
        width: 1080,
        height: 1920,
        pixelRatio: 1,
        cacheBust: true,
      });
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

        {/* 分享嘉宾 */}
        <fieldset
          style={{
            border: "1px solid var(--color-surface-border)",
            borderRadius: 10,
            padding: 16,
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
            分享嘉宾
          </legend>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div>
              <label style={labelStyle}>照片</label>
              <input
                type="file"
                accept="image/*"
                style={inputStyle}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handlePhotoUpload("speaker", f);
                }}
              />
            </div>
            <div>
              <label style={labelStyle}>简介（每行一条信息）</label>
              <textarea
                style={{ ...inputStyle, resize: "vertical" }}
                rows={4}
                placeholder={"Axton Wang 王帅辉\n10+年互联网架构师，跨境AI从业者\n日耗费10亿Token"}
                value={personToText(data.speaker)}
                onChange={(e) => {
                  const p = textToPerson(e.target.value);
                  setData((d) => ({ ...d, speaker: { ...d.speaker, ...p } }));
                }}
              />
              <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
                第一行：姓名（英文名 中文名），后续行：简介
              </span>
            </div>
          </div>
        </fieldset>

        {/* 主持人 */}
        <fieldset
          style={{
            border: "1px solid var(--color-surface-border)",
            borderRadius: 10,
            padding: 16,
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
            主持人（可选）
          </legend>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              marginBottom: hasHost ? 12 : 0,
            }}
          >
            <input
              type="checkbox"
              checked={hasHost}
              onChange={() => {
                setHasHost((v) => {
                  if (!v) {
                    setData((d) => ({
                      ...d,
                      host: { name: "", title: "" },
                    }));
                  } else {
                    setData((d) => ({ ...d, host: undefined }));
                  }
                  return !v;
                });
              }}
            />
            <span style={{ fontSize: 14, color: "var(--color-text-secondary)" }}>
              添加主持人
            </span>
          </label>
          {hasHost && data.host && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <label style={labelStyle}>照片</label>
                <input
                  type="file"
                  accept="image/*"
                  style={inputStyle}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handlePhotoUpload("host", f);
                  }}
                />
              </div>
              <div>
                <label style={labelStyle}>简介（每行一条信息）</label>
                <textarea
                  style={{ ...inputStyle, resize: "vertical" }}
                  rows={3}
                  placeholder={"Ryan\n全栈工程师\ne2e 测试方案探索者"}
                  value={personToText(data.host)}
                  onChange={(e) => {
                    const p = textToPerson(e.target.value);
                    setData((d) => ({
                      ...d,
                      host: { ...(d.host || { name: "", title: "" }), ...p },
                    }));
                  }}
                />
                <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
                  第一行：姓名，后续行：简介
                </span>
              </div>
            </div>
          )}
        </fieldset>

        {/* 时间 */}
        <div>
          <label style={labelStyle}>时间</label>
          <input
            style={inputStyle}
            value={data.date}
            onChange={(e) => update({ date: e.target.value })}
          />
        </div>

        {/* 腾讯会议 */}
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>腾讯会议号码</label>
            <input
              style={inputStyle}
              value={data.meetingId || ""}
              onChange={(e) =>
                update({ meetingId: e.target.value || undefined })
              }
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>会议二维码</label>
            <input
              type="file"
              accept="image/*"
              style={inputStyle}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleQrUpload(f);
              }}
            />
          </div>
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
      <div style={{ position: "sticky", top: 20, flexShrink: 0 }}>
        <PosterPreview data={data} scale={0.38} />
      </div>
    </div>
  );
};

/** Parse a multi-line text block into a Person object.
 *  Line 1: name (if contains space, split into name + nameCn)
 *  Line 2: title
 *  Line 3+: subtitle
 */
function textToPerson(text: string) {
  const lines = text.split("\n").filter((l) => l.trim());
  const nameLine = lines[0] || "";
  const parts = nameLine.trim().split(/\s+/);
  let name = nameLine.trim();
  let nameCn: string | undefined;
  // If has both latin and CJK, split them
  const hasCjk = /[\u4e00-\u9fff]/.test(nameLine);
  const hasLatin = /[a-zA-Z]/.test(nameLine);
  if (hasCjk && hasLatin && parts.length >= 2) {
    // Find where CJK starts
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

function personToText(person: { name: string; nameCn?: string; title: string; subtitle?: string }): string {
  const nameLine = person.nameCn
    ? `${person.name} ${person.nameCn}`
    : person.name;
  const lines = [nameLine, person.title];
  if (person.subtitle) lines.push(person.subtitle);
  return lines.join("\n");
}

export default PosterGenerator;
