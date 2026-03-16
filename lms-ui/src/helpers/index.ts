export const getCourseLevelLabel = (level: string) => {
  switch (level) {
    case "beginner":
      return "Cơ bản";
    case "intermediate":
      return "Trung bình";
    case "advanced":
      return "Nâng cao";
    default:
      return "Không xác định";
  }
};
