import { useState, useEffect } from 'react';

const testimonials = [
  {
    quote: '那真是个孤独的探索者，自己有想法，自己去实践：错了，再来；对了，继续。进群之后发现很多自己的探索结论早就是 common sense 了。成功、失败经验远不是个人实践可以比的。',
    name: '陈浩',
  },
  {
    quote: '我当时跟马工在线上对喷，核心观点就一个：现在的AI根本应付不了大的工程项目。马工跟我互喷半天说了一句："既然都知道问题了，那就一起解决。"就这么进了群。现在回头看，这是我今年做的最正确的决定之一。',
    name: 'Player¹',
    role: 'MES系统工程师',
  },
  {
    quote: 'AI探索需要的真不是教程，是同路人。教程到处都是，GPT能写、Claude能改。但是有好几个人跟你思考同样的事、想的方向居然差不多，这种感觉，啥工具都给不了。它解决的不是知识问题，是信心问题。',
    name: '锅',
  },
  {
    quote: '现实圈子的AI水平太低，没法学到东西。加入以来AI工程实践明显提升。最大的帮助 = 看到社区高手在做什么，然后偷师到自己的项目里。',
    name: '高兴',
  },
  {
    quote: 'Agents特区是我少数置顶且每天必看的群之一。最大的抱怨是：信息密度太高，要花很长时间才能消化。市面上讲AI吹牛逼的社群很多，干的很少。',
    name: '林秋楠Dylan',
  },
  {
    quote: '这里的氛围会"逼着你进步"。以前的我其实有点偏懒，很多东西自己理解了就算了。但在Agents特区，为了"应付"马工安排的两次分享，我不得不把零散的认知重新梳理、总结成体系。在这个过程中理解更深了。',
    name: 'Nick',
    role: '保利威直播',
  },
];

export default function TestimonialRotator() {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setIndex((i) => (i + 1) % testimonials.length);
        setFading(false);
      }, 400);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const t = testimonials[index];

  return (
    <div className="relative min-h-[180px]">
      <blockquote
        className={`border-l-3 border-[var(--color-accent)] pl-6 transition-opacity duration-400 ${fading ? 'opacity-0' : 'opacity-100'}`}
      >
        <p className="text-[var(--color-text-secondary)] leading-relaxed">
          {t.quote}
        </p>
        <footer className="mt-4 text-sm text-[var(--color-text-muted)]">
          — {t.name}{t.role && <span className="ml-1 text-[var(--color-text-muted)]/60">· {t.role}</span>}
        </footer>
      </blockquote>
      <div className="mt-6 flex gap-1.5 justify-center">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => { setFading(true); setTimeout(() => { setIndex(i); setFading(false); }, 400); }}
            className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-[var(--color-accent)]' : 'w-1.5 bg-[var(--color-text-muted)]/30 hover:bg-[var(--color-text-muted)]/50'}`}
            aria-label={`Testimonial ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
