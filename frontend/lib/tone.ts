export const TONE = {
  success: "bg-[#ECF9F2] text-[#289E68] border-[#C6EEDC]",
  info: "bg-[#EAF2FE] text-[#2C75EA] border-[#CBE0FC]",
  warning: "bg-[#FEF7E6] text-[#D08C0B] border-[#FBE4B2]",
  danger: "bg-[#FEECEB] text-[#D9423F] border-[#FBD0CF]",
  neutral: "bg-[#F2F4F8] text-[#72788A] border-[#E9EDF3]",
} as const;

export const DOT = {
  success: "bg-[#4AC48A]",
  info: "bg-[#5092F0]",
  warning: "bg-[#FAB62E]",
  danger: "bg-[#F36C69]",
  neutral: "bg-[#72788A]",
} as const;

export type Tone = keyof typeof TONE;
