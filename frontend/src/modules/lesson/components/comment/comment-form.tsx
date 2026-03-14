"use client";
import { useAuth } from "@/shared/contexts/auth-context";
import { Avatar, Button } from "@heroui/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { useAppSelector } from "@/shared/store";
import {
  TCommentFormData,
  TCommentItem,
  CommentLesson,
} from "@/shared/types/comment";
import { uniqBy } from "lodash";

interface CommentFormProps {
  comment?: CommentLesson;
  onSubmit: (data: TCommentFormData) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

interface IMentionItem {
  id: string;
  username: string;
  avatar?: string;
}

const CommentForm = ({
  comment,
  onSubmit,
  onCancel,
  isEdit,
}: CommentFormProps) => {
  const { comments } = useAppSelector((state) => state.comment);

  const editorRef = useRef<HTMLDivElement>(null);
  const [suggestions, setSuggestions] = useState<IMentionItem[]>([]);

  const [users, setUsers] = useState<IMentionItem[]>([]);

  const [showSuggestions, setShowSuggestions] = useState(false);

  const { isSubmitting } = useAppSelector((state) => state.comment);
  const { user } = useAuth();

  const insertMention = (item: IMentionItem) => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const range = sel.getRangeAt(0);

    // Bước 1: Tìm node text đang nhập và nội dung phía trước con trỏ
    const container = range.startContainer;
    const offset = range.startOffset;

    if (container.nodeType !== Node.TEXT_NODE) {
      return;
    }

    const textNode = container;
    const text = textNode.textContent || "";
    const before = text.slice(0, offset);
    const after = text.slice(offset);

    // Bước 2: Tìm @keyword để xóa đi
    const match = /@(\w*)$/.exec(before);
    if (!match) return;

    const matchStart = before.lastIndexOf(match[0]);
    const newText = before.slice(0, matchStart) + after;
    textNode.textContent = newText;

    // Bước 3: Tạo thẻ mention
    const span = document.createElement("span");

    span.contentEditable = "false";
    span.dataset.id = item.id;
    span.innerText = `@${item.username}`;

    const space = document.createTextNode("\u00A0");

    // Bước 4: Đặt lại con trỏ về đúng chỗ để chèn mention
    const newRange = document.createRange();
    newRange.setStart(textNode, matchStart);
    newRange.setEnd(textNode, matchStart);
    sel.removeAllRanges();
    sel.addRange(newRange);

    // Bước 5: Chèn mention và khoảng trắng
    newRange.insertNode(space);
    newRange.insertNode(span);

    // Đưa con trỏ sau khoảng trắng
    const cursor = document.createRange();
    cursor.setStartAfter(space);
    cursor.collapse(true);
    sel.removeAllRanges();
    sel.addRange(cursor);

    editorRef.current?.focus();
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const sel = window.getSelection();
    const node = sel?.anchorNode?.parentElement;

    // Nếu đang đứng sau một mention và bấm backspace → xóa nguyên mention
    if (
      e.key === "Backspace" &&
      node?.classList.contains("mention") &&
      sel?.anchorOffset === 1
    ) {
      e.preventDefault();
      node.remove();
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const text = e.currentTarget.innerText;
    const match = /@(\w*)$/.exec(text);
    if (match) {
      const keyword = match[1];

      const filtered = users.filter((u) =>
        u.username.toLowerCase().includes(keyword.toLowerCase()),
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const editor = editorRef.current;
    if (!editor) return;

    const html = editor.innerHTML;

    // ✅ Lấy mention span trong editor
    const mentionSpans = editor.querySelectorAll("span");

    const mentions = Array.from(mentionSpans)
      .map((el) => el.getAttribute("data-id"))
      .filter((id): id is string => id !== null);

    if (html.trim()) {
      onSubmit({
        content: html,
        mentions,
      });
      editor.innerHTML = "";
    }
  };

  const setCaretToEndWithSpace = (el: HTMLElement) => {
    if (!el) return;

    el.focus(); // 👈 focus trước để đảm bảo range hoạt động

    const space = document.createTextNode("\u00A0");
    el.appendChild(space);

    const range = document.createRange();
    range.setStartAfter(space);
    range.collapse(true);

    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  };

  const insertMentionSpan = (
    el: HTMLElement,
    user: { _id: string; username: string },
  ) => {
    const span = document.createElement("span");
    span.contentEditable = "false";
    span.dataset.id = user._id;
    span.className = "mention";
    span.innerText = `@${user.username}`;
    el.appendChild(span);
  };

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.innerHTML = "";

    // 👉 Case 1: Không có comment
    if (!comment) {
      editor.focus();
      return;
    }

    // 👉 Case 2: Đang edit comment
    if (isEdit) {
      editor.innerHTML = comment.content;
      setTimeout(() => {
        setCaretToEndWithSpace(editor);
      }, 500);
      return;
    }

    // 👉 Case 3: Đang reply
    if (user?._id !== comment.user?._id)
      insertMentionSpan(editor, comment.user);
    setCaretToEndWithSpace(editor);
  }, [comment, isEdit]);

  useEffect(() => {
    if (!comments?.length) return;

    const filtered = comments.filter(
      (item: TCommentItem) => item.user?._id !== user?._id,
    );

    const mapped = filtered.map((it: TCommentItem) => ({
      id: it.user?._id,
      username: it.user?.username,
      avatar: it.user?.avatar,
    }));

    const unique = uniqBy(mapped, "id"); // remove duplicates by id

    setSuggestions(unique);
    setUsers(unique);
  }, [comments, comment, user?._id]);
  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-start gap-2">
        <Image
          src={user?.avatar || "/images/profile-photo.webp"}
          width={40}
          height={40}
          alt=""
          className="shrink-0 rounded-full"
        />
        <div className="relative w-full">
          <div
            ref={editorRef}
            contentEditable
            className="comment min-h-20 rounded-md border border-gray-300 p-2 outline-none empty:before:text-gray-400 empty:before:content-[attr(data-placeholder)]"
            data-placeholder="Viết bình luận..."
            onInput={handleInput}
            onKeyDown={handleKeyDown}
          />

          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-10 mt-0 max-h-[150px] w-[200px] overflow-y-auto rounded-md border border-gray-300 bg-white">
              {suggestions.map((item) => (
                <li
                  className="flex cursor-pointer items-center gap-2 px-3 py-1.5 hover:bg-gray-100"
                  key={item.id}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    insertMention(item);
                  }}
                >
                  <Avatar
                    showFallback
                    as="button"
                    className="transition-transform"
                    name={item?.username}
                    size="sm"
                    src={item?.avatar}
                  />
                  <span> {item.username}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="ml-auto mt-4 flex w-full items-center justify-end gap-2">
        <Button
          type="button"
          radius="full"
          className="px-4 font-bold"
          variant="light"
          size="md"
          onPress={onCancel}
        >
          Hủy
        </Button>
        <Button
          type="submit"
          radius="full"
          className="flex items-center bg-gradient-to-r from-purple-500 to-pink-500 px-4 text-center font-medium text-white transition-all hover:bg-gradient-to-l focus:outline-none"
          size="md"
          isDisabled={isSubmitting}
          isLoading={isSubmitting}
        >
          {isEdit ? "Cập nhật" : "Phản hồi"}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
