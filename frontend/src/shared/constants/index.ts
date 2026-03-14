export const listPerPage = [
  { label: "5", value: "5" },
  { label: "10", value: "10" },
  { label: "20", value: "20" },
];

export const FILTER_REVIEW_CMS = [
  {
    label: "Từ 4.5 trở lên",
    value: "4.5",
  },
  {
    label: "Từ 4 trở lên",
    value: "4",
  },
  {
    label: "Từ 3.5 trở lên",
    value: "3.5",
  },
  {
    label: "Từ 2 trở lên",
    value: "2",
  },
  {
    label: "Từ 0.5 trở lên",
    value: "0.5",
  },
];

export const ITEMS_PER_PAGE = 10;
export const LIST_PER_PAGES = [
  { label: "5", value: "5" },
  { label: "10", value: "10" },
  { label: "20", value: "20" },
];

export const editorOptions = (
  field: any,
  theme: any,
  height: number = 300,
) => ({
  initialValue: "",
  onBlur: field.onBlur,
  onEditorChange: (content: any) => field.onChange(content),
  init: {
    codesample_global_prismjs: true,
    skin: theme === "dark" ? "oxide-dark" : "oxide",
    height,
    menubar: false,
    plugins: [
      "advlist",
      "autolink",
      "lists",
      "link",
      "image",
      "charmap",
      "preview",
      "anchor",
      "searchreplace",
      "visualblocks",
      "codesample",
      "fullscreen",
      "insertdatetime",
      "media",
      "table",
      "heading",
    ],
    toolbar:
      "undo redo | " +
      "codesample | bold italic forecolor | alignleft aligncenter |" +
      "alignright alignjustify | bullist numlist |" +
      "image |" +
      "h1 h2 h3 h4 h5 h6 | preview | fullscreen |" +
      "link",
    content_style: `@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap');body { font-family: Manrope,Helvetica,Arial,sans-serif; font-size:15px; line-height: 2; padding-bottom: 32px; } img { max-width: 100%; height: auto; display: block; margin: 0 auto; };`,
  },
});

export const DEFAULT_AVATAR = "/images/profile-photo.webp";
export const DEFAULT_IMAGE = "/images/default-image.jpg";
