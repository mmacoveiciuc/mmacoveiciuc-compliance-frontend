export const tryReadJSONBody = async (
  response: Response
): Promise<string | null> => {
  if (!response.body) {
    return null;
  }
  try {
    return await response.json();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return null;
  }
};
