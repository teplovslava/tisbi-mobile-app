import { IChat } from "@/interface";

export function normalizeGroup(groups:IChat[] | undefined) {
  let map = new Map();

  groups?.forEach((group) => {
    if (map.has(group.chat.GroupName)) {
      let unreadCount = map.get(group.chat.GroupName)
      let newCount = unreadCount + group.chat.UnreadCnt
      map.set(group.chat.GroupName, newCount)
    }else{
      map.set(group.chat.GroupName, group.chat.UnreadCnt)
    }
  });

  return Array.from(map)
}
