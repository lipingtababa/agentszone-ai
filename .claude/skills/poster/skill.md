---
name: poster
description: Prepare event poster - collect details, create event record, open poster generator
tools: Read, Write, Edit, Glob, Grep, Bash, AskUserQuestion, WebFetch, WebSearch
model: inherit
---

# Poster: Event Poster Preparation

*Collect event details, create the event record, and open the poster generator with pre-filled data.*

## Workflow

### Step 1: Collect event information

Ask the user for ALL of the following before doing anything else:

1. **期数** (episode number) — check `src/content/events/` for the latest episode number and suggest the next one
2. **标题** — the main topic/title of the sharing session
3. **内容简介** — a short description of what will be discussed
4. **本期内容** — bullet points of specific topics (list)
5. **嘉宾信息** — for each guest:
   - 姓名 (name)
   - 简介 (title/bio)
   - 补充信息 (subtitle, optional)
6. **时间** — date and time (default: next Saturday 20:00)
7. **腾讯会议号** — meeting ID (optional, can be added later)

Ask all questions in a single message. Wait for the user to provide all details before proceeding.

### Step 1.5: Fill in missing guest details

If the user only provides a guest name (or partial info), look up their details:

1. **Local authors** — search `src/content/authors/*.md` for matching name, bio, and other details
2. **agentszone.ai** — fetch `https://agentszone.ai/authors` or `https://agentszone.ai/en/authors` to find the guest's profile
3. **aichat** — search aichat for the guest name to find relevant context

Use what you find to fill in:
- English name / Chinese name (from author profile)
- Bio/title (from author `bio` field)
- Any notable subtitle (from author body text — pick the most distinctive one-liner)

Show the user what you found and confirm before proceeding.

### Step 2: Create event record

Create `src/content/events/ep{number}-{slug}.md` with frontmatter:

```yaml
---
number: {episode_number}
title: "{title}"
description: "{description}"
date: {YYYY-MM-DD}
speakers:
  - "{guest_name}"
tags:
  - {relevant_tags}
---
```

Check existing events for tag conventions and formatting patterns.

### Step 3: Open poster generator

Build the poster URL with query params and open it in the browser:

```
http://localhost:4321/poster?ep={number}&title={url_encoded_title}&desc={url_encoded_desc}&items={item1|item2|item3}&date={ISO_datetime}&meetingId={meeting_id}&guest={name;nameCn;title;subtitle}
```

Query param format:
- `ep` — episode number
- `title` — main title (use `\n` for line breaks in the title)
- `desc` — description text
- `items` — pipe-separated content items
- `date` — ISO datetime (e.g. `2026-03-28T20:00`)
- `meetingId` — Tencent meeting ID (omit if not provided)
- `guest` — semicolon-separated: `name;nameCn;title;subtitle` (repeat param for multiple guests)

Before opening, check if dev server is running. If not, start it with `npm run dev` in the background.

Then open the URL:
```bash
open "http://localhost:4321/poster?..."
```

Tell the user the poster page is open and they can:
- Upload guest photos
- Fine-tune any text
- Download the PNG when ready
