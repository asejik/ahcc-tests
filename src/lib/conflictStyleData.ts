export type ConflictStyleType = 'Avoiding' | 'Accommodating' | 'Competing' | 'Compromising' | 'Collaborating';

export interface ConflictStyleQuestion {
  id: number;
  text: string;
  options: {
    label: string;
    value: ConflictStyleType;
  }[];
}

// Map: a=Avoiding, b=Accommodating, c=Competing, d=Compromising, e=Collaborating
const MAP = {
  a: 'Avoiding' as ConflictStyleType,
  b: 'Accommodating' as ConflictStyleType,
  c: 'Competing' as ConflictStyleType,
  d: 'Compromising' as ConflictStyleType,
  e: 'Collaborating' as ConflictStyleType
};

export const CONFLICT_STYLE_QUESTIONS: ConflictStyleQuestion[] = [
  {
    id: 1, text: "When a disagreement arises, you usually:",
    options: [
      { label: "Step back and avoid it", value: MAP.a },
      { label: "Let the other person have their way", value: MAP.b },
      { label: "Stand firm on your position", value: MAP.c },
      { label: "Look for a compromise", value: MAP.d },
      { label: "Work together to solve it", value: MAP.e }
    ]
  },
  {
    id: 2, text: "You feel uncomfortable when:",
    options: [
      { label: "Conflict is ignored", value: MAP.a },
      { label: "Your needs aren’t prioritized", value: MAP.b },
      { label: "Others challenge you", value: MAP.c },
      { label: "You can’t reach a middle ground", value: MAP.d },
      { label: "Solutions are forced without discussion", value: MAP.e }
    ]
  },
  {
    id: 3, text: "Your instinct during arguments is to:",
    options: [
      { label: "Withdraw", value: MAP.a },
      { label: "Give in", value: MAP.b },
      { label: "Assert strongly", value: MAP.c },
      { label: "Negotiate", value: MAP.d },
      { label: "Collaborate", value: MAP.e }
    ]
  },
  {
    id: 4, text: "You are most satisfied with outcomes that:",
    options: [
      { label: "Keep peace by staying out of it", value: MAP.a },
      { label: "Please the other person", value: MAP.b },
      { label: "Win in the discussion", value: MAP.c },
      { label: "Balance both sides", value: MAP.d },
      { label: "Satisfy everyone fully", value: MAP.e }
    ]
  },
  {
    id: 5, text: "When tensions rise, you tend to:",
    options: [
      { label: "Avoid confrontation", value: MAP.a },
      { label: "Yield to reduce tension", value: MAP.b },
      { label: "Defend your position", value: MAP.c },
      { label: "Find a compromise", value: MAP.d },
      { label: "Talk through to a win-win solution", value: MAP.e }
    ]
  },
  {
    id: 6, text: "In conflicts at work or home, you:",
    options: [
      { label: "Stay silent", value: MAP.a },
      { label: "Focus on others’ wishes", value: MAP.b },
      { label: "Push your viewpoint", value: MAP.c },
      { label: "Seek middle ground", value: MAP.d },
      { label: "Explore all perspectives", value: MAP.e }
    ]
  },
  {
    id: 7, text: "You feel respected when:",
    options: [
      { label: "You are left out of conflict", value: MAP.a },
      { label: "Others’ feelings are prioritized", value: MAP.b },
      { label: "Your opinion is heard and wins", value: MAP.c },
      { label: "An equitable solution is found", value: MAP.d },
      { label: "All voices are included and valued", value: MAP.e }
    ]
  },
  {
    id: 8, text: "Others describe your conflict style as:",
    options: [
      { label: "Withdrawn", value: MAP.a },
      { label: "Agreeable", value: MAP.b },
      { label: "Assertive", value: MAP.c },
      { label: "Balanced", value: MAP.d },
      { label: "Collaborative", value: MAP.e }
    ]
  },
  {
    id: 9, text: "When a dispute becomes heated, you:",
    options: [
      { label: "Walk away", value: MAP.a },
      { label: "Let the other person take control", value: MAP.b },
      { label: "Push harder for your side", value: MAP.c },
      { label: "Offer concessions", value: MAP.d },
      { label: "Work together to resolve", value: MAP.e }
    ]
  },
  {
    id: 10, text: "You are frustrated when:",
    options: [
      { label: "People force confrontation", value: MAP.a },
      { label: "Others dismiss your input", value: MAP.b },
      { label: "People don’t yield", value: MAP.c },
      { label: "Compromise is rejected", value: MAP.d },
      { label: "Collaboration fails", value: MAP.e }
    ]
  },
  {
    id: 11, text: "Your goal in disagreements is usually to:",
    options: [
      { label: "Avoid tension", value: MAP.a },
      { label: "Keep the other happy", value: MAP.b },
      { label: "Win", value: MAP.c },
      { label: "Reach a fair deal", value: MAP.d },
      { label: "Solve the problem together", value: MAP.e }
    ]
  },
  {
    id: 12, text: "You feel anxious if:",
    options: [
      { label: "You have to confront someone", value: MAP.a },
      { label: "You can’t meet others’ needs", value: MAP.b },
      { label: "You might lose an argument", value: MAP.c },
      { label: "No compromise is possible", value: MAP.d },
      { label: "Collaboration isn’t effective", value: MAP.e }
    ]
  },
  {
    id: 13, text: "Your communication in conflict tends to be:",
    options: [
      { label: "Minimal", value: MAP.a },
      { label: "Agreeable", value: MAP.b },
      { label: "Assertive", value: MAP.c },
      { label: "Balanced", value: MAP.d },
      { label: "Open and inclusive", value: MAP.e }
    ]
  },
  {
    id: 14, text: "You are most likely to give in when:",
    options: [
      { label: "Avoiding is necessary", value: MAP.a },
      { label: "Others insist strongly", value: MAP.b },
      { label: "You see a benefit in winning later", value: MAP.c },
      { label: "A fair middle is available", value: MAP.d },
      { label: "Collaboration feels impossible", value: MAP.e }
    ]
  },
  {
    id: 15, text: "You feel empowered when:",
    options: [
      { label: "Tension is avoided", value: MAP.a },
      { label: "Others are happy", value: MAP.b },
      { label: "Your stance is respected", value: MAP.c },
      { label: "Both sides gain something", value: MAP.d },
      { label: "A true solution is found", value: MAP.e }
    ]
  },
  {
    id: 16, text: "You handle repeated conflicts by:",
    options: [
      { label: "Ignoring them", value: MAP.a },
      { label: "Yielding more", value: MAP.b },
      { label: "Pushing back", value: MAP.c },
      { label: "Seeking compromise", value: MAP.d },
      { label: "Engaging collaboratively", value: MAP.e }
    ]
  },
  {
    id: 17, text: "When emotions escalate, you:",
    options: [
      { label: "Withdraw quietly", value: MAP.a },
      { label: "Soften to accommodate", value: MAP.b },
      { label: "Stand your ground", value: MAP.c },
      { label: "Offer solutions", value: MAP.d },
      { label: "Facilitate discussion", value: MAP.e }
    ]
  },
  {
    id: 18, text: "Your strongest conflict skill is:",
    options: [
      { label: "Staying calm by avoiding", value: MAP.a },
      { label: "Pleasing others", value: MAP.b },
      { label: "Assertiveness", value: MAP.c },
      { label: "Negotiation", value: MAP.d },
      { label: "Collaboration", value: MAP.e }
    ]
  },
  {
    id: 19, text: "You tend to feel guilty when:",
    options: [
      { label: "You avoid confrontation", value: MAP.a },
      { label: "You don’t accommodate", value: MAP.b },
      { label: "You compete too strongly", value: MAP.c },
      { label: "You can’t compromise", value: MAP.d },
      { label: "Collaboration fails", value: MAP.e }
    ]
  },
  {
    id: 20, text: "Overall, your conflict style is:",
    options: [
      { label: "Avoiding", value: MAP.a },
      { label: "Accommodating", value: MAP.b },
      { label: "Competing", value: MAP.c },
      { label: "Compromising", value: MAP.d },
      { label: "Collaborating", value: MAP.e }
    ]
  }
];

export const CONFLICT_STYLE_DESCRIPTIONS: Record<ConflictStyleType, string> = {
  "Avoiding": "You prefer to withdraw from conflict or ignore it to maintain peace. While this reduces immediate tension, it may leave issues unresolved.",
  "Accommodating": "You prioritize the other person's needs over your own. You are cooperative and selfless, but may struggle to assert your own boundaries.",
  "Competing": "You are assertive and pursue your own concerns. You stand firm, which is useful in emergencies, but can strain relationships if overused.",
  "Compromising": "You seek a middle-ground solution where both parties give up something. It's a quick way to find fairness, though sometimes depth is lost.",
  "Collaborating": "You aim for a win-win solution that fully satisfies everyone. You dig into the underlying issues, which takes time but builds strong relationships."
};