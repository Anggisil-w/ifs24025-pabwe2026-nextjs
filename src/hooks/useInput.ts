import { useState, ChangeEvent } from "react";

export function useInput(initialValue: string = "") {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  return [value, handleChange, setValue] as const;
}