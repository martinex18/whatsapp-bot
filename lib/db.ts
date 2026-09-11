import Database from "better-sqlite3";

export const db = new Database("data/bot.db"); // se crea una instancia con la ruta del archivo SQLite

db.exec(
  // check (id = 1) en vez de autoincrement, si no cumple con el id, no se crea otro registro
  `create table if not exists bot_config(
        id integer primary key check (id = 1),
        system_prompt text,
        model text,
        temperature real,
        created_at text,
        updated_at text
    );`,
);
