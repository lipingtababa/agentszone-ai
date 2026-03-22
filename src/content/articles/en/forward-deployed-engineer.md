---
title: "Forward Deployed Engineer: Silicon Valley's Rebranded Delivery Consultant"
description: In 2025, Silicon Valley is swept up in a Forward Deployed Engineer (FDE) hiring frenzy. OpenAI, Anthropic, Databricks and others are all recruiting FDEs. Is this genuinely new, or just a fancy name for the traditional delivery engineer?
author: magong
date: 2025-12-15
tags: [ai-thinking, industry-analysis]
original_url: https://mp.weixin.qq.com/s/l73Z3FTkuEbwYqm6-I5Fpg
---

In 2025, Silicon Valley suddenly erupted in a Forward Deployed Engineer (FDE) hiring frenzy. OpenAI planned to hire 50 FDEs by year's end. Anthropic, Databricks, and Google DeepMind are all recruiting. LinkedIn FDE job postings surged 800%, and industry media called it "the hottest role of the AI era."

My first reaction: isn't this just what we called a "delivery engineer" in China a decade ago? On-site implementation, post-sale support, pre-sales engineering — give it a fancier name and suddenly it's Silicon Valley "innovation."

What's even more interesting: I looked up Palantir, the concept's birthplace, and found their former CFO Colin Anderson publicly criticized the FDE model as "lighting equity on fire," noting "spectacular pyres of time and treasure and travel expenses that amounted to nothing."

If their own people can't stomach it, how did it become an industry-wide celebrated "innovation"?

This reminds me of China's "Middle Platform" (中台) craze. Alibaba introduced the concept in 2015, every major tech company followed within five years, and the industry mantra became "build a middle platform or die." By 2023, Alibaba itself abandoned the strategy.

I'll boldly predict: Forward Deployed Engineer will be the next Middle Platform — a concept that looks great on paper, has serious problems in practice, and will ultimately be discarded by the industry.

## FDE: What Is It Really? The Emperor's New Clothes

Let's start with Palantir's official definition of FDE:

> Deltas are part of Business Development, and their mandate is to achieve technical outcomes for our customers. As part of a team that directly supports one customer, a Delta focuses on technology-driven value creation: deploying and customizing Palantir platforms to tackle critical business problems.

And here's what FDE day-to-day work looks like:

> "Most weeks, I spend a couple of days working at the customer premises, some of that time in meetings with technical or business stakeholders, and the rest of the time monitoring, debugging, deploying, or configuring our software for that customer."

Translated plainly: spend 2-3 days per week at the client site, attend meetings, debug, deploy, configure software. Back at the office, write small code changes, meet with product teams, handle emails.

Isn't this exactly what Chinese software companies call "delivery engineer," "on-site implementation," or "post-sales engineer"?

Kingdee and UFIDA, China's major ERP vendors, all have large teams of implementation consultants. They provide implementation services through partner networks — deploying, configuring, customizing systems for clients. But have you seen Kingdee packaging "ERP implementation consultant" as a "revolutionary innovative role" with LinkedIn postings surging 800%?

No. Because it's a normal position — nothing remarkable about it.

I'd like to propose a judgment criterion I'll call **The Spreadsheet Test**:

If I sell you Excel, you can use it. If I sell you an "Excel Platform" but you need my engineers on-site 3 days/week to make a spreadsheet — I don't have a product. I have a very expensive spreadsheet consulting service.

Similarly, if your "AI platform" or "data platform" requires permanent embedded engineers to operate, you're not selling a product. You're selling engineers' time.

## The Data: What Palantir Actually Is

Let's look at the numbers. There's a little-known historical fact about Palantir: until 2016, this "software company" had more FDEs than software engineers.

What kind of software company is that?

The 2024 data is even more revealing. Palantir had 3,936 total employees, with 1,383 in engineering roles (44%). But they no longer disclose the ratio of FDEs to regular software engineers. Why not? I suspect because the ratio would make people question whether they're actually a software company.

Look at revenue composition. 2024 total revenue was $2.9B, with government clients at 55% ($1.57B) and commercial at 45% ($1.30B). More critically, the trend: from 2019 to 2024, government revenue share grew from 46.5% to 55%.

Pay attention: they publicly tout their massive commercial market success while actually becoming more dependent on government contracts. What does this tell you? That in normal commercial markets, the FDE model struggles to succeed.

Here's another interesting number: FDE median salary is $221K vs. $195K for regular software engineers. FDEs seem more valuable? In reality, only 13% higher, in exchange for:

- 3-4 days per week at client sites
- Extensive travel
- Glassdoor reviews noting "Bad work-life balance"
- A development mode internally described as "jungle combat: quick-and-dirty code"

A 13% premium for dramatically worse quality of life and accumulating technical debt. Is that a good deal?

The most damning is Palantir's former CFO Colin Anderson's assessment. He said FDE works in some markets but in others is "lighting equity on fire." He observed "overlapping and wasted work, multiple teams on similar problems," resulting in "many failures — spectacular pyres of time and treasure and travel expenses that amounted to nothing."

Even their own CFO says this. Still think it's a good model?

## Why FDE Only Survives in High-Corruption Industries

You might ask: if FDE is so problematic, why does Palantir still win so many contracts, and why is their market cap so high?

The answer is simple: the revolving door.

In 2022, America's top 20 defense contractors hired 672 officials who had recently retired from the Pentagon. Former Joint Chiefs Chairman Joseph Dunford joined Lockheed Martin's board just 5 months after retiring. The Pentagon's own audits found defense contractors achieving 40-50% profit margins through corruption and waste.

This is the reality of US defense procurement: contractors promise high-paying jobs to Pentagon officials, officials award generous contracts to contractors while in office, then retire to collect high salaries from the contractors. Operation Ill Wind was the largest defense procurement corruption case in US history, prosecuting over 60 contractors, consultants, and government officials.

Palantir thrives in this ecosystem. When it was founded in 2003, traditional VCs all passed — but the CIA's venture arm In-Q-Tel became an early investor. Better yet, intelligence agencies didn't just provide money; they "helped design the product" and engaged in "iterative collaboration" with Palantir engineers for nearly three years.

In other words: the CIA funded it, the CIA designed it, then the CIA became the customer. The perfect government contractor model.

A friend put it vividly: "China's most connected company, Huawei, couldn't walk into PetroChina and say 'we don't even know what we can do for you, let us send an FDE, look at your data, take up your time, build an MVP, then you can decide — but you have to pay on day one.' That would be insane."

Why would that be insane in China but work fine in the US defense market? Because US defense procurement has enough corruption space to make this model viable.

In normal commercial markets, clients want clear deliverables, comparable bids, and the ability to switch vendors. The FDE model is essentially **lock-in by design** — once your team depends on Palantir's FDEs, you can't easily replace them. This works in the defense market because decision-makers aren't spending their own money and don't have to answer to taxpayers. But in normal commercial markets, CFOs will do the math.

## When FDE Meets the Real World: The NHS Disaster

Let's see how the FDE model performs in a relatively transparent market.

In November 2023, the UK's NHS signed a 7-year, £330 million contract with Palantir to build a national data platform. A big win — Palantir must have been thrilled.

One year later: of 215 NHS hospital trusts, fewer than 25% were actually using Palantir's system. Many trusts outright refused deployment, calling it a "step backwards on existing systems."

The contract itself was suspicious. Of 586 pages, 416 were redacted. Data protection clauses were still "subject to commercial negotiation" after the contract was signed. Patients couldn't opt out of data collection.

This is the FDE model's real performance in a transparent market: political connections win contracts, but a bad product is a bad product, and users won't buy what they won't buy.

I'm not surprised at all. A "platform" that requires permanent embedded engineers to function — how could it scale to 215 hospitals? Station an FDE at each? Who bears the cost?

This case perfectly illustrates the fundamental flaw of the FDE model: it's not a scalable business model.

## The American Twin of "Middle Platform"

I have to tell the Chinese "Middle Platform" (zhongtai) story here, because it's virtually the same script as FDE.

In 2015, Alibaba introduced the Middle Platform concept — an "enterprise-level capability reuse platform." Sounds great, right?

Within five years, Tencent, Baidu, ByteDance, Didi, JD.com, and Meituan all followed. The industry mantra became: "Don't build a Middle Platform and you'll die." Gartner placed Middle Platform at the Peak of Inflated Expectations in 2020.

But: nobody could even clearly define what a Middle Platform was. Industry reports stated: "Even today, we don't even have a clear definition for what Zhong Tai is."

In 2023, the climax arrived: Alibaba CEO Daniel Zhang publicly announced the Middle Platform would be "made light and thin." Translation: the strategy doesn't work anymore, we're abandoning it.

Alibaba — who promoted the Middle Platform — abandoned the Middle Platform.

Now compare to FDE:

| | Middle Platform | FDE |
|---|---|---|
| Definition clarity | "No clear definition" | "Just as confused" |
| Promoter | Alibaba | Palantir |
| Spread | All major companies within 5 years | 800% job surge in 2025 |
| Internal criticism | CEO admitted failure in 2023 | CFO criticized "burning cash" |
| Hype Cycle position | Peak → Disillusionment | Currently at Peak |

The parallel is perfect. Both are buzzwords with vague definitions. Both saw the industry flock to follow after large companies promoted them. Both were eventually abandoned by their own promoters.

Watching the FDE craze from a Chinese perspective feels like: I've seen this movie before.

## Product vs. Consulting Firm: A Fundamental Question

Let's get back to the fundamental question: is Palantir a software company or a consulting firm?

What defines a software product? At minimum:

- Customers can use it relatively independently
- Doesn't require the vendor's permanent staff
- Can be deployed through a partner network or customer IT team
- Has clear functional boundaries and APIs

Kingdee and UFIDA, China's largest ERP vendors, offer SaaS models billed monthly per user. Implementation is done through certified partners — no need for Kingdee engineers permanently on-site. This is a normal software product business model.

Microsoft Office, Salesforce, AWS: customers self-serve, there's documentation, APIs, partner ecosystems. Vendors provide the product and platform; customers and partners handle implementation and operations.

Palantir? Industry reports say customers "become dependent on company's employees." FDEs directly commit fixes to the platform. Each customer deployment may be a different fork.

Is this still a product?

The Spreadsheet Test applies: if your "platform" needs permanent on-site engineers to function, are you selling a product or labor?

Compare to traditional defense contractors:
- Lockheed Martin sells the F-35: after delivery, it flies, with maintenance manuals
- Boeing sells the 787: after delivery, it works, airlines operate it themselves
- Raytheon sells missile defense systems: after installation, it's operable, with training and documentation

Palantir sells a "data platform": requires a permanent FDE team on-site, or it doesn't work.

The fundamental difference: hardware companies sell products. Palantir sells engineers' time plus a GitHub repo.

Palantir's business model is closer to Accenture or Deloitte than to Microsoft or Oracle. But their market cap is valued as a software company — and that's the problem.

## Conclusion: America's Zhongke Red Flag

A friend offered a pointed analogy: Palantir is "America's Zhongke Red Flag" (中科红旗).

Zhongke Red Flag was a Chinese Linux distribution that put a national flag on its product page, won contracts through government connections, had mediocre technology, and ultimately collapsed when the political winds shifted — classic "patriotic vaporware."

Palantir similarly: national flag on product pages, started via CIA connections, survives on Pentagon contracts, technology that isn't particularly advanced (NHS users called it "step backwards"). The only difference is Palantir's political connections run deeper, so it can keep the game going longer.

But how long can this model last?

I don't know Palantir's future, but I know the FDE model is not the future of the AI industry.

**Advice for AI companies (OpenAI, Anthropic, et al.):**
- **Either truly productize**: learn from Kingdee, build a partner network, don't maintain your own FDE army
- **Or admit you're a consulting firm**: charge hourly rates, don't charge software license fees
- **Don't follow the defense contractor path**: that path requires deep political connections you don't have

The NHS already proved it: in a transparent market, the FDE model doesn't work.

Finally: Forward Deployed Engineer is not innovation. It's the traditional delivery engineer, on-site implementation — with a fancier name. If you have a genuinely good product, customers can use it themselves, or deploy it through partners. If your "platform" can't operate without a permanent on-site team, your product isn't finished — or it was never really a product to begin with.

Forward Deployed Engineer is hype. Delivery Engineer might be humble truth. The latter just can't attract VC money or top LinkedIn trending job lists.

As someone who witnessed the rise and fall of China's cloud computing era and the Middle Platform craze, I'm deeply skeptical of FDE. I've seen this pattern too many times: concept catches fire → entire industry follows → problems emerge → promoters abandon ship.

In 3-5 years, I predict FDE will join Middle Platform as an industry punchline. Let's come back then and see who got it right.
