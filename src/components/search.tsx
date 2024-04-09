"use client"

import { FaSearch } from "react-icons/fa"
import { Input } from "./ui/input"
import { useState } from "react"

export default function Search() {
  const [search, setSearch] = useState<string>("")

  return (
    <div className="grow flex flex-row rounded-l-xl">
      <Input value={search} onChange={e => setSearch(e.target.value)} className="rounded-xl border-primary border-2 hover:outline-0 bg-transparent grow focus-visible:ring-offset-0 focus-visible:ring-0 rounded-r-none" placeholder="Шкаф купе..." />
      <div className="flex items-center justify-center h-10 aspect-square group cursor-pointer text-white bg-primary rounded-r-xl">
        <FaSearch className="group-hover:scale-105 transition-transform ease-in-out duration-300" />
      </div>
    </div>
  )
}
