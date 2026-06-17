# Posting to the dummy-IG (instructions for Codex)

When the user asks to post an image to the dummy-IG from a prompt:

1. **Generate** the image for their prompt using your own image generation, and
   save it to a local file (e.g. `./out.png`).
2. **Upload** it by running the wrapper:
   ```bash
   node dummy-ig.mjs ./out.png --caption "<caption>" --type image
   ```
3. Report the returned post URL back to the user.

That's the whole flow — generation is yours, the wrapper only uploads. The
endpoint URL and token are already in the environment (`DUMMY_IG_UPLOAD_URL`,
`DUMMY_IG_TOKEN`); never ask the user for credentials.
