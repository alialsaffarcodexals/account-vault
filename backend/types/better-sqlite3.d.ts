// Minimal type declarations for better-sqlite3 used in this project
// These types cover only the APIs exercised in the codebase.
declare module 'better-sqlite3' {
  export interface Statement {
    run(...params: any[]): any;
    get(...params: any[]): any;
    all(...params: any[]): any[];
  }
  export interface Database {
    prepare(sql: string): Statement;
    exec(sql: string): void;
    pragma(source: string): void;
    transaction<T extends (...args: any[]) => any>(fn: T): T;
  }
  const BetterSqlite3: {
    new (filename: string, options?: any): Database;
  };
  export default BetterSqlite3;
}
