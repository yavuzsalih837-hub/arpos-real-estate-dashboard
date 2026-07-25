import type { Agent } from "@/features/agents/types";

export const mockAgents: Agent[] = [
  {
    id: "agent-1",
    name: "Elif Yılmaz",
    initials: "EY",
    phone: "+90 532 010 20 30",
    email: "elif.yilmaz@arpos.com",
    region: "Kadıköy, Üsküdar, Ataşehir",
    specialty: "Konut Satış",
    status: "aktif",
  },
  {
    id: "agent-2",
    name: "Mert Kaya",
    initials: "MK",
    phone: "+90 533 020 30 40",
    email: "mert.kaya@arpos.com",
    region: "Beşiktaş, Şişli, Bakırköy",
    specialty: "Kiralama",
    status: "aktif",
  },
  {
    id: "agent-3",
    name: "Zeynep Demir",
    initials: "ZD",
    phone: "+90 534 030 40 50",
    email: "zeynep.demir@arpos.com",
    region: "Sarıyer, Beykoz, Çeşme",
    specialty: "Villa & Yazlık",
    status: "izinli",
  },
  {
    id: "agent-4",
    name: "Burak Şahin",
    initials: "BŞ",
    phone: "+90 535 040 50 60",
    email: "burak.sahin@arpos.com",
    region: "Fatih, Ümraniye, Kartal",
    specialty: "Ticari Gayrimenkul",
    status: "pasif",
  },
];

export function getAgentById(id: string): Agent | undefined {
  return mockAgents.find((agent) => agent.id === id);
}
