import bcrypt from "bcrypt";
import promptSync from "prompt-sync";

const saltRounds = 10;
const prompt = promptSync();

async function generatepassword() {
    const password = await prompt("Masukan password : ");

    const hash = await bcrypt.hash(password, saltRounds);
    const hashcheck = await bcrypt.compare(password, hash);

    console.log("Password hash : ", hash);
    console.log("Password match : ", hashcheck);
}

generatepassword();
