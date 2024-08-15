import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

// declaring enum in database
// export const popularityEnum = pgEnum('popularity', ['unknown', 'known', 'popular']);

// export const countries = pgTable('countries', {
//   id: serial('id').primaryKey(),
//   name: varchar('name', { length: 256 }),
// }, (countries) => {
//   return {
//     nameIndex: uniqueIndex('name_idx').on(countries.name),
//   }
// });

// export const cities = pgTable('cities', {
//   id: serial('id').primaryKey(),
//   name: varchar('name', { length: 256 }),
//   countryId: integer('country_id').references(() => countries.id),
//   popularity: popularityEnum('popularity'),
// });

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(), // Store hashed passwords
  createdAt: timestamp("created_at").defaultNow(),
});

export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id")
    .references(() => users.id)
    .notNull(),
  receiverId: integer("receiver_id")
    .references(() => users.id)
    .notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const groups = pgTable("groups", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const groupChats = pgTable("group_chats", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id")
    .references(() => groups.id)
    .notNull(),
  senderId: integer("sender_id")
    .references(() => users.id)
    .notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const groupMembers = pgTable("group_members", {
  groupId: integer("group_id")
    .references(() => groups.id)
    .notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
});
