---
title: "Alibaba's qwen-code Was Too Hasty"
description: Alibaba's qwen-code CLI is a fork of Google's Gemini CLI. Legally fine under Apache 2.0, but from a product management perspective, this was a rash decision. Users discovered the /init command still generates GEMINI.md instead of QWEN.md — a leftover from an incomplete fork audit.
author: magong
date: 2025-08-09
tags: [ai-coding, industry-analysis]
original_url: https://mp.weixin.qq.com/s/6WJei6N398JAY2C6nZ3mUQ
---

Alibaba's qwen-code CLI is a fork of Google's Gemini CLI. The latter is licensed under the permissive Apache 2.0, so Alibaba's fork is legally completely fine.

But compliance aside, there are quite a few problems.

On the user experience front, users reported that the tool's `/init` command generates a `GEMINI.md` file — the configuration file Gemini models need — rather than the `QWEN.md` that qwen requires. This is clearly a leftover from an incomplete fork audit.

> What happened?
> While exploring the CLI, I noticed that the /init command generates a GEMINI.md file.
> What did you expect to happen?
> The /init command should ideally generate a QWEN.md.
>
> https://github.com/QwenLM/qwen-code/issues/231

Beyond that, product management will face significant challenges. Although Google's project is open source, it doesn't use a community-collaborative development model and essentially accepts no external contributions. The top few contributors are all Google employees. This means Gemini CLI will inevitably not accommodate the needs of non-Google models.

Given this, qwen must either invest equivalent resources to maintain a fully incompatible fork — or silently follow wherever Google goes. The latter is clearly unacceptable, and the former defeats the purpose of saving costs.

Users have also keenly noticed that the Alibaba team isn't maintaining qwen-code very actively. They've even sarcastically prodded "China's first CLI" not to stop updating.

![image-1](/images/articles/qwen-code-too-hasty/1.jpg)

This brings up a third problem: brand image. Users naturally wonder — a large company building its client software on top of a source it doesn't control, does that mean they have limited resources and can't invest, or that they don't care enough to invest?

One user on Twitter deliberately dug out every place qwen-code mentions Gemini and used it to mock qwen's marketing. This person clearly isn't a qwen competitor — they were just being pedantic. But they made one point dead on:

"If you copy Gemini CLI into qwen-code and can't even clean up all the Gemini references, I'm not going to take your ambitions seriously."

![image-2](/images/articles/qwen-code-too-hasty/2.jpg)

The truth is, Gemini CLI itself is poorly executed — its issues are flooded with bug reports, drowning out feature requests. Google's models aren't competitive in coding either, and there's no way this clunky CLI becomes a de facto standard. Forking it for qwen-code is like being born to the wrong parent and then undergoing surgery to fix it — deliberately taking an unnecessary detour.

In summary: from a product management perspective, basing qwen-code on a Gemini CLI fork was a rash decision. It results in client-side quality that doesn't match qwen's strong model competitiveness.

If Alibaba genuinely doesn't want to build the client itself (which, with AI assistance, wouldn't cost that much), they'd be better off sponsoring a community-led CLI. Open Code or Crush — either would be a better choice than Gemini CLI.
