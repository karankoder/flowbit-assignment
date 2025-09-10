import mongoose, { ConnectOptions, Mongoose } from 'mongoose';

export const connectDB = (): Promise<void> => {
  const mongo_uri: string | undefined =
    process.env.NODE_ENV === 'development'
      ? process.env.LOCAL_MONGO_URI
      : process.env.MONGO_URI;
  return mongoose
    .connect(
      mongo_uri as string,
      {
        dbName: 'Flowbit',
      } as ConnectOptions
    )
    .then((c: Mongoose) => {
      console.log(`Database Connected with ${c.connection.host}`);
    })
    .catch((err: unknown) => {
      console.log('Database Connection failed');
      console.log(err);
    });
};
