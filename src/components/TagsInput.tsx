import React, { useState, useRef, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TagsInputProps {
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
  maxTags?: number;
}

const TagsInput: React.FC<TagsInputProps> = ({
  value = [],
  onChange,
  placeholder = "Add tag...",
  className,
  maxTags = 10,
}) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // If Enter or comma is pressed, add the tag
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim() !== "") {
      e.preventDefault();
      addTag(inputValue);
    }
    // If backspace is pressed and input is empty, remove the last tag
    else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const addTag = (tag: string) => {
    const normalizedTag = tag.trim().toLowerCase();

    // Skip if tag is empty or already exists
    if (normalizedTag === "" || value.includes(normalizedTag)) {
      setInputValue("");
      return;
    }

    // Skip if we've reached the max number of tags
    if (value.length >= maxTags) {
      setInputValue("");
      return;
    }

    onChange([...value, normalizedTag]);
    setInputValue("");
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 p-2 border rounded-md min-h-10 bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        className
      )}
      onClick={handleContainerClick}
    >
      {value.map((tag, index) => (
        <Badge
          key={index}
          className="px-2 py-1 text-xs flex items-center gap-1"
        >
          {tag}
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              removeTag(index);
            }}
          />
        </Badge>
      ))}

      <Input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={value.length === 0 ? placeholder : ""}
        className="flex-grow border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-8"
        disabled={value.length >= maxTags}
      />

      {value.length >= maxTags && (
        <span className="text-xs text-muted-foreground">
          Max tags reached ({maxTags})
        </span>
      )}
    </div>
  );
};

export default TagsInput;
