import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from "fs";

const server = new McpServer({
  name: "achen-sticker-mcp",
  version: "0.1.0"
});

const stickers = JSON.parse(
  fs.readFileSync("./stickers.json", "utf8")
);

// 查看有哪些表情
server.tool(
  "list_stickers",
  "查看阿晨有哪些可用表情包",
  {},
  async () => {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(stickers, null, 2)
        }
      ]
    };
  }
);


// 发送指定表情
server.tool(
  "send_sticker",
  "发送一个阿晨表情包",
  {
    filename: z.string()
  },
  async ({ filename }) => {

    const sticker = stickers.find(
      s => s.file === filename
    );

    if (!sticker) {
      return {
        content: [
          {
            type: "text",
            text: "没有找到这个表情包"
          }
        ]
      };
    }

    return {
      content: [
        {
          type: "image",
          data: fs.readFileSync(
            `./${filename}`
          ).toString("base64"),
          mimeType: "image/png"
        }
      ]
    };
  }
);


const transport = new StdioServerTransport();

await server.connect(transport);
