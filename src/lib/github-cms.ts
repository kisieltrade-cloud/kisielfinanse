/**
 * GitHub Content API — helper dla CMS.
 * Używany w produkcji (Vercel) zamiast fs.writeFileSync, bo Vercel ma read-only filesystem.
 * Lokalnie (bez GITHUB_TOKEN) wszystko idzie przez fs jak dotychczas.
 */

const GITHUB_TOKEN  = process.env.GITHUB_TOKEN;
const GITHUB_OWNER  = process.env.GITHUB_OWNER  ?? 'kisieltrade-cloud';
const GITHUB_REPO   = process.env.GITHUB_REPO   ?? 'kisielfinanse';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH ?? 'main';
const CONTENT_BASE  = 'src/content/blog';

export const useGitHub = () => Boolean(GITHUB_TOKEN);

function ghHeaders() {
  return {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

function ghUrl(filename: string) {
  return `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${CONTENT_BASE}/${filename}`;
}

/** Pobiera SHA pliku z GitHub (potrzebne do update i delete). */
export async function ghGetFileSha(filename: string): Promise<string | null> {
  const res = await fetch(ghUrl(filename), { headers: ghHeaders() });
  if (!res.ok) return null;
  const data = await res.json() as { sha: string };
  return data.sha;
}

/** Tworzy lub aktualizuje plik w repo. */
export async function ghWriteFile(
  filename: string,
  content: string,
  sha: string | null,
  message: string,
): Promise<{ ok: boolean; error?: string }> {
  const body: Record<string, unknown> = {
    message,
    content: Buffer.from(content, 'utf-8').toString('base64'),
    branch: GITHUB_BRANCH,
  };
  if (sha) body.sha = sha;

  const res = await fetch(ghUrl(filename), {
    method: 'PUT',
    headers: ghHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('[github-cms] write error:', res.status, err);
    return { ok: false, error: `GitHub API ${res.status}` };
  }
  return { ok: true };
}

/** Usuwa plik z repo. */
export async function ghDeleteFile(
  filename: string,
  sha: string,
  message: string,
): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(ghUrl(filename), {
    method: 'DELETE',
    headers: ghHeaders(),
    body: JSON.stringify({ message, sha, branch: GITHUB_BRANCH }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('[github-cms] delete error:', res.status, err);
    return { ok: false, error: `GitHub API ${res.status}` };
  }
  return { ok: true };
}
