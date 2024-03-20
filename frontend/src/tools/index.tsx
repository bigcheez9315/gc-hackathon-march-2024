export function storeToLocalStorage(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  
export function getFromLocalStorage(key: string) {
const storedValue = localStorage.getItem(key);
return storedValue ? JSON.parse(storedValue) : null;
}