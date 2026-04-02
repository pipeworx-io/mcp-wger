# @pipeworx/mcp-wger

MCP server for wger workout and exercise data

## Tools

| Tool | Description |
|------|-------------|
| `list_exercises` | List exercises from the wger database (English only) |
| `get_exercise` | Get detailed information for a specific exercise by ID |
| `list_muscles` | List all muscles tracked in the wger database |
| `list_equipment` | List all equipment types in the wger database |

## Quickstart (Pipeworx Gateway)

```bash
curl -X POST https://gateway.pipeworx.io/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "list_exercises",
      "arguments": { "limit": 10 }
    }
  }'
```

## License

MIT
