const SESSION_HINT_KEY = "milk:has-session";

export const rememberSessionHint = () => {
  try {
    localStorage.setItem(SESSION_HINT_KEY, "1");
  } catch {
    return;
  }
};

export const forgetSessionHint = () => {
  try {
    localStorage.removeItem(SESSION_HINT_KEY);
  } catch {
    return;
  }
};

export const hasSessionHint = () => {
  try {
    return localStorage.getItem(SESSION_HINT_KEY) === "1";
  } catch {
    return true;
  }
};
