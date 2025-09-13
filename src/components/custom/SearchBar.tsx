import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState, type ChangeEvent } from "react"
import { Input } from "@/components/ui/input"
import { X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SearchBar() {
    const [language, setLanguage] = useState<string | undefined>(undefined)
    const [keywords, setKeywords] = useState<string | undefined>(undefined)
    const [error, setError] = useState<string | null>(null)

    const handleLanguage = (value: string) => {
        setLanguage(value)
        if (error) setError(null) // Clear error when user makes a selection
    }

    const handleKeywords = (value: ChangeEvent<HTMLInputElement>) => {
        setKeywords(value.target.value)
        if (error) setError(null) // Clear error when user types
    }

    const handleSearch = async (language: string | undefined, keywords: string | undefined) => {
        let searchLanguage: null | string = null
        let searchKeywords: null | string = null

        if ((typeof language === "undefined" || language === "no-language") && (typeof keywords === "undefined" || keywords.trim() === "")) {
            setError("Pass an input before searching")
            return
        }

        if (typeof language != "undefined" && language != "no-language") {
            searchLanguage = language
        }
        if (typeof keywords != "undefined" && keywords.trim() != "") {
            searchKeywords = keywords
        }

        const params = new URLSearchParams()

        if (searchLanguage !== null) {
            params.append('language', searchLanguage)
        }
        if (searchKeywords !== null) {
            params.append('keywords', searchKeywords)
        }

        // Navigate to search page
        window.location.href = `/search?${params.toString()}`
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 justify-center items-center">
                <div className="relative group">
                    <Select onValueChange={handleLanguage} value={language}>
                        <SelectTrigger className="w-[200px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-lg rounded-xl transition-all duration-200 hover:shadow-xl">
                            <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-xl rounded-xl">
                            <SelectGroup>
                              <SelectLabel className="text-slate-600 dark:text-slate-400 font-medium">Language</SelectLabel>
                              <SelectItem value="js" className="hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
                                JavaScript
                              </SelectItem>
                              <SelectItem value="ts" className="hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
                                TypeScript
                              </SelectItem>
                              <SelectItem value="go" className="hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
                                Go
                              </SelectItem>
                              <SelectItem value="c++" className="hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
                                C++
                              </SelectItem>
                              <SelectItem value="java" className="hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
                                Java
                              </SelectItem>
                              <SelectItem value="python" className="hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
                                Python
                              </SelectItem>
                              <SelectItem value="rust" className="hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
                                Rust
                              </SelectItem>
                              <SelectItem value="html" className="hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
                                HTML
                              </SelectItem>
                              <SelectItem value="dart" className="hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
                                Dart
                              </SelectItem>
                              <SelectItem value="bash" className="hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
                                Bash
                              </SelectItem>
                              <SelectItem value="powershell" className="hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
                                Powershell
                              </SelectItem>
                              <SelectItem value="no-language" className="hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
                                No Language
                              </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="relative group">
                    <Input
                        type="text"
                        placeholder="Put some keywords here..."
                        onChange={handleKeywords}
                        value={keywords || ''}
                    />
                </div>
                <div className="relative group flex items-center justify-center">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSearch(language, keywords)}
                        disabled={!!error}
                    >
                        Search
                        <Search className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            {error && (
                <div className="flex items-center justify-center text-red-600 dark:text-red-400">
                    <X className="h-4 w-4 mr-2" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    )
}
