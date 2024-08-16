import { relations } from "drizzle-orm";
import { boolean, decimal, integer, numeric, PgArray, pgEnum, pgTable, PgTimestampBuilderInitial, serial, text, timestamp } from "drizzle-orm/pg-core";

export const timestamps = (): {
    createdAt: PgTimestampBuilderInitial<"createdAt">;
    updatedAt: PgTimestampBuilderInitial<"updatedAt">;
} => ({
    createdAt: timestamp("createdAt", {
        withTimezone: true,
    }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", {
        withTimezone: true,
    }).defaultNow().notNull(),
});

export const Genders = pgEnum("gender", ["male", "female"]);
export const UserRoles = pgEnum("role", ["user", "admin"]);
export const PostTypes = pgEnum("type", ["question", "announcement"]);
export const PostStatuses = pgEnum("status", ["pending", "approved", 'rejected']);

export const userTable = pgTable("user", {
    id: text("id").primaryKey(),
    firstname: text("firstname").notNull(),
    lastname: text("lastname").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    password: text("password").notNull(),
    role: UserRoles('role').default('user').notNull(),
    ...timestamps(),
});

export const postTable = pgTable("post", {
    id: serial("id").primaryKey(),
    userId: text("userId").references(() => userTable.id, { onDelete: "cascade" }).notNull(),
    content: text("content").notNull(),
    images: text("images"),
    type: PostTypes('type').default('question').notNull(),
    status: PostStatuses('status').default('pending').notNull(),
    ...timestamps(),
});

export const replyTable = pgTable("reply", {
    id: serial("id").primaryKey(),
    content: text("content").notNull(),
    images: text("images"),
    userId: text("userId")
        .notNull()
        .references(() => userTable.id, { onDelete: "cascade" }),
    postId: integer("postId")
        .notNull()
        .references(() => postTable.id, { onDelete: "cascade" }),
    ...timestamps(),
});

// ? relations

export const userRelations = relations(userTable, ({ many }) => ({
    posts: many(postTable),
    replies: many(replyTable),
}));

export const postRelations = relations(postTable, ({ one, many }) => ({
    user: one(userTable, {
        fields: [postTable.userId],
        references: [userTable.id],
    }),
    replies: many(replyTable)
}));

export const replyRelations = relations(replyTable, ({ one }) => ({
    user: one(userTable, {
        fields: [replyTable.userId],
        references: [userTable.id],
    }),
    post: one(postTable, {
        fields: [replyTable.postId],
        references: [postTable.id],
    }),
}));

export const sessionTable = pgTable("session", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => userTable.id),
    expiresAt: timestamp("expires_at", {
        withTimezone: true,
        mode: "date"
    }).notNull()
});
