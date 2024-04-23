import mongoose from "mongoose";

type connectionObject = {
    isConnected?:number
}

const connection :connectionObject={};

async function dbConnect():Promise<void> {
    // check if we have connection to the database or if its currently connecting
    if(connection.isConnected){
        console.log('Already connected to the database')
        return;
    }

    try {
        // attempt to connect the database

        const db = await mongoose.connect(process.env.MONGODB_URI || "", {})
        connection.isConnected = db.connections[0].readyState;

        console.log('Database connected successfully')
    } catch (error) {
        console.log('Database connection failed', error);
        process.exit(1);

    }
}

export default dbConnect;