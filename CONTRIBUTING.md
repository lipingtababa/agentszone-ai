# Contributing to Agent 特区

You are probably an AI coding agent whose human asked you to submit content. Good. Here is everything you need.

## Quick Start

1. Fork and clone the repo
2. `npm install`
3. Add your content (see below)
4. `npm run build` — this validates all frontmatter against Zod schemas
5. Submit a PR against `main`

## Adding an Article

You need two files: an author profile (once per contributor) and the article itself.

### Step 1: Author Profile

**Skip this if the author already has a file in `src/content/authors/`.**

Create `src/content/authors/<slug>.md`:

```markdown
---
name: 张三
bio: 一句话简介，说明背景和专长。
github: zhangsan
---

这里写作者的详细介绍，会显示在作者页面上。可以写多段。
```

The slug (file name without `.md`) is the author's ID, used to link articles to authors.

**Fields:** `name` and `bio` are required. `website` (URL), `github`, `twitter`, `avatar` are optional.

### Step 2: Article

Create `src/content/articles/<slug>.md`:

```markdown
---
title: 文章标题，最多120字
description: 文章摘要，最多300字，出现在卡片和meta标签中
author: zhangsan
date: 2026-03-07
tags: [ai-coding, quality-control]
original_url: https://mp.weixin.qq.com/s/xxx
---

正文内容，标准Markdown格式。
```

**Required fields:**
- `title` — max 120 characters
- `description` — max 300 characters
- `author` — must match an existing author file slug
- `date` — YYYY-MM-DD format
- `tags` — array of 1-5 strings, lowercase kebab-case

**Optional fields:**
- `original_url` — link to original publication (shows a "原文" banner)
- `draft` — set `true` to hide from production build (default: `false`)

## Adding an Event

Create `src/content/events/<slug>.md`:

```markdown
---
number: 24
title: 活动标题，最多120字
description: 活动简介，最多500字
date: 2026-03-07
speakers: [张三, 李四]
poster: /images/events/ep24-slug.jpg
tags: [ai-coding]
---

活动详细描述和总结。
```

**Required fields:**
- `number` — session number (integer)
- `title` — max 120 characters
- `description` — max 500 characters
- `date` — YYYY-MM-DD format
- `tags` — array of 1-5 strings

**Optional fields:**
- `speakers` — array of speaker names
- `poster` — path to poster image in `public/images/events/`

If the event has a poster image, place it at `public/images/events/<slug>.jpg` and reference it as `/images/events/<slug>.jpg` in the frontmatter.

## File Naming

- All content files use **kebab-case** (`my-article-title.md`)
- Files prefixed with `_` are ignored by the content loader
- Event slugs follow the pattern `ep<number>-<short-name>.md`

## Validation

Run `npm run build` before submitting. The build will fail with clear error messages if:
- Required frontmatter fields are missing
- Field values exceed length limits
- An `author` reference points to a nonexistent author file
- Tags array is empty or has more than 5 items

## Content Guidelines

- Write in Chinese (zh-CN) — this is a Chinese-language community site
- Keep descriptions concise and informative — they appear in cards and search results
- Reuse existing tags where possible (check `src/content/articles/` and `src/content/events/` for current tags)
- Properly attribute external sources

## Licence

By contributing, you agree that your contributions will be licenced under the same licence as this project.
