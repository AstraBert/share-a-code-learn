import { Github, Code, Globe, Mail } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import RefreshButton from "./RefreshButton"

// Menu items.
const items = [
  {
    title: "Official Website",
    url: "https://shareacode.cc",
    icon: Globe,
  },
  {
    title: "Code Something Yourself",
    url: "https://app.shareacode.cc",
    icon: Code,
  },
  {
    title: "GitHub",
    url: "https://github.com/AstraBert/share-a-code",
    icon: Github,
  },
  {
    title: "Contact",
    url: "mailto:astraberte9@gmail.com",
    icon: Mail,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Share-A-Code Learn</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            <RefreshButton />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
