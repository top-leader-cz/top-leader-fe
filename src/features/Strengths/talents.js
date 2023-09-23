import { fromPairs, map, pipe } from "ramda";
import { useMemo } from "react";
import { defineMessages, useIntl } from "react-intl";

// export const TALENTS_EN = {
const messages = defineMessages({
  "dict.talents.initiator.name": {
    id: "dict.talents.initiator.name",
    defaultMessage: "Initiator",
  },
  "dict.talents.initiator.positives.1": {
    id: "dict.talents.initiator.positives.1",
    defaultMessage: `You bring energy to your environment.`,
  },
  "dict.talents.initiator.positives.2": {
    id: "dict.talents.initiator.positives.2",
    defaultMessage: `You're the one who makes things happen.`,
  },
  "dict.talents.initiator.positives.3": {
    id: "dict.talents.initiator.positives.3",
    defaultMessage: `Unlike many others, you have the ability to start.`,
  },
  "dict.talents.initiator.positives.4": {
    id: "dict.talents.initiator.positives.4",
    defaultMessage: `You hate wasting time.`,
  },
  "dict.talents.initiator.positives.5": {
    id: "dict.talents.initiator.positives.5",
    defaultMessage: `Unknown things don't slow you down, you just have to act.`,
  },
  "dict.talents.initiator.positives.6": {
    id: "dict.talents.initiator.positives.6",
    defaultMessage: `Heading constantly to next steps is the key for your growth.`,
  },
  "dict.talents.initiator.positives.7": {
    id: "dict.talents.initiator.positives.7",
    defaultMessage: `If no one is making a decision, it's you who feels you need to make one.`,
  },
  "dict.talents.initiator.positives.8": {
    id: "dict.talents.initiator.positives.8",
    defaultMessage: `You push things forward productively, and you naturally don't want to miss any opportunity.`,
  },
  "dict.talents.initiator.tips.1": {
    id: "dict.talents.initiator.tips.1",
    defaultMessage: `You show belief in other people that they can take an action. You show them support by saying "How can we start?", "Let's make it happen."`,
  },
  "dict.talents.initiator.tips.2": {
    id: "dict.talents.initiator.tips.2",
    defaultMessage: `In a work environment, if being an achiever is not one of your stronger points, try to cooperate with a person who has this skill in order to create a great team together.`,
  },
  "dict.talents.initiator.tips.3": {
    id: "dict.talents.initiator.tips.3",
    defaultMessage: `Stay focused on the outcome, not on the process. It's not what you say or what you think along the way, what's most important to you is that you can get it done. `,
  },
  "dict.talents.initiator.tips.4": {
    id: "dict.talents.initiator.tips.4",
    defaultMessage: `Your approach to push others to take action may be annoying. Try to build trust so they can follow you more easily. `,
  },
  "dict.talents.initiator.tips.5": {
    id: "dict.talents.initiator.tips.5",
    defaultMessage: `Try to be in regular contact with decision makers in order to help make your your ideas and actions happen.`,
  },
  "dict.talents.flexible.name": {
    id: "dict.talents.flexible.name",
    defaultMessage: "Flexible",
  },
  "dict.talents.flexible.positives.1": {
    id: "dict.talents.flexible.positives.1",
    defaultMessage: `You like it when things around you change.`,
  },
  "dict.talents.flexible.positives.2": {
    id: "dict.talents.flexible.positives.2",
    defaultMessage: `Surprises and unexpected turnarounds are something that you enjoy. `,
  },
  "dict.talents.flexible.positives.3": {
    id: "dict.talents.flexible.positives.3",
    defaultMessage: `When you're under pressure, you can still be productive and deliver a solid outcome.`,
  },
  "dict.talents.flexible.positives.4": {
    id: "dict.talents.flexible.positives.4",
    defaultMessage: `You hate routines and things which go as expected.`,
  },
  "dict.talents.flexible.positives.5": {
    id: "dict.talents.flexible.positives.5",
    defaultMessage: `You respond easily to moments which don't go according to plan.`,
  },
  "dict.talents.flexible.positives.6": {
    id: "dict.talents.flexible.positives.6",
    defaultMessage: `With all you do, you stay calm and controlled under stress more easily than others.`,
  },
  "dict.talents.flexible.tips.1": {
    id: "dict.talents.flexible.tips.1",
    defaultMessage: `Work on your assertivness. The fact that you can adapt quickly to things others demand doesn't mean you have to. Work on finding ways to be more flexible and know when to stand up for your rights.  `,
  },
  "dict.talents.flexible.tips.2": {
    id: "dict.talents.flexible.tips.2",
    defaultMessage: `Try to seek work which isn't routine and where you can maximize your talent of adaptability. `,
  },
  "dict.talents.flexible.tips.3": {
    id: "dict.talents.flexible.tips.3",
    defaultMessage: `When in a group and you encounter a situation which changes suddenly, you'll use your talent to cope with it easier than other members of the group.`,
  },
  "dict.talents.flexible.tips.4": {
    id: "dict.talents.flexible.tips.4",
    defaultMessage: `You will be a good leader if you build trust and loyalty in your environment, people will follow you with the expectancy that you'll succeed in turbulent times. `,
  },
  "dict.talents.flexible.tips.5": {
    id: "dict.talents.flexible.tips.5",
    defaultMessage: `Try to avoid activities which are constant and need structure, these will frustrate you very fast.`,
  },
  "dict.talents.analyser.name": {
    id: "dict.talents.analyser.name",
    defaultMessage: "Analyser",
  },
  "dict.talents.analyser.positives.1": {
    id: "dict.talents.analyser.positives.1",
    defaultMessage: `You prefer facts and a logical approach, rather than intuition.`,
  },
  "dict.talents.analyser.positives.2": {
    id: "dict.talents.analyser.positives.2",
    defaultMessage: `Having valuable data in your mind gives you confidence because you can easily search for patterns.`,
  },
  "dict.talents.analyser.positives.3": {
    id: "dict.talents.analyser.positives.3",
    defaultMessage: `You seek simplicity and clarification through a huge amount of data.`,
  },
  "dict.talents.analyser.positives.4": {
    id: "dict.talents.analyser.positives.4",
    defaultMessage: `You tend to be precise while communicating your ideas.`,
  },
  "dict.talents.analyser.positives.5": {
    id: "dict.talents.analyser.positives.5",
    defaultMessage: `As an analytical person you may easily get frustrated when someone tells you to follow your heart rather than your mind.`,
  },
  "dict.talents.analyser.positives.6": {
    id: "dict.talents.analyser.positives.6",
    defaultMessage: `Your brain can easily focus on different combinations and connections which other people cannot easily see.`,
  },
  "dict.talents.analyser.tips.1": {
    id: "dict.talents.analyser.tips.1",
    defaultMessage: `Consider partnering with someone who can push things through productively and take action, you'll complement each other, well.`,
  },
  "dict.talents.analyser.tips.2": {
    id: "dict.talents.analyser.tips.2",
    defaultMessage: `Avoid aggressive arguments while using your knowledge of data to help with building positive relationships with others.`,
  },
  "dict.talents.analyser.tips.3": {
    id: "dict.talents.analyser.tips.3",
    defaultMessage: `Other people see you as a logical person, it gives you a chance to build trust with people close to you.`,
  },
  "dict.talents.analyser.tips.4": {
    id: "dict.talents.analyser.tips.4",
    defaultMessage: `Even seemingly "proven facts" may not be true, try to be critical about what others say, try to get information from various sources, and be careful what you prove as fact to avoid embarrassment.`,
  },
  "dict.talents.analyser.tips.5": {
    id: "dict.talents.analyser.tips.5",
    defaultMessage: `Consider working in a field where you can analyze data, it could be either marketing, finance, risk advisory, or maybe medical research, to name a few.`,
  },
  "dict.talents.believer.name": {
    id: "dict.talents.believer.name",
    defaultMessage: "Believer",
  },
  "dict.talents.believer.positives.1": {
    id: "dict.talents.believer.positives.1",
    defaultMessage: `You prize your values more than money.`,
  },
  "dict.talents.believer.positives.2": {
    id: "dict.talents.believer.positives.2",
    defaultMessage: `It's difficult for you to accept when someone doubts your values and the things you do.`,
  },
  "dict.talents.believer.positives.3": {
    id: "dict.talents.believer.positives.3",
    defaultMessage: `You value things such as high ethics and responsibility.`,
  },
  "dict.talents.believer.positives.4": {
    id: "dict.talents.believer.positives.4",
    defaultMessage: `Your core values keep you on the right track in your life, especially in times of distraction and temptation.`,
  },
  "dict.talents.believer.positives.5": {
    id: "dict.talents.believer.positives.5",
    defaultMessage: `Your values will inspire others to take action.`,
  },
  "dict.talents.believer.positives.6": {
    id: "dict.talents.believer.positives.6",
    defaultMessage: `Your values guide your behaviour, and they help you to understand what's right and wrong`,
  },
  "dict.talents.believer.tips.1": {
    id: "dict.talents.believer.tips.1",
    defaultMessage: `Try to find work which is aligned with your core values, otherwise it/ll be more and more frustrating for you.`,
  },
  "dict.talents.believer.tips.2": {
    id: "dict.talents.believer.tips.2",
    defaultMessage: `Don't question your own values just because others doubt them, you know why they are important for you and it makes you stronger!`,
  },
  "dict.talents.believer.tips.3": {
    id: "dict.talents.believer.tips.3",
    defaultMessage: `Let your values help you to grow and develop yourself, it leads you to a future which is fulfilling you, as long as you continue to follow them.`,
  },
  "dict.talents.believer.tips.4": {
    id: "dict.talents.believer.tips.4",
    defaultMessage: `Your values increase your confidence, try to think of them frequently. Use the "value space" in your Wellmee app. `,
  },
  "dict.talents.believer.tips.5": {
    id: "dict.talents.believer.tips.5",
    defaultMessage: `Whenever you feel lost, review your values, they will guide you to take action and decisions which will come from your core.`,
  },
  "dict.talents.ideamaker.name": {
    id: "dict.talents.ideamaker.name",
    defaultMessage: "Ideamaker",
  },
  "dict.talents.ideamaker.positives.1": {
    id: "dict.talents.ideamaker.positives.1",
    defaultMessage: `You love creating of new ideas.`,
  },
  "dict.talents.ideamaker.positives.2": {
    id: "dict.talents.ideamaker.positives.2",
    defaultMessage: `You like it when you are challenged to bring new ideas.`,
  },
  "dict.talents.ideamaker.positives.3": {
    id: "dict.talents.ideamaker.positives.3",
    defaultMessage: `It gets boring for you once you start to do routine activities or you have to work with close minded people.`,
  },
  "dict.talents.ideamaker.positives.4": {
    id: "dict.talents.ideamaker.positives.4",
    defaultMessage: `For you an idea is a link to the unknown, and you love to search for the connections to these links. `,
  },
  "dict.talents.ideamaker.positives.5": {
    id: "dict.talents.ideamaker.positives.5",
    defaultMessage: `You don't feel ashamed when coming up with some bizzare novel approach, it drives your life. `,
  },
  "dict.talents.ideamaker.positives.6": {
    id: "dict.talents.ideamaker.positives.6",
    defaultMessage: `You admire visionaries and dreamers, it motivates you to follow their path.`,
  },
  "dict.talents.ideamaker.tips.1": {
    id: "dict.talents.ideamaker.tips.1",
    defaultMessage: `Try to find a work where you get space to use your creative thinking, where you are encouraged to do so and be rewarded for it (you'll do well in fields like product development, marketing, journalism or startups).`,
  },
  "dict.talents.ideamaker.tips.2": {
    id: "dict.talents.ideamaker.tips.2",
    defaultMessage: `Being in an environment with open minded people is much more fulfilling for you than hanging out with close minded people - try to avoid them so you aren't constantly frustrated.`,
  },
  "dict.talents.ideamaker.tips.3": {
    id: "dict.talents.ideamaker.tips.3",
    defaultMessage: `As you get bored quickly when you're not mentally challenged, try to keep yourself busy with thinking over new scenarios of different situations and challenging other people with your ideas.`,
  },
  "dict.talents.ideamaker.tips.4": {
    id: "dict.talents.ideamaker.tips.4",
    defaultMessage: `Don't be frustrated if others don't accept your ideas immediately. Everyone has to get on board and thus try to explain to others how you came up with certain ideas and to what outcome it will lead.`,
  },
  "dict.talents.ideamaker.tips.5": {
    id: "dict.talents.ideamaker.tips.5",
    defaultMessage: `Great ideas also come from other people's ideas and actions. Try to listen to audio or read books from smart and open minded people - it can be a great source for your thoughts.`,
  },
  "dict.talents.coach.name": {
    id: "dict.talents.coach.name",
    defaultMessage: "Coach",
  },
  "dict.talents.coach.positives.1": {
    id: "dict.talents.coach.positives.1",
    defaultMessage: `You have a talent for seeing potential in other people and you like to develop it.`,
  },
  "dict.talents.coach.positives.2": {
    id: "dict.talents.coach.positives.2",
    defaultMessage: `You are happy when you see other people not wasting their talent. `,
  },
  "dict.talents.coach.positives.3": {
    id: "dict.talents.coach.positives.3",
    defaultMessage: `People's success which you helped develop, feels like your own success. `,
  },
  "dict.talents.coach.positives.4": {
    id: "dict.talents.coach.positives.4",
    defaultMessage: `You seek ways in which to challenge other people. `,
  },
  "dict.talents.coach.positives.5": {
    id: "dict.talents.coach.positives.5",
    defaultMessage: `Understanding people is something you are good at, and it gives you pleasure to help them.`,
  },
  "dict.talents.coach.positives.6": {
    id: "dict.talents.coach.positives.6",
    defaultMessage: `You have the ability to change the life course of other people.`,
  },
  "dict.talents.coach.tips.1": {
    id: "dict.talents.coach.tips.1",
    defaultMessage: `Seek a career where you can use your inner motivation to help develop other people. This could be well used in jobs like trainers, teachers, and managers. This skill is important in leadership too.`,
  },
  "dict.talents.coach.tips.2": {
    id: "dict.talents.coach.tips.2",
    defaultMessage: `Trust your instincts to develop people who actually want to be developed, which is not always clear from the first moment you meet them, so check in to be sure your time and energy is well spent. `,
  },
  "dict.talents.coach.tips.3": {
    id: "dict.talents.coach.tips.3",
    defaultMessage: `On the other hand, try to encourage people who are continually struggling in their current role to try some other roles which may suit them better.`,
  },
  "dict.talents.coach.tips.4": {
    id: "dict.talents.coach.tips.4",
    defaultMessage: `Try to master the subject you want to develop in other people, you'll be a more and more trusted person and your suggestions and recommendations will be accepted more easily. `,
  },
  "dict.talents.coach.tips.5": {
    id: "dict.talents.coach.tips.5",
    defaultMessage: `When you provide feedback to someone, praise their positive progress, highlight what exactly was right and identify steps of improvement with timing.`,
  },
  "dict.talents.leader.name": {
    id: "dict.talents.leader.name",
    defaultMessage: "Leader",
  },
  "dict.talents.leader.positives.1": {
    id: "dict.talents.leader.positives.1",
    defaultMessage: `You like to be in charge.`,
  },
  "dict.talents.leader.positives.2": {
    id: "dict.talents.leader.positives.2",
    defaultMessage: `You make decisions easily and you aren't afraid of conflict.`,
  },
  "dict.talents.leader.positives.3": {
    id: "dict.talents.leader.positives.3",
    defaultMessage: `You like to be asked for your opinion and you love to speak up.`,
  },
  "dict.talents.leader.positives.4": {
    id: "dict.talents.leader.positives.4",
    defaultMessage: `Once you form your idea, you feel you need to share it with others. `,
  },
  "dict.talents.leader.positives.5": {
    id: "dict.talents.leader.positives.5",
    defaultMessage: `Even if it's unpleasant, you are not afraid of confrontation. `,
  },
  "dict.talents.leader.positives.6": {
    id: "dict.talents.leader.positives.6",
    defaultMessage: `You don't like it when things are unclear, it's the reason you push everyone to be more open, even if uncomfortable.`,
  },
  "dict.talents.leader.tips.1": {
    id: "dict.talents.leader.tips.1",
    defaultMessage: `Since it doesn't make you uncomfortable to be in conflict, you can support people who don't have the same talent to deliver their direct opinions.`,
  },
  "dict.talents.leader.tips.2": {
    id: "dict.talents.leader.tips.2",
    defaultMessage: `You may be a role model for people who lack self confidence and who like to be lead, consider that wisely so you can make a positive impact on others' lives.`,
  },
  "dict.talents.leader.tips.3": {
    id: "dict.talents.leader.tips.3",
    defaultMessage: `When you align body language and statements with your natural talent to command people, you'll be very persuasive.`,
  },
  "dict.talents.leader.tips.4": {
    id: "dict.talents.leader.tips.4",
    defaultMessage: `Seek roles where you can best apply your talent of persuasion like in Sales or Politics. `,
  },
  "dict.talents.leader.tips.5": {
    id: "dict.talents.leader.tips.5",
    defaultMessage: `Try to build strength through your openness, people will then turn to you for your opinions.`,
  },
  "dict.talents.communicator.name": {
    id: "dict.talents.communicator.name",
    defaultMessage: "Communicator",
  },
  "dict.talents.communicator.positives.1": {
    id: "dict.talents.communicator.positives.1",
    defaultMessage: `You are the master of communication.`,
  },
  "dict.talents.communicator.positives.2": {
    id: "dict.talents.communicator.positives.2",
    defaultMessage: `You love to be listened to and to speak in public. `,
  },
  "dict.talents.communicator.positives.3": {
    id: "dict.talents.communicator.positives.3",
    defaultMessage: `Situations where you cannot express yourself with words are annoying to you.`,
  },
  "dict.talents.communicator.positives.4": {
    id: "dict.talents.communicator.positives.4",
    defaultMessage: `You have the ability to summarize different points which can help others to understand the situation more clearly.`,
  },
  "dict.talents.communicator.positives.5": {
    id: "dict.talents.communicator.positives.5",
    defaultMessage: `An audience loves people who can present and communicate - you have a chance to succeed in this area. `,
  },
  "dict.talents.communicator.positives.6": {
    id: "dict.talents.communicator.positives.6",
    defaultMessage: `It's easy for you to lead a conversation, just don't forget to leave space for others to express themselves.`,
  },
  "dict.talents.communicator.tips.1": {
    id: "dict.talents.communicator.tips.1",
    defaultMessage: `Seek roles which fit you best (moderator, speaker, journalist, politics).`,
  },
  "dict.talents.communicator.tips.2": {
    id: "dict.talents.communicator.tips.2",
    defaultMessage: `Since you may excel in storytelling, read a lot or listen to different audio books, so you have the ability to impress other people with your knowledge.`,
  },
  "dict.talents.communicator.tips.3": {
    id: "dict.talents.communicator.tips.3",
    defaultMessage: `Getting other people's attention is what drives you, try to include images and metaphors into your story telling to make it more vivid.`,
  },
  "dict.talents.communicator.tips.4": {
    id: "dict.talents.communicator.tips.4",
    defaultMessage: `Even though you are naturally strong in communication, practice is a must in order to perform at your best. The more you practice, the more naturally you'll improvise.`,
  },
  "dict.talents.communicator.tips.5": {
    id: "dict.talents.communicator.tips.5",
    defaultMessage: `Use your talent, improve it and excel in it. You can volunteer for situations where you can present. Every step towards excellence increases your confidence.`,
  },
  "dict.talents.challenger.name": {
    id: "dict.talents.challenger.name",
    defaultMessage: "Challenger",
  },
  "dict.talents.challenger.positives.1": {
    id: "dict.talents.challenger.positives.1",
    defaultMessage: `You love challenges.`,
  },
  "dict.talents.challenger.positives.2": {
    id: "dict.talents.challenger.positives.2",
    defaultMessage: `You have the ability to turn a difficult challenge into a competition or a game.`,
  },
  "dict.talents.challenger.positives.3": {
    id: "dict.talents.challenger.positives.3",
    defaultMessage: `You find yourself lost in situations which are not competitive.`,
  },
  "dict.talents.challenger.positives.4": {
    id: "dict.talents.challenger.positives.4",
    defaultMessage: `It is not just about achieving goals but you need your efforts and performance to be recognized by others.`,
  },
  "dict.talents.challenger.positives.5": {
    id: "dict.talents.challenger.positives.5",
    defaultMessage: `You need to compete with other people and win to be fully fulfilled.`,
  },
  "dict.talents.challenger.positives.6": {
    id: "dict.talents.challenger.positives.6",
    defaultMessage: `Losing frustrates you, so you prefer contests where you feel you have a chance to win.`,
  },
  "dict.talents.challenger.tips.1": {
    id: "dict.talents.challenger.tips.1",
    defaultMessage: `Try to be in environments which have a defined measure of success (competing with others can show you what you are truly good at).`,
  },
  "dict.talents.challenger.tips.2": {
    id: "dict.talents.challenger.tips.2",
    defaultMessage: `Sometimes, people may find you arrogant or too competitive - try to be aware of the consequences of your actions to not uselessly harm your relationships or people around you.`,
  },
  "dict.talents.challenger.tips.3": {
    id: "dict.talents.challenger.tips.3",
    defaultMessage: `It's always good to set your goals high, yet when confronted with constant failure it could have a negative effect on your wellbeing.`,
  },
  "dict.talents.challenger.tips.4": {
    id: "dict.talents.challenger.tips.4",
    defaultMessage: `You have fun by competing - try to turn your routine tasks into a kind of competition. Your performance will improve. And, don't forget to enjoy the feeling of winning! `,
  },
  "dict.talents.challenger.tips.5": {
    id: "dict.talents.challenger.tips.5",
    defaultMessage: `Spend time with role models who will grow and push your skills and knowledge to the next level.`,
  },
  "dict.talents.connector.name": {
    id: "dict.talents.connector.name",
    defaultMessage: "Connector",
  },
  "dict.talents.connector.positives.1": {
    id: "dict.talents.connector.positives.1",
    defaultMessage: `You have the ability to calm unstable waters.`,
  },
  "dict.talents.connector.positives.2": {
    id: "dict.talents.connector.positives.2",
    defaultMessage: `Putting people together and building bridges between them is your great talent.`,
  },
  "dict.talents.connector.positives.3": {
    id: "dict.talents.connector.positives.3",
    defaultMessage: `It frustrates you when people don't want to find common ground.`,
  },
  "dict.talents.connector.positives.4": {
    id: "dict.talents.connector.positives.4",
    defaultMessage: `You are more spiritual than other people, you believe we are all connected.`,
  },
  "dict.talents.connector.positives.5": {
    id: "dict.talents.connector.positives.5",
    defaultMessage: `You are a bridge builder for people from different backgrounds and cultures.`,
  },
  "dict.talents.connector.positives.6": {
    id: "dict.talents.connector.positives.6",
    defaultMessage: `You take care of others as you take care of yourself because you feel unity between all humans.`,
  },
  "dict.talents.connector.tips.1": {
    id: "dict.talents.connector.tips.1",
    defaultMessage: `Be careful who you do favours for.  You're a caring and considerate person which other people may try to take advantage of.`,
  },
  "dict.talents.connector.tips.2": {
    id: "dict.talents.connector.tips.2",
    defaultMessage: `Your values are your life engine, whenever you feel down, remember them regularly - you can use the value feature in your Wellmee app.`,
  },
  "dict.talents.connector.tips.3": {
    id: "dict.talents.connector.tips.3",
    defaultMessage: `Think of roles where you could apply your abilities to connect people, helping them to have a dialogue (whether it's working for communities or organizing a book club).`,
  },
  "dict.talents.connector.tips.4": {
    id: "dict.talents.connector.tips.4",
    defaultMessage: `Since you're a good listener people know they can rely on you and that is what makes you a good intermediator to help achieve balance, don't lose that gained trust of others.`,
  },
  "dict.talents.connector.tips.5": {
    id: "dict.talents.connector.tips.5",
    defaultMessage: `Don't spend too much energy on people who don't follow your intuitive feelings because that is what your talent is mainly built on. Not everyone needs to agree with your style.`,
  },
  "dict.talents.empathizer.name": {
    id: "dict.talents.empathizer.name",
    defaultMessage: "Empathizer",
  },
  "dict.talents.empathizer.positives.1": {
    id: "dict.talents.empathizer.positives.1",
    defaultMessage: `You have the ability to feel what other people feel, to share their perspective.`,
  },
  "dict.talents.empathizer.positives.2": {
    id: "dict.talents.empathizer.positives.2",
    defaultMessage: `It makes you feel good when your actions positively affect others.`,
  },
  "dict.talents.empathizer.positives.3": {
    id: "dict.talents.empathizer.positives.3",
    defaultMessage: `On the other hand you don't like it when you are asked to not pay attention to your feelings and rely purely on logic.`,
  },
  "dict.talents.empathizer.positives.4": {
    id: "dict.talents.empathizer.positives.4",
    defaultMessage: `You know how to build strong relationships.`,
  },
  "dict.talents.empathizer.positives.5": {
    id: "dict.talents.empathizer.positives.5",
    defaultMessage: `You can anticipate the need of others and you understand the emotions of people in different situations.`,
  },
  "dict.talents.empathizer.positives.6": {
    id: "dict.talents.empathizer.positives.6",
    defaultMessage: `You don't always need to agree with other people, don't have to show them sympathy, yet it's important you respect their feelings.`,
  },
  "dict.talents.empathizer.tips.1": {
    id: "dict.talents.empathizer.tips.1",
    defaultMessage: `You have an ability like few other people - use it for good, show people you understand and support them - it'll give you a great feeling of meaning and purpose in your life.`,
  },
  "dict.talents.empathizer.tips.2": {
    id: "dict.talents.empathizer.tips.2",
    defaultMessage: `Be careful to distinguish between Empathy and Sympathy. You don't have to always feel pity for the others - that would be sympathy, yet people will be happy if you show you can see the situation from their point of view.`,
  },
  "dict.talents.empathizer.tips.3": {
    id: "dict.talents.empathizer.tips.3",
    defaultMessage: `Consider helping others as a coach or mentor, the fact that you can build rapport with others will have a good impact on your relationships.`,
  },
  "dict.talents.empathizer.tips.4": {
    id: "dict.talents.empathizer.tips.4",
    defaultMessage: `As a skilled empathizer you know that sometimes situations don't require a word to be said, be aware that a smile, a gesture or a supportive touch on the arm may be exactly what is needed at any given time.`,
  },
  "dict.talents.empathizer.tips.5": {
    id: "dict.talents.empathizer.tips.5",
    defaultMessage: `Since you can emotionally adapt to others, this consumes a lot of your energy. Think of your wellbeing as well, keep some rituals during the day that help you to switch off to not experience burnout.`,
  },
  "dict.talents.concentrated.name": {
    id: "dict.talents.concentrated.name",
    defaultMessage: "Concentrated",
  },
  "dict.talents.concentrated.positives.1": {
    id: "dict.talents.concentrated.positives.1",
    defaultMessage: `You don't like to have things mixed up - you go step by step.`,
  },
  "dict.talents.concentrated.positives.2": {
    id: "dict.talents.concentrated.positives.2",
    defaultMessage: `Once you finish one thing, then you move to another.`,
  },
  "dict.talents.concentrated.positives.3": {
    id: "dict.talents.concentrated.positives.3",
    defaultMessage: `You hate to be distracted from your work.`,
  },
  "dict.talents.concentrated.positives.4": {
    id: "dict.talents.concentrated.positives.4",
    defaultMessage: `Without a properly set goal or destination you may find yourself frustrated.`,
  },
  "dict.talents.concentrated.positives.5": {
    id: "dict.talents.concentrated.positives.5",
    defaultMessage: `You're very good at clarifying for yourself what's important and what needs to be left behind.`,
  },
  "dict.talents.concentrated.positives.6": {
    id: "dict.talents.concentrated.positives.6",
    defaultMessage: `You can easily get into the flow and lose track of time when you do things that are aligned with your talents.`,
  },
  "dict.talents.concentrated.tips.1": {
    id: "dict.talents.concentrated.tips.1",
    defaultMessage: `You are a valuable member of any team, keeping focus on what has to be done while meeting deadlines.`,
  },
  "dict.talents.concentrated.tips.2": {
    id: "dict.talents.concentrated.tips.2",
    defaultMessage: `Don't take too many activities onto your shoulders, focusing on delivering it all can lead to delays which will irritate you.`,
  },
  "dict.talents.concentrated.tips.3": {
    id: "dict.talents.concentrated.tips.3",
    defaultMessage: `Since you are good in filtering what is efficient, you tend to be impatient. Try to give other people enough time to finish their job properly.`,
  },
  "dict.talents.concentrated.tips.4": {
    id: "dict.talents.concentrated.tips.4",
    defaultMessage: `Help other people to get back on track when they get distracted. `,
  },
  "dict.talents.concentrated.tips.5": {
    id: "dict.talents.concentrated.tips.5",
    defaultMessage: `When setting your destination, consider setting a measurable goal to be able to evaluate the progress of your actions.`,
  },
  "dict.talents.loverOfOrder.name": {
    id: "dict.talents.loverOfOrder.name",
    defaultMessage: "Lover of order",
  },
  "dict.talents.loverOfOrder.positives.1": {
    id: "dict.talents.loverOfOrder.positives.1",
    defaultMessage: `Things need to have proper structure in order for you to be comfortable in your life.`,
  },
  "dict.talents.loverOfOrder.positives.2": {
    id: "dict.talents.loverOfOrder.positives.2",
    defaultMessage: `On the other hand it's difficult for you to be in an environment where things are not in order.`,
  },
  "dict.talents.loverOfOrder.positives.3": {
    id: "dict.talents.loverOfOrder.positives.3",
    defaultMessage: `You like deadlines and setting up processes.`,
  },
  "dict.talents.loverOfOrder.positives.4": {
    id: "dict.talents.loverOfOrder.positives.4",
    defaultMessage: `Everything should be according to plan.`,
  },
  "dict.talents.loverOfOrder.positives.5": {
    id: "dict.talents.loverOfOrder.positives.5",
    defaultMessage: `You don't like surprises.`,
  },
  "dict.talents.loverOfOrder.positives.6": {
    id: "dict.talents.loverOfOrder.positives.6",
    defaultMessage: `You are detail oriented.`,
  },
  "dict.talents.loverOfOrder.tips.1": {
    id: "dict.talents.loverOfOrder.tips.1",
    defaultMessage: `Seek roles where you can use your positive approach towards responsibility, precision and punctuality.`,
  },
  "dict.talents.loverOfOrder.tips.2": {
    id: "dict.talents.loverOfOrder.tips.2",
    defaultMessage: `It's easier for you when things are predictable, be aware that there are people who don't follow the same way of order, try to communicate the benefits of itl with them.`,
  },
  "dict.talents.loverOfOrder.tips.3": {
    id: "dict.talents.loverOfOrder.tips.3",
    defaultMessage: `Things will never be perfect. You have the right to expect the same discipline from others but don't get too frustrated if you don't get it. Focus more on the outcome.`,
  },
  "dict.talents.loverOfOrder.tips.4": {
    id: "dict.talents.loverOfOrder.tips.4",
    defaultMessage: `You can improve processes and make them more efficient, try to apply it in the environments which are not very organized. `,
  },
  "dict.talents.loverOfOrder.tips.5": {
    id: "dict.talents.loverOfOrder.tips.5",
    defaultMessage: `Consider fields like Finance, Controlling or Compliance. Your focus on detail can make an impact on your organization.`,
  },
  "dict.talents.selfDeveloper.name": {
    id: "dict.talents.selfDeveloper.name",
    defaultMessage: "Self-developer",
  },
  "dict.talents.selfDeveloper.positives.1": {
    id: "dict.talents.selfDeveloper.positives.1",
    defaultMessage: `You love to learn new things and enhance your knowledge.`,
  },
  "dict.talents.selfDeveloper.positives.2": {
    id: "dict.talents.selfDeveloper.positives.2",
    defaultMessage: `You are open to new challenges because they push you to explore new areas.`,
  },
  "dict.talents.selfDeveloper.positives.3": {
    id: "dict.talents.selfDeveloper.positives.3",
    defaultMessage: `Being around people who know it all is not the most desirable thing you can imagine.`,
  },
  "dict.talents.selfDeveloper.positives.4": {
    id: "dict.talents.selfDeveloper.positives.4",
    defaultMessage: `You are thrilled more by the process of learning than the actual outcome.`,
  },
  "dict.talents.selfDeveloper.positives.5": {
    id: "dict.talents.selfDeveloper.positives.5",
    defaultMessage: `You don't necessarily have to become an expert, yet having a solid knowledge of the matter at hand can be satisfying for you.`,
  },
  "dict.talents.selfDeveloper.positives.6": {
    id: "dict.talents.selfDeveloper.positives.6",
    defaultMessage: `Pushing yourself towards gaining knowledge motivates you, regardless of whether it's about improvement of skills or learning new things.`,
  },
  "dict.talents.selfDeveloper.tips.1": {
    id: "dict.talents.selfDeveloper.tips.1",
    defaultMessage: `Find the right way for your learning, whether from reading a book, listening to audiobooks, or practicing - try to cut the process into different levels so you can track the progress and celebrate it. `,
  },
  "dict.talents.selfDeveloper.tips.2": {
    id: "dict.talents.selfDeveloper.tips.2",
    defaultMessage: `Don't put yourself under stress if you feel you aren't progressing. It helps first to analyze your talents. Practicing natural talents will be much more fun.`,
  },
  "dict.talents.selfDeveloper.tips.3": {
    id: "dict.talents.selfDeveloper.tips.3",
    defaultMessage: `People usually don't like changes, try to be supportive in case there can be something new learned from it. Learn it beforehand, then you'll be able to facilitate the change and feel better about your contribution.`,
  },
  "dict.talents.selfDeveloper.tips.4": {
    id: "dict.talents.selfDeveloper.tips.4",
    defaultMessage: `Seek roles which need adaptability. Changing environments may energize your efforts to learn new things (this could be a field of start ups, consulting, or technologies).`,
  },
  "dict.talents.selfDeveloper.tips.5": {
    id: "dict.talents.selfDeveloper.tips.5",
    defaultMessage: `The learning process doesn't end for you by finishing school or graduation, be open to adult education, sign up for courses or seminars regularly.`,
  },
  "dict.talents.positive.name": {
    id: "dict.talents.positive.name",
    defaultMessage: "Positive",
  },
  "dict.talents.positive.positives.1": {
    id: "dict.talents.positive.positives.1",
    defaultMessage: `Even in difficult times, you are easily able to remind yourself of brighter moments of your life.`,
  },
  "dict.talents.positive.positives.2": {
    id: "dict.talents.positive.positives.2",
    defaultMessage: `You like to give praise about people's good points, and they like you for this.`,
  },
  "dict.talents.positive.positives.3": {
    id: "dict.talents.positive.positives.3",
    defaultMessage: `You are happy about what you have.`,
  },
  "dict.talents.positive.positives.4": {
    id: "dict.talents.positive.positives.4",
    defaultMessage: `It's difficult for negative people to drag you down.`,
  },
  "dict.talents.positive.positives.5": {
    id: "dict.talents.positive.positives.5",
    defaultMessage: `People like being influenced by your enthusiasm and being around you.`,
  },
  "dict.talents.positive.positives.6": {
    id: "dict.talents.positive.positives.6",
    defaultMessage: `You accept things can go wrong, but your positivity won't let you get too down.`,
  },
  "dict.talents.positive.tips.1": {
    id: "dict.talents.positive.tips.1",
    defaultMessage: `For some people it's hard to get back on track after falling off course, your positivity can help them get back on the right path.`,
  },
  "dict.talents.positive.tips.2": {
    id: "dict.talents.positive.tips.2",
    defaultMessage: `It's good that you are grateful for what you have, but don't be too satisfied as it can stop you from experiencing more deeply.  Life has much more to give, so let's explore it.`,
  },
  "dict.talents.positive.tips.3": {
    id: "dict.talents.positive.tips.3",
    defaultMessage: `Try to avoid people who sow negativity, it can be draining for you to move them toward the positive and it might just be out of your control.`,
  },
  "dict.talents.positive.tips.4": {
    id: "dict.talents.positive.tips.4",
    defaultMessage: `The ability to dramatize things and fill actions with optimism will help you to excel in roles like leadership, sales, or teaching.`,
  },
  "dict.talents.positive.tips.5": {
    id: "dict.talents.positive.tips.5",
    defaultMessage: `Feel free to show appreciation of others and concrete on what actions you liked.`,
  },
  "dict.talents.responsible.name": {
    id: "dict.talents.responsible.name",
    defaultMessage: "Responsible",
  },
  "dict.talents.responsible.positives.1": {
    id: "dict.talents.responsible.positives.1",
    defaultMessage: `Once pepole get to know you and know your values, you gain their trust and people know they can rely on you.`,
  },
  "dict.talents.responsible.positives.2": {
    id: "dict.talents.responsible.positives.2",
    defaultMessage: `You don't accept every request, you know some of them may be difficult to fulfill and you don't want to disappoint people.`,
  },
  "dict.talents.responsible.positives.3": {
    id: "dict.talents.responsible.positives.3",
    defaultMessage: `You can't stand it when promises get broken. `,
  },
  "dict.talents.responsible.positives.4": {
    id: "dict.talents.responsible.positives.4",
    defaultMessage: `You follow through on your commitments and you are happy if it leads to building trust.`,
  },
  "dict.talents.responsible.positives.5": {
    id: "dict.talents.responsible.positives.5",
    defaultMessage: `Avoidance of excuses is something that characterizes you.`,
  },
  "dict.talents.responsible.positives.6": {
    id: "dict.talents.responsible.positives.6",
    defaultMessage: `You hate to deliver unfished work, your good name depends on it.`,
  },
  "dict.talents.responsible.tips.1": {
    id: "dict.talents.responsible.tips.1",
    defaultMessage: `It's not always easy to deliver an outcome when people come to you with a request. Try to be more selective so it doesn't ruin you and your energy. Don't be afraid to say "no".`,
  },
  "dict.talents.responsible.tips.2": {
    id: "dict.talents.responsible.tips.2",
    defaultMessage: `If you can't deliver the outcome you'll try to make it up to people, be carerful not to be too emotionally connected to every single task you accept and be sure to take your capacity into account.`,
  },
  "dict.talents.responsible.tips.3": {
    id: "dict.talents.responsible.tips.3",
    defaultMessage: `Unlike many others, you thrive on responsibility, don't be afraid to volunteer for activities which require responsibility, you know you can deal with it.`,
  },
  "dict.talents.responsible.tips.4": {
    id: "dict.talents.responsible.tips.4",
    defaultMessage: `Surround yourself with people who share your sense of responsibility. It'll help you create an environment where you can excel.`,
  },
  "dict.talents.responsible.tips.5": {
    id: "dict.talents.responsible.tips.5",
    defaultMessage: `Be sure to make clear expectations about what needs to be delivered so no one can than second guess the quality of your work. Make measurable goals and milestones to plot your progress.`,
  },
  "dict.talents.selfBeliever.name": {
    id: "dict.talents.selfBeliever.name",
    defaultMessage: "Self-believer",
  },
  "dict.talents.selfBeliever.positives.1": {
    id: "dict.talents.selfBeliever.positives.1",
    defaultMessage: `You don't need others to boost your confidence, through reflection you can do it on your own.`,
  },
  "dict.talents.selfBeliever.positives.2": {
    id: "dict.talents.selfBeliever.positives.2",
    defaultMessage: `People admire you for your self-assurance.`,
  },
  "dict.talents.selfBeliever.positives.3": {
    id: "dict.talents.selfBeliever.positives.3",
    defaultMessage: `You are an independent and self-supportive person.`,
  },
  "dict.talents.selfBeliever.positives.4": {
    id: "dict.talents.selfBeliever.positives.4",
    defaultMessage: `You don't like it when you are told what to do and when somoene controls your actions.`,
  },
  "dict.talents.selfBeliever.positives.5": {
    id: "dict.talents.selfBeliever.positives.5",
    defaultMessage: `You aren't afraid to take risks and face new challenges to deliver results.`,
  },
  "dict.talents.selfBeliever.positives.6": {
    id: "dict.talents.selfBeliever.positives.6",
    defaultMessage: `You understand your unique existence on the Earth, you know it is you alone who is responsible for your life.`,
  },
  "dict.talents.selfBeliever.tips.1": {
    id: "dict.talents.selfBeliever.tips.1",
    defaultMessage: `Keep working on your talents to transform them into strengths, so you have faith in them which will again increase your self-confidence.`,
  },
  "dict.talents.selfBeliever.tips.2": {
    id: "dict.talents.selfBeliever.tips.2",
    defaultMessage: `Seek roles close to your expertise where you can make decisions. Making decisions is one of your biggest strengths.`,
  },
  "dict.talents.selfBeliever.tips.3": {
    id: "dict.talents.selfBeliever.tips.3",
    defaultMessage: `Don't be afraid of showing your confidence. It'll have an activating impact on people in your team.`,
  },
  "dict.talents.selfBeliever.tips.4": {
    id: "dict.talents.selfBeliever.tips.4",
    defaultMessage: `Since you're sure about yourself, you can calm yourself quickly. You can adapt this skill in sitautions which are hectic and disorganized. Your calmness can calm others, as well.`,
  },
  "dict.talents.selfBeliever.tips.5": {
    id: "dict.talents.selfBeliever.tips.5",
    defaultMessage: `You can excel in situations which require independence and a strong person which is not afraid of making a decision (fields of management, leadership or entreprenurial roles).`,
  },
  "dict.talents.solver.name": {
    id: "dict.talents.solver.name",
    defaultMessage: "Solver",
  },
  "dict.talents.solver.positives.1": {
    id: "dict.talents.solver.positives.1",
    defaultMessage: `It energizes you when you solve a problem.`,
  },
  "dict.talents.solver.positives.2": {
    id: "dict.talents.solver.positives.2",
    defaultMessage: `People admire you for your natural ability to analyze the issue and execute the perfect solution.`,
  },
  "dict.talents.solver.positives.3": {
    id: "dict.talents.solver.positives.3",
    defaultMessage: `You like to find bugs so you can fix them.`,
  },
  "dict.talents.solver.positives.4": {
    id: "dict.talents.solver.positives.4",
    defaultMessage: `You hate to leave unsolved issues behind you.`,
  },
  "dict.talents.solver.positives.5": {
    id: "dict.talents.solver.positives.5",
    defaultMessage: `You are not afraid to face even the most complex problems.`,
  },
  "dict.talents.solver.positives.6": {
    id: "dict.talents.solver.positives.6",
    defaultMessage: `It's one of your best moments when you fix bugs or solve problems and it was you who solved it.`,
  },
  "dict.talents.solver.tips.1": {
    id: "dict.talents.solver.tips.1",
    defaultMessage: `You can use your talent and experice of problem solving to set certain guidlines or processes which will prevent the issue from happening again.`,
  },
  "dict.talents.solver.tips.2": {
    id: "dict.talents.solver.tips.2",
    defaultMessage: `Your talents may be well wanted when problems occur and need to be fixed. Think of areas like healthcare, IT - programming, or consultancy. `,
  },
  "dict.talents.solver.tips.3": {
    id: "dict.talents.solver.tips.3",
    defaultMessage: `Become a subject expert so you minimalize the knowledge gap. You'd make a great first point of contact for people who use certain products/support services.`,
  },
  "dict.talents.solver.tips.4": {
    id: "dict.talents.solver.tips.4",
    defaultMessage: `With your "can solve" attitude be sure to stand back and let others find their own way to fix things, sometimes, both in life and work.`,
  },
  "dict.talents.solver.tips.5": {
    id: "dict.talents.solver.tips.5",
    defaultMessage: `Things will never be perfect, you cannot expect to solve everything. If it happens, be opened to discuss the problem with other people so you can share the knowledge and learn from each other.`,
  },
  "dict.talents.strategist.name": {
    id: "dict.talents.strategist.name",
    defaultMessage: "Strategist",
  },
  "dict.talents.strategist.positives.1": {
    id: "dict.talents.strategist.positives.1",
    defaultMessage: `You don't like easy tasks.`,
  },
  "dict.talents.strategist.positives.2": {
    id: "dict.talents.strategist.positives.2",
    defaultMessage: `You love it when you face challenges and when you can think a few steps ahead.`,
  },
  "dict.talents.strategist.positives.3": {
    id: "dict.talents.strategist.positives.3",
    defaultMessage: `You have an ability to see situations from a higher perspective which helps you to find the best way through.`,
  },
  "dict.talents.strategist.positives.4": {
    id: "dict.talents.strategist.positives.4",
    defaultMessage: `Where others see only problems you have the ability to see patterns.`,
  },
  "dict.talents.strategist.positives.5": {
    id: "dict.talents.strategist.positives.5",
    defaultMessage: `You have a great ability to analyze potential paths, select the best of them and strike forward.`,
  },
  "dict.talents.strategist.positives.6": {
    id: "dict.talents.strategist.positives.6",
    defaultMessage: `Your mind instinctively anticipates possible scenarios, so you can use it as much as you can.`,
  },
  "dict.talents.strategist.tips.1": {
    id: "dict.talents.strategist.tips.1",
    defaultMessage: `Having the skill to see the big picture can sometimes lead to the fact that you missed very important details. It helps to stop within the process, regularly, to look back to be sure nothing was missed.`,
  },
  "dict.talents.strategist.tips.2": {
    id: "dict.talents.strategist.tips.2",
    defaultMessage: `Don't hurry when thinking of next steps, you know it takes time to get the patterns to show up.`,
  },
  "dict.talents.strategist.tips.3": {
    id: "dict.talents.strategist.tips.3",
    defaultMessage: `Try to understand that not everyone has this ability and it takes them more time to connect the dots than you, be patient and try to be supportive.`,
  },
  "dict.talents.strategist.tips.4": {
    id: "dict.talents.strategist.tips.4",
    defaultMessage: `Your talent in strategizing can greatly help your organization, should you ever be involved in inititatives.  Be proactive in innovatively contributing to new ventures.`,
  },
  "dict.talents.strategist.tips.5": {
    id: "dict.talents.strategist.tips.5",
    defaultMessage: `Your capability to foresee potential issues in the future may make your colleagues play down your arguments because they need time to be proven right. Try to openly communicate your insights to show your assumptions are built on solid expectations.`,
  },
  "dict.talents.intellectual.name": {
    id: "dict.talents.intellectual.name",
    defaultMessage: "Intellectual",
  },
  "dict.talents.intellectual.positives.1": {
    id: "dict.talents.intellectual.positives.1",
    defaultMessage: `You enjoy mental activity.`,
  },
  "dict.talents.intellectual.positives.2": {
    id: "dict.talents.intellectual.positives.2",
    defaultMessage: `Intelectual discussions and contemplations are your favorite activities.`,
  },
  "dict.talents.intellectual.positives.3": {
    id: "dict.talents.intellectual.positives.3",
    defaultMessage: `Thinking comes before acting, it's natural for you.`,
  },
  "dict.talents.intellectual.positives.4": {
    id: "dict.talents.intellectual.positives.4",
    defaultMessage: `You enjoy time on your own because you can think about various things without being distracted by anyone else.`,
  },
  "dict.talents.intellectual.positives.5": {
    id: "dict.talents.intellectual.positives.5",
    defaultMessage: `You have the ability to imagine different scenarios in your mind, ask youreself questions and answer them back. You are introspective. `,
  },
  "dict.talents.intellectual.positives.6": {
    id: "dict.talents.intellectual.positives.6",
    defaultMessage: `You like it when someone challenges your thinking, so you can dig even more deeply into the matter.`,
  },
  "dict.talents.intellectual.tips.1": {
    id: "dict.talents.intellectual.tips.1",
    defaultMessage: `Areas of interest for you may be psychology or philosophy - anything what stimulates your thinking.`,
  },
  "dict.talents.intellectual.tips.2": {
    id: "dict.talents.intellectual.tips.2",
    defaultMessage: `Find your role models - people who think a lot - they will inspire you and show things from different perspectives.`,
  },
  "dict.talents.intellectual.tips.3": {
    id: "dict.talents.intellectual.tips.3",
    defaultMessage: `Some people may see you as a loner, if you care about what they think of you, try to explain to them that this is your way of finding reflection and that it actually energizes you to step away, then return back to the group, again.`,
  },
  "dict.talents.intellectual.tips.4": {
    id: "dict.talents.intellectual.tips.4",
    defaultMessage: `Take time for yourself, take time for thinking. And be careful who you challenge with your intelectual questions, not everyone needs or enjoys your open debates as much as you do. `,
  },
  "dict.talents.intellectual.tips.5": {
    id: "dict.talents.intellectual.tips.5",
    defaultMessage: `Consider writing or organizing discussion groups. This will both help to polish your thoughts as well as help you come up with new ones.`,
  },
});

// console.log(
//   "%c[TALENTS]",
//   "color:seagreen;",
//   Object.entries(TALENTS_EN).map(([k, v]) => [
//     k,
//     v.positives.length,
//     v.tips.length,
//   ])
// );

// Deciduous Tree
// Chart Increasing

const emojis = {
  analyser: "📊",
  believer: "🔮",
  challenger: "🏋️",
  coach: "🧑‍🏫",
  communicator: "🗣",
  concentrated: "🧘‍♀️",
  connector: "🤲",
  empathizer: "❤️",
  flexible: "🤸",
  ideamaker: "💡",
  initiator: "🙋‍♂️",
  intellectual: "🧑‍🎓",
  leader: "🥇",
  loverOfOrder: "📐",
  positive: "☀️",
  responsible: "🤝",
  selfBeliever: "💪",
  selfDeveloper: "👷‍♂️",
  solver: "🧩",
  strategist: "📈",
};

const talentsKeys = [
  "initiator",
  "flexible",
  "analyser",
  "believer",
  "ideamaker",
  "coach",
  "leader",
  "communicator",
  "challenger",
  "connector",
  "empathizer",
  "concentrated",
  "loverOfOrder",
  "selfDeveloper",
  "positive",
  "responsible",
  "selfBeliever",
  "solver",
  "strategist",
  "intellectual",
];

const getPositivesLength = (key) => ({ initiator: 8 }[key] ?? 6);

const translateTalent = (intl, key) => {
  const getId = (prop) => `dict.talents.${key}.${prop}`;

  return {
    name: intl.formatMessage({ ...messages[getId("name")] }),
    emoji: emojis[key],
    positives: [...Array(getPositivesLength(key))].map((_, i) =>
      intl.formatMessage({ ...messages[getId(`positives.${i + 1}`)] })
    ),
    tips: [...Array(5)].map((_, i) =>
      intl.formatMessage({ ...messages[getId(`tips.${i + 1}`)] })
    ),
  };
};

export const useTalentsDict = () => {
  // const { language, setLanguage } = useContext(I18nContext);
  const intl = useIntl();
  const talents = useMemo(
    () =>
      pipe(
        map((k) => [k, translateTalent(intl, k)]),
        fromPairs
      )(talentsKeys),
    [intl]
  );

  return useMemo(() => ({ talents }), [talents]);
};
