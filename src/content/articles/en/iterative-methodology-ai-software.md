---
title: "Using Iterative Methodology to Deliver Industrial-Quality Software with AI"
description: Complaints that AI-written code is unusable? The problem is not correctly applying iterative methodology. Iteration means repeatedly approximating a fixed goal through multiple attempts. In software development, iteration applies to every stage — from requirements to implementation and testing.
author: magong
date: 2025-07-26
tags: [methodology, ai-coding]
original_url: https://mp.weixin.qq.com/s/yOK7U__KNVYDwHMCMbNWVA
---

I often hear people complain that AI-written code is bad and unusable. I believe the reason is that they haven't correctly applied iterative methodology.

Iteration means repeatedly approximating a fixed goal through multiple attempts.

In software development, iteration can be applied to almost every stage. Let's start with requirements.

Requirements commonly have several problems:

1. The requirement itself is poor quality and impossible to understand. For example: "Write me a women's clothing e-commerce site."
2. The recipient's understanding and the sender's intent are misaligned — often because they have different context.
3. The requirement is shifting. For example, someone first says "your software is done, now give me Android, macOS, and Windows versions, compatible with Windows XP," then after learning the cost, changes to "just make a web version then."

All of these problems can be improved through iteration. My current Requirements Analyst role makes a decision on each requirement:

1. If the requirement is nonsensical, immediately declare No Further Action. For example, requirements from Project A filed under Project B, or "give me a plan to get rich lying down."

2. If the requirement is clear, summarize my understanding and action plan, and post it as a comment in the issue management system (Linear or GitHub Issues). This document serves as the behavioral basis for all subsequent roles — developer, troubleshooter, security engineer.

3. If the requirement is meaningful but unclear, AI raises questions, sets the ticket status to "awaiting clarification," and the requester answers via Issue comment. This interaction can iterate multiple times, each time bringing both sides' understanding closer to alignment.

The third point above is classic iterative approximation; the first and second are the exits from iteration. With this process, we can avoid a great deal of wasted work. This iteration happens between AI and the product manager.

But when we say "the requirement is clear," we're saying so as natural language users. And natural language's executability isn't great. Therefore, my Synthetic Engineering team has another step: translating requirements into test cases. My Analyst handles this work. After the Analyst writes the test case code, they submit a PR directly. Human engineers are responsible for review, focusing on whether the code-form test cases are consistent with the requirements expressed in natural language. If they're not consistent, the status is set to "Test Cases Refining" and comments are raised. The AI Analyst then revises based on the feedback.

This iteration happens between AI and human developers.

Once test cases are confirmed, the AI Developer role begins work. Their task is extremely clear: make the test cases pass. In my actual experience, even in familiar projects, the probability of the first implementation passing the tests is very low — there are always various issues. At this point, the troubleshooter enters, analyzes the test cases, the modified code, and the error messages, provides their revision opinion, and records it in troubleshooting.md. The developer then fixes based on that document. This interaction can happen several times.

This iteration happens between AI and AI. Currently I try not to involve humans, though humans may be added later.

In short, AI is not a magic lamp. You can't just recite a spell and have your dreams come true. Thinking of AI as a colleague who is equally smart, knowledgeable, impatient, and sometimes lazy — that's more accurate. Organizing a group of AIs to develop software, just like organizing human engineers, requires good software engineering methodology.
