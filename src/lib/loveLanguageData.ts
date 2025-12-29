export type LoveLanguageType = 'Words of Affirmation' | 'Quality Time' | 'Acts of Service' | 'Receiving Gifts' | 'Physical Touch';

export interface LoveLanguageQuestion {
  id: number;
  text: string;
  options: {
    label: string;
    value: LoveLanguageType;
  }[];
}

// Helper to keep data clean: A=Words, B=Time, C=Acts, D=Gifts, E=Touch
const MAP = {
  a: 'Words of Affirmation' as LoveLanguageType,
  b: 'Quality Time' as LoveLanguageType,
  c: 'Acts of Service' as LoveLanguageType,
  d: 'Receiving Gifts' as LoveLanguageType,
  e: 'Physical Touch' as LoveLanguageType
};

export const LOVE_LANGUAGE_QUESTIONS: LoveLanguageQuestion[] = [
  {
    id: 1, text: "You feel most loved when your partner:",
    options: [
      { label: "Says kind and encouraging words to you", value: MAP.a },
      { label: "Spends focused time with you", value: MAP.b },
      { label: "Helps you with something important", value: MAP.c },
      { label: "Gives you a thoughtful gift", value: MAP.d },
      { label: "Holds or hugs you", value: MAP.e }
    ]
  },
  {
    id: 2, text: "When you’re stressed, you prefer your partner to:",
    options: [
      { label: "Reassure you verbally", value: MAP.a },
      { label: "Sit with you and listen", value: MAP.b },
      { label: "Take responsibility for something", value: MAP.c },
      { label: "Surprise you with something meaningful", value: MAP.d },
      { label: "Comfort you physically", value: MAP.e }
    ]
  },
  {
    id: 3, text: "A meaningful expression of love to you is:",
    options: [
      { label: "A heartfelt message", value: MAP.a },
      { label: "Time set aside just for you", value: MAP.b },
      { label: "Practical help", value: MAP.c },
      { label: "A thoughtful gift", value: MAP.d },
      { label: "Physical closeness", value: MAP.e }
    ]
  },
  {
    id: 4, text: "You feel appreciated when your partner:",
    options: [
      { label: "Compliments or affirms you", value: MAP.a },
      { label: "Prioritizes time together", value: MAP.b },
      { label: "Shows care through actions", value: MAP.c },
      { label: "Gives you something symbolic", value: MAP.d },
      { label: "Shows affection", value: MAP.e }
    ]
  },
  {
    id: 5, text: "During conflict, what reassures you most?",
    options: [
      { label: "Hearing loving words", value: MAP.a },
      { label: "Talking it through together", value: MAP.b },
      { label: "Seeing effort to make things right", value: MAP.c },
      { label: "A peace-offering gift or gesture", value: MAP.d },
      { label: "Physical reassurance", value: MAP.e }
    ]
  },
  {
    id: 6, text: "You naturally express love by:",
    options: [
      { label: "Saying encouraging things", value: MAP.a },
      { label: "Making time for people", value: MAP.b },
      { label: "Helping and serving", value: MAP.c },
      { label: "Giving thoughtful gifts", value: MAP.d },
      { label: "Being physically affectionate", value: MAP.e }
    ]
  },
  {
    id: 7, text: "You feel disconnected when your partner:",
    options: [
      { label: "Stops affirming you", value: MAP.a },
      { label: "Is always too busy", value: MAP.b },
      { label: "Becomes unreliable", value: MAP.c },
      { label: "Stops being thoughtful", value: MAP.d },
      { label: "Avoids physical closeness", value: MAP.e }
    ]
  },
  {
    id: 8, text: "A perfect date for you includes:",
    options: [
      { label: "Meaningful conversation", value: MAP.a },
      { label: "Undistracted time together", value: MAP.b },
      { label: "Thoughtful planning or effort", value: MAP.c },
      { label: "A meaningful gift or surprise", value: MAP.d },
      { label: "Physical closeness", value: MAP.e }
    ]
  },
  {
    id: 9, text: "When someone praises you, you:",
    options: [
      { label: "Feel deeply encouraged", value: MAP.a },
      { label: "Appreciate it but prefer presence", value: MAP.b },
      { label: "Prefer actions over words", value: MAP.c },
      { label: "Appreciate symbolic gestures more", value: MAP.d },
      { label: "Prefer physical affection", value: MAP.e }
    ]
  },
  {
    id: 10, text: "You feel valued when your partner:",
    options: [
      { label: "Expresses appreciation verbally", value: MAP.a },
      { label: "Gives you their full attention", value: MAP.b },
      { label: "Supports you practically", value: MAP.c },
      { label: "Gives thoughtful gifts", value: MAP.d },
      { label: "Shows affection", value: MAP.e }
    ]
  },
  {
    id: 11, text: "When you miss your partner, you miss:",
    options: [
      { label: "Their encouraging words", value: MAP.a },
      { label: "Time spent together", value: MAP.b },
      { label: "Their help and support", value: MAP.c },
      { label: "Their thoughtful gestures", value: MAP.d },
      { label: "Their touch", value: MAP.e }
    ]
  },
  {
    id: 12, text: "You feel closest to your partner when:",
    options: [
      { label: "You exchange heartfelt words", value: MAP.a },
      { label: "You spend uninterrupted time", value: MAP.b },
      { label: "You work together on things", value: MAP.c },
      { label: "You exchange meaningful gifts", value: MAP.d },
      { label: "You are physically close", value: MAP.e }
    ]
  },
  {
    id: 13, text: "A loving apology includes:",
    options: [
      { label: "Verbal acknowledgment", value: MAP.a },
      { label: "Sitting together to talk", value: MAP.b },
      { label: "Corrective action", value: MAP.c },
      { label: "A peace-making gift", value: MAP.d },
      { label: "Comforting touch", value: MAP.e }
    ]
  },
  {
    id: 14, text: "You feel hurt when:",
    options: [
      { label: "Your efforts go unrecognized", value: MAP.a },
      { label: "Time together is neglected", value: MAP.b },
      { label: "Promises are not kept", value: MAP.c },
      { label: "Thoughtfulness disappears", value: MAP.d },
      { label: "Affection is withdrawn", value: MAP.e }
    ]
  },
  {
    id: 15, text: "You feel secure in love when:",
    options: [
      { label: "Love is spoken", value: MAP.a },
      { label: "Time is intentional", value: MAP.b },
      { label: "Actions match words", value: MAP.c },
      { label: "Thoughtfulness is shown", value: MAP.d },
      { label: "Affection is consistent", value: MAP.e }
    ]
  },
  {
    id: 16, text: "You naturally notice love when:",
    options: [
      { label: "Someone speaks kindly", value: MAP.a },
      { label: "Someone is fully present", value: MAP.b },
      { label: "Someone helps willingly", value: MAP.c },
      { label: "Someone gives meaningfully", value: MAP.d },
      { label: "Someone is affectionate", value: MAP.e }
    ]
  },
  {
    id: 17, text: "After time apart, you want:",
    options: [
      { label: "Reassuring words", value: MAP.a },
      { label: "Time to reconnect", value: MAP.b },
      { label: "Practical support", value: MAP.c },
      { label: "A thoughtful gift", value: MAP.d },
      { label: "Physical closeness", value: MAP.e }
    ]
  },
  {
    id: 18, text: "Your emotional tank fills fastest when:",
    options: [
      { label: "You are affirmed", value: MAP.a },
      { label: "You feel prioritized", value: MAP.b },
      { label: "You feel supported", value: MAP.c },
      { label: "You receive meaningful gifts", value: MAP.d },
      { label: "You feel physically connected", value: MAP.e }
    ]
  },
  {
    id: 19, text: "You show appreciation by:",
    options: [
      { label: "Saying it clearly", value: MAP.a },
      { label: "Spending quality time", value: MAP.b },
      { label: "Doing helpful things", value: MAP.c },
      { label: "Giving thoughtful gifts", value: MAP.d },
      { label: "Showing affection", value: MAP.e }
    ]
  },
  {
    id: 20, text: "Love feels strongest to you when:",
    options: [
      { label: "Words are kind and affirming", value: MAP.a },
      { label: "Time is shared intentionally", value: MAP.b },
      { label: "Care is shown through actions", value: MAP.c },
      { label: "Thoughtfulness is expressed with gifts", value: MAP.d },
      { label: "Affection is present", value: MAP.e }
    ]
  }
];

export const LOVE_LANGUAGE_DESCRIPTIONS: Record<LoveLanguageType, string> = {
  "Words of Affirmation": "You feel most loved when you hear it. Unsolicited compliments, verbal encouragement, and words of appreciation mean the world to you. Insults can leave you shattered and are not easily forgotten.",
  "Quality Time": "Nothing says 'I love you' like full, undivided attention. Being there for this person is critical, but really being there—with the TV off, fork and knife down, and all chores and tasks on standby—makes them feel truly special.",
  "Acts of Service": "Can vacuuming the floors really be an expression of love? Absolutely! Anything you do to ease the burden of responsibilities weighing on an 'Acts of Service' person will speak volumes.",
  "Receiving Gifts": "Don’t mistake this love language for materialism; the receiver of gifts thrives on the love, thoughtfulness, and effort behind the gift. If you speak this language, the perfect gift or gesture shows that you are known, cared for, and prized.",
  "Physical Touch": "To this person, nothing speaks more deeply than appropriate touch. Hugs, a pat on the back, holding hands, and thoughtful touches on the arm, shoulder, or face—they can all be ways to show excitement, concern, care, and love."
};