import { ReactionType } from "./enums";

export const reactions = [
  {
    type: ReactionType.LIKE,
    icon: "👍",
    value: "Đã thích",
    color: "text-blue-600",
  },
  {
    type: ReactionType.LOVE,
    icon: "❤️",
    value: "Đã yêu thích",
    color: "text-red-600",
  },
  {
    type: ReactionType.CARE,
    icon: "🤗",
    value: "Thương thương",
    color: "text-yellow-600",
  },
  {
    type: ReactionType.FUN,
    icon: "😆",
    value: "Vui vui",
    color: "text-green-600",
  },
  {
    type: ReactionType.WOW,
    icon: "😮",
    value: "Wow",
    color: "text-yellow-600",
  },
  {
    type: ReactionType.SAD,
    icon: "😢",
    value: "Buồn buồn",
    color: "text-orange-600",
  },
  {
    type: ReactionType.ANGRY,
    icon: "😡",
    value: "Giận dữ",
    color: "text-red-600",
  },
];
