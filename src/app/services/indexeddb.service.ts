import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IndexeddbService {

  private dbName: string = 'EmployeeDB';
  private storeName: string = 'employees';

  constructor() { }

  private openDB() {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onerror = (event) => reject(event);
      request.onsuccess = (event) => resolve((event.target as IDBRequest).result);
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }

  // Create or add an employee
  addEmployee(employee: any) {
    return new Promise((resolve, reject) => {
      this.openDB().then(db => {
        const transaction = db.transaction(this.storeName, 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.add(employee);
        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject(event);
      }).catch(error => reject(error));
    });
  }

  // Get all employees
  getEmployees() {
    return new Promise<any[]>((resolve, reject) => {
      this.openDB().then(db => {
        const transaction = db.transaction(this.storeName, 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject(event);
      }).catch(error => reject(error));
    });
  }
 // Get single employee by ID
 getEmployee(id: number) {
  return new Promise<any[]>((resolve, reject) => {
    this.openDB().then(db => {
      const transaction = db.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event);
    }).catch(error => reject(error));
  });
}

  // Delete an employee by ID
  deleteEmployee(id: number) {
    return new Promise((resolve, reject) => {
      this.openDB().then(db => {
        const transaction = db.transaction(this.storeName, 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.delete(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject(event);
      }).catch(error => reject(error));
    });
  }
}
