# dummy-ig — member wrapper (upload step)

Posts a generated image to the dummy-IG. **Codex generates the image; this
wrapper uploads it.** No clone, no creds typed — the endpoint URL + token come
from the (preconfigured Codex) environment.

```bash
dummy-ig ./out.png --caption "Triple Excellent, every time. #EIWA" --type image
```

Flags: `--caption`, `--type image|carousel|reel`, `--endpoint`, `--token`.
First argument (or `--image`) is the generated image file.

## The one-command flow in Codex
The member tunes a prompt and asks Codex to post it. Codex (per
[AGENTS.md](AGENTS.md)):
1. generates the image from the prompt → saves a file,
2. runs `dummy-ig <file> --caption "…"`,
3. reports the post URL.

So no OpenAI key on the member's side — generation is Codex's own; the wrapper
is purely the upload.

## Environment (preset in the Codex env)
| Var | Purpose |
| --- | --- |
| `DUMMY_IG_UPLOAD_URL` | the Worker's `/upload` endpoint |
| `DUMMY_IG_TOKEN` | bearer token for the endpoint |
| `DUMMY_IG_VIEW_URL` | public dummy-IG URL to print (optional) |

## Try it locally
```bash
# terminal 1: app + upload server
npm run dev
node worker/dev-server.mjs

# terminal 2: upload any image file
node wrapper/dummy-ig.mjs ./some.png --caption "test" \
  --endpoint http://localhost:8787/upload --token dev-token
# → open http://localhost:8731/live, it appears within ~15s
```
