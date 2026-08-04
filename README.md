# mcp-wger

Wger MCP — wraps wger Workout Manager REST API (free, no auth for read)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `list_exercises` | List fitness exercises from the wger database in English; optionally limit count (default 20). Returns exercise name, description, category, primary and secondary muscles, and required equipment per entry. |
| `get_exercise` | Get detailed information for a specific exercise by its numeric ID. |
| `list_muscles` | List all muscles tracked in the wger database. Returns each muscle's numeric ID, English name, and whether it is located on the front of the body. |
| `list_equipment` | List all gym equipment types in the wger database. Returns each item's numeric ID and name (e.g., 'Barbell', 'Dumbbell', 'Kettlebell'). |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "wger": {
      "url": "https://gateway.pipeworx.io/wger/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Wger data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
