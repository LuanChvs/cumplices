/* =========================================================
   STORAGE — persistência local do Cúmplices
========================================================= */

const STORAGE_PREFIX = 'cumplices.';

function storageKey(name) {
  return STORAGE_PREFIX + name;
}

function storageGet(name, fallback = null) {
  try {
    const value = localStorage.getItem(storageKey(name));

    if (value === null) {
      return fallback;
    }

    return JSON.parse(value);
  } catch (error) {
    console.warn(`Não foi possível ler "${name}" do storage.`, error);
    return fallback;
  }
}

function storageSet(name, value) {
  try {
    localStorage.setItem(
      storageKey(name),
      JSON.stringify(value)
    );

    return true;
  } catch (error) {
    console.warn(`Não foi possível salvar "${name}" no storage.`, error);
    return false;
  }
}

function storageRemove(name) {
  try {
    localStorage.removeItem(storageKey(name));
    return true;
  } catch (error) {
    console.warn(`Não foi possível remover "${name}" do storage.`, error);
    return false;
  }
}