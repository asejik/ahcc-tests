export type AttachmentStyle = 'Secure' | 'Anxious' | 'Avoidant' | 'Fearful-Avoidant';

export interface AttachmentQuestion {
  id: number;
  text: string;
  style: AttachmentStyle;
}

export const ATTACHMENT_QUESTIONS: AttachmentQuestion[] = [
  // A. SECURE
  { id: 1, text: "I am comfortable depending on others and having them depend on me.", style: "Secure" },
  { id: 2, text: "I find it easy to express my feelings in relationships.", style: "Secure" },
  { id: 3, text: "I feel secure even when my partner is not physically present.", style: "Secure" },
  { id: 4, text: "I believe I am worthy of love and healthy relationships.", style: "Secure" },
  { id: 5, text: "I can handle conflict without feeling threatened.", style: "Secure" },
  { id: 6, text: "I enjoy closeness but also value personal space.", style: "Secure" },

  // B. ANXIOUS
  { id: 7, text: "I often worry that people I love will leave me.", style: "Anxious" },
  { id: 8, text: "I need frequent reassurance to feel secure.", style: "Anxious" },
  { id: 9, text: "I fear that my partner may not love me as much as I love them.", style: "Anxious" },
  { id: 10, text: "I tend to overthink small changes in someone’s behavior.", style: "Anxious" },
  { id: 11, text: "I feel upset easily when I sense emotional distance.", style: "Anxious" },
  { id: 12, text: "I find it hard to relax unless I feel completely accepted.", style: "Anxious" },

  // C. AVOIDANT
  { id: 13, text: "I find it difficult to trust people fully.", style: "Avoidant" },
  { id: 14, text: "I feel uncomfortable when someone gets too close to me emotionally.", style: "Avoidant" },
  { id: 15, text: "I prefer to handle problems on my own.", style: "Avoidant" },
  { id: 16, text: "I often pull away when relationships become too intense.", style: "Avoidant" },
  { id: 17, text: "I struggle to express my deeper emotions.", style: "Avoidant" },
  { id: 18, text: "I value independence more than closeness.", style: "Avoidant" },

  // D. FEARFUL-AVOIDANT
  { id: 19, text: "I want closeness but get scared when it actually happens.", style: "Fearful-Avoidant" },
  { id: 20, text: "I feel torn between wanting love and pushing people away.", style: "Fearful-Avoidant" },
  { id: 21, text: "I sometimes sabotage relationships even when I care deeply.", style: "Fearful-Avoidant" },
  { id: 22, text: "I find it hard to trust people because I fear getting hurt.", style: "Fearful-Avoidant" },
  { id: 23, text: "I get overwhelmed by emotions in close relationships.", style: "Fearful-Avoidant" },
  { id: 24, text: "I struggle to maintain stable feelings toward people.", style: "Fearful-Avoidant" },
];

export const ATTACHMENT_DESCRIPTIONS = {
  "Secure": "You feel safe with love, express emotions well, trust easily, and handle conflict in a healthy way. You build stable, balanced relationships and connect with confidence.",
  "Anxious": "You crave closeness deeply but also fear losing it. You may seek reassurance often and overthink emotional signs. With support, you can learn deeper emotional security.",
  "Avoidant": "You value independence strongly and may fear relying on others. You protect yourself by keeping emotional distance. You can learn safe closeness without feeling overwhelmed.",
  "Fearful-Avoidant": "You desire love but fear it at the same time. You may struggle with trust, emotional overwhelm, or self-protection. Healing helps you build safer, more stable connections."
};