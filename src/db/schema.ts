import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const feedback = sqliteTable('feedback', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  feedback: text('feedback').notNull(),
  createdAt: text('created_at').notNull(),
});