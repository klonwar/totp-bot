import { Injectable } from '@nestjs/common';

@Injectable()
export class MessageService {
  public async generateTemplate(code: string, expires: number) {
    const lines = [`🔐 Code: \`${code}\``, `⏱ Expires in ${expires}s\\.`];

    return this.fromLines(lines);
  }

  private fromParts(parts: string[]) {
    return parts.filter((item) => item !== null).join(` `);
  }

  private fromLines(lines: string[]) {
    return lines.filter((item) => item !== null).join(`\n`);
  }
}
