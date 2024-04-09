"use client";

import { useTheme } from "next-themes"
import { useEffect } from "react";
import { FaLightbulb, FaRegLightbulb } from "react-icons/fa";
import { Button } from "./ui/button";

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    console.log(theme)
  }, [theme])

  return (
    <Button className="p-0 w-fit h-fit flex items-center space-x-2" variant={"ghost"} onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      {theme === "dark" ? (
        <>
          <FaLightbulb />
          <p>Светлая тема</p>
        </>
      ) : (
        <>
          <FaRegLightbulb />
          <p>Темная тема</p>
        </>
      )}
    </Button>
  )
}
