import { db } from "./database/dbIndex.js";
import "dotenv/config";
import { users } from "./database/schema.js";

async function main() {
    // inserting a user
    console.log("Inserting a user in the database..!!");
    await db.insert(users).values({
        full_name: "Harry Patel",
        email: "harry@yahoo.com"
    });       

    // fetching all users
    console.log("Fetching all users..!!")
    const allUsers = await db.select().from(users);
    console.log(allUsers);
}


main().catch((err) => {
    console.error("Error in main function:", err);
})
