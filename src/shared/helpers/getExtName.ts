import upath from 'upath';

export function getExtName(path: string): string {
  return upath.extname(path);
}
