import { fromPairs, map, pipe } from "ramda";
import { useMemo } from "react";
import { defineMessages, useIntl } from "react-intl";

const messages = defineMessages({
  "dict.values.accountability.name": {
    id: "dict.values.accountability.name",
    defaultMessage: "Accountability",
  },
  "dict.values.accountability.title": {
    id: "dict.values.accountability.title",
    defaultMessage: "Accountability (Responsibility, Commitment)",
  },
  "dict.values.accountability.description": {
    id: "dict.values.accountability.description",
    defaultMessage: `Being accountable is about creating a culture where people value responsibility. Your goals are constantly reinforced with accountability. Creating accountability increases your dedication to complete your goals, and it forces you to follow through on commitments. Accountability keeps you engaged. You can become personally accountable for your success. Just go for it!`,
  },
  "dict.values.accuracy.name": {
    id: "dict.values.accuracy.name",
    defaultMessage: "Accuracy",
  },
  "dict.values.accuracy.title": {
    id: "dict.values.accuracy.title",
    defaultMessage: "Accuracy (Being exact, Correct)",
  },
  "dict.values.accuracy.description": {
    id: "dict.values.accuracy.description",
    defaultMessage: `You feel it's right to have an attitude that doesn't accept mistakes. You see positivity in the ability to do things in an exact way. Precision is both important in personal life (when people know they can rely on you, you gain trust), and also in business. It's very important to deliver quality products or services to your customers. When you focus on accuracy, people will notice, and that's what matters. `,
  },
  "dict.values.beauty.name": {
    id: "dict.values.beauty.name",
    defaultMessage: "Beauty",
  },
  "dict.values.beauty.title": {
    id: "dict.values.beauty.title",
    defaultMessage: "Beauty (Prettiness, Aesthetics)",
  },
  "dict.values.beauty.description": {
    id: "dict.values.beauty.description",
    defaultMessage: `Beauty doesn't necessarily mean just pretty. Beauty is about a greater sense of eloquence and elegance. It's a way to peak the interest of others. Beauty is also a symbol of progress. In its presence you feel more alive. It has the power to energize and dazzle you. Who doesn't like to be amazed? :-)`,
  },
  "dict.values.creativity.name": {
    id: "dict.values.creativity.name",
    defaultMessage: "Creativity",
  },
  "dict.values.creativity.title": {
    id: "dict.values.creativity.title",
    defaultMessage: "Creativity (Innovation, Ideation)",
  },
  "dict.values.creativity.description": {
    id: "dict.values.creativity.description",
    defaultMessage: `You generally don't like directives and guidelines. The fact that you value creativity helps you to see things differently and to better deal with issues and uncertainty. You are a better problem solver. Creativity also leads to better self-awareness, and it makes human beings successful as individuals.`,
  },
  "dict.values.environment.name": {
    id: "dict.values.environment.name",
    defaultMessage: "Environment",
  },
  "dict.values.environment.title": {
    id: "dict.values.environment.title",
    defaultMessage: "Environment (Nature, Sustainability)",
  },
  "dict.values.environment.description": {
    id: "dict.values.environment.description",
    defaultMessage: `You feel connected to nature, to the environment around you. That's nice for you, not everyone has it like this. There's a significant responsibility that you feel as a human being regarding the environment. Now more than ever, the world needs people who value nature as you do, and even a little daily action towards sustainability and helping the environment is positive. Just keep doing good work!`,
  },
  "dict.values.fairness.name": {
    id: "dict.values.fairness.name",
    defaultMessage: "Fairness",
  },
  "dict.values.fairness.title": {
    id: "dict.values.fairness.title",
    defaultMessage: "Fairness (Equality, Justice)",
  },
  "dict.values.fairness.description": {
    id: "dict.values.fairness.description",
    defaultMessage: `It's important for you to see that people are treated equally and no one is left out. You value things like honesty and trust. People who are fair to each other help create a respectful environment. Problems are solved much easier when people are honest with each other. A society that is fair and equal also helps improve other public factors - people who have equal opportunity are better able to contribute to the community and to its prosperity. A fair society also helps to reduce social and economic disadvantages. Yes, fairness matters!`,
  },
  "dict.values.family.name": {
    id: "dict.values.family.name",
    defaultMessage: "Family",
  },
  "dict.values.family.title": {
    id: "dict.values.family.title",
    defaultMessage: "Family (Love, Relatives)",
  },
  "dict.values.family.description": {
    id: "dict.values.family.description",
    defaultMessage: `One might say that If you value family, that it's one of the essential things you can cultivate. Family is a place where you can share love, joy and support. Family is one of the most important things given to a human being. If things work well in the family, then everyone within has hope, advice, comfort, security and much more. It's one of the most important things for a child's growth. If we have the opportunity, the ideal is that we all contribute to creating the best family possible.`,
  },
  "dict.values.fitness.name": {
    id: "dict.values.fitness.name",
    defaultMessage: "Fitness",
  },
  "dict.values.fitness.title": {
    id: "dict.values.fitness.title",
    defaultMessage: "Fitness (Physical activity, Strength)",
  },
  "dict.values.fitness.description": {
    id: "dict.values.fitness.description",
    defaultMessage: `There are so many reasons why taking care of your physical health is important. If you already found a way to exercise regularly, congrats. If you're a fan of exercising, but haven't yet found a way to do it regularly, then try to find a way to do something that fits you. Fitness has more benefits which will help you than you 1st might realize - It can prevent serious health issues, control blood pressure, blood sugar and more. Plus, you'll look and feel better :-) Moreover, it strengthens your willpower and connection to your body. It has a circlular effect - the more you exercise, the more your will wants to continue on. Just make it a habit and keep moving forward with it, it'll pay off. `,
  },
  "dict.values.health.name": {
    id: "dict.values.health.name",
    defaultMessage: "Health",
  },
  "dict.values.health.title": {
    id: "dict.values.health.title",
    defaultMessage: "Health (Vitality, Vigour)",
  },
  "dict.values.health.description": {
    id: "dict.values.health.description",
    defaultMessage: `Healthy people are the basis of healthy societies and economies. It's wise not to take health for granted. As long as we feel good and have no pain, we usually don't think about health. Yet, once something goes wrong, we realize how important health actually is, especially when we are taking care of others and they depend on us. This is why health is one of the top values for many of us. If we're not ok, all other values like family, relationships, etc. are negatively effected. Keep taking care of your vitality. `,
  },
  "dict.values.helping.name": {
    id: "dict.values.helping.name",
    defaultMessage: "Helping",
  },
  "dict.values.helping.title": {
    id: "dict.values.helping.title",
    defaultMessage: "others Helping others (Care, Compassion)",
  },
  "dict.values.helping.description": {
    id: "dict.values.helping.description",
    defaultMessage: `Helping others reflects your humanity. You understand you're not the only one on the planet and that it's natural to sometimes care for another. Just make sure it doesn't ruin you. In the end, you have to make sure that you don't over give, keep the balance. There's no one who knows how you feel better than you do. If you tend to help others, don't forget to take care of yourself, too, and it's also OK to sometimes ask for a help.`,
  },
  "dict.values.honesty.name": {
    id: "dict.values.honesty.name",
    defaultMessage: "Honesty",
  },
  "dict.values.honesty.title": {
    id: "dict.values.honesty.title",
    defaultMessage: "Honesty (Ethics, Integrity)",
  },
  "dict.values.honesty.description": {
    id: "dict.values.honesty.description",
    defaultMessage: `Life will be much easier if you're open and honest with other people. You don't always have to remember what you said to this or that person. When you're honest you don't have to live in a mess of parallel worlds constructed in your mind. If you try to live in honesty you'll breathe more freely. Days feel brighter. Integrity makes you a person whom others like to spend time with, as no one really wants to share their sensitive feelings with a dishonest person.  So, people are more relaxed with you, as an honest person that they can rely on and let their guard down with.`,
  },
  "dict.values.independence.name": {
    id: "dict.values.independence.name",
    defaultMessage: "Independence",
  },
  "dict.values.independence.title": {
    id: "dict.values.independence.title",
    defaultMessage: "Independence (Freedom, Sovereignty)",
  },
  "dict.values.independence.description": {
    id: "dict.values.independence.description",
    defaultMessage: `For those who don't lean towards strict dependency, it's important to keep some kind of freedom and independence, at least in our own minds. All of us are born into societies which are more or less tied to certain constraints and limits. Independence goes along with creativity, open-mindness, and critical thinking which is very important nowadays in this complicated world. It helps to be in contact with similar thinking people. Life will be more vivid this way.`,
  },
  "dict.values.learning.name": {
    id: "dict.values.learning.name",
    defaultMessage: "Learning",
  },
  "dict.values.learning.title": {
    id: "dict.values.learning.title",
    defaultMessage: "Learning (Improvement, Knowledge)",
  },
  "dict.values.learning.description": {
    id: "dict.values.learning.description",
    defaultMessage: `As human beings, we have a huge advantage which no other living creature on this planet has - we can consider the consequences of our actions. It'd be such a waste if we didn't want to improve ourselves, learn to be better people and grow deeper understanding, on a daily basis. The more we know, in this complicated world, the more we can stand on our own 2 feet. The more we learn, the more we'll understand the context of things and the more we can contribute to our communities and societies, to be more fair, more effective and more supportive - to make a better place to live, exist and thrive on this planet.`,
  },
  "dict.values.love.name": {
    id: "dict.values.love.name",
    defaultMessage: "Love",
  },
  "dict.values.love.title": {
    id: "dict.values.love.title",
    defaultMessage: "Love (Belonging, Generosity)",
  },
  "dict.values.love.description": {
    id: "dict.values.love.description",
    defaultMessage: `Love is one of the most power-full emotions which a human being can experience. Lucky are those who have had at least one chance to feel what true love means and feels like. When you experience true love, you essentially don't feel negative emotions. On the other hand too much love in the long term is also not healthy. Neither for the person who is loved, nor for the person who is loving. It's important to find the right balance. Loving doesn't mean being in love with only one person, but to love other people and life, as well. Start with loving yourself. With all your pros and cons, be happy for what you have and who you are. Love yourself first and foremost:-). Then let it ripple out beyond you.`,
  },
  "dict.values.loyalty.name": {
    id: "dict.values.loyalty.name",
    defaultMessage: "Loyalty",
  },
  "dict.values.loyalty.title": {
    id: "dict.values.loyalty.title",
    defaultMessage: "Loyalty (Consistency, Fidelity)",
  },
  "dict.values.loyalty.description": {
    id: "dict.values.loyalty.description",
    defaultMessage: `In most cases loyalty has good paid off. Either at work, or in relationships where people respect each other, it shows that you can trust one another. And, trust is not easily built. You need time, and different situations where you can prove you are faithful. Yet it's worth it. It forms a connection, and forms real relationships. Loyalty creates a feeling of security, as well. If you value others and live in loyalty, you can be proud of yourself and the connections created.`,
  },
  "dict.values.money.name": {
    id: "dict.values.money.name",
    defaultMessage: "Money",
  },
  "dict.values.money.title": {
    id: "dict.values.money.title",
    defaultMessage: "Money (Wealth, Fortune)",
  },
  "dict.values.money.description": {
    id: "dict.values.money.description",
    defaultMessage: `If one of your top values is money, you likely enjoy nice things. Probably you're a materialistic person. A lot of people love to wear nice clothes, drive fancy cars, go out to posh restaurants. If you are one of them, you like it, and you can afford it - you've earned "the good life" :-) You may have a world filled with things you appreciate and love. Yet, you're also perhaps aware that there are things which money can't buy. Being focused on wealth doesn't mean it's the only thing you need to be focused on. Also, take time to look at other possibilities around you. Perhaps, contribute to something positive in your community, and not necessarily with money. The feeling you receive from sharing your knowledge, time and efforts, with others, will give you a different perspective on the world around you than you might have 1st expected. `,
  },
  "dict.values.passion.name": {
    id: "dict.values.passion.name",
    defaultMessage: "Passion",
  },
  "dict.values.passion.title": {
    id: "dict.values.passion.title",
    defaultMessage: "Passion (Enthusiasm, Fun)",
  },
  "dict.values.passion.description": {
    id: "dict.values.passion.description",
    defaultMessage: `It's said that a person without passion is a lost soul. It makes a big difference that no matter what it is, if you have passion for it, you must just go for it. Showing true enthusiasm, is the highest level of authenticity. Whether it's writing, sports, music or collecting different things, when you've a passion for something that positively feeds you, then spending a regular portion of your day with this, is essential. Practicing what you're passionate about brings your mind into flow and when you stay focused, you'll perform at your very best. This act of doing something meaningful has two positives - first you can be pleased with the progress and the outcome, second you'll enjoy what you're doing. So keep doing it :-)`,
  },
  "dict.values.patience.name": {
    id: "dict.values.patience.name",
    defaultMessage: "Patience",
  },
  "dict.values.patience.title": {
    id: "dict.values.patience.title",
    defaultMessage: "Patience (Will, Self-control)",
  },
  "dict.values.patience.description": {
    id: "dict.values.patience.description",
    defaultMessage: `It takes strong will and self-control to wait for something to happen. Usually, the more important something is for you, the more patient you are. Yet, there are some people who want something to happen and just can't wait for it. It's important for you to understand that everything needs its time. People who value patience are most likely calm, wise and perhaps experienced human beings. You have something to show and teach immature people around you. Have patience with their lack of patience :-).`,
  },
  "dict.values.patriotism.name": {
    id: "dict.values.patriotism.name",
    defaultMessage: "Patriotism",
  },
  "dict.values.patriotism.title": {
    id: "dict.values.patriotism.title",
    defaultMessage: "Patriotism (Nationalism)",
  },
  "dict.values.patriotism.description": {
    id: "dict.values.patriotism.description",
    defaultMessage: `To value Patriotism means you are devoted to your country. You feel proud hearing about the achievements of the people of your country both in the past, and present. It brings a feeling of belonging to a huge tradition to which you can contribute. There are wise statements in many constitutions. We must all fight for equality, protect those who can't protect themselves, giving opportunity to everyone.  The world will be a much better place when we follow these values. `,
  },
  "dict.values.peace.name": {
    id: "dict.values.peace.name",
    defaultMessage: "Peace",
  },
  "dict.values.peace.title": {
    id: "dict.values.peace.title",
    defaultMessage: "Peace (Well-being, Rest)",
  },
  "dict.values.peace.description": {
    id: "dict.values.peace.description",
    defaultMessage: `There is a lot of stress in our lives and therefore it's very important to find a time for rest and peace. First of all - a regular and sufficient sleep is essential and we ought to consider it as a must. To experience peace improves our ability to focus our mind, and improves our relationships. Moreover, peace enables us to enjoy happiness. So what are we waiting for? :-)`,
  },
  "dict.values.performance.name": {
    id: "dict.values.performance.name",
    defaultMessage: "Performance",
  },
  "dict.values.performance.title": {
    id: "dict.values.performance.title",
    defaultMessage: "Performance (Quality, Excellence)",
  },
  "dict.values.performance.description": {
    id: "dict.values.performance.description",
    defaultMessage: `Striving for excellence helps your confidence. It's a continuous circle. When you deliver quality work, usually you get positive feedback which pushes you to do a good job, again and again. Be the best you can possibly be. Don't be just be satisfied with what is expected of you. Set the bar higher, and go beyond that. It's easier to go along with the average. It's much more challenging to rise higher and perform with increased quality and excellence. People are remembered not because of their mediocrity in life, but for their extraordinary and excellent achievements.`,
  },
  "dict.values.power.name": {
    id: "dict.values.power.name",
    defaultMessage: "Power",
  },
  "dict.values.power.title": {
    id: "dict.values.power.title",
    defaultMessage: "Power (Influence)",
  },
  "dict.values.power.description": {
    id: "dict.values.power.description",
    defaultMessage: `You don't like to sit in the corner, do you? Having influence on something or someone is what drives you. Power doesn't need to be associated only with something negative. Only with certain power you're able to accomplish significant objectives, like in an organization. Only people who have certain levels of power make decisions which impact many others. It's a wise decision to invest in developing the skill of power. The more skillful you are, the more chances you'll have to sell your vision and ideas.`,
  },
  "dict.values.relationships.name": {
    id: "dict.values.relationships.name",
    defaultMessage: "Relationships",
  },
  "dict.values.relationships.title": {
    id: "dict.values.relationships.title",
    defaultMessage: "Relationships (People, Connection)",
  },
  "dict.values.relationships.description": {
    id: "dict.values.relationships.description",
    defaultMessage: `The most priceless thing a person can have.. is someone else, who regardless of how often they connect, they know they can turn to for help and support, when most needed. Obviously, this ideally works both ways. The people who have relationships built on trust and understanding, enjoy one of the biggest values which human beings can have - true relationship. Healthy relationships contribute to wellbeing, and happier and healthier lives. Don't forget: "Shared joy is double joy, shared sorrow is half a sorrow."`,
  },
  "dict.values.reliability.name": {
    id: "dict.values.reliability.name",
    defaultMessage: "Reliability",
  },
  "dict.values.reliability.title": {
    id: "dict.values.reliability.title",
    defaultMessage: "Reliability (Dependability)",
  },
  "dict.values.reliability.description": {
    id: "dict.values.reliability.description",
    defaultMessage: `To value reliability means it feels natural to you to back up what you say and follow through, or maybe you had a bad experience with someone in the past. Yet, it's not just about that. It's crucial to do it in the right way, as well. Being reliable means you need to build trust in other people, too. Being truthful is a good start. Promised things have to be done on time. If it's not possible, then clear communication is a must. Then, everyone is aware of what's happening and doubts are gone. When someone wants to be seen as reliable, he or she needs to be authentic, period. `,
  },
  "dict.values.success.name": {
    id: "dict.values.success.name",
    defaultMessage: "Success",
  },
  "dict.values.success.title": {
    id: "dict.values.success.title",
    defaultMessage: "Success (Results, Achievements)",
  },
  "dict.values.success.description": {
    id: "dict.values.success.description",
    defaultMessage: `There's no doubt, success is important in our lives. It drives us, gives us confidence, motivation, a sense of wellbeing. When we succeed, our brain triggers a surge of dopamine - a chemical reaction which fills us with warmth and happiness. We must set a few reachable daily goals, so we can enjoy the feeling of success - from making the bed in the morning to doing something good for mind and body. Daily. And don't be afraid to set harder and more time consuming, yet meaningful, goals for yourself. The more challenging the goal is, the better the outcome tastes. Once reached, you'll look back and be proud of yourself.`,
  },
  "dict.values.teamwork.name": {
    id: "dict.values.teamwork.name",
    defaultMessage: "Teamwork",
  },
  "dict.values.teamwork.title": {
    id: "dict.values.teamwork.title",
    defaultMessage: "Teamwork (Support, Cooperation)",
  },
  "dict.values.teamwork.description": {
    id: "dict.values.teamwork.description",
    defaultMessage: `Sure, you can contribute to something good as an individual, yet being part of a working team where one member adds value to another, that's when something incredible happens. And, it's great you believe in it! The importance of teamwork cannot be stressed enough. It provides great learning opportunities - not just for work related knowledge but also for understanding people's' psychology. Working in a team can help increase momentum, leading to greater efficiency, ideas and innovation!`,
  },
  "dict.values.trust.name": {
    id: "dict.values.trust.name",
    defaultMessage: "Trust",
  },
  "dict.values.trust.title": {
    id: "dict.values.trust.title",
    defaultMessage: "Trust (Respect, Dignity)",
  },
  "dict.values.trust.description": {
    id: "dict.values.trust.description",
    defaultMessage: `To earn trust is a long and sometimes complicated process. On the other hand, it can be too easily lost. Trust is built in little moments and in actions rather than in gestures. Trust means that someone recognizes you're worth listening to, that your truth and story matters. To be trustworthy you need to be transparent and accountable, be open to others and serve others. So how do we earn trust? Deliver on your promises, keep your word, show up on time, and don't gossip :-) No one wants to see themselves as another's subject of gossip. Create that which you yourself need and want in your own life.`,
  },
  "dict.values.truth.name": {
    id: "dict.values.truth.name",
    defaultMessage: "Truth",
  },
  "dict.values.truth.title": {
    id: "dict.values.truth.title",
    defaultMessage: "Truth (To be right)",
  },
  "dict.values.truth.description": {
    id: "dict.values.truth.description",
    defaultMessage: `The truth matters. You simply can't be comfortable around people who are not truthful, unless you are the same and accept you can't trust them. That would be a sad life, wouldn't it? :-) It's almost not possible to be 100% truthful, yet hold it as one of your biggest priorities and the fight for truth can be a moral commitment for us all. The truth matters both in science and personal relationships. It's the foundation for a fair and just society. And, most importantly, we need to take care that we're true to ourselves. We may decide to accept that others may fool us, yet we must not accept that we fool ourselves. `,
  },
  "dict.values.work.name": {
    id: "dict.values.work.name",
    defaultMessage: "Work",
  },
  "dict.values.work.title": {
    id: "dict.values.work.title",
    defaultMessage: "Work (Self-fulfillment)",
  },
  "dict.values.work.description": {
    id: "dict.values.work.description",
    defaultMessage: `To have meaningful work is not good just for our minds, yet also for our health. We must try to have at least a little bit of joy in what we're do for a living. If there is a period in life when things aren't aligned, never lose hope and energy to continue to move forward toward a better place. Yes, we'll consider decisions about our careers wisely, because we have certain responsibilities, yet, striving for something better needs to always be deeply within us. No matter what, work does continue to have plenty of benefits, regardless - besides rewarding us financially, it contributes to our self-confidence, meaning in our lives, and wellbeing. It plays a significant role in socialization and building a network of contacts that grow us in varying ways. Moreover, it gives us a sense of pride and being a part of something.`,
  },
});

const emojis = {
  accountability: "🤝",
  accuracy: "📐",
  beauty: "🌸",
  creativity: "🎨",
  environment: "🌳",
  fairness: "👨‍⚖️",
  family: "🏡",
  fitness: "🏋️",
  health: "❤️",
  helping: "🤲",
  honesty: "✊",
  independence: "🧑‍💻",
  learning: "📚",
  love: "👩‍❤️‍💋‍👨",
  loyalty: "💙",
  money: "💵",
  passion: "💕",
  patience: "♟️",
  patriotism: "👍",
  peace: "🧘‍♀️",
  performance: "📈",
  power: "💪",
  relationships: "👫",
  reliability: "🙏",
  success: "🥇",
  teamwork: "🤾‍♂️",
  trust: "🤝",
  truth: "🤥",
  work: "💼",
};

const valuesKeys = [
  "accountability",
  "accuracy",
  "beauty",
  "creativity",
  "environment",
  "fairness",
  "family",
  "fitness",
  "health",
  "helping",
  "honesty",
  "independence",
  "learning",
  "love",
  "loyalty",
  "money",
  "passion",
  "patience",
  "patriotism",
  "peace",
  "performance",
  "power",
  "relationships",
  "reliability",
  "success",
  "teamwork",
  "trust",
  "truth",
  "work",
];

const translateValue = (intl, key) => {
  const getId = (prop) => `dict.values.${key}.${prop}`;

  return {
    name: intl.formatMessage({ ...messages[getId("name")] }),
    emoji: emojis[key],
    // title: intl.formatMessage({ ...messages[getId("title")] }),
    description: intl.formatMessage({ ...messages[getId("description")] }),
  };
};

export const useValuesDict = () => {
  // const { language, setLanguage } = useContext(I18nContext);
  const intl = useIntl();
  const values = useMemo(
    () =>
      pipe(
        map((k) => [k, translateValue(intl, k)]),
        fromPairs
      )(valuesKeys),
    [intl]
  );

  return useMemo(() => ({ values }), [values]);
};
