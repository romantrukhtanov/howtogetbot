/**
 * Decodes the string to Buffer.
 * @param {string} str - The base64-encoded string.
 * @param {BufferEncoding} encoding - Encoding type.
 */
export function bufferFrom(str: string, encoding: BufferEncoding = 'base64') {
  return Buffer.from(str, encoding);
}

/**
 * Decodes the string to specific type.
 * @param {string} str - The base64-encoded string.
 * @param {BufferEncoding} encoding - Encoding type.
 * @param {BufferEncoding} returnEncoding - Return Encoding type.
 */
export function bufferToString(
  str: string,
  encoding: BufferEncoding,
  returnEncoding: BufferEncoding,
): string {
  return Buffer.from(str, encoding).toString(returnEncoding);
}

/**
 * Decodes the string from base64 to UTF-8.
 * @param {string} str - The base64-encoded string.
 */
export function base64decode(str: string): string {
  return bufferToString(str, 'base64', 'utf-8');
}

/**
 * Encodes the string using base64.
 * @param {string | number} str - The string to encode.
 * @returns {string} The base64-encoded string.
 */
export function base64encode(str: string | number): string {
  const strData = typeof str === 'number' ? str.toString() : str;
  return bufferToString(strData, 'utf-8', 'base64');
}

/**
 * Encodes the binary using base64.
 * @param {string | number} data - The string to encode.
 * @returns {string} The base64-encoded string.
 */
export function base64buffer(data: string | number): string {
  const strData = typeof data === 'number' ? data.toString() : data;
  return bufferToString(strData, 'binary', 'base64');
}
