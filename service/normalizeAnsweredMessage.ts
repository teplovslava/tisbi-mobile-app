export function normalizeAnsweredMessage(QuotesInfo:string){
    const collections = [];
    const answer = QuotesInfo.split('[END_LINE]');
    for (const idx in answer) {
      if (answer[idx].trim() === '') {
        continue;
      }
      const row = answer[idx].split('[SEP]');
      collections.push({
        ID: row[0],
        MsgSourceID: row[1],
        MemberName: row[2],
        Msg: row[3],
      });
    }
    return collections;
}